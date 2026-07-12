import { Search, Menu, Radio } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRadio } from "@/contexts/RadioContext";

interface Props {
  language: "AR" | "EN";
  onLanguageChange: (l: "AR" | "EN") => void;
  onMenuToggle: () => void;
  onSearchToggle: () => void;
  scrolled?: boolean;
}

const PremiumHeader = ({ language, onLanguageChange, onMenuToggle, onSearchToggle }: Props) => {
  const navigate = useNavigate();
  const { openSheet } = useRadio();
  const isRTL = language === "AR";
  const [scrolled, setScrolled] = useState(false);
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const d = new Date();
    setDateLabel(
      d.toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    );
  }, [isRTL]);

  return (
    <header
      dir={isRTL ? "rtl" : "ltr"}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong border-b border-foreground/8 shadow-luxe"
          : "bg-transparent"
      }`}
    >
      {/* Hairline gold */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent opacity-60" />

      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 gap-3">
          {/* Menu */}
          <button
            onClick={onMenuToggle}
            aria-label="Open menu"
            className="group relative w-11 h-11 flex items-center justify-center rounded-full bg-foreground/5 hover:bg-[hsl(var(--gold))]/15 transition-all active:scale-90"
          >
            <Menu size={20} className="text-foreground group-hover:text-[hsl(var(--gold))] transition-colors" strokeWidth={2.25} />
          </button>

          {/* Center wordmark */}
          <button onClick={() => navigate("/")} className="flex items-center gap-3 group min-w-0" aria-label="إيرام 24">
            <div className="flex items-baseline gap-[2px] leading-none">
              <span
                className="font-display text-[26px] md:text-[32px] font-black tracking-tight text-foreground transition-colors group-hover:text-[hsl(var(--gold))]"
                style={{ letterSpacing: "-0.01em" }}
              >
                {isRTL ? "إيرام" : "ERAM"}
              </span>
              <span
                className="font-display text-[26px] md:text-[32px] font-black bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(38_72%_48%)] bg-clip-text text-transparent"
                style={{ letterSpacing: "-0.02em" }}
              >
                24
              </span>
            </div>
            <div className="hidden md:flex flex-col leading-tight border-s border-foreground/15 ps-3">
              <span className="text-[10px] tracking-[0.35em] uppercase text-[hsl(var(--gold))] font-bold">
                {isRTL ? "نبض الحدث" : "PULSE OF NEWS"}
              </span>
              <span className="text-[10px] text-muted-foreground tracking-wider">
                {dateLabel}
              </span>
            </div>
          </button>

          {/* Right: Live + Lang + Search */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Live broadcast button */}
            <button
              onClick={() => openSheet()}
              aria-label={isRTL ? "البث المباشر" : "Live Radio"}
              className="group relative flex items-center gap-1.5 px-2.5 md:px-3 h-9 md:h-10 rounded-full bg-[hsl(var(--crimson))]/12 border border-[hsl(var(--crimson))]/35 hover:bg-[hsl(var(--crimson))]/25 transition-all active:scale-95"
            >
              <span className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-2 w-2 rounded-full bg-[hsl(var(--crimson))] opacity-75 animate-ping" />
                <Radio size={14} className="text-[hsl(var(--crimson))] relative" strokeWidth={2.5} />
              </span>
              <span className="hidden sm:inline text-[10px] md:text-[11px] font-black tracking-[0.18em] uppercase text-[hsl(var(--crimson))]">
                {isRTL ? "مباشر" : "LIVE"}
              </span>
            </button>

            {/* Premium language pill */}
            <div className="relative flex items-center bg-foreground/5 rounded-full p-1 border border-foreground/10">
              <span
                className={`absolute top-1 bottom-1 w-[44%] rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(38_72%_48%)] shadow-glow transition-all duration-500 ease-out ${
                  language === "AR" ? (isRTL ? "right-1" : "left-1") : (isRTL ? "right-[52%]" : "left-[52%]")
                }`}
                aria-hidden
              />
              <button
                onClick={() => onLanguageChange("AR")}
                className={`relative z-10 px-2.5 py-1.5 text-[11px] font-bold tracking-wider transition-colors ${
                  language === "AR" ? "text-[hsl(var(--primary-foreground))]" : "text-muted-foreground"
                }`}
              >
                AR
              </button>
              <button
                onClick={() => onLanguageChange("EN")}
                className={`relative z-10 px-2.5 py-1.5 text-[11px] font-bold tracking-wider transition-colors ${
                  language === "EN" ? "text-[hsl(var(--primary-foreground))]" : "text-muted-foreground"
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={onSearchToggle}
              aria-label="Search"
              className="group w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-foreground/5 hover:bg-[hsl(var(--gold))]/15 transition-all active:scale-90"
            >
              <Search size={18} className="text-foreground group-hover:text-[hsl(var(--gold))] transition-colors" strokeWidth={2.25} />

            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PremiumHeader;
