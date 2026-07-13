import { useState } from "react";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { analyzeNews, isAIConfigured } from "@/lib/ai";

const AdminAI = () => {
  const [newsText, setNewsText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!newsText.trim()) return;
    if (!isAIConfigured()) {
      toast.error("مفتاح Gemini غير مُعرّف. أضف VITE_GEMINI_API_KEY في .env");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeNews(newsText.trim());
      setResult(data);
    } catch (e: any) {
      toast.error(e.message || "حدث خطأ");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-foreground font-bold">🤖 محلل الأخبار بالذكاء الاصطناعي</h2>

      {!isAIConfigured() && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2 text-sm">
          <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-500 font-medium">Gemini API غير مُفعّل</p>
            <p className="text-muted-foreground text-xs mt-1">
              أضف <code className="bg-secondary px-1 rounded">VITE_GEMINI_API_KEY</code> في ملف .env
            </p>
          </div>
        </div>
      )}

      <div className="bg-secondary rounded-lg p-4 space-y-3">
        <p className="text-muted-foreground text-xs">ألصق نص الخبر وسيقوم الذكاء الاصطناعي بتحليله كباحث سياسي محترف — مقارنة مع الأخبار المنشورة وتقديم تحليل عميق</p>
        <textarea
          value={newsText}
          onChange={(e) => setNewsText(e.target.value)}
          placeholder="ألصق نص الخبر أو العنوان هنا للتحليل العميق..."
          rows={5}
          className="w-full px-3 py-2 rounded-lg bg-input text-foreground border border-border text-sm resize-y"
        />
        <button onClick={handleAnalyze} disabled={loading || !newsText.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-bold disabled:opacity-50">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {loading ? "جاري التحليل العميق..." : "تحليل وبحث بالذكاء الاصطناعي"}
        </button>

        {result && (
          <div className="bg-card rounded-lg p-4 space-y-4 border border-border">
            {result.betterTitle && (
              <div>
                <p className="text-primary text-xs font-bold mb-1">📝 عنوان مقترح:</p>
                <p className="text-foreground text-sm font-medium">{result.betterTitle}</p>
              </div>
            )}
            {result.category && (
              <div>
                <p className="text-primary text-xs font-bold mb-1">📂 التصنيف:</p>
                <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded">{result.category}</span>
              </div>
            )}
            {result.summary && (
              <div>
                <p className="text-primary text-xs font-bold mb-1">📋 ملخص:</p>
                <p className="text-foreground text-xs leading-relaxed">{result.summary}</p>
              </div>
            )}
            {result.analysis && (
              <div className="border-t border-border pt-3">
                <p className="text-primary text-xs font-bold mb-2">🔬 التحليل العميق:</p>
                <p className="text-foreground text-xs leading-relaxed whitespace-pre-wrap">{result.analysis}</p>
              </div>
            )}
            {result.relatedTopics && result.relatedTopics.length > 0 && (
              <div>
                <p className="text-primary text-xs font-bold mb-1">🔗 مواضيع ذات صلة:</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.relatedTopics.map((t: string, i: number) => (
                    <span key={i} className="bg-secondary text-foreground text-xs px-2 py-0.5 rounded border border-border">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAI;
