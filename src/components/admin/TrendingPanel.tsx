import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TrendingUp, Hash, RefreshCw, Loader2, Eye, ArrowUpRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface RecentArticle {
  id: string; title: string; category: string | null; image_url: string | null;
  author_name: string | null; published_at: string | null; language: string;
}

interface TopicCount { topic: string; count: number; }

const extractHashtags = (text: string): string[] => {
  if (!text) return [];
  const out: string[] = [];
  const re = /#([\p{L}\p{N}_\u0600-\u06FF]+)/gu;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) out.push(m[1]);
  return out;
};

const TrendingPanel = () => {
  const [articles, setArticles] = useState<RecentArticle[]>([]);
  const [topics, setTopics] = useState<TopicCount[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const since = new Date(Date.now() - 48 * 3600_000).toISOString();
      const { data: recent } = await supabase
        .from("articles")
        .select("id, title, description, category, image_url, author_name, published_at, language")
        .gte("published_at", since)
        .order("published_at", { ascending: false })
        .limit(30);

      const list = (recent as any[]) || [];
      setArticles(list.slice(0, 20).map((a: any) => ({
        id: a.id, title: a.title, category: a.category, image_url: a.image_url,
        author_name: a.author_name, published_at: a.published_at, language: a.language,
      })));

      // Derive trending hashtags from title + description
      const counts = new Map<string, number>();
      list.forEach((a: any) => {
        const tags = [...extractHashtags(a.title || ""), ...extractHashtags(a.description || "")];
        tags.forEach(t => counts.set(t, (counts.get(t) || 0) + 1));
      });
      // Fallback to recurring meaningful words when no hashtags
      if (counts.size === 0) {
        const words = new Map<string, number>();
        list.forEach((a: any) => {
          (String(a.title || "").match(/[\u0600-\u06FF\w]{4,}/g) || []).forEach((w: string) => {
            const k = w.toLowerCase();
            words.set(k, (words.get(k) || 0) + 1);
          });
        });
        Array.from(words.entries()).filter(([, c]) => c >= 2)
          .forEach(([k, v]) => counts.set(k, v));
      }

      setTopics(
        Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 15)
          .map(([topic, count]) => ({ topic, count }))
      );
    } catch (e: any) {
      console.error(e); toast.error("تعذّر تحميل البيانات");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-primary" size={18} />
          <h2 className="text-foreground font-bold">المواضيع الرائجة (48س)</h2>
        </div>
        <button onClick={load} disabled={loading}
          className="bg-secondary text-foreground rounded px-3 py-1.5 text-xs flex items-center gap-1.5 disabled:opacity-50">
          {loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} تحديث
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-secondary rounded-lg p-3 text-center">
          <p className="text-[10px] text-muted-foreground">مقالات</p>
          <p className="text-foreground text-xl font-bold">{articles.length}</p>
        </div>
        <div className="bg-secondary rounded-lg p-3 text-center">
          <p className="text-[10px] text-muted-foreground">هاشتاقات</p>
          <p className="text-foreground text-xl font-bold">{topics.length}</p>
        </div>
        <div className="bg-secondary rounded-lg p-3 text-center">
          <p className="text-[10px] text-muted-foreground">أقسام</p>
          <p className="text-foreground text-xl font-bold">{new Set(articles.map(a => a.category).filter(Boolean)).size}</p>
        </div>
      </div>

      <div className="bg-secondary rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Hash size={14} className="text-primary" />
          <h3 className="text-foreground text-sm font-semibold">أكثر تداولاً</h3>
        </div>
        {topics.length === 0 ? (
          <p className="text-muted-foreground text-xs text-center py-3">لا توجد بيانات</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {topics.map(t => (
              <span key={t.topic}
                className="bg-background text-foreground text-xs rounded px-2 py-1 flex items-center gap-1 border border-border">
                #{t.topic}
                <span className="text-primary text-[10px] font-bold">{t.count}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-secondary rounded-lg overflow-hidden">
        <div className="px-3 py-2 border-b border-border flex items-center gap-2">
          <TrendingUp size={13} className="text-primary" />
          <h3 className="text-foreground text-sm font-semibold">أحدث المقالات الرائجة</h3>
        </div>
        {loading ? (
          <p className="text-center text-muted-foreground text-sm py-6">جارٍ التحميل...</p>
        ) : (
          <div className="max-h-[45vh] overflow-y-auto">
            {articles.map((a, i) => (
              <a key={a.id} href={`/article/${a.id}`} target="_blank" rel="noopener"
                className="flex items-center gap-2 p-2 border-b border-border last:border-0 hover:bg-background/50">
                <span className="text-muted-foreground text-xs font-bold w-5 text-center shrink-0">{i + 1}</span>
                {a.image_url && (
                  <img src={a.image_url} alt="" className="w-9 h-9 rounded object-cover shrink-0"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-xs font-medium truncate">{a.title}</p>
                  <p className="text-muted-foreground text-[10px] truncate">
                    {a.category || "عام"} · {a.published_at ? formatDistanceToNow(new Date(a.published_at), { addSuffix: true, locale: ar }) : "—"}
                  </p>
                </div>
                <ArrowUpRight size={12} className="text-muted-foreground shrink-0" />
              </a>
            ))}
            {articles.length === 0 && <p className="text-center text-muted-foreground text-sm py-6">لا توجد مقالات حديثة</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingPanel;
