import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Bug, RefreshCw, Search, Loader2, CheckCircle2, AlertTriangle, XCircle, Globe, Rss, Wrench } from "lucide-react";
import { toast } from "sonner";

interface TestResult {
  name: string;
  status: "pass" | "warning" | "fail";
  message: string;
  code?: number;
}

interface DebugResult {
  success: boolean;
  tests: Record<string, TestResult>;
  suggestions: string[];
}

interface RssCandidate {
  url: string;
  items: number;
  status: string;
}

interface SourceItem {
  id: string;
  name: string;
  url: string;
  feed_url: string | null;
  fetch_type: string;
  is_active: boolean;
  last_fetch_status: string | null;
  last_fetch: string | null;
}

const SourceDebugger = () => {
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [results, setResults] = useState<Record<string, DebugResult>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [fixing, setFixing] = useState<Record<string, boolean>>({});
  const [allLoading, setAllLoading] = useState(false);
  const [allFixing, setAllFixing] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fix dialog state
  const [fixDialog, setFixDialog] = useState<{
    open: boolean;
    sourceId: string;
    sourceName: string;
    currentUrl: string;
    candidates: RssCandidate[];
    selectedUrl: string;
  }>({ open: false, sourceId: "", sourceName: "", currentUrl: "", candidates: [], selectedUrl: "" });

  useEffect(() => { fetchSources(); }, []);

  const fetchSources = async () => {
    setFetching(true);
    const { data } = await supabase.from("news_sources").select("id, name, url, feed_url, fetch_type, is_active, last_fetch_status, last_fetch").order("name");
    setSources(data || []);
    setFetching(false);
  };

  const testSource = async (source: SourceItem) => {
    setLoading((p) => ({ ...p, [source.id]: true }));
    try {
      const testUrl = source.feed_url || source.url;
      const { data, error } = await supabase.functions.invoke("debug-source", {
        body: { url: testUrl, fetch_type: source.fetch_type },
      });
      if (error) throw error;
      setResults((p) => ({ ...p, [source.id]: data as DebugResult }));
    } catch (err: any) {
      setResults((p) => ({
        ...p,
        [source.id]: {
          success: false,
          tests: { connection: { name: "فحص الاتصال", status: "fail", message: `خطأ: ${err.message}` } },
          suggestions: ["تحقق من اتصال الإنترنت أو أعد المحاولة"],
        },
      }));
    }
    setLoading((p) => ({ ...p, [source.id]: false }));
  };

  const testAllSources = async () => {
    setAllLoading(true);
    for (const source of sources) {
      await testSource(source);
      await new Promise((r) => setTimeout(r, 600));
    }
    setAllLoading(false);
  };

  const needsFix = (source: SourceItem, result?: DebugResult): boolean => {
    if (!result) return false;
    const statuses = Object.values(result.tests).map((t) => t.status);
    return statuses.includes("fail");
  };

  const findRssFix = async (source: SourceItem) => {
    setFixing((p) => ({ ...p, [source.id]: true }));
    try {
      const baseUrl = source.feed_url || source.url;
      const { data, error } = await supabase.functions.invoke("debug-source", {
        body: { url: baseUrl, action: "find_rss" },
      });
      if (error) throw error;

      const candidates: RssCandidate[] = data?.candidates || [];
      if (candidates.length > 0) {
        setFixDialog({
          open: true,
          sourceId: source.id,
          sourceName: source.name,
          currentUrl: source.feed_url || source.url,
          candidates,
          selectedUrl: candidates[0].url,
        });
      } else {
        toast.error(`لم يتم العثور على رابط RSS بديل لـ "${source.name}"`);
      }
    } catch (err: any) {
      toast.error(`خطأ أثناء البحث: ${err.message}`);
    }
    setFixing((p) => ({ ...p, [source.id]: false }));
  };

  const applyFix = async () => {
    const { sourceId, selectedUrl } = fixDialog;
    try {
      const { error } = await supabase.from("news_sources").update({
        feed_url: selectedUrl,
        last_fetch: null,
        last_fetch_status: "pending",
      }).eq("id", sourceId);

      if (error) throw error;

      toast.success("تم تحديث رابط المصدر بنجاح!");
      setFixDialog((p) => ({ ...p, open: false }));
      await fetchSources();
      // Re-test the fixed source
      const updatedSource = sources.find((s) => s.id === sourceId);
      if (updatedSource) {
        await testSource({ ...updatedSource, feed_url: selectedUrl });
      }
    } catch (err: any) {
      toast.error(`خطأ أثناء التحديث: ${err.message}`);
    }
  };

  const fixAllFailed = async () => {
    setAllFixing(true);
    const failedRss = sources.filter((s) => {
      const r = results[s.id];
      return s.fetch_type === "rss" && needsFix(s, r);
    });

    let fixed = 0;
    let notFixed = 0;

    for (const source of failedRss) {
      try {
        const baseUrl = source.feed_url || source.url;
        const { data } = await supabase.functions.invoke("debug-source", {
          body: { url: baseUrl, action: "find_rss" },
        });
        const candidates: RssCandidate[] = data?.candidates || [];
        if (candidates.length > 0) {
          await supabase.from("news_sources").update({
            feed_url: candidates[0].url,
            last_fetch: null,
            last_fetch_status: "pending",
          }).eq("id", source.id);
          fixed++;
        } else {
          notFixed++;
        }
      } catch {
        notFixed++;
      }
      await new Promise((r) => setTimeout(r, 800));
    }

    toast.success(`تم إصلاح ${fixed} مصدر، ${notFixed} لم يتم إصلاحه`);
    await fetchSources();
    setAllFixing(false);
  };

  const getOverallStatus = (result?: DebugResult) => {
    if (!result) return "unknown";
    const statuses = Object.values(result.tests).map((t) => t.status);
    if (statuses.includes("fail")) return "fail";
    if (statuses.includes("warning")) return "warning";
    return "pass";
  };

  const statusIcon = (status: string) => {
    if (status === "pass") return <CheckCircle2 className="text-green-500" size={16} />;
    if (status === "warning") return <AlertTriangle className="text-orange-500" size={16} />;
    if (status === "fail") return <XCircle className="text-red-500" size={16} />;
    return null;
  };

  const statusBorder = (status: string) => {
    if (status === "pass") return "border-r-4 border-r-green-500";
    if (status === "warning") return "border-r-4 border-r-orange-500";
    if (status === "fail") return "border-r-4 border-r-red-500";
    return "";
  };

  const testedCount = Object.keys(results).length;
  const passCount = Object.values(results).filter((r) => getOverallStatus(r) === "pass").length;
  const warnCount = Object.values(results).filter((r) => getOverallStatus(r) === "warning").length;
  const failCount = Object.values(results).filter((r) => getOverallStatus(r) === "fail").length;

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
        <span className="mr-2 text-muted-foreground">جاري تحميل المصادر...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Bug className="text-primary" size={20} />
          <h2 className="text-foreground font-bold text-lg">مصحح المصادر</h2>
          <span className="text-xs text-muted-foreground">({sources.length} مصدر)</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={testAllSources} disabled={allLoading || allFixing} size="sm">
            {allLoading ? <Loader2 className="animate-spin ml-1" size={14} /> : <Search size={14} className="ml-1" />}
            فحص الكل
          </Button>
          {failCount > 0 && (
            <Button onClick={fixAllFailed} disabled={allFixing || allLoading} size="sm" variant="outline" className="text-orange-600 border-orange-300">
              {allFixing ? <Loader2 className="animate-spin ml-1" size={14} /> : <Wrench size={14} className="ml-1" />}
              إصلاح الكل ({failCount})
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      {testedCount > 0 && (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{passCount}</div>
            <div className="text-xs text-green-700">سليم</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">{warnCount}</div>
            <div className="text-xs text-orange-700">تحذير</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{failCount}</div>
            <div className="text-xs text-red-700">فاشل</div>
          </div>
        </div>
      )}

      {/* Source cards */}
      <div className="grid gap-3">
        {sources.map((source) => {
          const result = results[source.id];
          const overall = getOverallStatus(result);
          const isLoading = loading[source.id];
          const isFixing = fixing[source.id];
          const canFix = needsFix(source, result);

          return (
            <Card key={source.id} className={result ? statusBorder(overall) : ""}>
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {source.fetch_type === "rss" ? <Rss size={14} className="text-muted-foreground flex-shrink-0" /> : <Globe size={14} className="text-muted-foreground flex-shrink-0" />}
                    <CardTitle className="text-sm truncate">{source.name}</CardTitle>
                    {!source.is_active && <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">معطل</span>}
                    {source.last_fetch_status === "failed" && <span className="text-[10px] bg-red-500/10 text-red-600 px-1.5 py-0.5 rounded">failed</span>}
                    {result && statusIcon(overall)}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {canFix && (
                      <Button variant="outline" size="sm" onClick={() => findRssFix(source)} disabled={isFixing} className="text-xs h-7 px-2 text-orange-600 border-orange-300">
                        {isFixing ? <Loader2 className="animate-spin" size={12} /> : <Wrench size={12} />}
                        <span className="mr-1">إصلاح</span>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => testSource(source)} disabled={isLoading} className="text-xs h-7 px-2">
                      {isLoading ? <Loader2 className="animate-spin" size={12} /> : <RefreshCw size={12} />}
                      <span className="mr-1">اختبار</span>
                    </Button>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono truncate mt-1" dir="ltr">
                  {source.feed_url || source.url}
                </p>
              </CardHeader>

              {result && (
                <CardContent className="p-3 pt-0 space-y-2">
                  {Object.entries(result.tests).map(([key, test]) => (
                    <div key={key} className={`p-2 rounded text-xs ${
                      test.status === "pass" ? "bg-green-500/5 border border-green-500/20"
                        : test.status === "warning" ? "bg-orange-500/5 border border-orange-500/20"
                        : "bg-red-500/5 border border-red-500/20"
                    }`}>
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        {statusIcon(test.status)}
                        {test.name}
                      </div>
                      <p className="text-muted-foreground mt-0.5">{test.message}</p>
                    </div>
                  ))}
                  {result.suggestions.length > 0 && (
                    <div className="bg-orange-500/5 border border-orange-500/20 rounded p-2">
                      <p className="text-xs font-bold text-orange-700 mb-1">💡 الحلول المقترحة:</p>
                      <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
                        {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                </CardContent>
              )}

              {!result && !isLoading && (
                <CardContent className="p-3 pt-0">
                  <p className="text-xs text-muted-foreground text-center py-2">اضغط "اختبار" لفحص هذا المصدر</p>
                </CardContent>
              )}

              {isLoading && !result && (
                <CardContent className="p-3 pt-0">
                  <div className="flex items-center justify-center gap-2 py-3">
                    <Loader2 className="animate-spin text-primary" size={16} />
                    <span className="text-xs text-muted-foreground">جاري الفحص...</span>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Fix Confirmation Dialog */}
      <Dialog open={fixDialog.open} onOpenChange={(open) => setFixDialog((p) => ({ ...p, open }))}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench size={18} className="text-orange-500" />
              إصلاح مصدر: {fixDialog.sourceName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm">
              <span className="text-muted-foreground">الرابط الحالي:</span>
              <p className="font-mono text-xs bg-red-500/5 border border-red-500/20 rounded p-2 mt-1 break-all" dir="ltr">
                {fixDialog.currentUrl}
              </p>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">الروابط البديلة المكتشفة:</span>
              <div className="space-y-2 mt-1">
                {fixDialog.candidates.map((c) => (
                  <label
                    key={c.url}
                    className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
                      fixDialog.selectedUrl === c.url
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="fix-url"
                      checked={fixDialog.selectedUrl === c.url}
                      onChange={() => setFixDialog((p) => ({ ...p, selectedUrl: c.url }))}
                      className="accent-primary"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs break-all" dir="ltr">{c.url}</p>
                      <p className="text-xs text-green-600 mt-0.5">✓ {c.items} مقال</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setFixDialog((p) => ({ ...p, open: false }))}>إلغاء</Button>
            <Button onClick={applyFix} disabled={!fixDialog.selectedUrl}>تحديث الرابط</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SourceDebugger;
