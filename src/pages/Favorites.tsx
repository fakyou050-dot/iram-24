import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getFavorites } from "@/lib/newsUtils";
import { Article } from "@/hooks/useArticles";
import NewsCard from "@/components/NewsCard";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const favIds = getFavorites();
    if (favIds.length === 0) return;
    const fetch = async () => {
      const { data } = await supabase.from("articles").select("*").in("id", favIds);
      if (data) setArticles(data as Article[]);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-16" dir="rtl">
      <header className="h-14 flex items-center gap-3 px-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="text-foreground"><ArrowRight size={20} /></button>
        <h1 className="text-foreground font-bold">المفضلة</h1>
      </header>
      <div className="p-4 space-y-4">
        {articles.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-12">لا توجد مقالات محفوظة</p>
        ) : (
          articles.map((a) => <NewsCard key={a.id} article={a} language={a.language as "AR" | "EN"} />)
        )}
      </div>
    </div>
  );
};

export default Favorites;
