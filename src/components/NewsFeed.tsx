import { useState, useEffect, useMemo } from "react";
import { useArticles } from "@/hooks/useArticles";
import { AR_CATEGORIES, EN_CATEGORIES, decodeHtmlEntities } from "@/lib/newsUtils";
import BreakingNewsBar from "@/components/BreakingNewsBar";
import WhatsAppButton from "@/components/WhatsAppButton";
import SearchOverlay from "@/components/SearchOverlay";
import ManualArticlesSection from "@/components/ManualArticlesSection";
import PremiumHeader from "@/components/home/PremiumHeader";
import PremiumSidebar from "@/components/home/PremiumSidebar";
import CategoryRail from "@/components/home/CategoryRail";
import CinematicHero from "@/components/home/CinematicHero";
import PremiumSkeleton from "@/components/home/PremiumSkeleton";
import EditorialSection from "@/components/home/EditorialSection";
import LiveTicker from "@/components/home/LiveTicker";
import MarketTicker from "@/components/home/MarketTicker";
import SiteFooter from "@/components/home/SiteFooter";
import NewsCard from "@/components/NewsCard";
import { ChevronLeft, ChevronRight, TrendingUp, Flame, Star } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PAGE_SIZE = 24;
const HOME_PAGE_SIZE = 39;

const NewsFeed = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const savedPos = sessionStorage.getItem("eram_feed_scroll");
    if (savedPos) {
      setTimeout(() => window.scrollTo(0, parseInt(savedPos)), 50);
      sessionStorage.removeItem("eram_feed_scroll");
    }
  }, []);

  const saveScroll = () => sessionStorage.setItem("eram_feed_scroll", String(window.scrollY));

  const [language, setLanguage] = useState<"AR" | "EN">(
    () => (localStorage.getItem("eram_lang") as "AR" | "EN") || "AR"
  );
  const categories = language === "AR" ? AR_CATEGORIES : EN_CATEGORIES;
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const setPage = (p: number) => {
    setSearchParams({ page: String(p) }, { replace: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [showSearch, setShowSearch] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const isHome = activeCategory === "الرئيسية" || activeCategory === "Home";
  const pageSize = isHome ? HOME_PAGE_SIZE : PAGE_SIZE;
  const fetchLimit = pageSize * page + 1;
  const { articles, loading } = useArticles(language, activeCategory, fetchLimit);

  const startIdx = (page - 1) * pageSize;
  const pageArticles = articles.slice(startIdx, startIdx + pageSize);
  const hasMore = articles.length > startIdx + pageSize;
  const totalEstimated = articles.length;
  const isRTL = language === "AR";
  const tickerHeadlines = useMemo(
    () => articles.slice(0, 10).map((article) => decodeHtmlEntities(article.title)).filter(Boolean),
    [articles]
  );

  const buckets = useMemo(() => {
    const m: Record<string, typeof articles> = {};
    for (const a of pageArticles) (m[a.category] ||= []).push(a);
    return m;
  }, [pageArticles]);

  const onLang = (l: "AR" | "EN") => {
    setLanguage(l);
    localStorage.setItem("eram_lang", l);
    const cats = l === "AR" ? AR_CATEGORIES : EN_CATEGORIES;
    setActiveCategory(cats[0]);
    setSearchParams({ page: "1" }, { replace: true });
  };
  const onCat = (c: string) => {
    setActiveCategory(c);
    setSearchParams({ page: "1" }, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.max(Math.ceil(totalEstimated / pageSize), page + (hasMore ? 1 : 0));
  const renderPagination = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) for (let i = 1; i <= totalPages; i++) pages.push(i);
    else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
    const NextIcon = isRTL ? ChevronLeft : ChevronRight;
    return (
      <div className="py-12 border-t border-foreground/10 mt-6">
        <p className="text-center text-muted-foreground text-[10px] tracking-[0.3em] uppercase mb-5">
          {isRTL ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
        </p>
        <div className="flex items-center justify-center gap-1.5 flex-wrap" dir={isRTL ? "rtl" : "ltr"}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="h-10 px-4 text-[11px] font-bold uppercase tracking-wider rounded-full bg-foreground/5 border border-foreground/10 disabled:opacity-30 hover:bg-[hsl(var(--gold))]/15 hover:text-[hsl(var(--gold))] hover:border-[hsl(var(--gold))]/30 transition-all flex items-center gap-1"
          >
            <PrevIcon size={14} />
            {isRTL ? "السابق" : "Prev"}
          </button>
          {pages.map((p, i) =>
            p === "..." ? (
              <span key={`e${i}`} className="w-8 text-center text-muted-foreground">…</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 font-display text-sm rounded-full transition-all ${
                  page === p
                    ? "bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(38_72%_48%)] text-[hsl(var(--primary-foreground))] shadow-glow"
                    : "bg-foreground/5 border border-foreground/10 text-foreground hover:bg-[hsl(var(--gold))]/15"
                }`}
              >
                {p}
              </button>
            )
          )}
          <button
            onClick={() => setPage(page + 1)}
            disabled={!hasMore}
            className="h-10 px-4 text-[11px] font-bold uppercase tracking-wider rounded-full bg-foreground/5 border border-foreground/10 disabled:opacity-30 hover:bg-[hsl(var(--gold))]/15 hover:text-[hsl(var(--gold))] hover:border-[hsl(var(--gold))]/30 transition-all flex items-center gap-1"
          >
            {isRTL ? "التالي" : "Next"}
            <NextIcon size={14} />
          </button>
        </div>
      </div>
    );
  };

  // HOME LAYOUT — Cinematic Premium
  const renderHome = () => {
    const source = pageArticles;
    const top = source.slice(0, 5);
    const sportsKey = isRTL ? "رياضة" : "Sports";
    const econKey = isRTL ? "اقتصاد" : "Economy";
    const techKey = isRTL ? "تكنولوجيا" : "Technology";
    const worldKey = isRTL ? "سياسة" : "Politics";
    const healthKey = isRTL ? "صحة" : "Health";

    const mostRead = [...source].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6);
    const trending = source.slice(5, 11);
    const editorPicks = source.filter(a => a.image_url).slice(11, 15);
    const recent = source.slice(15, 39);

    return (
      <>
        <CinematicHero articles={top} language={language} onBeforeNavigate={saveScroll} />

        {/* Trending strip */}
        {trending.length > 0 && (
          <section className="mb-12 animate-fade-up">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[hsl(var(--gold))]/15 flex items-center justify-center">
                  <Flame size={18} className="text-[hsl(var(--gold))]" />
                </span>
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[hsl(var(--gold))] font-bold">
                    {isRTL ? "الأكثر تداولاً" : "Trending"}
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl text-foreground leading-none mt-0.5">
                    {isRTL ? "ضجة اليوم" : "Buzzing now"}
                  </h2>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {trending.map((a) => (
                <NewsCard key={a.id} article={a} language={language} variant="medium" onBeforeNavigate={saveScroll} />
              ))}
            </div>
          </section>
        )}

        {/* Two-column: World feature + Most Read */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <EditorialSection
              title={isRTL ? "الشأن السياسي" : "Politics"}
              subtitle={isRTL ? "تغطية شاملة" : "Coverage"}
              articles={buckets[worldKey] || []}
              language={language}
              variant="feature"
              onMore={() => onCat(worldKey)}
              onBeforeNavigate={saveScroll}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-[hsl(var(--gold))]/40">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-[hsl(var(--gold))]" />
                <h3 className="font-display text-xl text-foreground leading-none">
                  {isRTL ? "الأكثر قراءة" : "Most Read"}
                </h3>
              </div>
            </div>
            <div className="space-y-1">
              {mostRead.map((a, i) => (
                <div key={a.id} className="flex gap-3 items-start py-3 border-b border-foreground/8 last:border-0 group cursor-pointer" onClick={() => { saveScroll(); navigate(`/article/${a.id}`); }}>
                  <span className="font-display text-3xl text-[hsl(var(--gold))]/50 leading-none w-8 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] tracking-[0.25em] uppercase font-bold text-[hsl(var(--gold))]">{a.category}</span>
                    <h4 className="font-display text-sm leading-snug text-foreground line-clamp-3 mt-1 group-hover:text-[hsl(var(--gold))] transition-colors">
                      {decodeHtmlEntities(a.title)}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editor's Picks band */}
        {editorPicks.length > 0 && (
          <section className="mb-12 -mx-4 md:-mx-6 px-4 md:px-6 py-10 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, hsl(220 45% 8%) 0%, hsl(220 40% 5%) 100%)" }}>
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/50 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/50 to-transparent" />
            <div className="max-w-screen-xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Star size={20} className="text-[hsl(var(--gold))]" fill="currentColor" />
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[hsl(var(--gold))] font-bold">
                    {isRTL ? "اختيار المحررين" : "Editor's Picks"}
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl text-foreground leading-none mt-0.5">
                    {isRTL ? "ما يجب أن تقرأه اليوم" : "Don't miss today"}
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {editorPicks.map((a) => (
                  <NewsCard key={a.id} article={a} language={language} variant="featured" onBeforeNavigate={saveScroll} />
                ))}
              </div>
            </div>
          </section>
        )}

        <EditorialSection
          title={isRTL ? "اقتصاد وأعمال" : "Business"}
          subtitle={isRTL ? "أسواق ومال" : "Markets"}
          articles={buckets[econKey] || []}
          language={language}
          variant="wide"
          onMore={() => onCat(econKey)}
          onBeforeNavigate={saveScroll}
        />

        <EditorialSection
          title={isRTL ? "الرياضة" : "Sports"}
          subtitle={isRTL ? "ميادين وأبطال" : "Game on"}
          articles={buckets[sportsKey] || []}
          language={language}
          variant="feature"
          onMore={() => onCat(sportsKey)}
          onBeforeNavigate={saveScroll}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <EditorialSection
            title={isRTL ? "تكنولوجيا" : "Tech"}
            subtitle={isRTL ? "ابتكار" : "Innovation"}
            articles={buckets[techKey] || []}
            language={language}
            variant="trio"
            onMore={() => onCat(techKey)}
            onBeforeNavigate={saveScroll}
          />
          <EditorialSection
            title={isRTL ? "صحة" : "Health"}
            subtitle={isRTL ? "علم وحياة" : "Wellness"}
            articles={buckets[healthKey] || []}
            language={language}
            variant="trio"
            onMore={() => onCat(healthKey)}
            onBeforeNavigate={saveScroll}
          />
        </div>

        {/* Latest grid */}
        <section className="py-10 mt-8 border-t border-foreground/10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[hsl(var(--gold))] mb-1">
                {isRTL ? "تحديثات" : "Latest"}
              </p>
              <h2 className="font-display text-2xl md:text-4xl text-foreground leading-none">
                {isRTL ? "أحدث القصص" : "Latest Stories"}
              </h2>
            </div>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
            {recent.map((a, i) => (
              <div key={a.id} style={{ animationDelay: `${(i % 8) * 50}ms` }} className="animate-fade-up">
                <NewsCard article={a} language={language} variant="medium" onBeforeNavigate={saveScroll} />
              </div>
            ))}
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {showSearch && <SearchOverlay language={language} onClose={() => setShowSearch(false)} />}
      <PremiumSidebar
        open={showSidebar}
        onClose={() => setShowSidebar(false)}
        language={language}
        activeCategory={activeCategory}
        onCategorySelect={onCat}
      />

      <PremiumHeader
        language={language}
        onLanguageChange={onLang}
        onMenuToggle={() => setShowSidebar(true)}
        onSearchToggle={() => setShowSearch(true)}
      />
      <CategoryRail
        categories={categories}
        active={activeCategory}
        onSelect={onCat}
        language={language}
      />
      {!loading && articles.length > 0 && isHome && page === 1 && (
        <LiveTicker articles={articles.slice(0, 10)} language={language} onBeforeNavigate={saveScroll} />
      )}
      <MarketTicker language={language} />
      <BreakingNewsBar
        language={language}
        initialHeadlines={tickerHeadlines}
      />


      <main className="max-w-screen-xl mx-auto px-4 md:px-6" style={{ minHeight: "60vh" }}>
        {loading && articles.length === 0 ? (
          <PremiumSkeleton />
        ) : pageArticles.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-display text-3xl text-foreground/30">
              {isRTL ? "لا توجد أخبار" : "No stories"}
            </p>
          </div>
        ) : isHome ? (
          renderHome()
        ) : (
          <section className="py-10">
            <div className="flex items-end justify-between mb-6 pb-4 border-b-2 border-[hsl(var(--gold))]/40">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[hsl(var(--gold))] font-bold mb-1">
                  {isRTL ? "قسم" : "Section"}
                </p>
                <h2 className="font-display text-3xl md:text-5xl text-foreground leading-none">
                  {activeCategory}
                </h2>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {totalEstimated}+ {isRTL ? "قصة" : "stories"}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
              {pageArticles.map((a, i) => (
                <div key={a.id} style={{ animationDelay: `${(i % 8) * 40}ms` }} className="animate-fade-up">
                  <NewsCard article={a} language={language} variant="medium" onBeforeNavigate={saveScroll} />
                </div>
              ))}
            </div>
          </section>
        )}

        {!loading && pageArticles.length > 0 && (hasMore || page > 1) && renderPagination()}
      </main>

      <ManualArticlesSection language={language} />
      <SiteFooter language={language} categories={categories} onCategorySelect={onCat} />
      <WhatsAppButton />
    </div>
  );
};

export default NewsFeed;
