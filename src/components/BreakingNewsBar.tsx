import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { decodeHtmlEntities } from "@/lib/newsUtils";

const STORAGE_KEY = "eram_breaking_v3";

interface BreakingNewsBarProps {
  language: "AR" | "EN";
  initialHeadlines?: string[];
}

interface BreakingSettings {
  is_active: boolean;
  scroll_speed: number;
  scroll_direction: string;
  separator_style: string;
  auto_refresh: boolean;
}

const DEFAULT_SETTINGS: BreakingSettings = {
  is_active: true,
  scroll_speed: 5,
  scroll_direction: "rtl",
  separator_style: "●",
  auto_refresh: true,
};

async function fetchLatestHeadlines(language: "AR" | "EN", limit = 15): Promise<string[]> {
  try {
    const { data } = await supabase
      .from("articles")
      .select("title")
      .eq("language", language)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (data?.length) {
      return data.map((a) => decodeHtmlEntities(a.title)).filter(Boolean);
    }
  } catch {}
  return [];
}

const BreakingNewsBar = ({ language, initialHeadlines = [] }: BreakingNewsBarProps) => {
  const [headlines, setHeadlines] = useState<string[]>(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(STORAGE_KEY + language) || "[]");
      if (cached.length > 0) return cached;
    } catch {}
    return initialHeadlines.length > 0 ? initialHeadlines : [];
  });
  const [settings] = useState<BreakingSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const latest = await fetchLatestHeadlines(language, 15);
      if (!active) return;
      if (latest.length > 0) {
        setHeadlines(latest);
        try { localStorage.setItem(STORAGE_KEY + language, JSON.stringify(latest)); } catch {}
      }
    };

    // Load immediately
    load();

    // Refresh every 60 seconds
    const interval = setInterval(load, 60_000);
    return () => { active = false; clearInterval(interval); };
  }, [language]);

  // Always render — even with placeholder if no headlines yet
  const displayHeadlines = headlines.length > 0
    ? headlines
    : [
        language === "AR" ? "مرحباً بكم في إيرام 24" : "Welcome to Eram 24",
        language === "AR" ? "أحدث الأخبار لحظة بلحظة" : "Latest news as it happens",
        language === "AR" ? "تابعونا للمزيد" : "Stay tuned for more",
      ];

  const separator = settings.separator_style;
  // Duplicate text for seamless infinite loop
  const text = displayHeadlines.join(`   ${separator}   `) + `   ${separator}   `;
  const isRTL = settings.scroll_direction === "rtl";
  const animationClass = isRTL ? "animate-marquee-rtl" : "animate-marquee-ltr";

  // Speed: ~34 chars/sec, clamped 22s–56s
  const duration = Math.min(56, Math.max(22, Math.round(text.length / 34)));

  return (
    <div className="bg-primary overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center gap-3 px-3 py-1.5">
        <span className="bg-background/20 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1">
          <span className="animate-pulse-live">⚡</span>
          {language === "AR" ? "عاجل" : "BREAKING"}
        </span>
        <div className="overflow-hidden flex-1 min-w-0">
          <div
            className={`flex w-max min-w-full whitespace-nowrap marquee-track ${animationClass}`}
            style={{ ["--marquee-duration" as string]: `${duration}s` }}
          >
            <span className="text-primary-foreground text-xs px-3 shrink-0 min-w-full">{text}</span>
            <span className="text-primary-foreground text-xs px-3 shrink-0 min-w-full" aria-hidden="true">{text}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsBar;
