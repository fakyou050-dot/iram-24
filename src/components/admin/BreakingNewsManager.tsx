import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Zap, Save } from "lucide-react";

const DIRECTIONS = [
  { value: "rtl", label: "يمين ← يسار" },
  { value: "ltr", label: "يسار ← يمين" },
  { value: "ttb", label: "أعلى ← أسفل" },
  { value: "btt", label: "أسفل ← أعلى" },
];

const SEPARATORS = ["●", "•", "|", "—", "⚡", "★", "◆"];

const BreakingNewsManager = () => {
  const [settings, setSettings] = useState<any>(null);
  const [breakingArticles, setBreakingArticles] = useState<any[]>([]);
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [settingsRes, breakingRes, articlesRes] = await Promise.all([
      supabase.from("breaking_news_settings").select("*").limit(1).single(),
      supabase.from("articles").select("id, title, language, is_breaking, breaking_duration").eq("is_breaking", true).order("published_at", { ascending: false }),
      supabase.from("articles").select("id, title, language, is_breaking").order("published_at", { ascending: false }).limit(50),
    ]);
    if (settingsRes.data) setSettings(settingsRes.data);
    setBreakingArticles((breakingRes.data as any[]) || []);
    setAllArticles((articlesRes.data as any[]) || []);
    setLoading(false);
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase.from("breaking_news_settings").update({
      is_active: settings.is_active,
      scroll_speed: settings.scroll_speed,
      scroll_direction: settings.scroll_direction,
      separator_style: settings.separator_style,
      auto_refresh: settings.auto_refresh,
    } as any).eq("id", settings.id);
    if (error) toast.error(error.message);
    else toast.success("تم حفظ الإعدادات");
    setSaving(false);
  };

  const toggleBreaking = async (articleId: string, isBreaking: boolean) => {
    const { error } = await supabase.from("articles").update({
      is_breaking: !isBreaking,
      breaking_duration: !isBreaking ? 60 : null,
    } as any).eq("id", articleId);
    if (error) toast.error(error.message);
    else { toast.success(isBreaking ? "تمت الإزالة من العاجل" : "تمت الإضافة للعاجل"); loadData(); }
  };

  if (loading) return <p className="text-muted-foreground text-sm text-center py-8">جاري التحميل...</p>;

  const previewText = breakingArticles.map(a => a.title).join(` ${settings?.separator_style || "●"} `);

  return (
    <div className="space-y-4">
      <h2 className="text-foreground font-bold">🚨 إدارة الأخبار العاجلة</h2>

      {/* Settings */}
      {settings && (
        <div className="bg-secondary rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-foreground text-sm font-medium">تفعيل الشريط</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.is_active}
                onChange={(e) => setSettings({ ...settings, is_active: e.target.checked })}
                className="sr-only peer" />
              <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-background after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </div>

          <div>
            <label className="text-foreground text-xs mb-1 block">سرعة التمرير: {settings.scroll_speed}s</label>
            <input type="range" min={1} max={30} value={settings.scroll_speed}
              onChange={(e) => setSettings({ ...settings, scroll_speed: +e.target.value })}
              className="w-full accent-primary" />
          </div>

          <div>
            <label className="text-foreground text-xs mb-1 block">اتجاه التمرير</label>
            <div className="grid grid-cols-2 gap-1">
              {DIRECTIONS.map(d => (
                <button key={d.value} onClick={() => setSettings({ ...settings, scroll_direction: d.value })}
                  className={`py-1.5 rounded text-xs ${settings.scroll_direction === d.value ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-foreground text-xs mb-1 block">الفاصل بين الأخبار</label>
            <div className="flex gap-1">
              {SEPARATORS.map(s => (
                <button key={s} onClick={() => setSettings({ ...settings, separator_style: s })}
                  className={`w-8 h-8 rounded flex items-center justify-center text-sm ${settings.separator_style === s ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={settings.auto_refresh}
              onChange={(e) => setSettings({ ...settings, auto_refresh: e.target.checked })}
              className="rounded border-border" />
            <span className="text-foreground text-xs">تحديث تلقائي</span>
          </label>

          {/* Preview */}
          {previewText && (
            <div className="bg-primary rounded-lg py-2 px-3 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="bg-background/20 text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">عاجل</span>
                <div className="overflow-hidden flex-1">
                  <div className="whitespace-nowrap animate-ticker-rtl" style={{ animationDuration: `${settings.scroll_speed * 3}s` }}>
                    <span className="text-primary-foreground text-xs">{previewText}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button onClick={saveSettings} disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            حفظ الإعدادات
          </button>
        </div>
      )}

      {/* Breaking articles */}
      <div className="bg-secondary rounded-lg p-3 space-y-2">
        <p className="text-foreground text-xs font-bold">أخبار في الشريط العاجل ({breakingArticles.length})</p>
        {breakingArticles.map(a => (
          <div key={a.id} className="flex items-center gap-2 bg-card rounded p-2 border border-border">
            <Zap size={12} className="text-yellow-400 shrink-0" />
            <span className="text-foreground text-xs flex-1 truncate">{a.title}</span>
            <button onClick={() => toggleBreaking(a.id, true)} className="text-primary text-[10px] shrink-0">إزالة</button>
          </div>
        ))}
        {breakingArticles.length === 0 && <p className="text-muted-foreground text-xs text-center py-2">لا توجد أخبار عاجلة</p>}
      </div>

      {/* Add from recent articles */}
      <div className="bg-secondary rounded-lg p-3 space-y-2">
        <p className="text-foreground text-xs font-bold">إضافة خبر للشريط العاجل</p>
        <div className="max-h-48 overflow-y-auto space-y-1">
          {allArticles.filter(a => !a.is_breaking).slice(0, 20).map(a => (
            <div key={a.id} className="flex items-center gap-2 bg-card rounded p-2 border border-border">
              <span className="text-foreground text-xs flex-1 truncate">{a.title}</span>
              <button onClick={() => toggleBreaking(a.id, false)} className="text-green-400 text-[10px] shrink-0">+ عاجل</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsManager;
