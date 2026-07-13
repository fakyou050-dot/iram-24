/**
 * Auto-fetch RSS news — Client-side fallback
 *
 * Priority order:
 * 1. Edge Function (fetch-news) — server-side, most reliable
 * 2. Client-side fetch via CORS proxy — fallback when Edge Function is down
 *
 * Reads sources from news_sources table + hardcoded fallback feeds.
 */

import { supabase } from "@/integrations/supabase/client";

const CORS_PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?",
  "https://api.codetabs.com/v1/proxy?quest=",
];

interface RssArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image_url: string | null;
  category: string;
  language: string;
  published_at: string;
  hash: string;
  is_manual: boolean;
  is_breaking: boolean;
  show_source: boolean;
  author_name: string;
  source_id?: string;
}

// ─── Utility Functions ──────────────────────────────────────────────

function decodeEntities(text: string): string {
  if (!text) return "";
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
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

function extractImage(block: string): string | null {
  const patterns = [
    /<media:(?:content|thumbnail)[^>]+url=["']([^"']+)["']/i,
    /<enclosure[^>]+url=["']([^"']+\.(?:jpg|jpeg|png|webp|gif))[^"']*["']/i,
    /<img[^>]+src=["']([^"']+)["']/i,
  ];
  for (const p of patterns) {
    const m = block.match(p);
    if (m) return m[1];
  }
  return null;
}

function getTag(block: string, tag: string): string {
  const escaped = tag.replace(":", "\\:");
  const re = new RegExp(
    `<${escaped}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))<\\/${escaped}>`,
    "i"
  );
  const m = block.match(re);
  return (m?.[1] || m?.[2] || "").trim();
}

// ─── Smart Category Classification ──────────────────────────────────

function classifyCategory(title: string, desc: string, lang: string): string {
  const t = (title + " " + desc).toLowerCase();

  if (lang === "AR") {
    if (/كرة|مباراة|دوري|بطولة|كأس|منتخب|نادي|هدف|لاعب|مدرب/.test(t)) return "رياضة";
    if (/اقتصاد|بورصة|أسهم|نفط|دولار|ذهب|بنك|استثمار|تجارة|سوق/.test(t)) return "اقتصاد";
    if (/تكنولوج|ذكاء|روبوت|هاتف|جوال|تطبيق|إنترنت|ذكاء اصطناعي/.test(t)) return "تكنولوجيا";
    if (/صحة|مرض|علاج|دواء|فيروس|لقاح|مستشفى|طبي/.test(t)) return "صحة";
    if (/انتخاب|برلمان|حكومة|رئيس|وزير|قمة|دبلوماس|عسكري|حرب|سلام/.test(t)) return "سياسة";
    if (/يمن|صنعاء|عدن|مأرب|تعز|حضرموت/.test(t)) return "محلي";
    if (/مصر|سعود|إمارات|عراق|سوري|فلسطين|أردن|لبنان|كويت|قطر/.test(t)) return "عربي";
    return "عامة";
  } else {
    if (/football|soccer|basketball|tennis|match|goal|league|cup|championship/.test(t)) return "Sports";
    if (/economy|market|stock|oil|gold|trade|bank|investment/.test(t)) return "Economy";
    if (/tech|ai|software|app|internet|digital|robot|smartphone/.test(t)) return "Technology";
    if (/health|disease|vaccine|treatment|hospital|medical/.test(t)) return "Health";
    if (/politic|government|president|election|parliament|war|peace/.test(t)) return "Politics";
    return "General";
  }
}

// ─── RSS Parser ─────────────────────────────────────────────────────

function parseRss(xml: string, sourceName: string, language: string): RssArticle[] {
  const items = Array.from(
    xml.matchAll(/<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/gi)
  ).map((m) => m[2]);

  return items
    .map((block) => {
      const title = decodeEntities(getTag(block, "title"));
      const linkRaw = getTag(block, "link") || block.match(/<link[^>]+href=["']([^"']+)["']/)?.[1] || "";
      const link = decodeEntities(linkRaw).trim();
      if (!title || !link) return null;

      const rawDesc = getTag(block, "description") || getTag(block, "summary") || getTag(block, "content:encoded") || "";
      const description = stripHtml(decodeEntities(rawDesc)).slice(0, 320) || null;
      const pubDate = getTag(block, "pubDate") || getTag(block, "published") || getTag(block, "updated");
      const image = extractImage(block);
      const category = classifyCategory(title, description || "", language);

      let isoDate: string;
      try {
        const time = pubDate ? new Date(decodeEntities(pubDate)).getTime() : NaN;
        isoDate = Number.isFinite(time) ? new Date(time).toISOString() : new Date().toISOString();
      } catch {
        isoDate = new Date().toISOString();
      }

      return {
        title: title.slice(0, 500),
        description,
        content: rawDesc ? decodeEntities(rawDesc).slice(0, 2000) : description,
        url: link.slice(0, 1000),
        image_url: image ? image.slice(0, 1000) : null,
        category,
        language,
        published_at: isoDate,
        hash: hashString(`${sourceName}-${link}`),
        is_manual: false,
        is_breaking: false,
        show_source: true,
        author_name: sourceName,
      } as RssArticle;
    })
    .filter(Boolean) as RssArticle[];
}

// ─── Fetch with CORS proxy rotation ─────────────────────────────────

async function fetchWithProxy(url: string): Promise<string | null> {
  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 12000);
      const res = await fetch(proxyUrl, { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 50) return text;
      }
    } catch {
      // Try next proxy
    }
  }
  return null;
}

// ─── Fetch from DB sources ──────────────────────────────────────────

async function fetchFromDBSources(): Promise<RssArticle[]> {
  try {
    const { data: sources } = await supabase
      .from("news_sources")
      .select("id, name, url, feed_url, language, category")
      .eq("is_active", true)
      .limit(20);

    if (!sources || sources.length === 0) return [];

    const allArticles: RssArticle[] = [];
    const seen = new Set<string>();

    // Process in batches of 4
    for (let i = 0; i < sources.length; i += 4) {
      const batch = sources.slice(i, i + 4);
      const results = await Promise.allSettled(
        batch.map(async (source) => {
          const feedUrl = source.feed_url || source.url;
          if (!feedUrl) return [];

          const xml = await fetchWithProxy(feedUrl);
          if (!xml) return [];

          const articles = parseRss(xml, source.name, source.language);
          // Tag with source_id
          return articles.map((a) => ({ ...a, source_id: source.id }));
        })
      );

      for (const r of results) {
        if (r.status === "fulfilled") {
          for (const a of r.value) {
            if (!seen.has(a.hash)) {
              seen.add(a.hash);
              allArticles.push(a);
            }
          }
        }
      }
    }

    return allArticles;
  } catch {
    return [];
  }
}

// ─── Hardcoded fallback feeds ───────────────────────────────────────

const FALLBACK_FEEDS: Array<{ name: string; url: string; lang: string }> = [
  { name: "BBC Arabic", url: "https://feeds.bbci.co.uk/arabic/rss.xml", lang: "AR" },
  { name: "France24 AR", url: "https://www.france24.com/ar/rss", lang: "AR" },
  { name: "RT Arabic", url: "https://arabic.rt.com/rss", lang: "AR" },
  { name: "Al Arabiya", url: "https://www.alarabiya.net/feed/rss2", lang: "AR" },
  { name: "Sky News Arabia", url: "https://www.skynewsarabia.com/rss", lang: "AR" },
  { name: "BBC News", url: "https://feeds.bbci.co.uk/news/world/rss.xml", lang: "EN" },
];

async function fetchFromFallbackFeeds(): Promise<RssArticle[]> {
  const allArticles: RssArticle[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < FALLBACK_FEEDS.length; i += 3) {
    const batch = FALLBACK_FEEDS.slice(i, i + 3);
    const results = await Promise.allSettled(
      batch.map(async (feed) => {
        const xml = await fetchWithProxy(feed.url);
        if (!xml) return [];
        return parseRss(xml, feed.name, feed.lang);
      })
    );

    for (const r of results) {
      if (r.status === "fulfilled") {
        for (const a of r.value) {
          if (!seen.has(a.hash)) {
            seen.add(a.hash);
            allArticles.push(a);
          }
        }
      }
    }
  }

  return allArticles;
}

// ─── Main auto-fetch function ───────────────────────────────────────

export async function autoFetchNews(): Promise<number> {
  // Check if enough time has passed since last fetch
  const { data: settings } = await supabase
    .from("fetch_settings")
    .select("last_fetch_time, fetch_interval")
    .limit(1)
    .single();

  if (settings?.last_fetch_time) {
    const lastFetch = new Date(settings.last_fetch_time).getTime();
    const intervalMs = (settings.fetch_interval || 2) * 60 * 60 * 1000;
    if (Date.now() - lastFetch < intervalMs) {
      return 0; // Not time yet
    }
  }

  // Try Edge Function first (most reliable)
  try {
    const { data, error } = await supabase.functions.invoke("fetch-news");
    if (!error && data?.count > 0) {
      console.log(`[Eram24] Edge Function fetched ${data.count} articles`);
      return data.count;
    }
  } catch {
    // Edge Function not available, fall through to client-side
  }

  // Fallback: client-side fetch
  console.log("[Eram24] Edge Function unavailable, using client-side fallback");

  // Try DB sources first, then fallback feeds
  let articles = await fetchFromDBSources();
  if (articles.length === 0) {
    articles = await fetchFromFallbackFeeds();
  }

  if (articles.length === 0) return 0;

  // Insert into database (upsert by hash)
  const { data, error } = await supabase
    .from("articles")
    .upsert(articles, { onConflict: "hash", ignoreDuplicates: true })
    .select("id");

  const inserted = data?.length || 0;

  // Update fetch settings
  await supabase
    .from("fetch_settings")
    .update({
      last_fetch_time: new Date().toISOString(),
      last_fetch_count: inserted,
    })
    .not("id", "is", null);

  return inserted;
}

// ─── Start auto-fetch interval ──────────────────────────────────────

export function startAutoFetch(intervalMs = 30 * 60 * 1000): () => void {
  let active = true;

  const run = async () => {
    if (!active) return;
    try {
      const count = await autoFetchNews();
      if (count > 0) {
        console.log(`[Eram24] Auto-fetched ${count} new articles`);
      }
    } catch (e) {
      console.warn("[Eram24] Auto-fetch error:", e);
    }
  };

  // Run once after 5 seconds
  const initialTimer = setTimeout(run, 5000);

  // Then run periodically
  const intervalId = setInterval(run, intervalMs);

  return () => {
    active = false;
    clearTimeout(initialTimer);
    clearInterval(intervalId);
  };
}
