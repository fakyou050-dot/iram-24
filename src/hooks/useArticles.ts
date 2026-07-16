import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getBlockedWords, removeBlockedWords } from "@/lib/blockedWords";
import { PUBLIC_ENV } from "@/config/public";

export interface Article {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  url: string;
  image_url: string | null;
  category: string;
  language: string;
  published_at: string | null;
  views: number | null;
  source_id: string | null;
  created_at: string;
  author_name: string | null;
  author_image_url: string | null;
  is_manual: boolean;
}

const MEM_CACHE = new Map<string, { data: Article[]; ts: number }>();
const CACHE_TTL = 60_000;
const STALE_TTL = 24 * 60 * 60 * 1000;

const COLS =
  "id,title,description,url,image_url,category,language,published_at,views,source_id,created_at,author_name,author_image_url,is_manual";

const LRU_KEY = "eram_cache_index";
const LRU_MAX = 50;
function readLRU(): string[] {
  try { return JSON.parse(localStorage.getItem(LRU_KEY) || "[]"); } catch { return []; }
}
function writeLRU(list: string[]) {
  try { localStorage.setItem(LRU_KEY, JSON.stringify(list)); } catch {}
}
function touchLRU(key: string) {
  let list = readLRU().filter((k) => k !== key);
  list.unshift(key);
  while (list.length > LRU_MAX) {
    const evict = list.pop();
    if (evict) { try { localStorage.removeItem("eram_cache_" + evict); } catch {} }
  }
  writeLRU(list);
}

function readPersisted(key: string) {
  try {
    const raw = localStorage.getItem("eram_cache_" + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data: Article[]; ts: number };
    if (Date.now() - parsed.ts > STALE_TTL) return null;
    return parsed;
  } catch { return null; }
}
function writePersisted(key: string, data: Article[]) {
  try {
    localStorage.setItem("eram_cache_" + key, JSON.stringify({ data, ts: Date.now() }));
    touchLRU(key);
  } catch {}
}

export function getCachedArticleById(id: string): Article | null {
  for (const entry of MEM_CACHE.values()) {
    const found = entry.data.find((article) => article.id === id);
    if (found) return found;
  }
  try {
    for (const key of readLRU()) {
      const parsed = readPersisted(key);
      const found = parsed?.data.find((article) => article.id === id);
      if (found) return found;
    }
  } catch {}
  return null;
}

// (unused legacy helper removed)

async function fetchEdgeDirect(language: string, category: string | undefined, limit: number): Promise<Article[] | null> {
  try {
    const params = new URLSearchParams({ lang: language, limit: String(limit) });
    if (category && category !== "الرئيسية" && category !== "Home") params.set("category", category);
    const url = `${PUBLIC_ENV.supabaseUrl}/functions/v1/home-feed?${params.toString()}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 7000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        apikey: PUBLIC_ENV.supabasePublishableKey,
        Authorization: `Bearer ${PUBLIC_ENV.supabasePublishableKey}`,
      },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const json = await res.json();
    const rows = (json?.articles as Article[]) || [];
    return Array.isArray(rows) ? rows : null;
  } catch { return null; }
}

async function fetchDirect(language: string, category: string | undefined, limit: number): Promise<Article[] | null> {
  let q = supabase
    .from("articles")
    .select(COLS)
    .eq("language", language)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (category && category !== "الرئيسية" && category !== "Home") q = q.eq("category", category);
  const timer = new Promise<null>((r) => setTimeout(() => r(null), 3500));
  const result = await Promise.race([q, timer]);
  if (!result || (result as any).error) return null;
  return ((result as any).data as Article[]) || [];
}

// Find any cached entry for the same language+category with >= limit, slice it.
function findRelatedCache(language: string, category: string | undefined, limit: number) {
  const prefix = `${language}|${category || ""}|`;
  let best: { data: Article[]; ts: number } | null = null;
  for (const [k, v] of MEM_CACHE.entries()) {
    if (k.startsWith(prefix) && v.data.length >= limit) {
      if (!best || v.ts > best.ts) best = v;
    }
  }
  return best;
}

export function useArticles(language: "AR" | "EN", category?: string, limit = 30) {
  const cacheKey = `${language}|${category || ""}|${limit}`;
  const initial = MEM_CACHE.get(cacheKey) || findRelatedCache(language, category, limit) || readPersisted(cacheKey);



  const [articles, setArticles] = useState<Article[]>(initial?.data || []);
  const [loading, setLoading] = useState(!initial);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;

    const fetchArticles = async (showLoading: boolean) => {
      if (showLoading && articles.length === 0) setLoading(true);

      // Try edge once (it has DB + RSS fallback), then one direct DB fallback.
      for (let attempt = 0; attempt < 2; attempt++) {
        let data = await fetchEdgeDirect(language, category, limit);
        if ((!data || data.length === 0) && attempt === 0) data = await fetchDirect(language, category, limit);
        if (!alive) return;
        if (data && data.length > 0) {
          // Apply blocked-words cleanup to title/description
          const blocked = await getBlockedWords();
          if (blocked.length > 0) {
            data = data.map((a) => ({
              ...a,
              title: removeBlockedWords(a.title || "", blocked),
              description: a.description ? removeBlockedWords(a.description, blocked) : a.description,
            }));
          }
          MEM_CACHE.set(cacheKey, { data, ts: Date.now() });
          writePersisted(cacheKey, data);
          setArticles(data);
          setLoading(false);
          return;
        }
        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
      }
      if (alive) setLoading(false);
    };

    const fresh = initial && Date.now() - initial.ts < CACHE_TTL;
    if (fresh) setLoading(false);
    else fetchArticles(true);

    const channel = supabase
      .channel(`articles-rt-${cacheKey}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "articles" }, () => {
        if (debounceRef.current) window.clearTimeout(debounceRef.current);
        debounceRef.current = window.setTimeout(() => fetchArticles(false), 2000);
      })
      .subscribe();

    return () => {
      alive = false;
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      supabase.removeChannel(channel);
    };
  }, [language, category, limit]);

  return { articles, loading };
}

export function useFetchSettings() {
  const [settings, setSettings] = useState<{
    auto_fetch_enabled: boolean;
    fetch_interval: number;
    last_fetch_time: string | null;
    last_fetch_count: number | null;
  } | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("fetch_settings").select("*").limit(1).single();
      if (data) setSettings(data);
    };
    fetch();
  }, []);

  return { settings, setSettings };
}
