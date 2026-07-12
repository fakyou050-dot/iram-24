export function decodeHtmlEntities(text: string): string {
  if (!text) return text;
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&#8216;/g, "\u2018")
    .replace(/&#8217;/g, "\u2019")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

export function getSessionId(): string {
  let id = localStorage.getItem("eram_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("eram_session_id", id);
  }
  return id;
}

export function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem("eram_favorites") || "[]");
  } catch { return []; }
}

export function toggleFavorite(articleId: string): string[] {
  const favs = getFavorites();
  const idx = favs.indexOf(articleId);
  if (idx > -1) favs.splice(idx, 1);
  else favs.push(articleId);
  localStorage.setItem("eram_favorites", JSON.stringify(favs));
  return [...favs];
}

export function timeAgo(dateStr: string | null, lang: "AR" | "EN" = "AR"): string {
  if (!dateStr) return lang === "AR" ? "غير معروف" : "Unknown";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return lang === "AR" ? "الآن" : "Just now";
  if (mins < 60) return lang === "AR" ? `منذ ${mins} دقيقة` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return lang === "AR" ? `منذ ${hrs} ساعة` : `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return lang === "AR" ? `منذ ${days} يوم` : `${days}d ago`;
}

// New unified section list — kept geographic concepts as TAGS only (see classifier.ts)
export const AR_CATEGORIES = [
  "الرئيسية",
  "سياسة",
  "اقتصاد",
  "رياضة",
  "تكنولوجيا",
  "علوم",
  "صحة",
  "ثقافة وفنون",
  "مجتمع",
  "مقالات",
  "منوعات",
];
export const EN_CATEGORIES = [
  "Home",
  "Politics",
  "Economy",
  "Sports",
  "Technology",
  "Science",
  "Health",
  "Arts",
  "Society",
  "Articles",
  "Lifestyle",
];

// Smart classifier lives in lib/classifier.ts. Re-export for backwards-compat.
export { classify, categorizeArticle, normalizeCategory } from "./classifier";
