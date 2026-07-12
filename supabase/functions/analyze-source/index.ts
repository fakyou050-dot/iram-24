import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface AnalysisResult {
  method: string;
  success: boolean;
  articleCount: number;
  quality: number; // 0-100
  feedUrl: string;
  sampleTitle: string | null;
  hasImages: boolean;
  hasContent: boolean;
  hasDates: boolean;
  error: string | null;
}

// ====== RSS/Atom Parser ======
function parseRSSAtom(xml: string, feedUrl: string): { method: string; items: any[] } {
  // Detect Atom
  const isAtom = /<feed[\s>]/i.test(xml);
  
  if (isAtom) {
    return { method: "Atom", items: parseAtomItems(xml, feedUrl) };
  }
  return { method: "RSS", items: parseRSSItems(xml, feedUrl) };
}

function parseRSSItems(xml: string, _feedUrl: string): any[] {
  const items: any[] = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const c = match[1];
    const getTag = (tag: string) => {
      const m = c.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
      return m ? decodeEntities((m[1] || m[2] || "").trim()) : "";
    };
    const title = getTag("title");
    const link = getTag("link");
    const rawDesc = getTag("description");
    const description = stripHtml(rawDesc).substring(0, 500);
    const pubDate = getTag("pubDate");
    const contentEncoded = getTag("content:encoded");
    const content = contentEncoded ? stripHtml(contentEncoded) : null;

    let imageUrl: string | null = null;
    const enclosureMatch = c.match(/url="([^"]*\.(jpg|jpeg|png|gif|webp)[^"]*)"/i);
    if (enclosureMatch) imageUrl = enclosureMatch[1];
    if (!imageUrl) {
      const mediaMatch = c.match(/<media:content[^>]*url="([^"]*)"/i);
      if (mediaMatch) imageUrl = mediaMatch[1];
    }
    if (!imageUrl) {
      const imgMatch = rawDesc.match(/<img[^>]*src="([^"]*)"/i);
      if (imgMatch) imageUrl = imgMatch[1];
    }

    if (title && link) {
      items.push({ title, link, description, pubDate, imageUrl, content });
    }
  }
  return items;
}

function parseAtomItems(xml: string, _feedUrl: string): any[] {
  const items: any[] = [];
  const entryRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/gi;
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const c = match[1];
    const getTag = (tag: string) => {
      const m = c.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
      return m ? decodeEntities((m[1] || m[2] || "").trim()) : "";
    };
    const title = getTag("title");
    const linkMatch = c.match(/<link[^>]*href="([^"]*)"/i);
    const link = linkMatch ? linkMatch[1] : "";
    const summary = getTag("summary");
    const content = getTag("content");
    const updated = getTag("updated") || getTag("published");
    const description = stripHtml(summary || content).substring(0, 500);
    const fullContent = content ? stripHtml(content) : null;

    let imageUrl: string | null = null;
    const imgMatch = (content || summary).match(/<img[^>]*src="([^"]*)"/i);
    if (imgMatch) imageUrl = imgMatch[1];

    if (title && link) {
      items.push({ title, link, description, pubDate: updated, imageUrl, content: fullContent });
    }
  }
  return items;
}

// ====== Quality Scoring ======
function scoreItems(items: any[]): { quality: number; hasImages: boolean; hasContent: boolean; hasDates: boolean } {
  if (items.length === 0) return { quality: 0, hasImages: false, hasContent: false, hasDates: false };

  let imageCount = 0, contentCount = 0, dateCount = 0;
  for (const item of items) {
    if (item.imageUrl) imageCount++;
    if (item.content && item.content.length > 100) contentCount++;
    if (item.pubDate) dateCount++;
  }

  const total = items.length;
  const hasImages = imageCount > total * 0.3;
  const hasContent = contentCount > total * 0.3;
  const hasDates = dateCount > total * 0.5;

  // Quality = weighted score
  let quality = 0;
  quality += Math.min(total, 30) * 1.5; // up to 45 for article count
  quality += (imageCount / total) * 20;
  quality += (contentCount / total) * 25;
  quality += (dateCount / total) * 10;

  return { quality: Math.round(Math.min(quality, 100)), hasImages, hasContent, hasDates };
}

// ====== Try RSS/Atom ======
async function tryFeed(feedUrl: string): Promise<AnalysisResult> {
  try {
    const res = await fetch(feedUrl, {
      headers: { "User-Agent": "EramNews/2.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();

    if (!/<rss|<feed|<channel/i.test(xml)) {
      throw new Error("Not a valid RSS/Atom feed");
    }

    const { method, items } = parseRSSAtom(xml, feedUrl);
    const { quality, hasImages, hasContent, hasDates } = scoreItems(items);

    return {
      method,
      success: items.length > 0,
      articleCount: items.length,
      quality,
      feedUrl,
      sampleTitle: items[0]?.title || null,
      hasImages,
      hasContent,
      hasDates,
      error: items.length === 0 ? "No articles found" : null,
    };
  } catch (e: any) {
    return {
      method: "RSS/Atom",
      success: false,
      articleCount: 0,
      quality: 0,
      feedUrl,
      sampleTitle: null,
      hasImages: false,
      hasContent: false,
      hasDates: false,
      error: e.message,
    };
  }
}

// ====== Try WordPress API ======
async function tryWordPressAPI(baseUrl: string): Promise<AnalysisResult> {
  const apiUrl = `${baseUrl.replace(/\/$/, "")}/wp-json/wp/v2/posts?per_page=20&_embed`;
  try {
    const res = await fetch(apiUrl, {
      headers: { "User-Agent": "EramNews/2.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts = await res.json();
    if (!Array.isArray(posts)) throw new Error("Not a WordPress API");

    const items = posts.map((p: any) => ({
      title: decodeEntities(stripHtml(p.title?.rendered || "")),
      link: p.link || "",
      description: decodeEntities(stripHtml(p.excerpt?.rendered || "")).substring(0, 500),
      content: decodeEntities(stripHtml(p.content?.rendered || "")),
      pubDate: p.date || "",
      imageUrl: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
    }));

    const { quality, hasImages, hasContent, hasDates } = scoreItems(items);

    return {
      method: "WordPress API",
      success: items.length > 0,
      articleCount: items.length,
      quality: quality + 5, // slight bonus for structured API
      feedUrl: apiUrl,
      sampleTitle: items[0]?.title || null,
      hasImages,
      hasContent,
      hasDates,
      error: null,
    };
  } catch (e: any) {
    return {
      method: "WordPress API",
      success: false,
      articleCount: 0,
      quality: 0,
      feedUrl: apiUrl,
      sampleTitle: null,
      hasImages: false,
      hasContent: false,
      hasDates: false,
      error: e.message,
    };
  }
}

// ====== Try HTML Scraping ======
async function tryHTMLScraping(baseUrl: string): Promise<AnalysisResult> {
  try {
    const res = await fetch(baseUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; EramNews/2.0)" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    // Extract article links from homepage
    const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
    let linkMatch;
    const articleLinks: { url: string; title: string }[] = [];
    const seen = new Set<string>();

    while ((linkMatch = linkRegex.exec(html)) !== null) {
      let href = linkMatch[1];
      const text = stripHtml(linkMatch[2]).trim();
      
      if (!text || text.length < 10 || text.length > 300) continue;
      // Filter for article-like URLs
      if (!/\d{4}|article|post|news|story|p=\d/i.test(href)) continue;
      // Skip navigation/footer links
      if (/login|signup|register|contact|about|privacy|terms|category|tag|page\/\d/i.test(href)) continue;

      if (!href.startsWith("http")) {
        try {
          href = new URL(href, baseUrl).href;
        } catch { continue; }
      }

      if (seen.has(href)) continue;
      seen.add(href);
      articleLinks.push({ url: href, title: decodeEntities(text) });
      if (articleLinks.length >= 10) break;
    }

    // Try to scrape first 3 articles for quality assessment
    let imageCount = 0, contentCount = 0, dateCount = 0;
    const items: any[] = [];

    for (const link of articleLinks.slice(0, 3)) {
      try {
        const articleRes = await fetch(link.url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; EramNews/2.0)" },
          signal: AbortSignal.timeout(8000),
        });
        if (!articleRes.ok) continue;
        const articleHtml = await articleRes.text();

        // Extract og:image
        const ogImage = articleHtml.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i);
        if (ogImage) imageCount++;

        // Extract article content
        const articleBody = articleHtml.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
        const content = articleBody ? stripHtml(articleBody[1]) : "";
        if (content.length > 200) contentCount++;

        // Extract date
        const dateMatch = articleHtml.match(/<time[^>]*datetime="([^"]*)"/i) ||
          articleHtml.match(/<meta[^>]*property="article:published_time"[^>]*content="([^"]*)"/i);
        if (dateMatch) dateCount++;

        items.push({
          title: link.title,
          link: link.url,
          content: content.substring(0, 1000),
          imageUrl: ogImage?.[1] || null,
          pubDate: dateMatch?.[1] || null,
        });
      } catch { /* skip */ }
    }

    const totalChecked = Math.min(articleLinks.length, 3);
    const hasImages = totalChecked > 0 && imageCount / totalChecked > 0.3;
    const hasContent = totalChecked > 0 && contentCount / totalChecked > 0.3;
    const hasDates = totalChecked > 0 && dateCount / totalChecked > 0.3;

    let quality = 0;
    quality += Math.min(articleLinks.length, 20) * 1.5;
    if (totalChecked > 0) {
      quality += (imageCount / totalChecked) * 15;
      quality += (contentCount / totalChecked) * 20;
      quality += (dateCount / totalChecked) * 10;
    }

    return {
      method: "HTML Scraping",
      success: articleLinks.length > 0,
      articleCount: articleLinks.length,
      quality: Math.round(Math.min(quality, 80)), // cap lower than feeds
      feedUrl: baseUrl,
      sampleTitle: articleLinks[0]?.title || null,
      hasImages,
      hasContent,
      hasDates,
      error: articleLinks.length === 0 ? "No article links found" : null,
    };
  } catch (e: any) {
    return {
      method: "HTML Scraping",
      success: false,
      articleCount: 0,
      quality: 0,
      feedUrl: baseUrl,
      sampleTitle: null,
      hasImages: false,
      hasContent: false,
      hasDates: false,
      error: e.message,
    };
  }
}

// ====== Discover RSS feeds from HTML ======
async function discoverFeeds(baseUrl: string): Promise<string[]> {
  try {
    const res = await fetch(baseUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; EramNews/2.0)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const html = await res.text();

    const feeds: string[] = [];
    const linkRegex = /<link[^>]*type="application\/(rss|atom)\+xml"[^>]*href="([^"]*)"/gi;
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      let href = match[2];
      if (!href.startsWith("http")) {
        try { href = new URL(href, baseUrl).href; } catch { continue; }
      }
      feeds.push(href);
    }

    // Also try common RSS paths
    const commonPaths = ["/feed", "/rss", "/feed.xml", "/rss.xml", "/atom.xml", "/feeds/posts/default"];
    for (const path of commonPaths) {
      try {
        const feedUrl = new URL(path, baseUrl).href;
        if (!feeds.includes(feedUrl)) feeds.push(feedUrl);
      } catch { /* skip */ }
    }

    return feeds;
  } catch {
    return [];
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ success: false, error: "URL is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let baseUrl = url.trim();
    if (!baseUrl.startsWith("http")) baseUrl = `https://${baseUrl}`;

    console.log("Analyzing source:", baseUrl);

    const results: AnalysisResult[] = [];

    // 1. Discover RSS/Atom feeds from the page
    const discoveredFeeds = await discoverFeeds(baseUrl);
    console.log(`Discovered ${discoveredFeeds.length} feeds`);

    // 2. Try all methods in parallel
    const feedPromises = discoveredFeeds.slice(0, 5).map(f => tryFeed(f));
    const [wpResult, scrapingResult, ...feedResults] = await Promise.all([
      tryWordPressAPI(baseUrl),
      tryHTMLScraping(baseUrl),
      ...feedPromises,
    ]);

    // Also try the URL itself as a feed (in case it's a direct RSS link)
    if (!discoveredFeeds.includes(baseUrl)) {
      const directFeed = await tryFeed(baseUrl);
      if (directFeed.success) results.push(directFeed);
    }

    results.push(wpResult);
    results.push(scrapingResult);
    results.push(...feedResults);

    // Sort by quality (best first), successful ones first
    results.sort((a, b) => {
      if (a.success && !b.success) return -1;
      if (!a.success && b.success) return 1;
      return b.quality - a.quality;
    });

    // Mark best
    const bestIdx = results.findIndex(r => r.success);

    return new Response(JSON.stringify({
      success: true,
      results,
      bestIndex: bestIdx >= 0 ? bestIdx : null,
      totalMethods: results.length,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Analyze error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
