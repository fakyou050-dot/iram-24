import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { autoFetchNews } from "@/lib/autoFetch";
import { RefreshCw, CheckCircle, Eraser, AlertTriangle } from "lucide-react";

const FetchControl = () => {
  const [settings, setSettings] = useState<any>(null);
  const [fetching, setFetching] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [fnAvailable, setFnAvailable] = useState<boolean | null>(null);

  const loadSettings = async () => {
    const { data } = await supabase.from("fetch_settings").select("*").limit(1).single();
    if (data) setSettings(data);
  };

  useEffect(() => {
    loadSettings();
    // Check if Edge Function is available
    supabase.functions.invoke("fetch-news").then(r => {
      setFnAvailable(!r.error);
    }).catch(() => setFnAvailable(false));
  }, []);

  const handleFetchNow = async () => {
    setFetching(true);
    setResult(null);
    try {
      // Try Edge Function first
      const res = await supabase.functions.invoke("fetch-news");
      if (res.data && !res.error) {
        setResult(`تم جلب ${res.data.count || 0} مقال جديد`);
        setFetching(false);
        loadSettings();
        return;
      }
    } catch {/* Edge Function not available */}

    // Fallback: client-side fetch
    try {
      const count = await autoFetchNews();
      if (count > 0) {
        setResult(`تم جلب ${count} مقال جديد عبر الجلب المباشر`);
      } else {
        setResult("لا توجد مقالات جديدة حالياً أو لم يحن وقت الجلب بعد");
      }
    } catch {
      setResult("حدث خطأ أثناء الجلب");
    }
    setFetching(false);
    loadSettings();
  };

  const handleCleanupDuplicates = async () => {
    setCleaning(true);
    setResult(null);
    try {
      const res = await supabase.functions.invoke("fetch-news", {
        body: { action: "cleanup_duplicates" },
      });
      if (res.data && !res.error) {
        setResult(`تم حذف ${res.data.removedCount || 0} خبر مكرر ضمن ${res.data.duplicateGroups || 0} مجموعة`);
      } else {
        setResult("⚠️ خدمة التنظيف غير متاحة حالياً");
      }
    } catch {
      setResult("⚠️ خدمة التنظيف غير متاحة حالياً");
    }
    setCleaning(false);
    loadSettings();
  };

  if (!settings) return <p className="text-muted-foreground text-sm">جاري التحميل...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-foreground font-bold">التحكم بالجلب التلقائي</h2>

      {fnAvailable === false && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2 text-sm">
          <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-500 font-medium">Edge Functions غير منشرة</p>
            <p className="text-muted-foreground text-xs mt-1">لتفعيل الجلب التلقائي، أنشر Edge Functions من Supabase Dashboard أو CLI</p>
          </div>
        </div>
      )}

      <div className="bg-secondary rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 bg-accent/20 text-foreground p-3 rounded-lg text-sm border border-border">
          <CheckCircle size={16} className="text-primary" />
          <span>
            {settings.auto_fetch_enabled
              ? `الجلب التلقائي مفعّل — كل ${settings.fetch_interval} ساعة`
              : "الجلب التلقائي معطّل"}
          </span>
        </div>

        <button onClick={handleFetchNow} disabled={fetching}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-bold disabled:opacity-50">
          <RefreshCw size={16} className={fetching ? "animate-spin" : ""} />
          {fetching ? "جاري الجلب..." : "جلب يدوي الآن"}
        </button>

        <button onClick={handleCleanupDuplicates} disabled={cleaning}
          className="w-full flex items-center justify-center gap-2 py-3 bg-card text-foreground rounded-lg text-sm font-bold border border-border disabled:opacity-50">
          <Eraser size={16} className={cleaning ? "animate-pulse" : ""} />
          {cleaning ? "جاري فحص وتنظيف المكرر..." : "تنظيف الأخبار المكررة"}
        </button>

        {result && (
          <p className="text-center text-sm text-foreground bg-secondary border border-border py-2 rounded-lg">{result}</p>
        )}
      </div>

      <div className="bg-secondary rounded-lg p-4 space-y-2">
        <h3 className="text-foreground text-sm font-medium">حالة الجلب</h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-muted-foreground">آخر جلب:</span>
            <p className="text-foreground">{settings.last_fetch_time ? new Date(settings.last_fetch_time).toLocaleString("ar") : "لم يتم بعد"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">عدد المقالات:</span>
            <p className="text-foreground">{settings.last_fetch_count || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FetchControl;
