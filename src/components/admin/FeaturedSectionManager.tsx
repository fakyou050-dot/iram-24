import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChefHat, Plus, Trash2, Loader2, Save, EyeOff, Eye } from "lucide-react";
import { useSiteSetting } from "@/hooks/useSlider";

/**
 * Featured Section Manager (ported from "Cooking" in saber-news, generalized).
 * Admin defines a custom section name + handpicks article IDs to feature.
 * Settings persisted in site_settings (key=featured_section).
 */

interface FeaturedConfig {
  enabled: boolean;
  name: string;
  emoji: string;
  article_ids: string[];
}

const DEFAULT: FeaturedConfig = { enabled: false, name: "مطبخ إيرام", emoji: "🍳", article_ids: [] };

interface ArticleLite { id: string; title: string; image_url: string | null; category: string; }

const FeaturedSectionManager = () => {
  const { value: cfg, save, loading: cfgLoading } = useSiteSetting<FeaturedConfig>("featured_section", DEFAULT);
  const [draft, setDraft] = useState<FeaturedConfig>(DEFAULT);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ArticleLite[]>([]);
  const [featured, setFeatured] = useState<ArticleLite[]>([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!cfgLoading) setDraft({ ...DEFAULT, ...cfg }); }, [cfgLoading, cfg]);

  useEffect(() => {
    const loadFeatured = async () => {
      if (!draft.article_ids?.length) { setFeatured([]); return; }
      const { data } = await supabase.from("articles")
        .select("id, title, image_url, category").in("id", draft.article_ids);
      const order = new Map(draft.article_ids.map((id, i) => [id, i]));
      setFeatured(((data as ArticleLite[]) || []).sort((a, b) =>
        (order.get(a.id) ?? 99) - (order.get(b.id) ?? 99)));
    };
    loadFeatured();
  }, [draft.article_ids]);

  const doSearch = async () => {
    if (!search.trim()) { setResults([]); return; }
    setSearching(true);
    const { data } = await supabase.from("articles")
      .select("id, title, image_url, category")
      .ilike("title", `%${search.trim()}%`)
      .order("published_at", { ascending: false })
      .limit(15);
    setResults((data as ArticleLite[]) || []);
    setSearching(false);
  };

  const addArticle = (id: string) => {
    if (draft.article_ids.includes(id)) return;
    setDraft({ ...draft, article_ids: [...draft.article_ids, id] });
  };
  const removeArticle = (id: string) =>
    setDraft({ ...draft, article_ids: draft.article_ids.filter(x => x !== id) });

  const handleSave = async () => {
    setSaving(true);
    const ok = await save(draft);
    if (ok) toast.success("تم الحفظ"); else toast.error("فشل الحفظ");
    setSaving(false);
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChefHat className="text-primary" size={18} />
          <h2 className="text-foreground font-bold">الركن المميّز</h2>
        </div>
        <button onClick={() => setDraft({ ...draft, enabled: !draft.enabled })}
          className="bg-secondary text-foreground rounded px-3 py-1.5 text-xs flex items-center gap-1.5">
          {draft.enabled ? <Eye size={12} className="text-green-400" /> : <EyeOff size={12} className="text-muted-foreground" />}
          {draft.enabled ? "ظاهر" : "مخفي"}
        </button>
      </div>

      <p className="text-muted-foreground text-xs">
        قسم خاص يظهر في الصفحة الرئيسية باسم وأيقونة من اختيارك، تختار له المقالات يدويًا.
      </p>

      <div className="bg-secondary rounded-lg p-3 space-y-2">
        <div className="grid grid-cols-[1fr_60px] gap-2">
          <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })}
            placeholder="اسم القسم" className="bg-background text-foreground text-sm rounded px-3 py-2 border border-border" />
          <input value={draft.emoji} onChange={e => setDraft({ ...draft, emoji: e.target.value })}
            placeholder="🍳" className="bg-background text-foreground text-center text-lg rounded px-2 py-2 border border-border" />
        </div>
        <button onClick={handleSave} disabled={saving}
          className="w-full bg-primary text-primary-foreground rounded py-2 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} حفظ الإعدادات
        </button>
      </div>

      {/* Currently featured */}
      <div>
        <p className="text-foreground text-sm font-semibold mb-2">المقالات المعروضة ({featured.length})</p>
        <div className="space-y-1.5 max-h-[28vh] overflow-y-auto">
          {featured.map(a => (
            <div key={a.id} className="bg-secondary rounded-lg p-2 flex items-center gap-2">
              {a.image_url && <img src={a.image_url} alt="" className="w-10 h-10 rounded object-cover shrink-0" />}
              <p className="text-foreground text-xs font-medium truncate flex-1">{a.title}</p>
              <button onClick={() => removeArticle(a.id)} className="p-1.5 text-muted-foreground hover:text-primary shrink-0">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {featured.length === 0 && <p className="text-center text-muted-foreground text-xs py-3">لم تُضف مقالات بعد</p>}
        </div>
      </div>

      {/* Search and add */}
      <div className="bg-secondary rounded-lg p-3 space-y-2">
        <p className="text-foreground text-sm font-semibold">إضافة مقالات</p>
        <div className="flex gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && doSearch()}
            placeholder="ابحث بالعنوان..."
            className="flex-1 bg-background text-foreground text-sm rounded px-3 py-2 border border-border" />
          <button onClick={doSearch} disabled={searching}
            className="bg-primary text-primary-foreground rounded px-3 text-xs font-bold">
            {searching ? <Loader2 size={12} className="animate-spin" /> : "بحث"}
          </button>
        </div>
        <div className="space-y-1.5 max-h-[28vh] overflow-y-auto">
          {results.map(a => (
            <button key={a.id} onClick={() => addArticle(a.id)}
              disabled={draft.article_ids.includes(a.id)}
              className="w-full bg-background rounded p-2 flex items-center gap-2 disabled:opacity-40 hover:bg-accent/30 text-right">
              {a.image_url && <img src={a.image_url} alt="" className="w-9 h-9 rounded object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-xs font-medium truncate">{a.title}</p>
                <p className="text-muted-foreground text-[10px]">{a.category}</p>
              </div>
              <Plus size={13} className="text-primary shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedSectionManager;
