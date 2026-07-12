import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Article } from "@/hooks/useArticles";
import { timeAgo } from "@/lib/newsUtils";

interface ManualArticlesSectionProps {
  language: "AR" | "EN";
}

const ManualArticlesSection = ({ language }: ManualArticlesSectionProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManual = async () => {
      try {
        const params = new URLSearchParams({ lang: language, limit: "20" });
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/home-feed?${params.toString()}`, {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          signal: AbortSignal.timeout(4500),
        });
        if (!res.ok) return;
        const json = await res.json();
        setArticles((((json?.articles || []) as Article[]).filter((article) => article.is_manual)).slice(0, 5));
      } catch { setArticles([]); }
    };
    fetchManual();
  }, [language]);

  if (articles.length === 0) return null;

  return (
    <div className="px-4 pb-4" dir={language === "AR" ? "rtl" : "ltr"}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-5 bg-primary rounded-full" />
        <h3 className="text-foreground font-bold text-sm">
          {language === "AR" ? "مقالات خاصة" : "Featured Articles"}
        </h3>
      </div>
      <div className="space-y-3">
        {articles.map((article) => (
          <div key={article.id} className="bg-card rounded-xl overflow-hidden border border-border cursor-pointer"
            onClick={() => navigate(`/article/${article.id}`)}>
            {article.image_url && (
              <img src={article.image_url} alt={article.title} className="w-full aspect-video object-contain bg-secondary" loading="lazy" />
            )}
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                {article.author_image_url && (
                  <img src={article.author_image_url} alt={article.author_name || ""} className="w-6 h-6 rounded-full object-cover shrink-0" />
                )}
                <h4 className="text-foreground font-bold text-sm leading-snug line-clamp-2 flex-1">{article.title}</h4>
              </div>
              {article.description && (
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 mb-2">{article.description}</p>
              )}
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-primary font-medium">{article.category}</span>
                {article.author_name && (
                  <><span className="text-muted-foreground">•</span><span className="text-muted-foreground">{article.author_name}</span></>
                )}
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{timeAgo(article.published_at, language)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManualArticlesSection;
