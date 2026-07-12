import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  "Accept-Language": "ar,en-US;q=0.9,en;q=0.8",
  "Accept": "application/rss+xml, application/xml, text/xml, text/html;q=0.9, */*;q=0.8",
};

type ParsedFeedItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  imageUrl: string | null;
  content: string | null;
  videoUrl: string | null;
};

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

function decodeEntities(text: string): string {
  if (!text) return text;
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&#8216;/g, "\u2018")
    .replace(/&#8217;/g, "\u2019")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_: string, code: string) => String.fromCharCode(parseInt(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_: string, code: string) => String.fromCharCode(parseInt(code, 16)));
}

function normalizeUrl(url: string): string {
  if (!url) return "";
  let normalized = decodeEntities(url).trim().replace(/\s+/g, "");
  if (normalized.startsWith("//")) normalized = `https:${normalized}`;
  normalized = normalized.replace(/^http:\/\//i, "https://");
  return normalized;
}

function normalizeUrlKey(url: string): string {
  const normalized = normalizeUrl(url);
  if (!normalized) return "";

  try {
    const parsed = new URL(normalized);
    parsed.hash = "";
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid", "s"].forEach((param) => {
      parsed.searchParams.delete(param);
    });
    return `${parsed.origin}${parsed.pathname.replace(/\/$/, "")}${parsed.search}`.toLowerCase();
  } catch {
    return normalized.toLowerCase().replace(/\/$/, "");
  }
}

function normalizeTitleKey(title: string): string {
  return decodeEntities(title || "")
    .toLowerCase()
    .replace(/[\u0640]/g, "")
    .replace(/["'“”‘’`´]/g, "")
    .replace(/[\u061f؟!.,:;()\-_/\\|\[\]{}]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<aside[\s\S]*?<\/aside>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeImageUrl(url: string): string {
  url = normalizeUrl(url);
  if (!url) return url;
  if (url.includes("pbs.twimg.com")) {
    url = url.replace(/name=\w+/, "name=orig");
    if (!url.includes("name=")) url += (url.includes("?") ? "&" : "?") + "name=orig";
  }
  return url;
}

function normalizeVideoUrl(url: string): string {
  return normalizeUrl(url);
}

function dedupeUrls(urls: string[]) {
  return [...new Set(urls.filter(Boolean))];
}

function extractMedia(html: string) {
  if (!html) return null;

  const imageMatches = [
    ...Array.from(html.matchAll(/<img[^>]+(?:src|data-src)=["']([^"']+)["']/gi)).map((m) => normalizeImageUrl(m[1])),
    ...Array.from(html.matchAll(/(?:https?:)?\/\/pbs\.twimg\.com\/[^\s"'<>]+/gi)).map((m) => normalizeImageUrl(m[0])),
  ];

  const videoMatches = [
    ...Array.from(html.matchAll(/<video[^>]+src=["']([^"']+)["']/gi)).map((m) => normalizeVideoUrl(m[1])),
    ...Array.from(html.matchAll(/<source[^>]+src=["']([^"']+)["']/gi)).map((m) => normalizeVideoUrl(m[1])),
    ...Array.from(html.matchAll(/(?:https?:)?\/\/video\.twimg\.com\/[^\s"'<>]+/gi)).map((m) => normalizeVideoUrl(m[0])),
    ...Array.from(html.matchAll(/(?:https?:)?\/\/[^\s"'<>]+\.(?:mp4|webm|mov|m3u8)(?:\?[^\s"'<>]*)?/gi)).map((m) => normalizeVideoUrl(m[0])),
  ];

  return {
    images: dedupeUrls(imageMatches),
    videos: dedupeUrls(videoMatches),
  };
}

function extractEnclosureMedia(itemXml: string) {
  const images: string[] = [];
  const videos: string[] = [];

  for (const match of itemXml.matchAll(/<enclosure[^>]*url=["']([^"']+)["'][^>]*?(?:type=["']([^"']+)["'])?[^>]*>/gi)) {
    const url = normalizeUrl(match[1]);
    const type = (match[2] || "").toLowerCase();
    if (!url) continue;

    if (type.startsWith("video/") || /\.(mp4|webm|mov|m3u8)(\?|$)/i.test(url)) {
      videos.push(normalizeVideoUrl(url));
    } else if (type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|avif)(\?|$)/i.test(url) || url.includes("pbs.twimg.com")) {
      images.push(normalizeImageUrl(url));
    }
  }

  for (const match of itemXml.matchAll(/<media:content[^>]*url=["']([^"']+)["'][^>]*?(?:medium|type)=["']([^"']+)["']?[^>]*>/gi)) {
    const url = normalizeUrl(match[1]);
    const kind = (match[2] || "").toLowerCase();
    if (!url) continue;

    if (kind.includes("video")) videos.push(normalizeVideoUrl(url));
    else images.push(normalizeImageUrl(url));
  }

  for (const match of itemXml.matchAll(/<media:thumbnail[^>]*url=["']([^"']+)["']/gi)) {
    const url = normalizeImageUrl(match[1]);
    if (url) images.push(url);
  }

  return { images: dedupeUrls(images), videos: dedupeUrls(videos) };
}

function buildPlainText(html: string): string {
  return decodeEntities(stripHtml(html || "")).substring(0, 500);
}

function parseRSSItems(xml: string): ParsedFeedItem[] {
  const items: ParsedFeedItem[] = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const c = match[1];
    const getTag = (tag: string) => {
      const m = c.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
      return m ? (m[1] || m[2] || "").trim() : "";
    };
    const title = decodeEntities(getTag("title"));
    const link = normalizeUrl(getTag("link"));
    const rawDesc = getTag("description");
    const description = buildPlainText(rawDesc);
    const pubDate = getTag("pubDate");
    const contentEncoded = getTag("content:encoded");
    const rawContent = decodeEntities(contentEncoded || rawDesc || "").trim();

    const descMedia = extractMedia(rawDesc) || { images: [], videos: [] };
    const contentMedia = extractMedia(contentEncoded) || { images: [], videos: [] };
    const enclosureMedia = extractEnclosureMedia(c);
    const allImages = dedupeUrls([...enclosureMedia.images, ...contentMedia.images, ...descMedia.images]);
    const allVideos = dedupeUrls([...enclosureMedia.videos, ...contentMedia.videos, ...descMedia.videos]);
    const imageUrl = allImages[0] || null;
    const videoUrl = allVideos[0] || null;
    const content = rawContent || null;

    if (title && link) {
      items.push({ title, link, description, pubDate, imageUrl, content, videoUrl });
    }
  }
  return items;
}

function parseAtomItems(xml: string): Array<{
  title: string; link: string; description: string; pubDate: string; imageUrl: string | null; content: string | null; videoUrl: string | null;
}> {
  const items: ParsedFeedItem[] = [];
  const entryRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/gi;
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const c = match[1];
    const getTag = (tag: string) => {
      const m = c.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
      return m ? (m[1] || m[2] || "").trim() : "";
    };
    const title = decodeEntities(getTag("title"));
    const linkMatch = c.match(/<link[^>]*href="([^"]*)"/i);
    const link = linkMatch ? normalizeUrl(linkMatch[1]) : "";
    const summary = getTag("summary");
    const contentTag = getTag("content");
    const updated = getTag("updated") || getTag("published");
    const description = buildPlainText(summary || contentTag);
    const content = decodeEntities(contentTag || summary || "").trim() || null;
    const media = extractMedia(`${summary || ""}\n${contentTag || ""}`) || { images: [], videos: [] };
    const imageUrl = media.images[0] || null;
    const videoUrl = media.videos[0] || null;

    if (title && link) {
      items.push({ title, link, description, pubDate: updated, imageUrl, content, videoUrl });
    }
  }
  return items;
}

function parseFeed(xml: string) {
  const isAtom = /<feed[\s>]/i.test(xml);
  if (isAtom) return parseAtomItems(xml);
  return parseRSSItems(xml);
}

async function tryWordPressAPI(baseUrl: string) {
  const apiUrl = `${baseUrl.replace(/\/$/, "")}/wp-json/wp/v2/posts?per_page=20&_embed`;
  try {
    const res = await fetch(apiUrl, {
      headers: { "User-Agent": "EramNews/2.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) return null;

    return posts.map((p: any) => ({
      title: decodeEntities(stripHtml(p.title?.rendered || "")),
      link: normalizeUrl(p.link || ""),
      description: decodeEntities(stripHtml(p.excerpt?.rendered || "")).substring(0, 500),
      content: decodeEntities(p.content?.rendered || "") || null,
      pubDate: p.date || new Date().toISOString(),
      imageUrl: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url || extractMedia(p.content?.rendered || "")?.images?.[0] || null,
      videoUrl: extractMedia(p.content?.rendered || "")?.videos?.[0] || null,
    }));
  } catch {
    return null;
  }
}

import { classify } from "../_shared/classifier.ts";

function categorize(title: string, desc: string, lang: string, sourceName = ""): string {
  return classify(`${title} ${sourceName}`, desc, (lang as "AR" | "EN") || "AR").category;
}

async function loadExistingFingerprints(supabase: ReturnType<typeof createClient>) {
  const titleKeys = new Set<string>();
  const urlKeys = new Set<string>();
  const pageSize = 1000;

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("articles")
      .select("title, url")
      .range(from, from + pageSize - 1);

    if (error || !data || data.length === 0) break;

    for (const article of data) {
      const titleKey = normalizeTitleKey(article.title || "");
      const urlKey = normalizeUrlKey(article.url || "");
      if (titleKey) titleKeys.add(titleKey);
      if (urlKey) urlKeys.add(urlKey);
    }

    if (data.length < pageSize) break;
  }

  return { titleKeys, urlKeys };
}

async function cleanupDuplicates(supabase: ReturnType<typeof createClient>) {
  const rows: Array<{ id: string; title: string; url: string; published_at: string | null; created_at: string | null }> = [];
  const pageSize = 1000;

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("articles")
      .select("id, title, url, published_at, created_at")
      .range(from, from + pageSize - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;

    rows.push(...data);
    if (data.length < pageSize) break;
  }

  rows.sort((a, b) => {
    const aTime = new Date(a.published_at || a.created_at || 0).getTime();
    const bTime = new Date(b.published_at || b.created_at || 0).getTime();
    return bTime - aTime;
  });

  const seenTitleKeys = new Set<string>();
  const seenUrlKeys = new Set<string>();
  const duplicateGroupKeys = new Set<string>();
  const idsToDelete = new Set<string>();

  for (const row of rows) {
    const titleKey = normalizeTitleKey(row.title || "");
    const urlKey = normalizeUrlKey(row.url || "");
    const titleDup = titleKey && seenTitleKeys.has(titleKey);
    const urlDup = urlKey && seenUrlKeys.has(urlKey);

    if (titleDup || urlDup) {
      idsToDelete.add(row.id);
      if (titleDup) duplicateGroupKeys.add(`title:${titleKey}`);
      if (urlDup) duplicateGroupKeys.add(`url:${urlKey}`);
      continue;
    }

    if (titleKey) seenTitleKeys.add(titleKey);
    if (urlKey) seenUrlKeys.add(urlKey);
  }

  const ids = [...idsToDelete];
  for (let i = 0; i < ids.length; i += 200) {
    const chunk = ids.slice(i, i + 200);
    const { error } = await supabase.from("articles").delete().in("id", chunk);
    if (error) throw error;
  }

  return {
    removedCount: ids.length,
    duplicateGroups: duplicateGroupKeys.size,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let body: any = {};
    try { body = await req.json(); } catch {}
    const targetSourceId = body?.source_id;
    const action = body?.action;

    if (action === "cleanup_duplicates") {
      const cleanup = await cleanupDuplicates(supabase);
      return new Response(JSON.stringify({
        message: `Removed ${cleanup.removedCount} duplicate articles`,
        ...cleanup,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let query = supabase.from("news_sources").select("*").eq("is_active", true);
    if (targetSourceId) query = supabase.from("news_sources").select("*").eq("id", targetSourceId);

    const { data: sources } = await query;
    if (!sources || sources.length === 0) {
      return new Response(JSON.stringify({ count: 0, message: "No active sources" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let totalInserted = 0;
    const logs: string[] = [];
    const existingFingerprints = await loadExistingFingerprints(supabase);

    for (const source of sources) {
      try {
        let items: any[] = [];
        let method = "RSS";

        // Method 1: Try RSS/Atom feed
        try {
          const res = await fetch(source.url, {
            headers: REQUEST_HEADERS,
            signal: AbortSignal.timeout(15000),
          });
          if (res.ok) {
            const text = await res.text();
            if (/<rss|<feed|<channel/i.test(text)) {
              items = parseFeed(text);
              method = /<feed[\s>]/i.test(text) ? "Atom" : "RSS";
            }
          }
        } catch (e) {
          console.log(`RSS failed for ${source.name}: ${e}`);
        }

        // Method 2: Fallback to WordPress API
        if (items.length === 0) {
          try {
            const baseUrl = new URL(source.url).origin;
            const wpItems = await tryWordPressAPI(baseUrl);
            if (wpItems && wpItems.length > 0) {
              items = wpItems;
              method = "WordPress API";
            }
          } catch (e) {
            console.log(`WP API failed for ${source.name}: ${e}`);
          }
        }

        if (items.length === 0) {
          logs.push(`${source.name}: No articles found (tried RSS, Atom, WP API)`);
          await supabase.from("news_sources").update({
            last_fetch_status: "failed",
            last_fetch: new Date().toISOString(),
          }).eq("id", source.id);
          continue;
        }

        // Limit to last 30 articles
        items = items.slice(0, 30);
        let sourceInserted = 0;
        let sourceSkipped = 0;

        for (const item of items) {
          const titleKey = normalizeTitleKey(item.title);
          const urlKey = normalizeUrlKey(item.link);
          if (!titleKey || !urlKey) {
            sourceSkipped++;
            continue;
          }

          if (existingFingerprints.titleKeys.has(titleKey) || existingFingerprints.urlKeys.has(urlKey)) {
            sourceSkipped++;
            continue;
          }

          const hash = hashString(`${titleKey}|${urlKey}`);
          // Always use smart categorizer — analyzes title + description to pick the best section.
          const category = categorize(item.title, item.description, source.language, source.name);

          // Try to fetch og:image if no image found
          let finalImage = item.imageUrl;
          if (!finalImage && item.link) {
            try {
              const pageRes = await fetch(item.link, {
                headers: REQUEST_HEADERS,
                signal: AbortSignal.timeout(8000),
              });
              if (pageRes.ok) {
                const html = await pageRes.text();
                const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
                  || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
                if (ogMatch) finalImage = normalizeImageUrl(ogMatch[1]);
              }
            } catch { /* skip */ }
          }

          if (finalImage) finalImage = normalizeImageUrl(finalImage);
          const finalVideo = item.videoUrl ? normalizeVideoUrl(item.videoUrl) : null;

          const { error } = await supabase.from("articles").upsert({
            source_id: source.id,
            title: item.title,
            description: item.description || null,
            content: item.content || null,
            url: item.link,
            image_url: finalImage,
            video_url: finalVideo,
            category,
            language: source.language,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            hash,
          }, { onConflict: "hash" });

          if (!error) {
            sourceInserted++;
            existingFingerprints.titleKeys.add(titleKey);
            existingFingerprints.urlKeys.add(urlKey);
          }
        }

        logs.push(`${source.name}: ${sourceInserted} articles via ${method}${sourceSkipped ? `, skipped ${sourceSkipped} duplicates` : ""}`);

        await supabase.from("news_sources").update({
          last_fetch: new Date().toISOString(),
          last_fetch_status: "success",
          article_count: (source.article_count || 0) + sourceInserted,
        }).eq("id", source.id);

        totalInserted += sourceInserted;
      } catch (e: any) {
        console.error(`Error fetching ${source.name}:`, e);
        logs.push(`${source.name}: ERROR - ${e.message}`);
        await supabase.from("news_sources").update({
          last_fetch_status: "failed",
          last_fetch: new Date().toISOString(),
        }).eq("id", source.id);
      }
    }

    await supabase.from("fetch_settings").update({
      last_fetch_time: new Date().toISOString(),
      last_fetch_count: totalInserted,
    }).neq("id", "00000000-0000-0000-0000-000000000000");

    console.log("Fetch complete:", logs.join(" | "));

    return new Response(JSON.stringify({
      count: totalInserted,
      message: `Fetched ${totalInserted} new articles`,
      logs,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Fetch error:", error);
    return new Response(JSON.stringify({ error: "Internal error", details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
