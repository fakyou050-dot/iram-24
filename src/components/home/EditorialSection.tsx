import { Article } from "@/hooks/useArticles";
import { useNavigate } from "react-router-dom";
import { decodeHtmlEntities, timeAgo } from "@/lib/newsUtils";
import { proxyImageUrl } from "@/lib/imageProxy";
import { normalizeImageUrl } from "@/lib/contentParser";
import LazyImage from "@/components/LazyImage";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  number?: string;
  articles: Article[];
  language: "AR" | "EN";
  onMore?: () => void;
  variant?: "feature" | "list" | "trio" | "wide";
  onBeforeNavigate?: () => void;
}

const hasImg = (a: Article) => !!(a.image_url && a.image_url.trim());

const Img = ({ a, className }: { a: Article; className?: string }) => {
  const raw = a.image_url?.trim();
  if (!raw) return null;
  return (
    <LazyImage
      src={proxyImageUrl(normalizeImageUrl(raw))}
      alt={decodeHtmlEntities(a.title)}
      className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${className || ""}`}
    />
  );
};

const EditorialSection = ({
  title,
  subtitle,
  articles,
  language,
  onMore,
  variant = "trio",
  onBeforeNavigate,
}: Props) => {
  const navigate = useNavigate();
  if (articles.length === 0) return null;
  const isRTL = language === "AR";
  const go = (id: string) => {
    onBeforeNavigate?.();
    navigate(`/article/${id}`);
  };

  const Header = (
    <div
      className="flex items-end justify-between mb-5 pb-3 border-b-2 border-foreground"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div>
        {subtitle && (
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[hsl(var(--gold))] block mb-1">
            {subtitle}
          </span>
        )}
        <h2 className="font-display text-2xl md:text-3xl text-foreground leading-none">
          {title}
        </h2>
      </div>
      {onMore && (
        <button
          onClick={onMore}
          className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground hover:text-primary flex items-center gap-1 transition-colors"
        >
          <span>{isRTL ? "كل القسم" : "View all"}</span>
          {isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      )}
    </div>
  );

  // FEATURE: 1 lead + small list
  if (variant === "feature") {
    const lead = articles[0];
    const rest = articles.slice(1, 3);
    return (
      <section dir={isRTL ? "rtl" : "ltr"} className="py-8 border-b border-foreground/15">
        {Header}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article onClick={() => go(lead.id)} className="cursor-pointer group">
            {hasImg(lead) && (
              <div className="aspect-[4/3] overflow-hidden bg-foreground/5 mb-3">
                <Img a={lead} className="w-full h-full" />
              </div>
            )}
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
              {lead.category}
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-foreground leading-tight mt-1 group-hover:text-primary transition-colors line-clamp-3">
              {decodeHtmlEntities(lead.title)}
            </h3>
            {lead.description && (
              <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                {decodeHtmlEntities(lead.description)}
              </p>
            )}
            <span className="text-[10px] text-muted-foreground mt-2 block uppercase tracking-wider">
              {timeAgo(lead.published_at, language)}
            </span>
          </article>
          <div className="flex flex-col">
            {rest.map((a, i) => (
              <article
                key={a.id}
                onClick={() => go(a.id)}
                className={`cursor-pointer group flex-1 ${i !== 0 ? "border-t border-foreground/15 pt-5 mt-5" : ""}`}
              >
                {hasImg(a) ? (
                  <div className="grid grid-cols-5 gap-3">
                    <div className="col-span-2 aspect-[4/3] overflow-hidden bg-foreground/5">
                      <Img a={a} className="w-full h-full" />
                    </div>
                    <div className="col-span-3">
                      <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-primary">
                        {a.category}
                      </span>
                      <h4 className="font-display text-base md:text-xl text-foreground leading-tight mt-1 group-hover:text-primary transition-colors line-clamp-3">
                        {decodeHtmlEntities(a.title)}
                      </h4>
                      <span className="text-[10px] text-muted-foreground mt-2 block uppercase tracking-wider">
                        {timeAgo(a.published_at, language)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-primary">
                      {a.category}
                    </span>
                    <h4 className="font-display text-lg md:text-2xl text-foreground leading-tight mt-1 group-hover:text-primary transition-colors line-clamp-3">
                      {decodeHtmlEntities(a.title)}
                    </h4>
                    {a.description && (
                      <p className="text-muted-foreground text-sm mt-1.5 line-clamp-2">
                        {decodeHtmlEntities(a.description)}
                      </p>
                    )}
                    <span className="text-[10px] text-muted-foreground mt-2 block uppercase tracking-wider">
                      {timeAgo(a.published_at, language)}
                    </span>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // LIST: editorial list (no images, no numbers)
  if (variant === "list") {
    return (
      <section dir={isRTL ? "rtl" : "ltr"} className="py-8 border-b border-foreground/15">
        {Header}
        <ol className="space-y-0">
          {articles.slice(0, 6).map((a) => (
            <li
              key={a.id}
              onClick={() => go(a.id)}
              className="cursor-pointer group py-3 border-b border-foreground/10 last:border-b-0"
            >
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-primary block mb-1">
                {a.category}
              </span>
              <h4 className="font-display text-base text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {decodeHtmlEntities(a.title)}
              </h4>
              <span className="text-[10px] text-muted-foreground mt-1 block uppercase tracking-wider">
                {timeAgo(a.published_at, language)}
              </span>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  // WIDE: 4-column editorial grid
  if (variant === "wide") {
    return (
      <section dir={isRTL ? "rtl" : "ltr"} className="py-8 border-b border-foreground/15">
        {Header}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {articles.slice(0, 4).map((a) => (
            <article key={a.id} onClick={() => go(a.id)} className="cursor-pointer group">
              {hasImg(a) && (
                <div className="aspect-[4/3] overflow-hidden bg-foreground/5 mb-2">
                  <Img a={a} className="w-full h-full" />
                </div>
              )}
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-primary">
                {a.category}
              </span>
              <h4 className="font-display text-sm md:text-base text-foreground leading-tight mt-1 group-hover:text-primary transition-colors line-clamp-3">
                {decodeHtmlEntities(a.title)}
              </h4>
              <span className="text-[10px] text-muted-foreground mt-1.5 block uppercase tracking-wider">
                {timeAgo(a.published_at, language)}
              </span>
            </article>
          ))}
        </div>
      </section>
    );
  }

  // TRIO (default)
  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="py-8 border-b border-foreground/15">
      {Header}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.slice(0, 3).map((a) => (
          <article key={a.id} onClick={() => go(a.id)} className="cursor-pointer group">
            {hasImg(a) && (
              <div className="aspect-[16/10] overflow-hidden bg-foreground/5 mb-3">
                <Img a={a} className="w-full h-full" />
              </div>
            )}
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
              {a.category}
            </span>
            <h4 className="font-display text-lg md:text-xl text-foreground leading-tight mt-1 group-hover:text-primary transition-colors line-clamp-3">
              {decodeHtmlEntities(a.title)}
            </h4>
            {a.description && (
              <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                {decodeHtmlEntities(a.description)}
              </p>
            )}
            <span className="text-[10px] text-muted-foreground mt-2 block uppercase tracking-wider">
              {timeAgo(a.published_at, language)}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
};

export default EditorialSection;
