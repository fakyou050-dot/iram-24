import { useState, useEffect, useRef } from "react";
import { X, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/hooks/useArticles";
import NewsCard from "./NewsCard";

interface SearchOverlayProps {
  language: "AR" | "EN";
  onClose: () => void;
}

const SearchOverlay = ({ language, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("language", language)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order("published_at", { ascending: false })
        .limit(20);
      setResults((data as Article[]) || []);
      setSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, language]);

  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border" dir={language === "AR" ? "rtl" : "ltr"}>
        <Search size={20} className="text-muted-foreground shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={language === "AR" ? "ابحث عن الأخبار..." : "Search news..."}
          className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground"
        />
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4" dir={language === "AR" ? "rtl" : "ltr"}>
        {searching && (
          <p className="text-center text-muted-foreground text-sm py-8">
            {language === "AR" ? "جاري البحث..." : "Searching..."}
          </p>
        )}
        {!searching && query.trim().length >= 2 && results.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">
            {language === "AR" ? "لا توجد نتائج" : "No results found"}
          </p>
        )}
        {results.map((a) => (
          <NewsCard key={a.id} article={a} language={language} />
        ))}
      </div>
    </div>
  );
};

export default SearchOverlay;
