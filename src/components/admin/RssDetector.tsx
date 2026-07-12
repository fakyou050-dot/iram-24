import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus, Loader2, ExternalLink } from "lucide-react";

interface DetectedFeed {
  title: string;
  url: string;
  type: string;
}

interface RssDetectorProps {
  onAddSource: (url: string, name: string) => void;
}

const RssDetector = ({ onAddSource }: RssDetectorProps) => {
  const [url, setUrl] = useState("");
  const [feeds, setFeeds] = useState<DetectedFeed[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDetect = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setFeeds([]);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("detect-rss", {
        body: { url: url.trim() },
      });
      if (fnError) throw fnError;
      if (data?.success && data.feeds?.length > 0) {
        setFeeds(data.feeds);
      } else if (data?.feeds?.length === 0) {
        setError("لم يتم العثور على أي RSS في هذا الموقع");
      } else {
        setError(data?.error || "حدث خطأ");
      }
    } catch (e: any) {
      setError(e.message || "حدث خطأ أثناء الفحص");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-foreground font-bold">🔍 كاشف RSS</h2>
      <div className="bg-secondary rounded-lg p-4 space-y-3">
        <p className="text-muted-foreground text-xs">أدخل رابط أي موقع إخباري لاكتشاف روابط RSS المتاحة</p>
        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 px-3 py-2 rounded-lg bg-input text-foreground border border-border text-sm"
            dir="ltr"
            onKeyDown={(e) => e.key === "Enter" && handleDetect()}
          />
          <button
            onClick={handleDetect}
            disabled={loading || !url.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            فحص
          </button>
        </div>

        {error && (
          <p className="text-sm text-primary bg-primary/10 py-2 px-3 rounded-lg">{error}</p>
        )}

        {feeds.length > 0 && (
          <div className="space-y-2">
            <p className="text-foreground text-sm font-medium">تم العثور على {feeds.length} رابط RSS:</p>
            {feeds.map((feed, i) => (
              <div key={i} className="bg-card rounded-lg p-3 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium truncate">{feed.title}</p>
                  <p className="text-muted-foreground text-[10px] truncate" dir="ltr">{feed.url}</p>
                  <span className="text-[10px] text-primary">{feed.type}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a href={feed.url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-muted-foreground hover:text-foreground">
                    <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={() => onAddSource(feed.url, feed.title)}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium"
                  >
                    <Plus size={12} /> إضافة
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RssDetector;
