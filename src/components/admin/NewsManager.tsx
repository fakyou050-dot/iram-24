import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Edit, Eye } from "lucide-react";
import { toast } from "sonner";
import ArticleEditPage from "./ArticleEditPage";

interface ArticleRow {
  id: string;
  title: string;
  category: string;
  language: string;
  published_at: string | null;
  views: number | null;
  is_manual: boolean;
  image_url: string | null;
  author_name: string | null;
}

const NewsManager = () => {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "AR" | "EN">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 30;

  const fetchArticles = async () => {
    setLoading(true);
    let q = supabase.from("articles").select("id, title, category, language, published_at, views, is_manual, image_url, author_name")
      .order("published_at", { ascending: false }).range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    if (filter !== "all") q = q.eq("language", filter);
    const { data } = await q;
    setArticles((data as ArticleRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchArticles(); }, [filter, page]);

  const handleDelete = async (id: string) => {
    if (!confirm("حذف هذا الخبر؟")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("تم الحذف"); fetchArticles(); }
  };

  if (editingId) {
    return <ArticleEditPage articleId={editingId} onBack={() => { setEditingId(null); fetchArticles(); }} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground font-bold">📰 جميع الأخبار</h2>
        <div className="flex gap-1">
          {(["all", "AR", "EN"] as const).map(f => (
            <button key={f} onClick={() => { setFilter(f); setPage(0); }}
              className={`px-2.5 py-1 rounded-md text-xs ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground bg-secondary"}`}>
              {f === "all" ? "الكل" : f === "AR" ? "عربي" : "EN"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm text-center py-8">جاري التحميل...</p>
      ) : (
        <div className="space-y-1.5 max-h-[65vh] overflow-y-auto">
          {articles.map(a => (
            <div key={a.id} className="bg-secondary rounded-lg p-2.5 flex items-center gap-2 cursor-pointer hover:bg-accent/30 transition-colors"
              onClick={() => setEditingId(a.id)}>
              {a.image_url && (
                <img src={a.image_url} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-xs font-medium truncate">{a.title}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="text-primary">{a.category}</span>
                  <span>•</span>
                  <span>{a.author_name || "—"}</span>
                  <span>•</span>
                  <span>{a.views || 0} 👁</span>
                  {a.is_manual && <span className="text-green-400">✍️</span>}
                </div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setEditingId(a.id)} className="p-1.5 text-muted-foreground hover:text-foreground">
                  <Edit size={13} />
                </button>
                <button onClick={() => handleDelete(a.id)} className="p-1.5 text-muted-foreground hover:text-primary">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          {articles.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">لا توجد أخبار</p>}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
          className="px-3 py-1 rounded bg-secondary text-foreground text-xs disabled:opacity-30">السابق</button>
        <span className="text-muted-foreground text-xs">صفحة {page + 1}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={articles.length < PAGE_SIZE}
          className="px-3 py-1 rounded bg-secondary text-foreground text-xs disabled:opacity-30">التالي</button>
      </div>
    </div>
  );
};

export default NewsManager;
