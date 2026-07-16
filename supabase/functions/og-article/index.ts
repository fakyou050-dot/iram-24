// supabase/functions/og-article/index.ts
// Serves OG meta tags for social media crawlers (WhatsApp, Facebook, Telegram, Twitter)
// Deploy: supabase functions deploy og-article

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY")!;
const SITE = Deno.env.get("SITE_URL") || "https://iram-24.vercel.app";

// Known crawler user agents
const CRAWLER_AGENTS = [
  "facebookexternalhit",
  "Facebot",
  "WhatsApp",
  "Twitterbot",
  "TelegramBot",
  "LinkedInBot",
  "Slackbot",
  "Discordbot",
  "Applebot",
  "Googlebot",
  "bingbot",
  "YandexBot",
  "Pinterest",
  "redditbot",
  "SkypeUriPreview",
  "Embedly",
  "outbrain",
  "flipboard",
  "tumblr",
  "vkShare",
  "W3C_Validator",
  "developers.google.com",
];

function isCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return CRAWLER_AGENTS.some((c) => ua.includes(c.toLowerCase()));
}

function escapeHtml(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(html: string): string {
  return (html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

serve(async (req) => {
  const url = new URL(req.url);
  const userAgent = req.headers.get("user-agent") || "";
  const articleId = url.searchParams.get("id");

  // If no article ID, redirect to homepage
  if (!articleId) {
    return Response.redirect(SITE + "/", 302);
  }

  // Fetch article from Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data: article } = await supabase
    .from("articles")
    .select("id,title,description,image_url,category,language,published_at,author_name")
    .eq("id", articleId)
    .maybeSingle();

  if (!article) {
    return Response.redirect(SITE + "/", 302);
  }

  const title = escapeHtml(article.title || "إيرام 24");
  const desc = escapeHtml(stripHtml(article.description || "").slice(0, 200));
  const image = article.image_url || "";
  const articleUrl = `${SITE}/article/${article.id}`;
  const lang = article.language === "EN" ? "en" : "ar";
  const publishedAt = article.published_at || new Date().toISOString();
  const author = escapeHtml(article.author_name || "إيرام 24");

  // Build HTML with OG tags
  const html = `<!doctype html>
<html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}">
<head>
  <meta charset="UTF-8" />
  <title>${title} | إيرام 24</title>

  <!-- Open Graph (Facebook, WhatsApp, Telegram, LinkedIn) -->
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="إيرام 24" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:url" content="${articleUrl}" />
  <meta property="og:locale" content="${lang === "ar" ? "ar_AR" : "en_US"}" />
  ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${title}" />` : ""}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : ""}

  <!-- Article meta -->
  <meta property="article:published_time" content="${publishedAt}" />
  <meta property="article:author" content="${author}" />
  <meta property="article:section" content="${escapeHtml(article.category || "")}" />
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${articleUrl}" />

  <!-- JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "${title.replace(/"/g, '\\"')}",
    "description": "${desc.replace(/"/g, '\\"')}",
    ${image ? `"image": ["${image}"],` : ""}
    "datePublished": "${publishedAt}",
    "author": {"@type": "Person", "name": "${author.replace(/"/g, '\\"')}"},
    "publisher": {"@type": "Organization", "name": "إيرام 24", "logo": {"@type": "ImageObject", "url": "${SITE}/favicon.ico"}},
    "mainEntityOfPage": {"@type": "WebPage", "@id": "${articleUrl}"},
    "inLanguage": "${lang}"
  }
  </script>

  <!-- Redirect humans to SPA -->
  <meta http-equiv="refresh" content="0;url=${SITE}/?/article/${article.id}" />
  <link rel="canonical" href="${articleUrl}" />
</head>
<body>
  <p>جاري التحويل... <a href="${SITE}/?/article/${article.id}">إيرام 24</a></p>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
