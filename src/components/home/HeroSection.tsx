import { Article } from "@/hooks/useArticles";
import { useNavigate } from "react-router-dom";
import { decodeHtmlEntities, timeAgo } from "@/lib/newsUtils";
import { proxyImageUrl } from "@/lib/imageProxy";
import { normalizeImageUrl } from "@/lib/contentParser";
import LazyImage from "@/components/LazyImage";
import { Clock } from "lucide-react";

interface HeroSectionProps {
  articles: Article[];
  language: "AR" | "EN";
  onBeforeNavigate?: () => void;
}

const HeroSection = ({ articles, language, onBeforeNavigate }: HeroSectionProps) => {
  const navigate = useNavigate();
  if (articles.length === 0) return null;

  const main = articles[0];
  const sides = articles.slice(1, 3);
  const isRTL = language === "AR";

  const go = (id: string) => {
    onBeforeNavigate?.();
    navigate(`/article/${id}`);
  };

  const renderImg = (a: Article) => {
    const raw = a.image_url?.trim();
    if (!raw) return (
      <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary flex items-center justify-center">
        <span className="text-4xl opacity-40">📰</span>
      </div>
    );
    return (
      <LazyImage
        src={proxyImageUrl(normalizeImageUrl(raw))}
        alt={decodeHtmlEntities(a.title)}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="eager"
      />
    );
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Main hero */}
      <article
        onClick={() => go(main.id)}
        className="lg:col-span-2 relative rounded-2xl overflow-hidden cursor-pointer group bg-card shadow-xl ring-1 ring-border/50"
      >
        <div className="aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden">
          {renderImg(main)}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary text-primary-foreground text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
              {main.category}
            </span>
            <span className="bg-background/40 backdrop-blur-sm text-foreground text-[10px] md:text-xs font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
              <Clock size={10} />
              {timeAgo(main.published_at, language)}
            </span>
          </div>
          <h1 className="text-foreground font-extrabold text-lg md:text-2xl lg:text-3xl leading-tight line-clamp-3 group-hover:text-primary transition-colors">
            {decodeHtmlEntities(main.title)}
          </h1>
          {main.description && (
            <p className="hidden md:block text-foreground/80 text-sm mt-2 line-clamp-2">
              {decodeHtmlEntities(main.description)}
            </p>
          )}
        </div>
      </article>

      {/* Side stories */}
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
        {sides.map((a) => (
          <article
            key={a.id}
            onClick={() => go(a.id)}
            className="relative rounded-xl overflow-hidden cursor-pointer group bg-card shadow-md ring-1 ring-border/50"
          >
            <div className="aspect-[16/10] lg:aspect-[16/9] w-full overflow-hidden">
              {renderImg(a)}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-2.5">
              <span className="inline-block bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded mb-1">
                {a.category}
              </span>
              <h3 className="text-foreground font-bold text-xs md:text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {decodeHtmlEntities(a.title)}
              </h3>
              <span className="text-foreground/60 text-[9px] mt-1 block">
                {timeAgo(a.published_at, language)}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
