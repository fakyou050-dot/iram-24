import { Search, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import eramLogo from "@/assets/eram-logo.png";

interface HeaderProps {
  language: "AR" | "EN";
  onLanguageChange: (lang: "AR" | "EN") => void;
  onMenuToggle?: () => void;
  onSearchToggle?: () => void;
}

const Header = ({ language, onLanguageChange, onMenuToggle, onSearchToggle }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border" dir="rtl">
      <div className="flex items-center justify-between h-14 px-3 max-w-screen-xl mx-auto">
        {/* Right: Menu */}
        <button onClick={onMenuToggle} className="p-2 text-foreground hover:text-primary transition-colors shrink-0">
          <Menu size={22} />
        </button>

        {/* Center: Logo */}
        <button onClick={() => navigate("/")} className="flex items-center shrink-0">
          <img src={eramLogo} alt="Eram News" className="h-9 object-contain" />
        </button>

        {/* Left: Search + Language */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={onSearchToggle} className="p-2 text-foreground hover:text-primary transition-colors">
            <Search size={20} />
          </button>
          <div className="flex rounded-lg overflow-hidden border border-border">
            <button
              onClick={() => onLanguageChange("AR")}
              className={`px-2.5 py-1 text-xs font-bold transition-all ${
                language === "AR"
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => onLanguageChange("EN")}
              className={`px-2.5 py-1 text-xs font-bold transition-all ${
                language === "EN"
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
