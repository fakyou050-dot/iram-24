import { Home, Grid3X3, Heart, Settings, Radio } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    { icon: Settings, label: "الإعدادات", path: "/settings" },
    { icon: Radio, label: "راديو", path: "/radio" },
    { icon: Heart, label: "المفضلة", path: "/favorites" },
    { icon: Grid3X3, label: "الأقسام", path: "/categories" },
    { icon: Home, label: "الرئيسية", path: "/" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50">
      <div className="flex items-center justify-around py-2" dir="rtl">
        {tabs.map(({ icon: Icon, label, path }) => {
          const isActive = path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] ${isActive ? "font-bold" : ""}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
