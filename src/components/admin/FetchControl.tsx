import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, CheckCircle, Eraser } from "lucide-react";

const FetchControl = () => {
  const [settings, setSettings] = useState<any>(null);
  const [fetching, setFetching] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const loadSettings = async () => {
    const { data } = await supabase.from("fetch_settings").select("*").limit(1).single();
    if (data) setSettings(data);
  };

  useEffect(() => { loadSettings(); }, []);

  const handleFetchNow = async () => {
    setFetching(true);
    setResult(null);
    try {
      const res = await supabase.functions.invoke("fetch-news");
      if (res.data) {
        setResult(`تم جلب ${res.data.count || 0} مقال جديد`);
      } else {
        setResult("حدث خطأ أثناء الجلب");
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

      if (res.data) {
        setResult(`تم حذف ${res.data.removedCount || 0} خبر مكرر ضمن ${res.data.duplicateGroups || 0} مجموعة`);
      } else {
        setResult("تعذر تنظيف الأخبار المكررة");
      }
    } catch {
      setResult("تعذر تنظيف الأخبار المكررة");
    }
    setCleaning(false);
    loadSettings();
  };

  if (!settings) return <p className="text-muted-foreground text-sm">جاري التحميل...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-foreground font-bold">التحكم بالجلب التلقائي</h2>

      <div className="bg-secondary rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 bg-accent/20 text-foreground p-3 rounded-lg text-sm border border-border">
          <CheckCircle size={16} className="text-primary" />
          <span>الجلب التلقائي مفعّل — يعمل كل دقيقتين عبر مجدول الخادم (Cron Job)</span>
        </div>

        <button onClick={handleFetchNow} disabled={fetching}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-bold disabled:opacity-50">
          <RefreshCw size={16} className={fetching ? "animate-spin" : ""} />
          {fetching ? "جاري الجلب..." : "جلب يدوي الآن"}
        </button>

        <button
          onClick={handleCleanupDuplicates}
          disabled={cleaning}
          className="w-full flex items-center justify-center gap-2 py-3 bg-card text-foreground rounded-lg text-sm font-bold border border-border disabled:opacity-50"
        >
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
