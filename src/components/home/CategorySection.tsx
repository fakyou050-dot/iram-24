import { Article } from "@/hooks/useArticles";
import { useNavigate } from "react-router-dom";
import { decodeHtmlEntities, timeAgo } from "@/lib/newsUtils";
import { proxyImageUrl } from "@/lib/imageProxy";
import { normalizeImageUrl } from "@/lib/contentParser";
import LazyImage from "@/components/LazyImage";
import SectionHeader from "./SectionHeader";

interface CategorySectionProps {
  title: string;
  articles: Article[];
  language: "AR" | "EN";
  onMore?: () => void;
  layout?: "grid" | "list" | "magazine";
  icon?: React.ReactNode;
  onBeforeNavigate?: () => void;
}

const CategorySection = ({
  title,
  articles,
  language,
  onMore,
  layout = "grid",
  icon,
  onBeforeNavigate,
}: CategorySectionProps) => {
  const navigate = useNavigate();
  if (articles.length === 0) return null;
  const isRTL = language === "AR";

  const go = (id: string) => {
    onBeforeNavigate?.();
    navigate(`/article/${id}`);
  };

  const Img = ({ a, className }: { a: Article; className?: string }) => {
    const raw = a.image_url?.trim();
    if (!raw) return (
      <div className={`bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center ${className || ""}`}>
        <span className="text-2xl opacity-30">📰</span>
      </div>
    );
    return (
      <LazyImage
        src={proxyImageUrl(normalizeImageUrl(raw))}
        alt={decodeHtmlEntities(a.title)}
        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${className || ""}`}
      />
    );
  };

  // MAGAZINE: 1 large + 4 small list
  if (layout === "magazine" && articles.length >= 3) {
    const lead = articles[0];
    const rest = articles.slice(1, 5);
    return (
      <section className="mb-7" dir={isRTL ? "rtl" : "ltr"}>
        <SectionHeader title={title} language={language} onMore={onMore} icon={icon} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Lead */}
          <article
            onClick={() => go(lead.id)}
            className="group cursor-pointer rounded-xl overflow-hidden bg-card shadow-md ring-1 ring-border/50"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <Img a={lead} className="w-full h-full" />
            </div>
            <div className="p-3">
              <span className="text-primary text-[10px] font-bold uppercase tracking-wider">{lead.category}</span>
              <h3 className="text-foreground font-bold text-base md:text-lg leading-tight line-clamp-2 mt-1 group-hover:text-primary transition-colors">
                {decodeHtmlEntities(lead.title)}
              </h3>
              {lead.description && (
                <p className="text-muted-foreground text-xs mt-1.5 line-clamp-2">
                  {decodeHtmlEntities(lead.description)}
                </p>
              )}
              <span className="text-muted-foreground text-[10px] mt-2 block">{timeAgo(lead.published_at, language)}</span>
            </div>
          </article>

          {/* Rest list */}
          <div className="flex flex-col divide-y divide-border">
            {rest.map((a, i) => (
              <article
                key={a.id}
                onClick={() => go(a.id)}
                className="flex gap-3 py-2.5 cursor-pointer group first:pt-0"
              >
                <span className="text-2xl md:text-3xl font-black text-primary/30 leading-none w-7 shrink-0">
                  {String(i + 2).padStart(2, "0")}
                </span>
                <div className="w-20 h-16 md:w-24 md:h-20 rounded-lg overflow-hidden shrink-0 bg-secondary">
                  <Img a={a} className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-foreground font-bold text-xs md:text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {decodeHtmlEntities(a.title)}
                  </h4>
                  <span className="text-muted-foreground text-[10px] mt-1 block">
                    {timeAgo(a.published_at, language)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // LIST: numbered list (most read style)
  if (layout === "list") {
    return (
      <section className="mb-7" dir={isRTL ? "rtl" : "ltr"}>
        <SectionHeader title={title} language={language} onMore={onMore} icon={icon} />
        <div className="flex flex-col divide-y divide-border bg-card rounded-xl ring-1 ring-border/50 px-3">
          {articles.slice(0, 5).map((a, i) => (
            <article
              key={a.id}
              onClick={() => go(a.id)}
              className="flex gap-3 py-3 cursor-pointer group"
            >
              <span className="text-2xl font-black text-primary/40 leading-none w-7 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="text-foreground font-bold text-xs md:text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {decodeHtmlEntities(a.title)}
                </h4>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground">
                  <span className="text-primary font-semibold">{a.category}</span>
                  <span>•</span>
                  <span>{timeAgo(a.published_at, language)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  // GRID (default)
  return (
    <section className="mb-7" dir={isRTL ? "rtl" : "ltr"}>
      <SectionHeader title={title} language={language} onMore={onMore} icon={icon} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {articles.slice(0, 4).map((a) => (
          <article
            key={a.id}
            onClick={() => go(a.id)}
            className="group cursor-pointer rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-lg transition-shadow ring-1 ring-border/50"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <Img a={a} className="w-full h-full" />
            </div>
            <div className="p-2.5">
              <span className="text-primary text-[9px] font-bold uppercase tracking-wide">{a.category}</span>
              <h3 className="text-foreground font-bold text-xs leading-snug line-clamp-2 mt-0.5 group-hover:text-primary transition-colors">
                {decodeHtmlEntities(a.title)}
              </h3>
              <span className="text-muted-foreground text-[9px] mt-1 block">
                {timeAgo(a.published_at, language)}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
