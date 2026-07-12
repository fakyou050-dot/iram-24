import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Article, getCachedArticleById } from "@/hooks/useArticles";
import { timeAgo, decodeHtmlEntities } from "@/lib/newsUtils";
import { ArrowRight, ArrowLeft, Heart, Copy, Check, ExternalLink, Eye, Clock, Bookmark, Share2 } from "lucide-react";
import { toggleFavorite, getFavorites } from "@/lib/newsUtils";
import LazyImage from "@/components/LazyImage";
import { normalizeImageUrl, parseContentToStructured } from "@/lib/contentParser";
import { proxyImageUrl } from "@/lib/imageProxy";
import { toast } from "sonner";

interface SourceInfo {
  name: string;
  show_source: boolean;
  alt_source_name: string | null;
  alt_source_url: string | null;
}

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [favs, setFavs] = useState(getFavorites());
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [sourceInfo, setSourceInfo] = useState<SourceInfo | null>(null);
  const [progress, setProgress] = useState(0);

  const lang = article?.language === "EN" ? "EN" : "AR";
  const isRTL = lang === "AR";

  // Reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(100, (scrolled / max) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Inject JSON-LD + dynamic OG/Twitter meta for per-article previews
  useEffect(() => {
    if (!article) return;
    const url = `${window.location.origin}/article/${article.id}`;
    const cleanTitle = decodeHtmlEntities(article.title);
    const rawDesc = decodeHtmlEntities(article.description || article.content || "").replace(/<[^>]+>/g, "").trim();
    const desc = rawDesc.slice(0, 200);
    const image = article.image_url || undefined;

    const ld = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "NewsArticle",
          headline: cleanTitle,
          description: desc || undefined,
          image: image ? [image] : undefined,
          datePublished: article.published_at || article.created_at,
          dateModified: article.published_at || article.created_at,
          author: article.author_name ? [{ "@type": "Person", name: article.author_name }] : undefined,
          publisher: { "@type": "Organization", name: "إيرام 24", logo: { "@type": "ImageObject", url: `${window.location.origin}/icon-512.png` } },
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          articleSection: article.category,
          inLanguage: article.language === "EN" ? "en" : "ar",
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "إيرام 24", item: window.location.origin },
            { "@type": "ListItem", position: 2, name: article.category, item: `${window.location.origin}/categories?c=${encodeURIComponent(article.category)}` },
            { "@type": "ListItem", position: 3, name: cleanTitle, item: url },
          ],
        },
      ],
    };
    const tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.id = "article-jsonld";
    tag.text = JSON.stringify(ld);
    document.querySelectorAll("#article-jsonld").forEach((n) => n.remove());
    document.head.appendChild(tag);

    // Per-article meta (helps JS-executing crawlers + shows correct tab preview)
    const setMeta = (selector: string, attr: string, key: string, value: string) => {
      if (!value) return;
      let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
      if (!el) {
        el = document.createElement(selector.startsWith("link") ? "link" : "meta") as any;
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute(selector.startsWith("link") ? "href" : "content", value);
    };
    const prevTitle = document.title;
    const snapshot = new Map<string, string | null>();
    const track = (sel: string) => {
      const el = document.head.querySelector(sel);
      snapshot.set(sel, el ? el.getAttribute(sel.startsWith("link") ? "href" : "content") : null);
    };
    ["meta[name='description']","meta[property='og:title']","meta[property='og:description']","meta[property='og:image']","meta[property='og:url']","meta[property='og:type']","meta[name='twitter:title']","meta[name='twitter:description']","meta[name='twitter:image']","link[rel='canonical']"].forEach(track);

    document.title = `${cleanTitle} | إيرام 24`;
    setMeta("meta[name='description']", "name", "description", desc);
    setMeta("meta[property='og:title']", "property", "og:title", cleanTitle);
    setMeta("meta[property='og:description']", "property", "og:description", desc);
    setMeta("meta[property='og:url']", "property", "og:url", url);
    setMeta("meta[property='og:type']", "property", "og:type", "article");
    if (image) setMeta("meta[property='og:image']", "property", "og:image", image);
    setMeta("meta[name='twitter:title']", "name", "twitter:title", cleanTitle);
    setMeta("meta[name='twitter:description']", "name", "twitter:description", desc);
    if (image) setMeta("meta[name='twitter:image']", "name", "twitter:image", image);
    setMeta("link[rel='canonical']", "rel", "canonical", url);

    return () => {
      tag.remove();
      document.title = prevTitle;
      snapshot.forEach((val, sel) => {
        const el = document.head.querySelector(sel);
        if (!el) return;
        const attr = sel.startsWith("link") ? "href" : "content";
        if (val === null) el.removeAttribute(attr);
        else el.setAttribute(attr, val);
      });
    };
  }, [article]);

  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      setLoading(true);
      setRelatedArticles([]);
      setSourceInfo(null);
      setImgError(false);
      const timer = new Promise<{ data: null }>((resolve) => setTimeout(() => resolve({ data: null }), 3500));
      const result = await Promise.race([
        supabase.from("articles").select("*").eq("id", id).maybeSingle(),
        timer,
      ]);
      const data = result.data || getCachedArticleById(id);
      if (data) {
        setArticle(data as any);
        if (!id.startsWith("rss-")) supabase.from("articles").update({ views: (data.views || 0) + 1 }).eq("id", id).then(() => {});
        if (data.source_id && !id.startsWith("rss-")) {
          const { data: src } = await supabase.from("news_sources")
            .select("name, website_url, url, show_source, alt_source_name, alt_source_url")
            .eq("id", data.source_id).maybeSingle();
          if (src) setSourceInfo(src as any);
        }
        if (!id.startsWith("rss-")) {
          const { data: related } = await supabase.from("articles").select("*")
            .eq("category", data.category).eq("language", data.language)
            .neq("id", id).order("published_at", { ascending: false }).limit(6);
          if (related) setRelatedArticles(related as any);
        }
      }
      setLoading(false);
    };
    fetchArticle();
    window.scrollTo({ top: 0 });
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <div className="h-14 glass-strong border-b border-foreground/8" />
        <div className="max-w-screen-md mx-auto p-6 space-y-4 animate-fade-in">
          <div className="h-3 w-24 skeleton-shimmer mx-auto" />
          <div className="h-10 skeleton-shimmer w-full" />
          <div className="h-10 skeleton-shimmer w-3/4 mx-auto" />
          <div className="aspect-[16/9] skeleton-shimmer mt-6" />
          {[...Array(6)].map((_, i) => <div key={i} className="h-4 skeleton-shimmer" style={{ width: `${90 - i * 8}%` }} />)}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6">
        <p className="font-display text-2xl text-foreground/40">المقال غير موجود</p>
        <button onClick={() => navigate("/")} className="px-6 py-2.5 rounded-full bg-[hsl(var(--gold))] text-[hsl(var(--primary-foreground))] text-sm font-bold">
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const isFav = favs.includes(article.id);
  // Share URL — direct link to article
  const shareUrl = `${window.location.origin}/article/${article.id}`;
  const title = decodeHtmlEntities(article.title);
  const shareText = `${title} - إيرام 24\n${shareUrl}`;
  const handleFav = () => { setFavs(toggleFavorite(article.id)); toast.success(isFav ? (isRTL ? "أزيل من المفضلة" : "Removed") : (isRTL ? "أُضيف للمفضلة" : "Saved")); };
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast.success(isRTL ? "تم نسخ الرابط" : "Link copied");
    setTimeout(() => setCopied(false), 2000);
  };
  const handleShareNative = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, text: shareText, url: shareUrl }); } catch {}
    } else handleCopy();
  };

  const decodedDesc = decodeHtmlEntities(article.description || "").trim();
  const decodedContent = decodeHtmlEntities(article.content || "").trim();
  // Prefer content; only fall back to description if there's no content at all
  const rawContent = decodedContent || decodedDesc;
  const structured = parseContentToStructured(rawContent);
  const contentImages = structured.images.filter(img => img && img.length > 10);
  const contentVideos = structured.videos.filter(v => v && v.length > 10);

  // Dedupe: drop paragraphs that are duplicates (normalized) of ones already shown
  const seen = new Set<string>();
  const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
  const uniqueParagraphs = structured.text.filter((p) => {
    const k = norm(p);
    if (k.length < 3 || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const textParagraphs = uniqueParagraphs.length > 0
    ? uniqueParagraphs
    : [(isRTL ? "لا يوجد محتوى إضافي." : "No additional content.")];

  // Hide standfirst if the description is already contained in the body (avoids the
  // "text shown twice" bug the user reported).
  const bodyJoined = norm(uniqueParagraphs.join(" "));
  const descNorm = norm(decodedDesc);
  const descDuplicated = !!descNorm && (
    bodyJoined.includes(descNorm) ||
    (descNorm.length > 40 && bodyJoined.startsWith(descNorm.slice(0, Math.min(descNorm.length, 120))))
  );
  const showStandfirst = !!decodedDesc && !descDuplicated;

  const wordCount = textParagraphs.join(" ").split(/\s+/).length;
  const readMinutes = Math.max(1, Math.round(wordCount / 200));

  const articleShowSource = (article as any).show_source !== false;
  const sourceShowSource = sourceInfo?.show_source !== false;
  const shouldShowSource = articleShowSource && sourceShowSource;
  const displaySourceName = (sourceInfo?.show_source === false && sourceInfo?.alt_source_name)
    ? sourceInfo.alt_source_name : sourceInfo?.name || null;
  const displaySourceUrl = (sourceInfo?.show_source === false && sourceInfo?.alt_source_url)
    ? sourceInfo.alt_source_url : (shouldShowSource ? article.url : null);

  const videoUrl = (article as any).video_url;
  const seoKeywords = (article as any).seo_keywords;
  const keywordsList = seoKeywords ? seoKeywords.split(",").map((k: string) => k.trim()).filter(Boolean) : [];

  const hasHero = !!(article.image_url && !imgError);

  const shareButtons = [
    { name: "WhatsApp", color: "bg-green-600", url: `https://wa.me/?text=${encodeURIComponent(shareText)}` },
    { name: "Telegram", color: "bg-blue-500", url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title + " - إيرام 24")}` },
    { name: "X", color: "bg-foreground/80 text-background", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title + " - إيرام 24")}&url=${encodeURIComponent(shareUrl)}` },
    { name: "Facebook", color: "bg-blue-700", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
  ];

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background animate-fade-in" dir={isRTL ? "rtl" : "ltr"}>
      {/* Reading progress */}
      <div className="reading-progress" style={{ width: `${progress}%` }} />

      {/* Floating top bar */}
      <header className="sticky top-0 z-40 glass-strong border-b border-foreground/8">
        <div className="max-w-screen-lg mx-auto h-14 flex items-center justify-between gap-3 px-4">
          <button onClick={handleBack} className="flex items-center gap-2 px-3 py-2 rounded-full bg-foreground/5 hover:bg-[hsl(var(--gold))]/15 hover:text-[hsl(var(--gold))] transition-colors text-sm">
            <BackIcon size={16} />
            <span className="hidden sm:inline font-bold">{isRTL ? "رجوع" : "Back"}</span>
          </button>
          <span className="font-display text-base text-[hsl(var(--gold))] tracking-wider">
             {isRTL ? "إيرام 24" : "ERAM 24"}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={handleShareNative} aria-label="Share" className="w-9 h-9 rounded-full bg-foreground/5 hover:bg-[hsl(var(--gold))]/15 hover:text-[hsl(var(--gold))] flex items-center justify-center transition-colors">
              <Share2 size={15} />
            </button>
            <button onClick={handleFav} aria-label="Favorite" className="w-9 h-9 rounded-full bg-foreground/5 hover:bg-[hsl(var(--crimson))]/15 flex items-center justify-center transition-colors">
              <Heart size={15} className={isFav ? "fill-[hsl(var(--crimson))] text-[hsl(var(--crimson))]" : ""} />
            </button>
          </div>
        </div>
      </header>

      {/* Cinematic hero image */}
      {hasHero && (
        <figure className="relative -mt-14 w-full overflow-hidden bg-[hsl(var(--navy-deep))]">
          <div className="aspect-[16/10] md:aspect-[21/9] lg:aspect-[21/8] max-h-[80vh] overflow-hidden">
            <LazyImage
              src={proxyImageUrl(normalizeImageUrl(article.image_url!))}
              alt={title}
              className="w-full h-full object-cover animate-kenburns"
              loading="eager"
              onError={() => setImgError(true)}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))] via-[hsl(var(--background))]/40 to-[hsl(var(--background))]/60" />
          <div className="absolute inset-x-0 bottom-0 px-4 md:px-6 pb-8 md:pb-14">
            <div className="max-w-screen-md mx-auto">
              <span className="inline-block text-[10px] md:text-[11px] tracking-[0.3em] uppercase font-bold text-[hsl(var(--gold))] bg-[hsl(var(--navy-deep))]/70 backdrop-blur px-3 py-1.5 rounded-full border border-[hsl(var(--gold))]/30 mb-4">
                {article.category}
              </span>
              <h1 className="font-display text-2xl md:text-4xl lg:text-5xl text-foreground leading-[1.15] max-w-4xl">
                {title}
              </h1>
            </div>
          </div>
        </figure>
      )}

      <article id="main-content" className="max-w-screen-md mx-auto px-4 md:px-6 pt-8 pb-10">
        {/* Breadcrumb */}
        <nav aria-label={isRTL ? "مسار التنقل" : "Breadcrumb"} className="mb-4">
          <ol className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <li><button onClick={() => navigate("/")} className="hover:text-[hsl(var(--gold))] transition-colors">{isRTL ? "الرئيسية" : "Home"}</button></li>
            <li aria-hidden>/</li>
            <li><button onClick={() => navigate(`/categories?c=${encodeURIComponent(article.category)}`)} className="hover:text-[hsl(var(--gold))] transition-colors">{article.category}</button></li>
            <li aria-hidden>/</li>
            <li className="text-foreground/80 truncate max-w-[40vw]">{title}</li>
          </ol>
        </nav>

        {!hasHero && (
          <>
            <div className="text-center mb-5">
              <span className="text-[11px] tracking-[0.3em] uppercase text-[hsl(var(--gold))] font-bold">
                {article.category}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl text-foreground leading-[1.1] text-center mb-6">
              {title}
            </h1>
          </>
        )}

        {/* Standfirst (hidden if already contained in body to prevent duplication) */}
        {showStandfirst && (
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto my-6 font-serif italic">
            {decodedDesc}
          </p>
        )}

        <div className="editorial-rule max-w-[140px] mx-auto my-6" />

        {/* Byline */}
        <div className="flex items-center justify-center gap-4 flex-wrap text-[11px] uppercase tracking-wider text-muted-foreground mb-8">
          {article.author_image_url && (
            <img src={article.author_image_url} alt={article.author_name || ""}
              className="w-8 h-8 rounded-full object-cover border border-[hsl(var(--gold))]/40" />
          )}
          {article.author_name && (
            <span>{isRTL ? "بقلم" : "By"}{" "}
              <span className="text-foreground font-bold">{article.author_name}</span>
            </span>
          )}
          <span className="flex items-center gap-1"><Clock size={11} />{timeAgo(article.published_at, lang)}</span>
          <span className="flex items-center gap-1">{readMinutes} {isRTL ? "د قراءة" : "min"}</span>
          {article.views != null && (
            <span className="flex items-center gap-1"><Eye size={11} />{article.views}</span>
          )}
        </div>

        {/* Video */}
        {videoUrl && (
          <div className="overflow-hidden rounded-xl bg-[hsl(var(--navy-mid))] shadow-luxe mb-8">
            <video src={videoUrl} controls className="w-full max-h-[480px]" preload="metadata" />
          </div>
        )}

        {/* Body */}
        <div className="article-content text-foreground text-[17px] md:text-[19px] leading-[1.95]">
          {contentImages.map((img, i) => (
            <figure key={`ci-${i}`} className="my-8 -mx-2 md:-mx-6">
              <LazyImage src={proxyImageUrl(normalizeImageUrl(img))} alt={`${title} - ${i + 1}`}
                className="w-full object-cover rounded-xl shadow-luxe" />
            </figure>
          ))}
          {contentVideos.map((v, i) => (
            <div key={`cv-${i}`} className="overflow-hidden rounded-xl bg-[hsl(var(--navy-mid))] shadow-luxe my-8">
              <video src={v} controls className="w-full max-h-[450px]" preload="metadata" />
            </div>
          ))}
          {textParagraphs.map((p, i) => (
            <p key={i} className="mb-6 first:first-letter:font-display first:first-letter:text-[3.5em] first:first-letter:text-[hsl(var(--gold))] first:first-letter:float-start first:first-letter:leading-[0.85] first:first-letter:me-3 first:first-letter:mt-1">
              {p}
            </p>
          ))}
        </div>

        {/* Tags */}
        {keywordsList.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center pt-6 mt-8 border-t border-foreground/10">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground me-2">
              {isRTL ? "وسوم" : "Tags"}
            </span>
            {keywordsList.map((tag: string, i: number) => (
              <span key={i} className="text-xs text-foreground/85 bg-foreground/5 border border-foreground/10 hover:border-[hsl(var(--gold))]/50 hover:text-[hsl(var(--gold))] transition-colors px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Source */}
        {displaySourceUrl && !displaySourceUrl.startsWith("#") && (
          <a href={displaySourceUrl} target="_blank" rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--gold))]/30 hover:border-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] transition-all">
            <ExternalLink size={13} />
            {displaySourceName || (isRTL ? "المصدر الرسمي" : "Official Source")}
          </a>
        )}

        {/* Share */}
        <div className="border-t border-foreground/10 pt-8 mt-10">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[hsl(var(--gold))] mb-4">
            {isRTL ? "شارك القصة" : "Share this story"}
          </p>
          <div className="flex flex-wrap gap-2">
            {shareButtons.map(btn => (
              <a key={btn.name} href={btn.url} target="_blank" rel="noopener noreferrer"
                className={`${btn.color} text-white px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-transform hover:scale-105 active:scale-95`}>
                {btn.name}
              </a>
            ))}
            <button onClick={handleCopy}
              className="bg-foreground/10 border border-foreground/15 text-foreground px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95">
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? (isRTL ? "تم النسخ" : "Copied") : (isRTL ? "نسخ الرابط" : "Copy")}
            </button>
          </div>
        </div>
      </article>

      {/* Related */}
      {relatedArticles.length > 0 && (
        <section className="max-w-screen-lg mx-auto px-4 md:px-6 border-t border-foreground/10 mt-6 pt-12 pb-16">
          <div className="mb-6">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[hsl(var(--gold))] mb-1">
              {isRTL ? "للمتابعة" : "Keep reading"}
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground leading-none">
              {isRTL ? "أخبار ذات صلة" : "Related Stories"}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map((ra) => {
              const raTitle = decodeHtmlEntities(ra.title);
              const raHasImage = !!(ra.image_url && ra.image_url.trim());
              return (
                <article key={ra.id} onClick={() => { navigate(`/article/${ra.id}`); }}
                  className="cursor-pointer group" dir={isRTL ? "rtl" : "ltr"}>
                  {raHasImage ? (
                    <div className="aspect-[16/10] overflow-hidden rounded-xl bg-[hsl(var(--navy-mid))] mb-3 shadow-luxe">
                      <LazyImage src={proxyImageUrl(normalizeImageUrl(ra.image_url!))} alt={raTitle}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                  ) : (
                    <div className="h-px bg-foreground/15 mb-3" />
                  )}
                  <span className="text-[9px] tracking-[0.25em] uppercase font-bold text-[hsl(var(--gold))]">{ra.category}</span>
                  <h4 className="font-display text-base md:text-lg text-foreground leading-snug mt-1 line-clamp-3 group-hover:text-[hsl(var(--gold))] transition-colors">{raTitle}</h4>
                  <span className="text-[10px] text-muted-foreground mt-2 block uppercase tracking-wider">{timeAgo(ra.published_at, lang)}</span>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default ArticlePage;
