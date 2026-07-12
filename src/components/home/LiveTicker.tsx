import { Article } from "@/hooks/useArticles";
import { useNavigate } from "react-router-dom";
import { decodeHtmlEntities, timeAgo } from "@/lib/newsUtils";

interface Props {
  articles: Article[];
  language: "AR" | "EN";
  onBeforeNavigate?: () => void;
}

const LiveTicker = ({ articles, language, onBeforeNavigate }: Props) => {
  const navigate = useNavigate();
  if (articles.length === 0) return null;
  const isRTL = language === "AR";
  const items = articles.slice(0, 10);

  // Medium global-news speed, never sluggish.
  const duration = Math.min(50, Math.max(24, items.length * 3.5));
  const animationClass = isRTL ? "animate-marquee-rtl" : "animate-marquee-ltr";

  const Row = ({ ariaHidden = false }: { ariaHidden?: boolean }) => (
    <div className="flex items-center gap-8 px-5 py-2.5 whitespace-nowrap shrink-0 min-w-full" aria-hidden={ariaHidden}>
      {items.map((a, i) => (
        <button
          key={`${ariaHidden ? "b" : "a"}-${a.id}`}
          onClick={() => {
            if (ariaHidden) return;
            onBeforeNavigate?.();
            navigate(`/article/${a.id}`);
          }}
          className="flex items-center gap-3 group"
        >
          <span className="text-[hsl(var(--gold))] text-[11px] font-bold tracking-wider uppercase shrink-0">
            {timeAgo(a.published_at, language)}
          </span>
          <span className="text-white text-[13px] font-medium group-hover:text-[hsl(var(--gold))] transition-colors max-w-[320px] truncate">
            {decodeHtmlEntities(a.title)}
          </span>
          {i < items.length - 1 && <span className="text-white/30">·</span>}
        </button>
      ))}
      <span className="text-white/30">·</span>
    </div>
  );

  return (
    <div className="bg-[hsl(var(--ink))] text-white" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-screen-xl mx-auto flex items-stretch">
        <div className="bg-primary px-4 py-2.5 flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse-live" />
          <span className="text-[11px] font-black tracking-[0.2em] uppercase">
            {isRTL ? "مباشر" : "LIVE"}
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div
            className={`flex w-max min-w-full marquee-track ${animationClass}`}
            style={{ ["--marquee-duration" as string]: `${duration}s` }}
          >
            <Row />
            <Row ariaHidden />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTicker;
