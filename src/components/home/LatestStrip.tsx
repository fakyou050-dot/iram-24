import { Article } from "@/hooks/useArticles";
import { useNavigate } from "react-router-dom";
import { decodeHtmlEntities, timeAgo } from "@/lib/newsUtils";
import { Radio } from "lucide-react";

interface LatestStripProps {
  articles: Article[];
  language: "AR" | "EN";
  onBeforeNavigate?: () => void;
}

const LatestStrip = ({ articles, language, onBeforeNavigate }: LatestStripProps) => {
  const navigate = useNavigate();
  if (articles.length === 0) return null;
  const isRTL = language === "AR";

  return (
    <div
      className="bg-card border-y border-border mb-5 overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-stretch max-w-screen-xl mx-auto">
        <div className="bg-primary text-primary-foreground px-3 py-2 flex items-center gap-1.5 shrink-0">
          <Radio size={12} className="animate-pulse-live" />
          <span className="text-[11px] font-bold whitespace-nowrap">
            {isRTL ? "آخر الأخبار" : "LATEST"}
          </span>
        </div>
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-5 px-3 py-2 whitespace-nowrap">
            {articles.slice(0, 8).map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  onBeforeNavigate?.();
                  navigate(`/article/${a.id}`);
                }}
                className="flex items-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-muted-foreground text-[10px] font-mono shrink-0">
                  {timeAgo(a.published_at, language)}
                </span>
                <span className="text-foreground text-xs font-medium group-hover:text-primary transition-colors max-w-[280px] truncate">
                  {decodeHtmlEntities(a.title)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestStrip;
