// Resilient home feed: DB first, stale cache second, live RSS fallback third.
// The homepage must never go blank because of database latency or free-tier cold starts.
import { createClient } from "npm:@supabase/supabase-js@2";
import { classify } from "../_shared/classifier.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const COLS =
  "id,title,description,url,image_url,category,language,published_at,views,source_id,created_at,author_name,author_image_url,is_manual";

interface ArticleRow {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  url: string;
  image_url: string | null;
  category: string;
  language: string;
  published_at: string | null;
  views: number | null;
  source_id: string | null;
  created_at: string;
  author_name: string | null;
  author_image_url: string | null;
  is_manual: boolean;
}

interface CacheEntry { data: ArticleRow[]; ts: number; mode: "db" | "rss"; }
type QueryResult = { data?: ArticleRow[] | null; error?: { message?: string } | null } | null;
const cache = new Map<string, CacheEntry>();
const FRESH_TTL = 90_000;
const STALE_TTL = 6 * 60 * 60_000;
const DB_TIMEOUT_MS = 2400;

const REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  "Accept-Language": "ar,en-US;q=0.9,en;q=0.8",
  "Accept": "application/rss+xml, application/xml, text/xml, text/html;q=0.8, */*;q=0.7",
};

const FEEDS: Record<string, Array<{ name: string; url: string }>> = {
  AR: [
    { name: "BBC عربي", url: "https://feeds.bbci.co.uk/arabic/rss.xml" },
    { name: "سكاي نيوز عربية", url: "https://www.skynewsarabia.com/rss" },
    { name: "فرانس 24", url: "https://www.france24.com/ar/rss" },
    { name: "CNN عربية", url: "https://arabic.cnn.com/rss" },
  ],
  EN: [
    { name: "BBC News", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
    { name: "The Guardian", url: "https://www.theguardian.com/world/rss" },
  ],
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const language = (url.searchParams.get("lang") || "AR").toUpperCase();
  const category = url.searchParams.get("category") || "";
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "60", 10), 1), 120);
  const key = `${language}|${category}|${limit}`;
  const now = Date.now();

  const cached = cache.get(key);
  if (cached && now - cached.ts < FRESH_TTL) {
    return await json(cached.data, { cached: true, mode: cached.mode });
  }

  try {
    const data = await fetchDbArticles(language, category, limit);
    if (data.length > 0) {
      cache.set(key, { data, ts: now, mode: "db" });
      return await json(data, { cached: false, mode: "db" });
    }
  } catch (err) {
    console.error("home-feed-db", err instanceof Error ? err.message : String(err));
  }

  if (cached && now - cached.ts < STALE_TTL) {
    void refreshRssCache(key, language, category, limit);
    return await json(cached.data, { cached: true, stale: true, mode: cached.mode });
  }

  const fallback = await fetchRssArticles(language, category, limit);
  if (fallback.length > 0) {
    cache.set(key, { data: fallback, ts: now, mode: "rss" });
    return await json(fallback, { cached: false, fallback: true, mode: "rss" });
  }

  return await json([], { cached: false, stale: true, mode: "empty" });
});

async function fetchDbArticles(language: string, category: string, limit: number): Promise<ArticleRow[]> {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );

  let q = supabase
    .from("articles")
    .select(COLS)
    .eq("language", language)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (category && category !== "الرئيسية" && category !== "Home") q = q.eq("category", category);

  const timer = new Promise<null>((resolve) => setTimeout(() => resolve(null), DB_TIMEOUT_MS));
  const result = await Promise.race([q, timer]) as QueryResult;
  if (!result || result.error) throw new Error(result?.error?.message || "db_timeout");
  return result.data || [];
}

async function refreshRssCache(key: string, language: string, category: string, limit: number) {
  try {
    const data = await fetchRssArticles(language, category, limit);
    if (data.length > 0) cache.set(key, { data, ts: Date.now(), mode: "rss" });
  } catch (_) { /* background refresh only */ }
}

async function fetchRssArticles(language: string, category: string, limit: number): Promise<ArticleRow[]> {
  const feeds = FEEDS[language] || FEEDS.AR;
  const results = await Promise.allSettled(
    feeds.map(async (feed) => {
      const res = await fetch(feed.url, { headers: REQUEST_HEADERS, signal: AbortSignal.timeout(3800) });
      if (!res.ok) throw new Error(`${feed.name}:${res.status}`);
      return parseFeed(await res.text(), feed.name, feed.url, language);
    })
  );

  const seen = new Set<string>();
  const all = results
    .flatMap((r) => r.status === "fulfilled" ? r.value : [])
    .filter((a) => {
      const key = normalizeUrlKey(a.url) || a.title.toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());

  const wantsCategory = category && category !== "الرئيسية" && category !== "Home";
  const filtered = wantsCategory ? all.filter((a) => a.category === category) : all;
  const merged = (filtered.length > 0 ? filtered : all).slice(0, limit);

  return merged;
}

function parseFeed(xml: string, sourceName: string, _sourceUrl: string, language: string): ArticleRow[] {
  const blocks = Array.from(xml.matchAll(/<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/gi)).map((m) => m[2]);
  return blocks.map((block, index) => {
    const title = decodeEntities(getTag(block, "title"));
    const link = normalizeUrl(getTag(block, "link") || getAtomLink(block));
    if (!title || !link) return null;
    const rawSummary = getTag(block, "description") || getTag(block, "summary") || getTag(block, "content") || getTag(block, "content:encoded");
    const description = stripHtml(decodeEntities(rawSummary)).slice(0, 320) || null;
    const published = parseDate(getTag(block, "pubDate") || getTag(block, "published") || getTag(block, "updated"));
    const image = extractImage(block);
    return {
      id: `rss-${hashString(`${sourceName}-${link}-${index}`)}`,
      title,
      description,
      content: rawSummary ? decodeEntities(rawSummary) : description,
      url: link,
      image_url: image,
      category: categorizeArticle(title, description, language),
      language,
      published_at: published,
      views: 0,
      source_id: null,
      created_at: published || new Date().toISOString(),
      author_name: sourceName,
      author_image_url: null,
      is_manual: false,
    } satisfies ArticleRow;
  }).filter(Boolean) as ArticleRow[];
}

function getTag(block: string, tag: string): string {
  const escaped = tag.replace(":", "\\:");
  const re = new RegExp(`<${escaped}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))<\\/${escaped}>`, "i");
  const match = block.match(re);
  return (match?.[1] || match?.[2] || "").trim();
}

function getAtomLink(block: string): string {
  return block.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] || "";
}

function extractImage(block: string): string | null {
  const candidates = [
    ...Array.from(block.matchAll(/<media:content[^>]+url=["']([^"']+)["'][^>]*>/gi)).map((m) => m[1]),
    ...Array.from(block.matchAll(/<media:thumbnail[^>]+url=["']([^"']+)["'][^>]*>/gi)).map((m) => m[1]),
    ...Array.from(block.matchAll(/<enclosure[^>]+url=["']([^"']+\.(?:jpg|jpeg|png|webp|avif)(?:\?[^"']*)?)["'][^>]*>/gi)).map((m) => m[1]),
    ...Array.from(block.matchAll(/<img[^>]+(?:src|data-src)=["']([^"']+)["']/gi)).map((m) => m[1]),
    ...Array.from(block.matchAll(/(?:https?:)?\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|avif)(?:\?[^\s"'<>]*)?/gi)).map((m) => m[0]),
  ];
  const image = candidates.map(normalizeUrl).find(Boolean);
  return image || null;
}

function parseDate(value: string): string {
  const time = value ? new Date(decodeEntities(value)).getTime() : NaN;
  return new Date(Number.isFinite(time) ? time : Date.now()).toISOString();
}

function normalizeUrl(url: string): string {
  let normalized = decodeEntities(url || "").trim().replace(/\s+/g, "");
  if (normalized.startsWith("//")) normalized = `https:${normalized}`;
  return normalized.replace(/^http:\/\//i, "https://");
}

function normalizeUrlKey(url: string): string {
  try {
    const parsed = new URL(normalizeUrl(url));
    parsed.hash = "";
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "fbclid", "gclid"].forEach((p) => parsed.searchParams.delete(p));
    return `${parsed.origin}${parsed.pathname.replace(/\/$/, "")}`.toLowerCase();
  } catch { return normalizeUrl(url).toLowerCase(); }
}

function decodeEntities(text: string): string {
  if (!text) return "";
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(html: string): string {
  return (html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  return Math.abs(hash).toString(36);
}


function categorizeArticle(title: string, description: string | null, language: string): string {
  return classify(title, description, (language as "AR" | "EN") || "AR").category;
}

async function json(articles: ArticleRow[], meta: Record<string, unknown>, status = 200) {
  const body = JSON.stringify({ articles, ...meta, generated_at: new Date().toISOString() });
  // Try gzip if available in runtime
  try {
    // @ts-expect-error CompressionStream is available in the edge runtime before TS lib support here.
    if (typeof CompressionStream !== "undefined") {
      const stream = new Response(body).body!.pipeThrough(new CompressionStream("gzip"));
      return new Response(stream, {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Content-Encoding": "gzip",
          "Vary": "Accept-Encoding",
          "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
        },
      });
    }
  } catch (_) { /* fall through */ }
  return new Response(body, {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
