import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";
import { decodeHtmlEntities, timeAgo } from "@/lib/newsUtils";
import { categoryStyle } from "@/lib/categoryColors";
import { proxyImageUrl } from "@/lib/imageProxy";
import { normalizeImageUrl } from "@/lib/contentParser";
import LazyImage from "@/components/LazyImage";
import {
  ArrowRight, Landmark, TrendingUp, Cpu, Trophy, Stethoscope,
  Palette, Newspaper, FlaskConical, Users, FileText, Sparkles,
} from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  "سياسة": Landmark, "اقتصاد": TrendingUp, "رياضة": Trophy,
  "تكنولوجيا": Cpu, "علوم": FlaskConical, "صحة": Stethoscope,
  "ثقافة وفنون": Palette, "مجتمع": Users, "مقالات": FileText, "منوعات": Sparkles,
  "Politics": Landmark, "Economy": TrendingUp, "Sports": Trophy,
  "Technology": Cpu, "Science": FlaskConical, "Health": Stethoscope,
  "Arts": Palette, "Society": Users, "Articles": FileText, "Lifestyle": Sparkles,
};

const categoriesAR = ["سياسة", "اقتصاد", "رياضة", "تكنولوجيا", "علوم", "صحة", "ثقافة وفنون", "مجتمع", "مقالات", "منوعات"];
const categoriesEN = ["Politics", "Economy", "Sports", "Technology", "Science", "Health", "Arts", "Society", "Articles", "Lifestyle"];

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  // Pre-select from ?c=... so links from breadcrumbs work
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("c");
    if (c) setSelected(c);
  }, []);

  const allCategories = [...categoriesAR, ...categoriesEN];
  const language: "AR" | "EN" = selected && categoriesEN.includes(selected) ? "EN" : "AR";

  // Use cached, resilient hook — instant on revisit, falls back to RSS
  const { articles, loading } = useArticles(language, selected || undefined, 24);

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      <header className="sticky top-0 z-40 h-12 flex items-center gap-3 px-4 bg-background/95 backdrop-blur border-b border-border">
        <button onClick={() => (selected ? setSelected(null) : navigate(-1))} className="text-foreground"><ArrowRight size={20} /></button>
        <span className="text-foreground font-bold text-sm">{selected || "الأقسام"}</span>
      </header>

      {!selected ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
          {allCategories.map((cat) => {
            const Icon = categoryIcons[cat] || Newspaper;
            const s = categoryStyle(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelected(cat)}
                className="relative overflow-hidden rounded-xl p-5 flex flex-col items-center gap-2 hover-lift transition-all group min-h-[110px]"
                style={{ background: s.gradient }}
              >
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon size={22} className="text-white" />
                </div>
                <span className="text-white font-bold text-sm drop-shadow">{cat}</span>
                <span className="absolute top-2 end-2 text-lg opacity-50">{s.emoji}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          {loading && articles.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-muted-foreground text-sm">جاري التحميل...</div>
            </div>
          ) : articles.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">لا توجد أخبار في هذا القسم</p>
          ) : (
            <div className="divide-y divide-border">
              {articles.map((a) => {
                const title = decodeHtmlEntities(a.title);
                const rawImg = a.image_url?.trim() || "";
                const hasImg = !!rawImg;
                const s = categoryStyle(a.category);
                return (
                  <div key={a.id} onClick={() => navigate(`/article/${a.id}`)} className="flex gap-3 p-4 cursor-pointer hover:bg-secondary/30 transition-colors">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0" style={{ background: s.gradient }}>
                      {hasImg ? (
                        <LazyImage
                          src={proxyImageUrl(normalizeImageUrl(rawImg))}
                          alt={title}
                          className="w-full h-full object-cover"
                          fallback={
                            <div className="w-full h-full flex items-center justify-center text-2xl" style={{ background: s.gradient }}>{s.emoji}</div>
                          }
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">{s.emoji}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-foreground font-bold text-sm line-clamp-2">{title}</h3>
                      <span className="text-muted-foreground text-xs">{timeAgo(a.published_at, language)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
