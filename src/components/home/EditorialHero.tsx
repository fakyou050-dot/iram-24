import { Article } from "@/hooks/useArticles";
import { useNavigate } from "react-router-dom";
import { decodeHtmlEntities, timeAgo } from "@/lib/newsUtils";
import { proxyImageUrl } from "@/lib/imageProxy";
import { normalizeImageUrl } from "@/lib/contentParser";
import LazyImage from "@/components/LazyImage";

interface Props {
  articles: Article[];
  language: "AR" | "EN";
  onBeforeNavigate?: () => void;
}

const hasImg = (a: Article) => !!(a.image_url && a.image_url.trim());

const EditorialHero = ({ articles, language, onBeforeNavigate }: Props) => {
  const navigate = useNavigate();
  if (articles.length === 0) return null;
  const isRTL = language === "AR";

  const lead = articles[0];
  const subs = [articles[1], articles[2], articles[3]].filter(Boolean);

  const go = (id: string) => {
    onBeforeNavigate?.();
    navigate(`/article/${id}`);
  };

  const renderImg = (a: Article, eager = false) => (
    <LazyImage
      src={proxyImageUrl(normalizeImageUrl(a.image_url!.trim()))}
      alt={decodeHtmlEntities(a.title)}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      loading={eager ? "eager" : "lazy"}
    />
  );

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="grid grid-cols-12 gap-x-6 gap-y-8 py-8 border-b border-foreground/15"
    >
      <article
        onClick={() => go(lead.id)}
        className="col-span-12 lg:col-span-8 cursor-pointer group"
      >
        {hasImg(lead) && (
          <div className="aspect-[16/9] md:aspect-[16/8] overflow-hidden bg-foreground/5 mb-4">
            {renderImg(lead, true)}
          </div>
        )}
        <div className={isRTL ? "border-r-4 border-primary pr-4" : "border-l-4 border-primary pl-4"}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
              {lead.category}
            </span>
            <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
              {timeAgo(lead.published_at, language)}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground leading-[1.05] group-hover:text-primary transition-colors">
            {decodeHtmlEntities(lead.title)}
          </h1>
          {lead.description && (
            <p className="text-muted-foreground text-sm md:text-base mt-3 leading-relaxed line-clamp-2 max-w-2xl">
              {decodeHtmlEntities(lead.description)}
            </p>
          )}
          {lead.author_name && (
            <p className="text-[11px] text-muted-foreground mt-3 uppercase tracking-wider">
              {isRTL ? "بقلم" : "By"} <span className="text-foreground font-bold">{lead.author_name}</span>
            </p>
          )}
        </div>
      </article>

      <aside className="col-span-12 lg:col-span-4 flex flex-col">
        {subs.map((a, i) => (
          <article
            key={a.id}
            onClick={() => go(a.id)}
            className={`cursor-pointer group py-4 ${
              i !== 0 ? "border-t border-foreground/15" : ""
            } first:pt-0`}
          >
            <div className="flex gap-3">
              {hasImg(a) && (
                <div className="w-24 h-20 md:w-28 md:h-24 shrink-0 overflow-hidden bg-foreground/5">
                  <LazyImage
                    src={proxyImageUrl(normalizeImageUrl(a.image_url!.trim()))}
                    alt={decodeHtmlEntities(a.title)}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-primary block mb-1">
                  {a.category}
                </span>
                <h3 className="font-display text-base md:text-lg text-foreground leading-tight line-clamp-3 group-hover:text-primary transition-colors">
                  {decodeHtmlEntities(a.title)}
                </h3>
                <span className="text-[10px] text-muted-foreground mt-1.5 block uppercase tracking-wider">
                  {timeAgo(a.published_at, language)}
                </span>
              </div>
            </div>
          </article>
        ))}
      </aside>
    </section>
  );
};

export default EditorialHero;
