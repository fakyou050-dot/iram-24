import { X, Home, Newspaper, TrendingUp, Dribbble, Cpu, Heart as HeartIcon, Palette, FileText, Settings, Shield, FlaskConical, Users, Sparkles, Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  language: "AR" | "EN";
  onCategorySelect: (cat: string) => void;
}

const Sidebar = ({ open, onClose, language, onCategorySelect }: SidebarProps) => {
  const navigate = useNavigate();

  const arSections = [
    { icon: Home, label: "الرئيسية", cat: "الرئيسية" },
    { icon: Landmark, label: "سياسة", cat: "سياسة" },
    { icon: TrendingUp, label: "اقتصاد", cat: "اقتصاد" },
    { icon: Dribbble, label: "رياضة", cat: "رياضة" },
    { icon: Cpu, label: "تكنولوجيا", cat: "تكنولوجيا" },
    { icon: FlaskConical, label: "علوم", cat: "علوم" },
    { icon: HeartIcon, label: "صحة", cat: "صحة" },
    { icon: Palette, label: "ثقافة وفنون", cat: "ثقافة وفنون" },
    { icon: Users, label: "مجتمع", cat: "مجتمع" },
    { icon: FileText, label: "مقالات", cat: "مقالات" },
    { icon: Sparkles, label: "منوعات", cat: "منوعات" },
  ];

  const enSections = [
    { icon: Home, label: "Home", cat: "Home" },
    { icon: Landmark, label: "Politics", cat: "Politics" },
    { icon: TrendingUp, label: "Economy", cat: "Economy" },
    { icon: Dribbble, label: "Sports", cat: "Sports" },
    { icon: Cpu, label: "Technology", cat: "Technology" },
    { icon: FlaskConical, label: "Science", cat: "Science" },
    { icon: HeartIcon, label: "Health", cat: "Health" },
    { icon: Palette, label: "Arts", cat: "Arts" },
    { icon: Users, label: "Society", cat: "Society" },
    { icon: FileText, label: "Articles", cat: "Articles" },
    { icon: Sparkles, label: "Lifestyle", cat: "Lifestyle" },
  ];

  const sections = language === "AR" ? arSections : enSections;

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[90]" onClick={onClose} />
      
      {/* Sidebar panel */}
      <div
        className={`fixed top-0 ${language === "AR" ? "right-0" : "left-0"} h-full w-72 bg-card/95 backdrop-blur-md border-border z-[91] shadow-2xl flex flex-col`}
        dir={language === "AR" ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-foreground font-bold">{language === "AR" ? "الأقسام" : "Sections"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {sections.map(({ icon: Icon, label, cat }) => (
            <button
              key={cat}
              onClick={() => { onCategorySelect(cat); onClose(); }}
              className="w-full flex items-center gap-3 px-5 py-3 text-foreground hover:bg-accent transition-colors text-sm"
            >
              <Icon size={18} className="text-primary shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="border-t border-border p-3 space-y-1">
          <button onClick={() => { navigate("/favorites"); onClose(); }}
            className="w-full flex items-center gap-3 px-5 py-2.5 text-foreground hover:bg-accent transition-colors text-sm rounded-lg">
            <HeartIcon size={18} className="text-primary" />
            {language === "AR" ? "المفضلة" : "Favorites"}
          </button>
          <button onClick={() => { navigate("/settings"); onClose(); }}
            className="w-full flex items-center gap-3 px-5 py-2.5 text-foreground hover:bg-accent transition-colors text-sm rounded-lg">
            <Settings size={18} className="text-primary" />
            {language === "AR" ? "الإعدادات" : "Settings"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
