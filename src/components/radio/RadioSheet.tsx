import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Search, Heart, Radio, Loader2, Pause, Play, X, AlertCircle } from "lucide-react";
import { RadioStation } from "@/data/defaultStations";
import { getStations, getFavorites, toggleFavorite } from "@/lib/radioStorage";
import { useRadio } from "@/contexts/RadioContext";
import ShareMenu from "./ShareMenu";

const RadioSheet = () => {
  const { sheetOpen, closeSheet, currentId, status, errorMsg, play, flashId } = useRadio();
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "favorites">("all");
  const [country, setCountry] = useState("all");

  useEffect(() => {
    const load = () => {
      setStations(getStations().filter((s) => s.enabled));
      setFavorites(getFavorites());
    };
    load();
    window.addEventListener("radio-stations-updated", load);
    return () => window.removeEventListener("radio-stations-updated", load);
  }, []);

  useEffect(() => {
    if (sheetOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [sheetOpen]);

  const countries = useMemo(() => {
    const s = new Set(stations.map((x) => x.country));
    return ["all", ...Array.from(s).sort()];
  }, [stations]);

  const filtered = useMemo(() => {
    let list = tab === "favorites" ? stations.filter((s) => favorites.has(s.id)) : stations;
    if (country !== "all") list = list.filter((s) => s.country === country);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || s.country.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => (favorites.has(b.id) ? 1 : 0) - (favorites.has(a.id) ? 1 : 0));
  }, [stations, favorites, search, tab, country]);

  const handleFav = (id: string) => setFavorites(new Set(toggleFavorite(id)));

  const statusIcon = (id: string) => {
    if (currentId !== id) return <Play size={16} className="text-[hsl(var(--gold))]" fill="currentColor" />;
    if (status === "loading") return <Loader2 size={16} className="animate-spin text-[hsl(var(--gold))]" />;
    if (status === "playing") return <Pause size={16} className="text-[hsl(var(--gold))]" fill="currentColor" />;
    if (status === "error") return <AlertCircle size={16} className="text-[hsl(var(--crimson))]" />;
    return <Play size={16} className="text-[hsl(var(--gold))]" fill="currentColor" />;
  };

  if (!sheetOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80]" dir="rtl">
      {/* Backdrop */}
      <div
        onClick={closeSheet}
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
      />
      {/* Sheet */}
      <div
        className="absolute inset-x-0 bottom-0 h-[70vh] rounded-t-3xl border-t border-[hsl(var(--gold))]/30 shadow-luxe overflow-hidden flex flex-col"
        style={{
          background: "linear-gradient(180deg, hsl(220 50% 8%) 0%, hsl(220 55% 4%) 100%)",
          animation: "slide-up-sheet 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Handle */}
        <div className="pt-2 pb-1 flex justify-center">
          <span className="w-12 h-1.5 rounded-full bg-foreground/20" />
        </div>

        {/* Header */}
        <div className="px-4 pt-2 pb-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-9 h-9 rounded-full bg-[hsl(var(--gold))]/15 flex items-center justify-center">
              <Radio size={18} className="text-[hsl(var(--gold))]" />
            </span>
            <div className="flex-1">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[hsl(var(--gold))] font-bold">البث المباشر</p>
              <h2 className="font-display text-xl text-foreground leading-none mt-0.5">راديو عربي ({stations.length})</h2>
            </div>
            <button
              onClick={closeSheet}
              aria-label="إغلاق"
              className="w-9 h-9 rounded-full bg-foreground/5 hover:bg-[hsl(var(--crimson))]/15 hover:text-[hsl(var(--crimson))] flex items-center justify-center transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-2">
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن محطة..."
              className="w-full bg-foreground/5 border border-foreground/10 rounded-full pr-9 pl-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[hsl(var(--gold))]/50"
            />
          </div>

          {/* Tabs + country */}
          <div className="flex gap-1.5 mb-2">
            <button
              onClick={() => setTab("all")}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                tab === "all" ? "bg-[hsl(var(--gold))] text-[hsl(var(--primary-foreground))]" : "bg-foreground/5 text-muted-foreground"
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setTab("favorites")}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors flex items-center gap-1 ${
                tab === "favorites" ? "bg-[hsl(var(--gold))] text-[hsl(var(--primary-foreground))]" : "bg-foreground/5 text-muted-foreground"
              }`}
            >
              <Heart size={11} /> المفضلة ({favorites.size})
            </button>
          </div>
          <div className="flex gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setCountry(c)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] transition-colors ${
                  country === c ? "bg-[hsl(var(--gold))]/20 text-[hsl(var(--gold))] border border-[hsl(var(--gold))]/40" : "bg-foreground/5 text-muted-foreground border border-transparent"
                }`}
              >
                {c === "all" ? "كل الدول" : c}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-3 pb-24 space-y-1.5">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">لا توجد نتائج</div>
          )}
          {filtered.map((s) => {
            const active = currentId === s.id;
            const flash = flashId === s.id;
            return (
              <div
                key={s.id}
                className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all ${
                  active
                    ? "bg-[hsl(var(--gold))]/8 border-[hsl(var(--gold))]/40"
                    : "bg-foreground/[0.02] border-foreground/8 hover:border-foreground/15"
                } ${flash ? "animate-radio-flash" : ""}`}
              >
                <button
                  onClick={() => play(s.id, s.stream_url)}
                  className="flex-shrink-0 w-11 h-11 rounded-full bg-foreground/5 hover:bg-[hsl(var(--gold))]/15 flex items-center justify-center transition-colors"
                >
                  {statusIcon(s.id)}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${active ? "text-[hsl(var(--gold))]" : "text-foreground"}`}>{s.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{s.city} · {s.country}</p>
                  {active && status === "error" && <p className="text-[10px] text-[hsl(var(--crimson))] mt-0.5">{errorMsg}</p>}
                </div>
                <ShareMenu station={s} />
                <button onClick={() => handleFav(s.id)} className="p-1.5 active:scale-125 transition-transform">
                  <Heart size={17} className={favorites.has(s.id) ? "fill-[hsl(var(--crimson))] text-[hsl(var(--crimson))]" : "text-muted-foreground"} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RadioSheet;
