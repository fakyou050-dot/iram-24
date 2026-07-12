import { Heart, Share2, Clock, ArrowUpRight, Zap } from "lucide-react";
import { Article } from "@/hooks/useArticles";
import { timeAgo, toggleFavorite, getFavorites, decodeHtmlEntities } from "@/lib/newsUtils";
import { classify, normalizeCategory } from "@/lib/classifier";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { proxyImageUrl } from "@/lib/imageProxy";
import { normalizeImageUrl } from "@/lib/contentParser";
import LazyImage from "@/components/LazyImage";
import { categoryStyle } from "@/lib/categoryColors";

interface NewsCardProps {
  article: Article;
  language: "AR" | "EN";
  variant?: "featured" | "medium" | "compact";
  onBeforeNavigate?: () => void;
}

// Branded gradient placeholder rendered when an article has no image
const GradientPlaceholder = ({
  category,
  title,
  className = "",
}: { category: string; title?: string; className?: string }) => {
  const s = categoryStyle(category);
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center text-center p-3 ${className}`}
      style={{ background: s.gradient }}
      aria-hidden="true"
    >
      <span className="text-3xl md:text-4xl opacity-90 mb-1 drop-shadow-sm">{s.emoji}</span>
      <span
        className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-bold text-white/85"
        style={{ textShadow: "0 1px 4px rgba(0,0,0,.45)" }}
      >
        {category}
      </span>
      {title && (
        <span className="text-[10px] text-white/55 mt-1 line-clamp-2 max-w-[90%] hidden md:block">
          {title}
        </span>
      )}
    </div>
  );
};

const NewsCard = ({ article, language, variant = "medium", onBeforeNavigate }: NewsCardProps) => {
  const [favs, setFavs] = useState(getFavorites());
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const isFav = favs.includes(article.id);
  const isRTL = language === "AR";

  const goToArticle = () => {
    onBeforeNavigate?.();
    navigate(`/article/${article.id}`);
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavs(toggleFavorite(article.id));
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/article/${article.id}`;
    const text = `${decodeHtmlEntities(article.title)} - إيرام برس\n${url}`;
    if (navigator.share) {
      try { await navigator.share({ title: decodeHtmlEntities(article.title), text, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  const rawImgUrl = article.image_url?.trim() || "";
  const imgSrc = rawImgUrl ? proxyImageUrl(normalizeImageUrl(rawImgUrl)) : "";
  const hasImage = !!(rawImgUrl && !imgError);
  const title = decodeHtmlEntities(article.title);
  const displayCategory = normalizeCategory(article.category);
  const meta = useMemo(
    () => classify(article.title, article.description, language),
    [article.id, article.title, article.description, language]
  );
  const isBreaking = meta.breaking;
  const geoTag = meta.tags.find((t) => ["اليمن", "عربي", "دولي", "Yemen", "Arab", "World"].includes(t));

  // Featured — premium full-bleed
  if (variant === "featured") {
    return (
      <article
        className="relative overflow-hidden cursor-pointer group rounded-2xl shadow-luxe hover-lift bg-[hsl(var(--navy-deep))]"
        onClick={goToArticle}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="aspect-[16/10] overflow-hidden">
          {hasImage ? (
            <LazyImage
              src={imgSrc}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
              loading="eager"
              onError={() => setImgError(true)}
              fallback={<GradientPlaceholder category={displayCategory} />}
            />
          ) : (
            <GradientPlaceholder category={displayCategory} />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy-deep))] via-[hsl(var(--navy-deep))]/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            {isBreaking && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded-full tracking-wider uppercase animate-pulse">
                <Zap size={10} /> {isRTL ? "عاجل" : "Breaking"}
              </span>
            )}
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[hsl(var(--gold))]">
              {displayCategory}
            </span>
            {geoTag && (
              <span className="text-[9px] tracking-wider uppercase text-white/70 bg-white/10 px-1.5 py-0.5 rounded-full">
                #{geoTag}
              </span>
            )}
          </div>
          <h2 className="font-display text-lg md:text-2xl text-white leading-tight line-clamp-3 group-hover:text-[hsl(var(--gold-soft))] transition-colors">
            {title}
          </h2>
          <div className="flex items-center gap-3 text-[10px] text-white/60 mt-3 uppercase tracking-wider">
            <span className="flex items-center gap-1"><Clock size={11} />{timeAgo(article.published_at, language)}</span>
          </div>
        </div>
      </article>
    );
  }

  // Medium — editorial card
  if (variant === "medium") {
    return (
      <article
        className="cursor-pointer group flex flex-col h-full"
        onClick={goToArticle}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-[hsl(var(--navy-mid))] mb-3 relative shadow-luxe">
          {hasImage ? (
            <LazyImage
              src={imgSrc}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImgError(true)}
              fallback={<GradientPlaceholder category={displayCategory} title={title} />}
            />
          ) : (
            <GradientPlaceholder category={displayCategory} title={title} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy-deep))]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="absolute top-2.5 start-2.5 text-[9px] tracking-[0.25em] uppercase font-bold text-[hsl(var(--gold))] bg-[hsl(var(--navy-deep))]/80 backdrop-blur px-2.5 py-1 rounded-full border border-[hsl(var(--gold))]/30">
            {displayCategory}
          </span>
        </div>
        <h3 className="font-display text-[15px] md:text-base text-foreground leading-snug line-clamp-3 group-hover:text-[hsl(var(--gold))] transition-colors flex-1">
          {title}
        </h3>
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-foreground/10">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={10} />
            {timeAgo(article.published_at, language)}
            <span className="opacity-40">•</span>
            <span>{Math.max(1, Math.round(((article.description?.split(/\s+/).length || 60)) / 200))} {isRTL ? "د" : "min"}</span>
          </span>
          <div className="flex items-center gap-2.5">
            <button onClick={handleShare} aria-label="Share" className="text-muted-foreground hover:text-[hsl(var(--gold))] transition-colors">
              <Share2 size={12} />
            </button>
            <button onClick={handleFav} aria-label="Favorite" className="transition-transform active:scale-110">
              <Heart size={12} className={isFav ? "fill-[hsl(var(--crimson))] text-[hsl(var(--crimson))]" : "text-muted-foreground hover:text-[hsl(var(--crimson))] transition-colors"} />
            </button>
          </div>
        </div>
      </article>
    );
  }

  // Compact horizontal
  return (
    <article
      className="flex gap-3 cursor-pointer group py-3 border-b border-foreground/8 last:border-b-0"
      dir={isRTL ? "rtl" : "ltr"}
      onClick={goToArticle}
    >
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden bg-[hsl(var(--navy-mid))] shrink-0 shadow-luxe">
        {hasImage ? (
          <LazyImage
            src={imgSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
            fallback={<GradientPlaceholder category={displayCategory} />}
          />
        ) : (
          <GradientPlaceholder category={displayCategory} />
        )}
      </div>
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <span className="text-[9px] tracking-[0.25em] uppercase font-bold text-[hsl(var(--gold))]">{displayCategory}</span>
          <h3 className="text-foreground font-display text-sm leading-snug line-clamp-3 mt-1 group-hover:text-[hsl(var(--gold))] transition-colors">{title}</h3>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-muted-foreground text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Clock size={10} /> {timeAgo(article.published_at, language)}
          </span>
          <ArrowUpRight size={13} className="text-[hsl(var(--gold))] opacity-0 group-hover:opacity-100 transition-opacity flip-rtl" />
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
