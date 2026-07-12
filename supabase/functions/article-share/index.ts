// Public share endpoint. Returns crawler-friendly HTML with per-article OG/Twitter
// tags. Human browsers get an immediate redirect to the SPA article page.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const SITE_ORIGIN = "https://fakyou050-dot.github.io/iram-24";
const SITE_NAME = "إيرام 24";

const escape = (s: string) =>
  (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const stripHtml = (s: string) =>
  (s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const BOT_UA = /(bot|crawler|spider|facebookexternalhit|whatsapp|telegrambot|twitterbot|slackbot|discordbot|linkedinbot|pinterest|embedly|quora link preview|showyoubot|outbrain|w3c_validator|preview|link|scanner|monitor)/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const target = id ? `${SITE_ORIGIN}/article/${id}` : SITE_ORIGIN;

  if (!id) {
    return Response.redirect(SITE_ORIGIN, 302);
  }

  const ua = req.headers.get("user-agent") || "";
  const isBot = BOT_UA.test(ua);

  // For humans: just redirect immediately.
  if (!isBot) {
    return new Response(null, { status: 302, headers: { location: target, ...corsHeaders } });
  }

  // For crawlers: fetch article and return rich HTML with OG tags.
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data } = await supabase
      .from("articles")
      .select("title, description, content, image_url, category, published_at, language, author_name")
      .eq("id", id)
      .maybeSingle();

    const title = escape(stripHtml(data?.title || SITE_NAME));
    const desc = escape(
      stripHtml(data?.description || data?.content || "").slice(0, 200)
    );
    const image = data?.image_url ? escape(data.image_url) : "";
    const lang = data?.language === "EN" ? "en" : "ar";
    const dir = lang === "ar" ? "rtl" : "ltr";
    const published = data?.published_at || "";

    const html = `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${title} | ${SITE_NAME}</title>
<link rel="canonical" href="${target}" />
<meta name="description" content="${desc}" />
<meta property="og:site_name" content="${SITE_NAME}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:url" content="${target}" />
${image ? `<meta property="og:image" content="${image}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />` : ""}
<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />
${image ? `<meta name="twitter:image" content="${image}" />` : ""}
${published ? `<meta property="article:published_time" content="${escape(published)}" />` : ""}
<meta http-equiv="refresh" content="0;url=${target}" />
<script>window.location.replace(${JSON.stringify(target)});</script>
</head>
<body>
<h1>${title}</h1>
<p>${desc}</p>
<p><a href="${target}">Continue to article →</a></p>
</body>
</html>`;

    const headers = new Headers(corsHeaders);
    headers.set("Content-Type", "text/html; charset=utf-8");
    headers.set("Cache-Control", "public, max-age=300, s-maxage=600");
    return new Response(new TextEncoder().encode(html), { headers });
  } catch (_e) {
    return new Response(null, { status: 302, headers: { location: target, ...corsHeaders } });
  }
});
