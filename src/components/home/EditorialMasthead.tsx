import { Search, Menu, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import eramLogo from "@/assets/eram-logo.png";
import { useEffect, useState } from "react";

interface Props {
  language: "AR" | "EN";
  onLanguageChange: (l: "AR" | "EN") => void;
  onMenuToggle?: () => void;
  onSearchToggle?: () => void;
}

const EditorialMasthead = ({ language, onLanguageChange, onMenuToggle, onSearchToggle }: Props) => {
  const navigate = useNavigate();
  const isRTL = language === "AR";
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setTime(d.toLocaleDateString(isRTL ? "ar-SA" : "en-US", opts));
    };
    update();
    const i = setInterval(update, 60_000);
    return () => clearInterval(i);
  }, [isRTL]);

  return (
    <header dir={isRTL ? "rtl" : "ltr"} className="bg-background sticky top-0 z-50">
      {/* Top utility bar — black */}
      <div className="bg-[hsl(var(--ink))] text-white text-[10px] tracking-[0.15em] uppercase">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-1.5">
          <div className="flex items-center gap-2 opacity-80">
            <Calendar size={11} />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onLanguageChange("AR")}
              className={`transition-opacity ${language === "AR" ? "text-[hsl(var(--gold))] opacity-100" : "opacity-60 hover:opacity-100"}`}
            >
              عربي
            </button>
            <span className="opacity-30">|</span>
            <button
              onClick={() => onLanguageChange("EN")}
              className={`transition-opacity ${language === "EN" ? "text-[hsl(var(--gold))] opacity-100" : "opacity-60 hover:opacity-100"}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Masthead — center logo */}
      <div className="border-b-2 border-foreground/10">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          <button onClick={onMenuToggle} className="p-2 hover:text-primary transition-colors">
            <Menu size={22} strokeWidth={2.5} />
          </button>

          <button onClick={() => navigate("/")} className="flex flex-col items-center group">
            <span className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground mb-1 hidden md:block">
              {isRTL ? "الإصدار العربي · يومية" : "Daily Edition"}
            </span>
            <img src={eramLogo} alt="Eram News" className="h-10 md:h-12 object-contain" />
          </button>

          <button onClick={onSearchToggle} className="p-2 hover:text-primary transition-colors">
            <Search size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Decorative gold rule */}
      <div className="editorial-rule" />
    </header>
  );
};

export default EditorialMasthead;
