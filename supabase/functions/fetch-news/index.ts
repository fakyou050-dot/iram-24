// supabase/functions/fetch-news/index.ts
// Edge Function: Fetch news from all active sources in news_sources table
// Deploy: supabase functions deploy fetch-news
// Schedule via pg_cron or call manually from admin panel

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
}

function extractImage(block: string): string | null {
  const patterns = [
    /<media:(?:content|thumbnail)[^>]+url=["']([^"']+)["']/i,
    /<enclosure[^>]+url=["']([^"']+\.(?:jpg|jpeg|png|webp|gif))[^"']*["']/i,
    /<image[^>]*>([\s\S]*?)<\/image>/i,
    /<img[^>]+src=["']([^"']+)["']/i,
    /<media:content[^>]+url=["']([^"']+)["']/i,
  ];
  for (const p of patterns) {
    const m = block.match(p);
    if (m) {
      // For <image> tag, extract <image:loc> inside
      if (p.source.includes("image[^>]*>")) {
        const locMatch = m[1]?.match(/<image:loc>([^<]+)<\/image:loc>/i);
        if (locMatch) return locMatch[1];
      }
      return m[1];
    }
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

// ─── Smart Categorization (Arabic) ──────────────────────────────────

function classifyCategory(title: string, desc: string): string {
  const t = (title + " " + desc).toLowerCase();

  // Arabic categories
  if (/كرة|مباراة|مباريات|دوري|بطولة|كأس|منتخب|نادي|هدف|أهداف|مدرب|لاعب|الهلال|النصر|الاتحاد|الأهلي|برشلونة|ريال مدريد|تشيلسي|ليفربول|مانشستر|رونالدو|ميسي|الانتقالات|الفيفا|أولمبي|رماية|سباق|تنس|سلة|طائرة|ملاكمة|سباحة|مونديال|كأس العالم|رياض/.test(t)) return "رياضة";
  if (/اقتصاد|اقتصادي|مالي|البورصة|بورصة|أسهم|سهم|نفط|دولار|يورو|ذهب|الأسعار|تضخم|البنك|بنوك|استثمار|تجارة|صفقة|السوق|الأسواق|ميزانية|اكتتاب|أرامكو|الفائدة|عملة|عملات|مصرف/.test(t)) return "اقتصاد";
  if (/تكنولوج|تقني|تقنية|ذكاء اصطناعي|روبوت|هاتف|جوال|آيفون|سامسونغ|أبل|جوجل|مايكروسوفت|ميتا|إنترنت|تطبيق|برمج|chatgpt|openai|كهربائية|تسلا|فضاء|قمر صناعي|إيلون ماسك/.test(t)) return "تكنولوجيا";
  if (/صحة|طبي|الطب|مرض|أمراض|علاج|دواء|أدوية|فيروس|لقاح|مستشفى|أطباء|وباء|جائحة|كوفيد|كورونا|سرطان|سكري|قلب|تغذية|أنفلونزا/.test(t)) return "صحة";
  if (/فيلم|أفلام|سينما|مسرح|موسيق|أغنية|مغني|ممثل|مسلسل|فنان|ثقاف|كتاب|رواية|معرض/.test(t)) return "ثقافة";
  if (/انتخاب|برلمان|حكومة|رئيس|وزير|قمة|دبلوماس|سفير|عقوبات|ترمب|بايدن|بوتين|الناتو|الأمم المتحدة|عسكر|الجيش|قصف|غارة|صاروخ|مسيرة|اغتيال|حماس|حزب الله|الحوثي|غزة|إسرائيل|إيران|الحرب|هدنة|مفاوضات|اتفاق/.test(t)) return "سياسة";
  if (/اليمن|يمني|يمنية|صنعاء|عدن|مأرب|تعز|حضرموت|إب|ذمار|البيضاء|سقطرى|الحديدة|المهرة|حجة|شبوة|الجوف|أبين|لحج/.test(t)) return "محلي";
  if (/سعود|السعودية|الرياض|الإمارات|أبوظبي|دبي|مصر|القاهرة|الكويت|قطر|الدوحة|البحرين|عُمان|لبنان|بيروت|سوري|دمشق|عراق|بغداد|أردن|فلسطين|المغرب|الجزائر|تونس|ليبيا|السودان/.test(t)) return "عربي";
  if (/أوروب|أمريك|واشنطن|روسي|موسكو|الصين|بكين|اليابان|طوكيو|الهند|كوريا|بريطان|لندن|فرنسا|باريس|ألمانيا|برلين|تركيا|أنقرة|أوكرانيا|أفريقيا|أستراليا|كندا/.test(t)) return "دولي";

  return "عامة";
}

// ─── RSS Parser ─────────────────────────────────────────────────────

interface ParsedArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image_url: string | null;
  category: string;
  published_at: string;
  hash: string;
  author_name: string;
}

function parseRss(xml: string, sourceName: string, language: string, sourceCategory: string | null): ParsedArticle[] {
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

      // Use source category if set, otherwise auto-classify
      const category = sourceCategory || classifyCategory(title, description || "");

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
        published_at: isoDate,
        hash: hashString(`${sourceName}-${link}`),
        author_name: sourceName,
      } as ParsedArticle;
    })
    .filter(Boolean) as ParsedArticle[];
}

// ─── Main Handler ───────────────────────────────────────────────────

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Parse request body for optional actions
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // No body — default fetch
    }

    // ─── Cleanup Duplicates Action ───────────────────────────────
    if (body.action === "cleanup_duplicates") {
      // Find duplicate hashes, keep the newest
      const { data: dupes } = await supabase.rpc("cleanup_duplicate_articles");
      return new Response(
        JSON.stringify({ success: true, removedCount: dupes || 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ─── Fetch from specific source ──────────────────────────────
    if (body.source_id) {
      const { data: source } = await supabase
        .from("news_sources")
        .select("*")
        .eq("id", body.source_id)
        .eq("is_active", true)
        .single();

      if (!source) {
        return new Response(
          JSON.stringify({ error: "Source not found or inactive" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const articles = await fetchFromSource(source);
      const inserted = await insertArticles(supabase, articles, source.id);

      return new Response(
        JSON.stringify({ success: true, count: inserted, source: source.name }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ─── Fetch from ALL active sources ───────────────────────────
    const { data: sources, error: srcError } = await supabase
      .from("news_sources")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (srcError) {
      throw new Error(`Failed to fetch sources: ${srcError.message}`);
    }

    if (!sources || sources.length === 0) {
      return new Response(
        JSON.stringify({ success: true, count: 0, message: "No active sources found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let totalInserted = 0;
    const results: Array<{ source: string; status: string; count: number; error?: string }> = [];

    // Process sources in batches of 5 to avoid overwhelming
    for (let i = 0; i < sources.length; i += 5) {
      const batch = sources.slice(i, i + 5);
      const batchResults = await Promise.allSettled(
        batch.map(async (source) => {
          try {
            const articles = await fetchFromSource(source);
            const inserted = await insertArticles(supabase, articles, source.id);

            // Update source metadata
            await supabase
              .from("news_sources")
              .update({
                last_fetch: new Date().toISOString(),
                last_fetch_status: "success",
                article_count: (source.article_count || 0) + inserted,
              })
              .eq("id", source.id);

            return { source: source.name, status: "success", count: inserted };
          } catch (err) {
            const errMsg = err instanceof Error ? err.message : "Unknown error";

            // Update source with error status
            await supabase
              .from("news_sources")
              .update({ last_fetch_status: `error: ${errMsg}` })
              .eq("id", source.id);

            return { source: source.name, status: "error", count: 0, error: errMsg };
          }
        })
      );

      for (const r of batchResults) {
        if (r.status === "fulfilled") {
          results.push(r.value);
          totalInserted += r.value.count;
        }
      }
    }

    // Update fetch_settings
    await supabase
      .from("fetch_settings")
      .update({
        last_fetch_time: new Date().toISOString(),
        last_fetch_count: totalInserted,
      })
      .not("id", "is", null);

    return new Response(
      JSON.stringify({
        success: true,
        count: totalInserted,
        sources_processed: results.length,
        details: results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    console.error("[fetch-news] Error:", errMsg);
    return new Response(
      JSON.stringify({ error: errMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// ─── Fetch articles from a single source ────────────────────────────

async function fetchFromSource(source: any): Promise<ParsedArticle[]> {
  const feedUrl = source.feed_url || source.url;
  if (!feedUrl) return [];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Eram24NewsBot/1.0 (+https://iram-24.vercel.app/)",
        "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xml = await response.text();
    if (!xml || xml.length < 50) {
      throw new Error("Empty or invalid response");
    }

    return parseRss(xml, source.name, source.language, source.category);
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

// ─── Insert articles into database ──────────────────────────────────

async function insertArticles(
  supabase: any,
  articles: ParsedArticle[],
  sourceId: string
): Promise<number> {
  if (articles.length === 0) return 0;

  // Add source_id and language to each article
  const { data: sourceData } = await supabase
    .from("news_sources")
    .select("language")
    .eq("id", sourceId)
    .single();

  const language = sourceData?.language || "AR";

  const enriched = articles.map((a) => ({
    ...a,
    source_id: sourceId,
    language,
    is_manual: false,
    is_breaking: false,
    show_source: true,
    views: 0,
  }));

  // Batch insert in chunks of 50
  let inserted = 0;
  for (let i = 0; i < enriched.length; i += 50) {
    const chunk = enriched.slice(i, i + 50);
    const { data, error } = await supabase
      .from("articles")
      .upsert(chunk, { onConflict: "hash", ignoreDuplicates: true })
      .select("id");

    if (!error && data) {
      inserted += data.length;
    }
  }

  return inserted;
}
