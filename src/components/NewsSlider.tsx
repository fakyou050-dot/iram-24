import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Article } from "@/hooks/useArticles";
import { supabase } from "@/integrations/supabase/client";
import { decodeHtmlEntities } from "@/lib/newsUtils";
import { proxyImageUrl } from "@/lib/imageProxy";

interface NewsSliderProps {
  language: "AR" | "EN";
}

const NewsSlider = ({ language }: NewsSliderProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("language", language)
        .order("published_at", { ascending: false })
        .limit(5);
      if (data) setArticles(data as Article[]);
    };
    fetch();
  }, [language]);

  useEffect(() => {
    if (articles.length <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % articles.length), 5000);
    return () => clearInterval(timer);
  }, [articles.length]);

  if (articles.length === 0) return null;

  const article = articles[current];
  const hasImage = article?.image_url && !imgErrors.has(article.id);

  return (
    <div
      className="relative aspect-[16/9] bg-secondary overflow-hidden cursor-pointer"
      dir={language === "AR" ? "rtl" : "ltr"}
      onClick={() => navigate(`/article/${article.id}`)}
    >
      {hasImage && (
        <img
          src={proxyImageUrl(article.image_url!)}
          alt={decodeHtmlEntities(article.title)}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImgErrors(prev => new Set(prev).add(article.id))}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="inline-block bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded mb-2">
          {language === "AR" ? "الأحدث" : "Latest"}
        </span>
        <h2 className="text-foreground text-lg font-bold leading-tight line-clamp-2">
          {decodeHtmlEntities(article?.title || "")}
        </h2>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {articles.map((_, i) => (
          <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-foreground/30"}`} />
        ))}
      </div>
    </div>
  );
};

export default NewsSlider;
