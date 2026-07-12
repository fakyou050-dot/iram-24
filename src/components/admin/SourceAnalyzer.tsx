import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2, CheckCircle, XCircle, Image, FileText, Clock, Plus } from "lucide-react";
import { toast } from "sonner";

interface AnalysisResult {
  method: string;
  success: boolean;
  articleCount: number;
  quality: number;
  feedUrl: string;
  sampleTitle: string | null;
  hasImages: boolean;
  hasContent: boolean;
  hasDates: boolean;
  error: string | null;
}

const SourceAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [bestIndex, setBestIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResults([]);
    setBestIndex(null);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-source", {
        body: { url: url.trim() },
      });
      if (error) throw error;
      if (data?.success) {
        setResults(data.results || []);
        setBestIndex(data.bestIndex);
      } else {
        toast.error(data?.error || "فشل التحليل");
      }
    } catch (e: any) {
      toast.error(e.message || "حدث خطأ");
    }
    setLoading(false);
  };

  const handleAddSource = async (result: AnalysisResult, index: number) => {
    setSaving(index);
    try {
      const domain = new URL(result.feedUrl).hostname.replace("www.", "");
      const name = domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1);
      
      const { error } = await supabase.from("news_sources").insert({
        name: `${name} (${result.method})`,
        url: result.feedUrl,
        language: "AR",
        is_active: true,
      });
      if (error) {
        if (error.code === "23505") {
          toast.error("هذا المصدر موجود بالفعل");
        } else throw error;
      } else {
        toast.success(`تم إضافة المصدر: ${name}`);
      }
    } catch (e: any) {
      toast.error(e.message || "فشل الحفظ");
    }
    setSaving(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-foreground font-bold">🔎 محلل المصادر الذكي</h2>
      <div className="bg-secondary rounded-lg p-4 space-y-3">
        <p className="text-muted-foreground text-xs">
          أدخل رابط أي موقع إخباري — سيتم تحليل جميع طرق الجلب تلقائياً واختيار الأفضل
        </p>
        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 px-3 py-2 rounded-lg bg-input text-foreground border border-border text-sm"
            dir="ltr"
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !url.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            تحليل
          </button>
        </div>

        {loading && (
          <div className="text-center py-6">
            <Loader2 size={24} className="animate-spin mx-auto text-primary mb-2" />
            <p className="text-muted-foreground text-xs">جاري تحليل الموقع وتجربة جميع الطرق...</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2 mt-2">
            <p className="text-foreground text-sm font-medium">نتائج التحليل ({results.length} طريقة):</p>
            {results.map((r, i) => (
              <div
                key={i}
                className={`rounded-lg p-3 border ${
                  i === bestIndex
                    ? "bg-green-500/10 border-green-500/30"
                    : r.success
                    ? "bg-secondary border-border"
                    : "bg-destructive/5 border-destructive/20 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        i === bestIndex
                          ? "bg-green-500/20 text-green-400"
                          : r.success
                          ? "bg-primary/20 text-primary"
                          : "bg-destructive/20 text-destructive"
                      }`}>
                        #{i + 1}
                      </span>
                      {r.success ? (
                        <CheckCircle size={14} className="text-green-400" />
                      ) : (
                        <XCircle size={14} className="text-destructive" />
                      )}
                      <span className="text-foreground text-sm font-medium">{r.method}</span>
                      {i === bestIndex && (
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">
                          الأفضل ⭐
                        </span>
                      )}
                    </div>

                    {r.success ? (
                      <>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-1">
                          <span className="text-foreground font-medium">{r.articleCount} مقال</span>
                          <span>جودة: {r.quality}%</span>
                          <span className="flex items-center gap-0.5">
                            <Image size={10} className={r.hasImages ? "text-green-400" : "text-muted-foreground"} />
                            صور
                          </span>
                          <span className="flex items-center gap-0.5">
                            <FileText size={10} className={r.hasContent ? "text-green-400" : "text-muted-foreground"} />
                            محتوى
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Clock size={10} className={r.hasDates ? "text-green-400" : "text-muted-foreground"} />
                            تواريخ
                          </span>
                        </div>
                        {r.sampleTitle && (
                          <p className="text-[10px] text-muted-foreground truncate">
                            نموذج: {r.sampleTitle}
                          </p>
                        )}
                        <p className="text-[9px] text-muted-foreground truncate mt-0.5" dir="ltr">
                          {r.feedUrl}
                        </p>
                      </>
                    ) : (
                      <p className="text-[10px] text-destructive">{r.error}</p>
                    )}
                  </div>

                  {r.success && (
                    <button
                      onClick={() => handleAddSource(r, i)}
                      disabled={saving === i}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium shrink-0 disabled:opacity-50"
                    >
                      {saving === i ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Plus size={12} />
                      )}
                      إضافة
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SourceAnalyzer;
