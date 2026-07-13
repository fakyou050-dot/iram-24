/**
 * Auto-fetch RSS news — client-side fallback when Edge Functions are not deployed.
 * Runs in the background, fetches RSS via CORS proxy, inserts into Supabase.
 */

import { supabase } from "@/integrations/supabase/client";

const CORS_PROXY = "https://api.allorigins.win/raw?url=";

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
}

// Classify article into category
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
    /<enclosure[^>]+url=["']([^"']+\.(?:jpg|jpeg|png|webp))[^"']*["']/i,
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

const FEEDS: Array<{ name: string; url: string; lang: string }> = [
  // Arabic news
  { name: "BBC Arabic", url: "https://feeds.bbci.co.uk/arabic/rss.xml", lang: "AR" },
  { name: "France24 AR", url: "https://www.france24.com/ar/rss", lang: "AR" },
  { name: "RT Arabic", url: "https://arabic.rt.com/rss", lang: "AR" },
  { name: "Sky News Arabia", url: "https://www.skynewsarabia.com/rss", lang: "AR" },
  { name: "Al Arabiya", url: "https://www.alarabiya.net/feed/rss2", lang: "AR" },
  { name: "RT Sports", url: "https://arabic.rt.com/sport/rss", lang: "AR" },
  // English news
  { name: "BBC News", url: "https://feeds.bbci.co.uk/news/world/rss.xml", lang: "EN" },
  { name: "The Guardian", url: "https://www.theguardian.com/world/rss", lang: "EN" },
];

async function fetchOneFeed(feed: { name: string; url: string; lang: string }): Promise<RssArticle[]> {
  try {
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(feed.url)}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    const res = await fetch(proxyUrl, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRss(xml, feed.name, feed.lang);
  } catch {
    return [];
  }
}

/**
 * Fetch all RSS feeds and insert new articles into Supabase.
 * Returns the number of new articles inserted.
 */
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

  // Fetch all feeds in parallel
  const results = await Promise.allSettled(FEEDS.map(fetchOneFeed));
  const allArticles: RssArticle[] = [];
  const seen = new Set<string>();

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

  if (allArticles.length === 0) return 0;

  // Insert into database (upsert by hash)
  const { data, error } = await supabase
    .from("articles")
    .upsert(allArticles, { onConflict: "hash", ignoreDuplicates: true })
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

/**
 * Start auto-fetch interval. Returns a cleanup function.
 * Call this once when the app loads.
 */
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
