import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface Quote {
  symbol: string;
  label_ar: string;
  label_en: string;
  unit?: string;
  price: number;
  change: number;
  changePct: number;
}

const SYMBOLS = [
  { sym: "CL=F", label_ar: "نفط WTI", label_en: "WTI Oil", unit: "$" },
  { sym: "BZ=F", label_ar: "نفط برنت", label_en: "Brent Oil", unit: "$" },
  { sym: "GC=F", label_ar: "ذهب", label_en: "Gold", unit: "$" },
  { sym: "SI=F", label_ar: "فضة", label_en: "Silver", unit: "$" },
  { sym: "^GSPC", label_ar: "S&P 500", label_en: "S&P 500", unit: "" },
  { sym: "^DJI", label_ar: "داو جونز", label_en: "Dow Jones", unit: "" },
  { sym: "^IXIC", label_ar: "ناسداك", label_en: "NASDAQ", unit: "" },
  { sym: "^TASI.SR", label_ar: "تاسي السعودي", label_en: "TASI", unit: "" },
  { sym: "BTC-USD", label_ar: "بيتكوين", label_en: "Bitcoin", unit: "$" },
  { sym: "ETH-USD", label_ar: "إيثريوم", label_en: "Ethereum", unit: "$" },
  { sym: "EURUSD=X", label_ar: "يورو/دولار", label_en: "EUR/USD", unit: "" },
  { sym: "GBPUSD=X", label_ar: "إسترليني/دولار", label_en: "GBP/USD", unit: "" },
  { sym: "SAR=X", label_ar: "دولار/ريال سعودي", label_en: "USD/SAR", unit: "" },
  { sym: "EGP=X", label_ar: "دولار/جنيه مصري", label_en: "USD/EGP", unit: "" },
  { sym: "AED=X", label_ar: "دولار/درهم إماراتي", label_en: "USD/AED", unit: "" },
];

let cache: { data: Quote[]; ts: number } | null = null;
const TTL = 60_000; // 60s
const STALE_TTL = 15 * 60_000;

const MARKET_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Accept": "application/json,text/plain,*/*",
  "Accept-Language": "ar,en-US;q=0.9,en;q=0.8",
};

async function fetchQuotesBatch(): Promise<Map<string, { price: number; prev: number }>> {
  const out = new Map<string, { price: number; prev: number }>();
  try {
    const symbols = SYMBOLS.map((s) => s.sym).join(",");
    const r = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}`,
      { headers: MARKET_HEADERS, signal: AbortSignal.timeout(5200) }
    );
    if (!r.ok) return out;
    const j = await r.json();
    for (const item of j?.quoteResponse?.result || []) {
      const symbol = String(item.symbol || "");
      const price = Number(item.regularMarketPrice ?? item.postMarketPrice ?? item.preMarketPrice);
      const prev = Number(item.regularMarketPreviousClose ?? item.previousClose ?? price);
      if (symbol && isFinite(price)) out.set(symbol, { price, prev: isFinite(prev) ? prev : price });
    }
  } catch {
    // fall through to per-symbol chart fallback
  }
  return out;
}

async function fetchQuote(sym: string): Promise<{ price: number; prev: number } | null> {
  try {
    const r = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=1d`,
      { headers: MARKET_HEADERS, signal: AbortSignal.timeout(4200) }
    );
    if (!r.ok) return null;
    const j = await r.json();
    const meta = j?.chart?.result?.[0]?.meta;
    if (!meta) return null;
    const price = Number(meta.regularMarketPrice);
    const prev = Number(meta.chartPreviousClose ?? meta.previousClose ?? price);
    if (!isFinite(price)) return null;
    return { price, prev };
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const now = Date.now();
  if (cache && now - cache.ts < TTL) {
    return new Response(JSON.stringify({ quotes: cache.data, cached: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=60" },
    });
  }

  const batch = await fetchQuotesBatch();
  const results = await Promise.all(SYMBOLS.map((s) => batch.get(s.sym) || fetchQuote(s.sym)));
  const quotes: Quote[] = [];
  SYMBOLS.forEach((s, i) => {
    const q = results[i];
    if (!q) return;
    const change = q.price - q.prev;
    const changePct = q.prev ? (change / q.prev) * 100 : 0;
    quotes.push({
      symbol: s.sym,
      label_ar: s.label_ar,
      label_en: s.label_en,
      unit: s.unit,
      price: Math.round(q.price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePct: Math.round(changePct * 100) / 100,
    });
  });

  if (quotes.length === 0 && cache && now - cache.ts < STALE_TTL) {
    return new Response(JSON.stringify({ quotes: cache.data, cached: true, stale: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=60, stale-while-revalidate=900" },
    });
  }

  if (quotes.length > 0) cache = { data: quotes, ts: now };
  return new Response(JSON.stringify({ quotes, cached: false }), {
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=60, stale-while-revalidate=900" },
  });
});
