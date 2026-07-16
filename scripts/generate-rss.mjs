/**
 * Generate RSS 2.0 feed from Supabase articles.
 * Compatible with Google News, Apple News, Feedly, Inoreader, etc.
 * Run: node scripts/generate-rss.mjs
 */
import { writeFileSync } from "fs";

const DEFAULT_SUPABASE_URL = "https://zifhmbbhqgoqvqeofhtw.supabase.co";
const DEFAULT_SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZmhtYmJocWdvcXZxZW9maHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NzIzOTIsImV4cCI6MjA5OTQ0ODM5Mn0.sbth2PRkMOXS1tEyIXujYcpfiMabltLZAcR_1B35BZ8";
const DEFAULT_SITE_URL = "https://iram-24.vercel.app";

const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/+$/, "");
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_KEY;
const SITE = (process.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");

function escapeXml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(html) {
  return (html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function rfc822Date(d) {
  if (!d) return new Date().toUTCString();
  return new Date(d).toUTCString();
}

async function fetchAllArticles() {
  const articles = [];
  let offset = 0;
  const pageSize = 1000;

  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/articles?select=id,title,description,content,image_url,category,language,published_at,author_name,url&order=published_at.desc&limit=${pageSize}&offset=${offset}`;
    const resp = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!resp.ok) {
      console.error("Fetch error:", resp.status, await resp.text());
      break;
    }

    const data = await resp.json();
    if (!data || data.length === 0) break;
    articles.push(...data);
    if (data.length < pageSize) break;
    offset += pageSize;
  }

  return articles;
}

async function main() {
  console.log("Generating RSS feed...");

  const articles = await fetchAllArticles();
  console.log(`Found ${articles.length} articles`);

  const now = new Date().toUTCString();
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <channel>
    <title>إيرام 24 | نبض الحدث</title>
    <link>${SITE}</link>
    <description>إيرام 24 — منصة إخبارية شاملة تقدم تغطية موثوقة لأهم الأخبار المحلية والعربية والدولية في السياسة والاقتصاد والرياضة والتكنولوجيا لحظة بلحظة.</description>
    <language>ar</language>
    <lastBuildDate>${now}</lastBuildDate>
    <ttl>30</ttl>
    <image>
      <url>${SITE}/favicon.ico</url>
      <title>إيرام 24</title>
      <link>${SITE}</link>
    </image>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
`;

  const feedArticles = articles.slice(0, 100);

  for (const article of feedArticles) {
    const title = escapeXml(article.title || "");
    const link = `${SITE}/article/${article.id}`;
    const desc = escapeXml(stripHtml(article.description || article.content || "").slice(0, 500));
    const pubDate = rfc822Date(article.published_at);
    const author = escapeXml(article.author_name || "إيرام 24");
    const category = escapeXml(article.category || "");
    const image = article.image_url || "";

    xml += `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${desc}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${author}</author>
      <category>${category}</category>
`;

    if (image) {
      xml += `      <media:content url="${escapeXml(image)}" medium="image" />
      <enclosure url="${escapeXml(image)}" type="image/jpeg" />
`;
    }

    xml += `    </item>
`;
  }

  xml += `  </channel>
</rss>`;

  writeFileSync("public/rss.xml", xml, "utf-8");

  const arCount = feedArticles.filter((article) => article.language === "AR").length;
  const enCount = feedArticles.filter((article) => article.language === "EN").length;
  console.log(`✅ RSS feed generated: public/rss.xml`);
  console.log(`   ${feedArticles.length} articles (AR: ${arCount}, EN: ${enCount})`);
  console.log(`   Feed URL: ${SITE}/rss.xml`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
