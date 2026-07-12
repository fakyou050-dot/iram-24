import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const MARKET_CACHE_KEY = "eram_market_v3";

interface Quote {
  symbol: string;
  label_ar: string;
  label_en: string;
  unit?: string;
  price: number;
  change: number;
  changePct: number;
}

interface Props {
  language: "AR" | "EN";
}

const formatNum = (n: number) => {
  if (Math.abs(n) >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return n.toFixed(2);
};

// Hardcoded defaults — always available even if DB is empty
const DEFAULT_QUOTES: Quote[] = [
  { symbol: "GOLD", label_ar: "ذهب", label_en: "Gold", unit: "$", price: 2150, change: 5.2, changePct: 0.24 },
  { symbol: "SILVER", label_ar: "فضة", label_en: "Silver", unit: "$", price: 24.5, change: -0.15, changePct: -0.61 },
  { symbol: "USD/YER", label_ar: "دولار/ريال", label_en: "USD/YER", unit: "", price: 1650, change: 0, changePct: 0.10 },
  { symbol: "SAR/YER", label_ar: "ريال سعودي/ريال", label_en: "SAR/YER", unit: "", price: 435, change: 0, changePct: 0.05 },
  { symbol: "BRENT", label_ar: "نفط برنت", label_en: "Brent Crude", unit: "$", price: 82.5, change: 0.8, changePct: 0.98 },
  { symbol: "BTC", label_ar: "بيتكوين", label_en: "Bitcoin", unit: "$", price: 68500, change: 1200, changePct: 1.78 },
];

const MarketTicker = ({ language }: Props) => {
  const [quotes, setQuotes] = useState<Quote[]>(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(MARKET_CACHE_KEY) || "[]");
      if (cached.length > 0) return cached;
    } catch {}
    return DEFAULT_QUOTES;
  });
  const isRTL = language === "AR";

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // Try Edge Function first
      try {
        const { data } = await supabase.functions.invoke("market-prices");
        if (!cancelled && data?.quotes?.length) {
          setQuotes(data.quotes);
          try { localStorage.setItem(MARKET_CACHE_KEY, JSON.stringify(data.quotes)); } catch {}
          return;
        }
      } catch {}

      // Fallback: load from currencies table
      try {
        const { data: currencies } = await supabase
          .from("currencies")
          .select("name,code,price,change_percent")
          .eq("is_active", true);
        if (!cancelled && currencies?.length) {
          const fallback: Quote[] = currencies.map((c) => ({
            symbol: c.code,
            label_ar: c.name,
            label_en: c.name,
            price: Number(c.price) || 0,
            change: 0,
            changePct: Number(c.change_percent) || 0,
          }));
          setQuotes(fallback);
          try { localStorage.setItem(MARKET_CACHE_KEY, JSON.stringify(fallback)); } catch {}
          return;
        }
      } catch {}

      // Last resort: use defaults (never empty)
      if (!cancelled) {
        setQuotes(DEFAULT_QUOTES);
      }
    };

    load();
    const id = setInterval(load, 90_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  // Always render — never return null
  const displayQuotes = quotes.length > 0 ? quotes : DEFAULT_QUOTES;

  // Duplicate for seamless loop
  const allQuotes = [...displayQuotes, ...displayQuotes];

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="relative border-y border-[hsl(var(--gold))]/25 overflow-hidden"
      style={{
        background: "linear-gradient(90deg, hsl(220 50% 5%) 0%, hsl(220 45% 8%) 50%, hsl(220 50% 5%) 100%)",
      }}
    >
      <div className="max-w-screen-xl mx-auto flex items-stretch">
        {/* Label */}
        <div className="shrink-0 flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(38_72%_45%)] text-[hsl(var(--primary-foreground))]">
          <Activity size={13} strokeWidth={2.75} className="animate-pulse-live" />
          <span className="text-[10px] md:text-[11px] font-black tracking-[0.18em] uppercase">
            {isRTL ? "الأسواق" : "Markets"}
          </span>
        </div>

        {/* Scrolling track */}
        <div className="flex-1 overflow-hidden relative">
          <div
            className={`flex w-max min-w-full marquee-track ${isRTL ? "animate-marquee-rtl" : "animate-marquee-ltr"}`}
            style={{ ["--marquee-duration" as string]: `${Math.max(24, Math.min(42, displayQuotes.length * 2.1))}s` }}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-7 whitespace-nowrap py-2 px-3 shrink-0 min-w-full" aria-hidden={copy === 1}>
                {displayQuotes.map((q, i) => {
                  const up = q.change >= 0;
                  const label = isRTL ? q.label_ar : q.label_en;
                  return (
                    <span key={`${copy}-${q.symbol}-${i}`} className="flex items-center gap-2 text-[12px] md:text-[13px] tabular-nums">
                      <span className="text-white/90 font-bold tracking-wide">{label}</span>
                      <span className="text-white font-display font-semibold">
                        {q.unit}{formatNum(q.price)}
                      </span>
                      <span
                        className={`flex items-center gap-0.5 font-bold text-[11px] px-1.5 py-0.5 rounded ${
                          up ? "text-emerald-300 bg-emerald-500/10" : "text-rose-300 bg-rose-500/10"
                        }`}
                      >
                        {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {up ? "+" : ""}{q.changePct.toFixed(2)}%
                      </span>
                      <span className="text-[hsl(var(--gold))]/40">•</span>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[hsl(220_50%_5%)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[hsl(220_50%_5%)] to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default MarketTicker;
