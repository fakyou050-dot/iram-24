import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Eye, TrendingUp, Newspaper, Rss, Globe, Zap, Clock } from "lucide-react";
import { categoryStyle } from "@/lib/categoryColors";

interface Stats {
  totalViews: number;
  todayViews: number;
  weekViews: number;
  totalArticles: number;
  todayArticles: number;
  weekArticles: number;
  manualArticles: number;
  rssArticles: number;
  sourcesCount: number;
  arCount: number;
  enCount: number;
  topArticles: { id: string; title: string; views: number; category: string }[];
  byCategory: { category: string; count: number }[];
  bySource: { name: string; count: number }[];
  byHour: number[]; // 24 buckets
}

const fmt = (n: number) => n.toLocaleString("ar-EG");

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const today = new Date(now); today.setHours(0, 0, 0, 0);
        const week = new Date(now.getTime() - 7 * 86400_000);

        const [viewsAll, viewsToday, articlesAll, articlesToday, articlesWeek,
               manualCnt, rssCnt, sourcesCnt, arCnt, enCnt, top, byCat, bySrc, recent] =
          await Promise.all([
            supabase.from("page_views").select("id", { count: "exact", head: true }),
            supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", today.toISOString()),
            supabase.from("articles").select("id", { count: "exact", head: true }),
            supabase.from("articles").select("id", { count: "exact", head: true }).gte("created_at", today.toISOString()),
            supabase.from("articles").select("id", { count: "exact", head: true }).gte("created_at", week.toISOString()),
            supabase.from("articles").select("id", { count: "exact", head: true }).eq("is_manual", true),
            supabase.from("articles").select("id", { count: "exact", head: true }).eq("is_manual", false),
            supabase.from("news_sources").select("id", { count: "exact", head: true }),
            supabase.from("articles").select("id", { count: "exact", head: true }).eq("language", "AR"),
            supabase.from("articles").select("id", { count: "exact", head: true }).eq("language", "EN"),
            supabase.from("articles").select("id,title,views,category").order("views", { ascending: false }).limit(10),
            supabase.from("articles").select("category").gte("created_at", week.toISOString()).limit(1000),
            supabase.from("articles").select("source_id, news_sources(name)").gte("created_at", week.toISOString()).limit(1000),
            supabase.from("articles").select("created_at").gte("created_at", new Date(now.getTime() - 86400_000).toISOString()).limit(2000),
          ]);

        // Category breakdown
        const catMap = new Map<string, number>();
        ((byCat.data as { category: string }[]) || []).forEach(r => {
          catMap.set(r.category, (catMap.get(r.category) || 0) + 1);
        });

        // Source breakdown
        const srcMap = new Map<string, number>();
        ((bySrc.data as { news_sources?: { name?: string } | null }[]) || []).forEach(r => {
          const n = r?.news_sources?.name || "غير معروف";
          srcMap.set(n, (srcMap.get(n) || 0) + 1);
        });

        // Hourly histogram (last 24h)
        const hours = new Array(24).fill(0);
        ((recent.data as { created_at: string }[]) || []).forEach(r => {
          const h = new Date(r.created_at).getHours();
          hours[h]++;
        });

        setStats({
          totalViews: viewsAll.count || 0,
          todayViews: viewsToday.count || 0,
          weekViews: 0,
          totalArticles: articlesAll.count || 0,
          todayArticles: articlesToday.count || 0,
          weekArticles: articlesWeek.count || 0,
          manualArticles: manualCnt.count || 0,
          rssArticles: rssCnt.count || 0,
          sourcesCount: sourcesCnt.count || 0,
          arCount: arCnt.count || 0,
          enCount: enCnt.count || 0,
          topArticles: (top.data as Stats["topArticles"]) || [],
          byCategory: [...catMap.entries()].sort((a, b) => b[1] - a[1]).map(([category, count]) => ({ category, count })),
          bySource: [...srcMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, count })),
          byHour: hours,
        });
      } catch (e) {
        console.error("analytics", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="text-muted-foreground text-sm py-8 text-center">جاري تحميل الإحصائيات...</div>;
  }
  if (!stats) {
    return <div className="text-muted-foreground text-sm py-8 text-center">تعذّر جلب الإحصائيات الآن. جرّب لاحقاً.</div>;
  }

  const kpis = [
    { label: "إجمالي المشاهدات", value: stats.totalViews, icon: Eye, color: "text-primary" },
    { label: "مشاهدات اليوم", value: stats.todayViews, icon: TrendingUp, color: "text-green-400" },
    { label: "إجمالي المقالات", value: stats.totalArticles, icon: Newspaper, color: "text-amber-400" },
    { label: "مقالات اليوم", value: stats.todayArticles, icon: Zap, color: "text-cyan-400" },
    { label: "هذا الأسبوع", value: stats.weekArticles, icon: Clock, color: "text-violet-400" },
    { label: "يدوي / RSS", value: `${fmt(stats.manualArticles)} / ${fmt(stats.rssArticles)}`, icon: Rss, color: "text-pink-400" },
    { label: "المصادر النشطة", value: stats.sourcesCount, icon: Globe, color: "text-emerald-400" },
    { label: "AR / EN", value: `${fmt(stats.arCount)} / ${fmt(stats.enCount)}`, icon: BarChart3, color: "text-orange-400" },
  ];

  const maxHour = Math.max(1, ...stats.byHour);
  const maxCat = Math.max(1, ...stats.byCategory.map(c => c.count));
  const maxSrc = Math.max(1, ...stats.bySource.map(s => s.count));

  return (
    <div className="space-y-5">
      <h2 className="text-foreground font-bold text-lg">لوحة الإحصائيات الاحترافية</h2>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-secondary rounded-lg p-3 text-center">
            <Icon size={18} className={`mx-auto mb-1 ${color}`} />
            <p className="text-foreground text-base font-bold">{typeof value === "number" ? fmt(value) : value}</p>
            <p className="text-muted-foreground text-[10px] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Hourly activity */}
      <div className="bg-secondary rounded-lg p-4">
        <h3 className="text-foreground text-sm font-bold mb-3">نشاط آخر 24 ساعة (نشر)</h3>
        <div className="flex items-end gap-1 h-24" dir="ltr">
          {stats.byHour.map((v, h) => (
            <div key={h} className="flex-1 flex flex-col items-center justify-end" title={`${h}:00 — ${v} مقال`}>
              <div
                className="w-full rounded-t bg-gradient-to-t from-[hsl(var(--gold))]/40 to-[hsl(var(--gold))]"
                style={{ height: `${(v / maxHour) * 100}%`, minHeight: v > 0 ? "4px" : "1px" }}
              />
              {h % 3 === 0 && <span className="text-[8px] text-muted-foreground mt-1">{h}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Category distribution */}
      {stats.byCategory.length > 0 && (
        <div className="bg-secondary rounded-lg p-4">
          <h3 className="text-foreground text-sm font-bold mb-3">توزيع الأخبار حسب القسم (آخر أسبوع)</h3>
          <div className="space-y-2">
            {stats.byCategory.slice(0, 10).map((c) => {
              const s = categoryStyle(c.category);
              return (
                <div key={c.category} className="flex items-center gap-2 text-xs">
                  <span className="text-foreground w-24 truncate">{c.category}</span>
                  <div className="flex-1 h-3 rounded-full bg-background/60 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(c.count / maxCat) * 100}%`, background: s.gradient }} />
                  </div>
                  <span className="text-muted-foreground w-10 text-end">{fmt(c.count)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top sources */}
      {stats.bySource.length > 0 && (
        <div className="bg-secondary rounded-lg p-4">
          <h3 className="text-foreground text-sm font-bold mb-3">أعلى المصادر إنتاجاً (آخر أسبوع)</h3>
          <div className="space-y-2">
            {stats.bySource.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <span className="text-foreground w-28 truncate">{s.name}</span>
                <div className="flex-1 h-2 rounded-full bg-background/60 overflow-hidden">
                  <div className="h-full bg-[hsl(var(--gold))] rounded-full" style={{ width: `${(s.count / maxSrc) * 100}%` }} />
                </div>
                <span className="text-muted-foreground w-10 text-end">{fmt(s.count)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top articles */}
      <div className="bg-secondary rounded-lg p-4">
        <h3 className="text-foreground text-sm font-bold mb-3">الأكثر مشاهدة</h3>
        <div className="space-y-2">
          {stats.topArticles.length === 0 ? (
            <p className="text-muted-foreground text-xs text-center py-4">لا توجد بيانات بعد</p>
          ) : (
            stats.topArticles.map((a, i) => (
              <div key={a.id} className="flex items-center justify-between text-xs gap-2">
                <span className="text-foreground truncate flex-1">
                  <span className="text-[hsl(var(--gold))] font-bold me-2">{String(i + 1).padStart(2, "0")}</span>
                  {a.title}
                </span>
                <span className="text-muted-foreground shrink-0">{fmt(a.views)} 👁</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
