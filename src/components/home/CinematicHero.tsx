import { Article } from "@/hooks/useArticles";
import { decodeHtmlEntities, timeAgo } from "@/lib/newsUtils";
import { proxyImageUrl } from "@/lib/imageProxy";
import { normalizeImageUrl } from "@/lib/contentParser";
import LazyImage from "@/components/LazyImage";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowUpRight } from "lucide-react";

interface Props {
  articles: Article[];
  language: "AR" | "EN";
  onBeforeNavigate?: () => void;
}

const hasImg = (a?: Article) => !!(a?.image_url && a.image_url.trim());

const CinematicHero = ({ articles, language, onBeforeNavigate }: Props) => {
  const navigate = useNavigate();
  const isRTL = language === "AR";
  if (!articles.length) return null;

  const lead = articles.find(hasImg) || articles[0];
  const rest = articles.filter((a) => a.id !== lead.id).slice(0, 4);

  const go = (id: string) => {
    onBeforeNavigate?.();
    navigate(`/article/${id}`);
  };

  return (
    <section className="relative -mx-4 md:-mx-6 mb-12 animate-fade-in" dir={isRTL ? "rtl" : "ltr"}>
      <div className="grid grid-cols-12 gap-0 lg:gap-px bg-foreground/5">
        {/* Lead — full cinematic */}
        <article
          onClick={() => go(lead.id)}
          className="col-span-12 lg:col-span-8 relative cursor-pointer group overflow-hidden bg-[hsl(var(--navy-deep))]"
        >
          {hasImg(lead) ? (
            <div className="aspect-[16/10] md:aspect-[16/9] lg:aspect-[16/10] overflow-hidden relative">
              <LazyImage
                src={proxyImageUrl(normalizeImageUrl(lead.image_url!))}
                alt={decodeHtmlEntities(lead.title)}
                className="w-full h-full object-cover animate-kenburns"
                loading="eager"
              />
              <div className="absolute inset-0" style={{ background: "var(--grad-hero)" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy-deep))] via-transparent to-transparent opacity-90" />
            </div>
          ) : (
            <div className="aspect-[16/10] md:aspect-[16/9] lg:aspect-[16/10] bg-gradient-to-br from-[hsl(220_45%_12%)] to-[hsl(var(--navy-deep))]" />
          )}

          <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--crimson))] animate-pulse-live" />
              <span className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase font-bold text-[hsl(var(--gold))] bg-[hsl(var(--navy-deep))]/60 backdrop-blur px-3 py-1 rounded-full border border-[hsl(var(--gold))]/30">
                {lead.category}
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-white leading-[1.1] max-w-4xl group-hover:text-[hsl(var(--gold-soft))] transition-colors">
              {decodeHtmlEntities(lead.title)}
            </h1>
            {lead.description && (
              <p className="hidden md:block text-base lg:text-lg text-white/75 mt-4 max-w-3xl line-clamp-2 leading-relaxed">
                {decodeHtmlEntities(lead.description)}
              </p>
            )}
            <div className="flex items-center gap-4 mt-4 md:mt-5 text-[11px] md:text-xs text-white/60 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                {timeAgo(lead.published_at, language)}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[hsl(var(--gold))] font-bold group-hover:translate-x-1 transition-transform">
                {isRTL ? "اقرأ المزيد" : "Read more"}
                <ArrowUpRight size={14} className="flip-rtl" />
              </span>
            </div>
          </div>
        </article>

        {/* Side stack */}
        <div className="col-span-12 lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-px bg-foreground/5">
          {rest.map((a, i) => (
            <article
              key={a.id}
              onClick={() => go(a.id)}
              style={{ animationDelay: `${i * 80}ms` }}
              className="animate-fade-up relative cursor-pointer group overflow-hidden bg-[hsl(var(--navy-deep))] min-h-[140px] lg:min-h-0"
            >
              {hasImg(a) ? (
                <>
                  <div className="absolute inset-0 overflow-hidden">
                    <LazyImage
                      src={proxyImageUrl(normalizeImageUrl(a.image_url!))}
                      alt={decodeHtmlEntities(a.title)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy-deep))] via-[hsl(var(--navy-deep))]/50 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220_45%_10%)] to-[hsl(var(--navy-deep))]" />
              )}
              <div className="relative h-full flex flex-col justify-end p-4 lg:p-5 min-h-[150px] lg:min-h-[170px]">
                <span className="text-[9px] tracking-[0.25em] uppercase font-bold text-[hsl(var(--gold))] mb-1.5">
                  {a.category}
                </span>
                <h3 className="font-display text-sm md:text-base lg:text-lg text-white leading-tight line-clamp-3 group-hover:text-[hsl(var(--gold-soft))] transition-colors">
                  {decodeHtmlEntities(a.title)}
                </h3>
                <span className="text-[10px] text-white/50 mt-2 uppercase tracking-wider">
                  {timeAgo(a.published_at, language)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CinematicHero;
