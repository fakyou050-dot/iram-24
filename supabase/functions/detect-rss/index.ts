import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ success: false, error: "URL is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://${targetUrl}`;
    }

    console.log("Detecting RSS for:", targetUrl);

    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ar,en;q=0.9",
      },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ success: false, error: `Failed to fetch: ${res.status}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const html = await res.text();
    const feeds: Array<{ title: string; url: string; type: string }> = [];

    // 1. Detect <link> tags for RSS/Atom feeds
    const linkRegex = /<link[^>]*type=["'](application\/rss\+xml|application\/atom\+xml|application\/feed\+json|text\/xml)["'][^>]*>/gi;
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      const tag = match[0];
      const type = match[1];
      const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
      const titleMatch = tag.match(/title=["']([^"']+)["']/i);
      if (hrefMatch) {
        let feedUrl = hrefMatch[1];
        if (feedUrl.startsWith("/")) {
          const u = new URL(targetUrl);
          feedUrl = `${u.origin}${feedUrl}`;
        } else if (!feedUrl.startsWith("http")) {
          feedUrl = `${targetUrl.replace(/\/$/, "")}/${feedUrl}`;
        }
        feeds.push({
          title: titleMatch ? titleMatch[1] : feedUrl,
          url: feedUrl,
          type: type.includes("atom") ? "Atom" : type.includes("json") ? "JSON Feed" : "RSS",
        });
      }
    }

    // 2. Try common RSS paths
    const baseUrl = new URL(targetUrl);
    const commonPaths = [
      "/feed", "/feed/", "/rss", "/rss.xml", "/feed.xml", "/atom.xml",
      "/feeds/posts/default", "/blog/feed", "/news/feed", "/?feed=rss2",
    ];

    for (const path of commonPaths) {
      const testUrl = `${baseUrl.origin}${path}`;
      // Skip if already found
      if (feeds.some(f => f.url === testUrl)) continue;
      try {
        const testRes = await fetch(testUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/rss+xml,application/xml,text/xml,*/*;q=0.8",
          },
          redirect: "follow",
        });
        if (testRes.ok) {
          const contentType = testRes.headers.get("content-type") || "";
          const body = await testRes.text();
          if (contentType.includes("xml") || contentType.includes("rss") || contentType.includes("atom") || body.trimStart().startsWith("<?xml") || body.includes("<rss") || body.includes("<feed")) {
            feeds.push({ title: `RSS Feed (${path})`, url: testUrl, type: "RSS" });
          }
        }
      } catch {
        // skip
      }
    }

    // Deduplicate
    const unique = feeds.filter((f, i, arr) => arr.findIndex(x => x.url === f.url) === i);

    return new Response(JSON.stringify({ success: true, feeds: unique }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("RSS detect error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message || "Failed to detect RSS" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
