import { ArrowRight, Moon, Sun, Bell, BellOff, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Settings = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem("eram_theme") !== "light");
  const [notifs, setNotifs] = useState(() => localStorage.getItem("eram_notifs") === "true");

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("eram_theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("eram_theme", "light");
    }
  }, [dark]);

  const handleNotifs = async () => {
    if (!notifs) {
      if ("Notification" in window) {
        const perm = await Notification.requestPermission();
        if (perm === "granted") {
          setNotifs(true);
          localStorage.setItem("eram_notifs", "true");
        }
      }
    } else {
      setNotifs(false);
      localStorage.setItem("eram_notifs", "false");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16" dir="rtl">
      <header className="h-14 flex items-center gap-3 px-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="text-foreground"><ArrowRight size={20} /></button>
        <h1 className="text-foreground font-bold">الإعدادات</h1>
      </header>

      <div className="p-4 space-y-3">
        {/* Dark/Light Mode */}
        <button
          onClick={() => setDark(!dark)}
          className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border"
        >
          <div className="flex items-center gap-3">
            {dark ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-primary" />}
            <span className="text-foreground font-medium text-sm">{dark ? "الوضع الداكن" : "الوضع الفاتح"}</span>
          </div>
          <div className={`w-11 h-6 rounded-full p-0.5 transition-colors ${dark ? "bg-primary" : "bg-muted"}`}>
            <div className={`w-5 h-5 bg-background rounded-full transition-transform ${dark ? "translate-x-0" : "-translate-x-5"}`} />
          </div>
        </button>

        {/* Notifications */}
        <button
          onClick={handleNotifs}
          className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border"
        >
          <div className="flex items-center gap-3">
            {notifs ? <Bell size={20} className="text-primary" /> : <BellOff size={20} className="text-muted-foreground" />}
            <span className="text-foreground font-medium text-sm">الإشعارات</span>
          </div>
          <div className={`w-11 h-6 rounded-full p-0.5 transition-colors ${notifs ? "bg-primary" : "bg-muted"}`}>
            <div className={`w-5 h-5 bg-background rounded-full transition-transform ${notifs ? "translate-x-0" : "-translate-x-5"}`} />
          </div>
        </button>

        {/* Editor-in-Chief */}
        <div className="p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center gap-3 mb-2">
            <User size={20} className="text-primary" />
            <span className="text-foreground font-medium text-sm">رئيس التحرير</span>
          </div>
          <p className="text-muted-foreground text-sm pr-8">عبدالملك حميد الكوكباني</p>
        </div>
      </div>

    </div>
  );
};

export default Settings;
