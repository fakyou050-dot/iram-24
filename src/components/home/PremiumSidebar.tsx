import { X, Home, Globe, Newspaper, TrendingUp, Trophy, Cpu, Heart, Palette, Radio, Settings, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  language: "AR" | "EN";
  activeCategory: string;
  onCategorySelect: (cat: string) => void;
}

const PremiumSidebar = ({ open, onClose, language, activeCategory, onCategorySelect }: Props) => {
  const navigate = useNavigate();
  const isRTL = language === "AR";

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const arSections = [
    { icon: Home, label: "الرئيسية", cat: "الرئيسية" },
    { icon: Newspaper, label: "سياسة", cat: "سياسة" },
    { icon: TrendingUp, label: "اقتصاد", cat: "اقتصاد" },
    { icon: Trophy, label: "رياضة", cat: "رياضة" },
    { icon: Cpu, label: "تكنولوجيا", cat: "تكنولوجيا" },
    { icon: Sparkles, label: "علوم", cat: "علوم" },
    { icon: Heart, label: "صحة", cat: "صحة" },
    { icon: Palette, label: "ثقافة وفنون", cat: "ثقافة وفنون" },
    { icon: Globe, label: "مجتمع", cat: "مجتمع" },
    { icon: Newspaper, label: "مقالات", cat: "مقالات" },
    { icon: Sparkles, label: "منوعات", cat: "منوعات" },
  ];

  const enSections = [
    { icon: Home, label: "Home", cat: "Home" },
    { icon: Newspaper, label: "Politics", cat: "Politics" },
    { icon: TrendingUp, label: "Economy", cat: "Economy" },
    { icon: Trophy, label: "Sports", cat: "Sports" },
    { icon: Cpu, label: "Technology", cat: "Technology" },
    { icon: Sparkles, label: "Science", cat: "Science" },
    { icon: Heart, label: "Health", cat: "Health" },
    { icon: Palette, label: "Arts", cat: "Arts" },
    { icon: Globe, label: "Society", cat: "Society" },
    { icon: Newspaper, label: "Articles", cat: "Articles" },
    { icon: Sparkles, label: "Lifestyle", cat: "Lifestyle" },
  ];

  const sections = isRTL ? arSections : enSections;
  const side = isRTL ? "right-0" : "left-0";
  const slideAnim = isRTL ? "animate-slide-in-right" : "animate-slide-in-left";

  if (!open) return null;

  return (
    <>
      {/* Backdrop with cinematic blur */}
      <div
        className="fixed inset-0 z-[90] animate-fade-in"
        onClick={onClose}
        style={{
          background: "radial-gradient(circle at center, hsl(var(--navy-deep) / 0.7), hsl(var(--navy-deep) / 0.95))",
          backdropFilter: "blur(16px) saturate(140%)",
          WebkitBackdropFilter: "blur(16px) saturate(140%)",
        }}
      />

      {/* Sidebar panel */}
      <aside
        dir={isRTL ? "rtl" : "ltr"}
        className={`fixed top-0 ${side} h-full w-[88vw] max-w-[360px] z-[91] flex flex-col shadow-luxe ${slideAnim}`}
        style={{
          background: "linear-gradient(180deg, hsl(220 50% 5%) 0%, hsl(220 45% 7%) 100%)",
          borderInlineStart: isRTL ? "none" : "1px solid hsl(var(--gold) / 0.2)",
          borderInlineEnd: isRTL ? "1px solid hsl(var(--gold) / 0.2)" : "none",
        }}
      >
        {/* Decorative gold strip */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent" />

        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-foreground/8">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(var(--gold))] font-bold">
                {isRTL ? "إيرام برس" : "ERAM PRESS"}
              </p>
              <h2 className="font-display text-2xl text-foreground mt-1">
                {isRTL ? "استكشف" : "Explore"}
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-foreground/5 hover:bg-[hsl(var(--gold))]/15 transition-all active:scale-90"
            >
              <X size={18} className="text-foreground" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground px-3 mb-2 font-bold">
            {isRTL ? "الأقسام" : "Sections"}
          </p>
          <div className="space-y-0.5">
            {sections.map(({ icon: Icon, label, cat }, idx) => {
              const isActive = activeCategory === cat;
              const Chevron = isRTL ? ChevronLeft : ChevronRight;
              return (
                <button
                  key={cat}
                  onClick={() => { onCategorySelect(cat); onClose(); }}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  className={`animate-fade-up group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${
                    isActive
                      ? "bg-gradient-to-r from-[hsl(var(--gold))]/20 to-transparent text-[hsl(var(--gold))]"
                      : "text-foreground/85 hover:bg-foreground/5 hover:text-[hsl(var(--gold))]"
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? "bg-[hsl(var(--gold))]/20" : "bg-foreground/5 group-hover:bg-[hsl(var(--gold))]/15"
                  }`}>
                    <Icon size={15} strokeWidth={2.25} />
                  </span>
                  <span className="font-bold flex-1 text-start">{label}</span>
                  <Chevron size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>

          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground px-3 mt-6 mb-2 font-bold">
            {isRTL ? "اكتشف المزيد" : "More"}
          </p>
          <div className="space-y-0.5">
            {[
              { icon: Heart, label: isRTL ? "المفضلة" : "Favorites", path: "/favorites" },
              { icon: Radio, label: isRTL ? "البث المباشر" : "Live Radio", path: "/radio" },
              { icon: Settings, label: isRTL ? "الإعدادات" : "Settings", path: "/settings" },
            ].map(({ icon: Icon, label, path }) => (
              <button
                key={path}
                onClick={() => { navigate(path); onClose(); }}
                className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/85 hover:bg-foreground/5 hover:text-[hsl(var(--gold))] transition-all text-sm"
              >
                <span className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center group-hover:bg-[hsl(var(--gold))]/15 transition-colors">
                  <Icon size={15} strokeWidth={2.25} />
                </span>
                <span className="font-bold flex-1 text-start">{label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-foreground/8">
          <p className="text-[10px] text-muted-foreground tracking-wider">
            © {new Date().getFullYear()} ERAM PRESS · {isRTL ? "كل الحقوق محفوظة" : "All rights reserved"}
          </p>
        </div>
      </aside>
    </>
  );
};

export default PremiumSidebar;
