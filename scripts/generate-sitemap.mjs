/**
 * Generate professional news sitemap from Supabase articles.
 * Uses native fetch — no external dependencies.
 * Run: node scripts/generate-sitemap.mjs
 */
import { writeFileSync } from "fs";

const SUPABASE_URL = "https://zifhmbbhqgoqvqeofhtw.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZmhtYmJocWdvcXZxZW9maHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NzIzOTIsImV4cCI6MjA5OTQ0ODM5Mn0.sbth2PRkMOXS1tEyIXujYcpfiMabltLZAcR_1B35BZ8";
const SITE = "https://fakyou050-dot.github.io/iram-24";

function escapeXml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isoDate(d) {
  if (!d) return new Date().toISOString().split("T")[0];
  return new Date(d).toISOString().split("T")[0];
}

async function fetchAllArticles() {
  const articles = [];
  let offset = 0;
  const pageSize = 1000;

  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/articles?select=id,title,description,image_url,category,language,published_at,author_name&order=published_at.desc&limit=${pageSize}&offset=${offset}`;
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
  console.log("Generating sitemap...");

  const articles = await fetchAllArticles();
  console.log(`Found ${articles.length} articles`);

  const today = isoDate(new Date());

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Homepage — updated on every fetch -->
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Categories index -->
  <url>
    <loc>${SITE}/categories</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Radio -->
  <url>
    <loc>${SITE}/radio</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Settings -->
  <url>
    <loc>${SITE}/settings</loc>
    <changefreq>monthly</changefreq>
    <priority>0.2</priority>
  </url>

  <!-- Favorites -->
  <url>
    <loc>${SITE}/favorites</loc>
    <changefreq>monthly</changefreq>
    <priority>0.2</priority>
  </url>

`;

  for (const a of articles) {
    const url = `${SITE}/article/${a.id}`;
    const lastmod = isoDate(a.published_at);
    const title = escapeXml(a.title || "");
    const lang = a.language === "EN" ? "en" : "ar";
    const pubDate = a.published_at
      ? new Date(a.published_at).toUTCString()
      : new Date().toUTCString();
    const author = escapeXml(a.author_name || "إيرام 24");

    xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
    <news:news>
      <news:publication>
        <news:name>إيرام 24</news:name>
        <news:language>${lang}</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
      <news:keywords>${escapeXml(a.category || "")}</news:keywords>
    </news:news>`;

    if (a.image_url) {
      xml += `
    <image:image>
      <image:loc>${escapeXml(a.image_url)}</image:loc>
      <image:title>${title}</image:title>
    </image:image>`;
    }

    xml += `
  </url>
`;
  }

  xml += `</urlset>`;

  writeFileSync("public/sitemap.xml", xml, "utf-8");

  // Stats
  const arCount = articles.filter((a) => a.language === "AR").length;
  const enCount = articles.filter((a) => a.language === "EN").length;
  const categories = [...new Set(articles.map((a) => a.category))];
  const withImages = articles.filter((a) => a.image_url).length;

  console.log(`\nSitemap generated successfully!`);
  console.log(`  Total articles: ${articles.length}`);
  console.log(`  Arabic: ${arCount}`);
  console.log(`  English: ${enCount}`);
  console.log(`  With images: ${withImages}`);
  console.log(`  Categories: ${categories.join(", ")}`);
  console.log(`  Output: public/sitemap.xml`);
  console.log(`  URL: ${SITE}/sitemap.xml`);
}

main().catch(console.error);
