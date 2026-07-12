// Shared blocked-words cache (5 min TTL)
let cache: string[] = [];
let lastFetch = 0;
const TTL = 5 * 60 * 1000;
const STORAGE_KEY = "eram_blocked_words_cache";

export async function getBlockedWords(): Promise<string[]> {
  const now = Date.now();
  if (now - lastFetch < TTL && cache.length > 0) return cache;
  try {
    cache = (JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[])
      .map((word) => String(word || "").toLowerCase().trim().replace(/^#+/, ""))
      .filter(Boolean);
    lastFetch = now;
  } catch { cache = []; }
  return cache;
}

export function persistBlockedWords(words: string[]): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(words)); } catch { cache = words; }
  cache = words;
  lastFetch = Date.now();
}

export function invalidateBlockedWordsCache(): void {
  cache = [];
  lastFetch = 0;
}

/**
 * Remove blocked words from text. Arabic + English word-boundary aware.
 */
export function removeBlockedWords(text: string, blocked: string[]): string {
  if (!text || !blocked || blocked.length === 0) return text;
  let result = text;
  for (const bw of blocked) {
    if (!bw) continue;
    const escaped = bw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(
      `(?<![\\w\\u0600-\\u06FF\\u0750-\\u077F])${escaped}(?![\\w\\u0600-\\u06FF\\u0750-\\u077F])`,
      "gi"
    );
    result = result.replace(regex, "");
  }
  // Truncated remnants (e.g. "الكلمة_عا...")
  for (const bw of blocked) {
    if (!bw || bw.length < 4) continue;
    const prefix = bw.slice(0, Math.max(5, Math.floor(bw.length * 0.6)));
    const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(
      new RegExp(
        `(?<![\\w\\u0600-\\u06FF\\u0750-\\u077F])${escapedPrefix}[\\w\\u0600-\\u06FF\\u0750-\\u077F_]*(\\.\\.\\.)?[\\s]*$`,
        "gi"
      ),
      ""
    );
  }
  return result
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/ +([,.،؛!?])/g, "$1")
    .trim();
}

export async function cleanText(text: string): Promise<string> {
  const blocked = await getBlockedWords();
  return removeBlockedWords(text, blocked);
}
