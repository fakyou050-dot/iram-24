import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { autoFetchNews } from "@/lib/autoFetch";
import { RefreshCw, CheckCircle, Eraser, AlertTriangle, Clock, Zap, Database, Globe } from "lucide-react";
import { toast } from "sonner";

interface FetchResult {
  source: string;
  status: string;
  count: number;
  error?: string;
}

const FetchControl = () => {
  const [settings, setSettings] = useState<any>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [fetchDetails, setFetchDetails] = useState<FetchResult[]>([]);
  const [fnAvailable, setFnAvailable] = useState<boolean | null>(null);
  const [fetchingSource, setFetchingSource] = useState<string | null>(null);

  const loadSettings = async () => {
    const { data } = await supabase.from("fetch_settings").select("*").limit(1).single();
    if (data) setSettings(data);
  };

  const loadSources = async () => {
    const { data } = await supabase
      .from("news_sources")
      .select("id, name, language, is_active, last_fetch, last_fetch_status, article_count")
      .order("created_at", { ascending: false });
    if (data) setSources(data);
  };

  useEffect(() => {
    loadSettings();
    loadSources();
    // Check if Edge Function is available
    supabase.functions
      .invoke("fetch-news", { body: { action: "ping" } })
      .then((r) => {
        setFnAvailable(!r.error);
      })
      .catch(() => setFnAvailable(false));
  }, []);

  const handleFetchAll = async () => {
    setFetching(true);
    setResult(null);
    setFetchDetails([]);

    try {
      // Try Edge Function first
      const res = await supabase.functions.invoke("fetch-news");
      if (res.data && !res.error) {
        const count = res.data.count || 0;
        setResult(`تم جلب ${count} مقال جديد من ${res.data.sources_processed || 0} مصدر`);
        if (res.data.details) setFetchDetails(res.data.details);
        setFetching(false);
        loadSettings();
        loadSources();
        toast.success(`تم جلب ${count} مقال جديد`);
        return;
      }
    } catch {
      /* Edge Function not available */
    }

    // Fallback: client-side fetch
    try {
      const count = await autoFetchNews();
      if (count > 0) {
        setResult(`تم جلب ${count} مقال جديد عبر الجلب المباشر`);
        toast.success(`تم جلب ${count} مقال`);
      } else {
        setResult("لا توجد مقالات جديدة حالياً");
      }
    } catch {
      setResult("حدث خطأ أثناء الجلب");
      toast.error("فشل الجلب");
    }
    setFetching(false);
    loadSettings();
    loadSources();
  };

  const handleFetchSource = async (sourceId: string, sourceName: string) => {
    setFetchingSource(sourceId);
    try {
      const res = await supabase.functions.invoke("fetch-news", {
        body: { source_id: sourceId },
      });
      if (res.data && !res.error) {
        toast.success(`${sourceName}: تم جلب ${res.data.count || 0} مقال`);
      } else {
        toast.error(`${sourceName}: فشل الجلب`);
      }
    } catch {
      toast.error(`${sourceName}: Edge Function غير متاحة`);
    }
    setFetchingSource(null);
    loadSettings();
    loadSources();
  };

  const handleCleanupDuplicates = async () => {
    setCleaning(true);
    setResult(null);
    try {
      const res = await supabase.functions.invoke("fetch-news", {
        body: { action: "cleanup_duplicates" },
      });
      if (res.data && !res.error) {
        setResult(`تم حذف ${res.data.removedCount || 0} خبر مكرر`);
        toast.success(`تم تنظيف ${res.data.removedCount || 0} مكرر`);
      } else {
        setResult("⚠️ خدمة التنظيف غير متاحة حالياً");
      }
    } catch {
      setResult("⚠️ خدمة التنظيف غير متاحة حالياً");
    }
    setCleaning(false);
    loadSettings();
  };

  const handleToggleAutoFetch = async () => {
    if (!settings) return;
    const newValue = !settings.auto_fetch_enabled;
    await supabase
      .from("fetch_settings")
      .update({ auto_fetch_enabled: newValue })
      .eq("id", settings.id);
    loadSettings();
    toast.success(newValue ? "تم تفعيل الجلب التلقائي" : "تم تعطيل الجلب التلقائي");
  };

  const handleSetInterval = async (hours: number) => {
    if (!settings) return;
    await supabase
      .from("fetch_settings")
      .update({ fetch_interval: hours })
      .eq("id", settings.id);
    loadSettings();
    toast.success(`تم تحديث الفترة الزمنية إلى ${hours} ساعة`);
  };

  if (!settings) return <p className="text-muted-foreground text-sm">جاري التحميل...</p>;

  const activeSources = sources.filter((s) => s.is_active);
  const lastFetchTime = settings.last_fetch_time ? new Date(settings.last_fetch_time) : null;
  const timeSinceLastFetch = lastFetchTime
    ? Math.floor((Date.now() - lastFetchTime.getTime()) / 1000 / 60)
    : null;

  return (
    <div className="space-y-4">
      <h2 className="text-foreground font-bold text-lg">التحكم بالجلب التلقائي</h2>

      {/* Edge Function Status */}
      {fnAvailable === false && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2 text-sm">
          <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-500 font-medium">Edge Functions غير منشرة</p>
            <p className="text-muted-foreground text-xs mt-1">
              الجلب التلقائي يعمل من المتصفح فقط. لتفعيله على السيرفر، أنشر Edge Function{" "}
              <code className="bg-muted px-1 rounded">fetch-news</code> من Supabase Dashboard
            </p>
          </div>
        </div>
      )}

      {fnAvailable === true && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-start gap-2 text-sm">
          <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-green-500 font-medium">Edge Function متاحة</p>
            <p className="text-muted-foreground text-xs mt-1">الجلب يعمل من السيرفر بشكل موثوق</p>
          </div>
        </div>
      )}

      {/* Status Overview */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-secondary rounded-lg p-3 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Clock size={12} />
            آخر جلب
          </div>
          <p className="text-foreground font-bold text-sm">
            {lastFetchTime
              ? `${timeSinceLastFetch} دقيقة مضت`
              : "لم يتم بعد"}
          </p>
        </div>
        <div className="bg-secondary rounded-lg p-3 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Database size={12} />
            آخر نتيجة
          </div>
          <p className="text-foreground font-bold text-sm">
            {settings.last_fetch_count || 0} مقال
          </p>
        </div>
        <div className="bg-secondary rounded-lg p-3 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Globe size={12} />
            المصادر النشطة
          </div>
          <p className="text-foreground font-bold text-sm">{activeSources.length} مصدر</p>
        </div>
        <div className="bg-secondary rounded-lg p-3 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Zap size={12} />
            الحالة
          </div>
          <p className={`font-bold text-sm ${settings.auto_fetch_enabled ? "text-green-500" : "text-red-500"}`}>
            {settings.auto_fetch_enabled ? "مفعّل" : "معطّل"}
          </p>
        </div>
      </div>

      {/* Auto-fetch Toggle & Interval */}
      <div className="bg-secondary rounded-lg p-4 space-y-3 border border-border">
        <div className="flex items-center justify-between">
          <span className="text-foreground text-sm font-medium">الجلب التلقائي</span>
          <button
            onClick={handleToggleAutoFetch}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
              settings.auto_fetch_enabled ? "bg-primary" : "bg-muted"
            }`}
          >
            <div
              className={`w-5 h-5 bg-background rounded-full transition-transform ${
                settings.auto_fetch_enabled ? "translate-x-0" : "-translate-x-5"
              }`}
            />
          </button>
        </div>

        {settings.auto_fetch_enabled && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">كل:</span>
            {[1, 2, 4, 6, 12].map((h) => (
              <button
                key={h}
                onClick={() => handleSetInterval(h)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  settings.fetch_interval === h
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {h}س
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fetch All Button */}
      <button
        onClick={handleFetchAll}
        disabled={fetching}
        className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-bold disabled:opacity-50 transition-all hover:brightness-110"
      >
        <RefreshCw size={16} className={fetching ? "animate-spin" : ""} />
        {fetching ? "جاري الجلب من جميع المصادر..." : "جلب من جميع المصادر الآن"}
      </button>

      {/* Result */}
      {result && (
        <div className="bg-secondary rounded-lg p-3 border border-border text-sm text-foreground">
          {result}
        </div>
      )}

      {/* Fetch Details */}
      {fetchDetails.length > 0 && (
        <div className="bg-secondary rounded-lg p-3 border border-border">
          <h3 className="text-foreground font-medium text-sm mb-2">تفاصيل الجلب:</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {fetchDetails.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-border last:border-0">
                <span className="text-foreground">{d.source}</span>
                <span className={d.status === "success" ? "text-green-500" : "text-red-500"}>
                  {d.status === "success" ? `${d.count} مقال` : d.error || "فشل"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-source fetch */}
      <div className="bg-secondary rounded-lg p-4 border border-border">
        <h3 className="text-foreground font-medium text-sm mb-3">الجلب من مصدر محدد:</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {sources.map((source) => (
            <div
              key={source.id}
              className="flex items-center justify-between py-2 px-3 bg-background rounded-lg border border-border"
            >
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-sm font-medium truncate">{source.name}</p>
                <p className="text-muted-foreground text-xs">
                  {source.language} • {source.is_active ? "نشط" : "معطّل"} •{" "}
                  {source.article_count || 0} مقال
                </p>
                {source.last_fetch && (
                  <p className="text-muted-foreground text-xs">
                    آخر جلب: {new Date(source.last_fetch).toLocaleString("ar")}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleFetchSource(source.id, source.name)}
                disabled={fetchingSource === source.id || !source.is_active}
                className="shrink-0 p-2 text-primary hover:bg-primary/10 rounded-lg disabled:opacity-30 transition-colors"
              >
                <RefreshCw
                  size={14}
                  className={fetchingSource === source.id ? "animate-spin" : ""}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cleanup */}
      <button
        onClick={handleCleanupDuplicates}
        disabled={cleaning}
        className="w-full flex items-center justify-center gap-2 py-3 bg-card text-foreground rounded-lg text-sm font-bold border border-border disabled:opacity-50 transition-colors hover:bg-muted"
      >
        <Eraser size={16} className={cleaning ? "animate-pulse" : ""} />
        {cleaning ? "جاري فحص وتنظيف المكرر..." : "تنظيف الأخبار المكررة"}
      </button>
    </div>
  );
};

export default FetchControl;
