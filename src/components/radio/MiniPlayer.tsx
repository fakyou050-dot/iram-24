import { Play, Pause, X, Loader2, Volume2, VolumeX, ChevronUp, Radio } from "lucide-react";
import { useRadio } from "@/contexts/RadioContext";
import ShareMenu from "./ShareMenu";

const MiniPlayer = () => {
  const { currentStation, currentId, status, play, stop, sheetOpen, openSheet, volume, setVolume, muted, setMuted } = useRadio();

  if (!currentStation || !currentId) return null;
  if (sheetOpen) return null; // hide when sheet open

  const togglePlay = () => play(currentId, currentStation.stream_url);

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-[70] border-t border-[hsl(var(--gold))]/30 animate-slide-up"
      style={{
        background: "linear-gradient(180deg, hsl(220 50% 8%/0.96) 0%, hsl(220 55% 4%/0.98) 100%)",
        backdropFilter: "blur(20px)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      dir="rtl"
    >
      {/* Top accent */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent opacity-70" />

      <div className="max-w-screen-xl mx-auto px-3 py-2.5 flex items-center gap-2.5">
        {/* Status badge */}
        <button
          onClick={openSheet}
          aria-label="فتح القائمة"
          className="flex-shrink-0 relative w-11 h-11 rounded-full bg-[hsl(var(--gold))]/15 flex items-center justify-center hover:bg-[hsl(var(--gold))]/25 transition-all active:scale-95"
        >
          {status === "playing" ? (
            <div className="flex gap-[3px] items-end h-4">
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="w-[3px] bg-[hsl(var(--gold))] rounded-full animate-pulse"
                  style={{ height: `${6 + i * 3}px`, animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          ) : status === "loading" ? (
            <Loader2 size={18} className="animate-spin text-[hsl(var(--gold))]" />
          ) : (
            <Radio size={18} className="text-[hsl(var(--gold))]" />
          )}
        </button>

        {/* Info */}
        <button onClick={openSheet} className="flex-1 min-w-0 text-right">
          <p className="text-[9px] tracking-[0.25em] uppercase text-[hsl(var(--gold))] font-bold leading-none mb-0.5">
            {status === "playing" ? "● مباشر الآن" : status === "loading" ? "جاري التحميل" : "متوقف"}
          </p>
          <p className="text-sm text-foreground font-bold truncate">{currentStation.name}</p>
          <p className="text-[10px] text-muted-foreground truncate">{currentStation.city} · {currentStation.country}</p>
        </button>

        {/* Volume (desktop only) */}
        <div className="hidden md:flex items-center gap-1.5">
          <button onClick={() => setMuted(!muted)} className="text-muted-foreground hover:text-[hsl(var(--gold))] transition-colors">
            {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
            className="w-24 h-1 accent-[hsl(var(--gold))] cursor-pointer"
          />
        </div>

        {/* Actions */}
        <ShareMenu station={currentStation} />
        <button
          onClick={togglePlay}
          aria-label="تشغيل/إيقاف"
          className="w-11 h-11 rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(38_72%_45%)] flex items-center justify-center shadow-glow active:scale-90 transition-all"
        >
          {status === "playing" ? (
            <Pause size={18} className="text-[hsl(var(--primary-foreground))]" fill="currentColor" />
          ) : status === "loading" ? (
            <Loader2 size={18} className="animate-spin text-[hsl(var(--primary-foreground))]" />
          ) : (
            <Play size={18} className="text-[hsl(var(--primary-foreground))]" fill="currentColor" />
          )}
        </button>
        <button
          onClick={openSheet}
          aria-label="القائمة"
          className="hidden sm:flex w-9 h-9 rounded-full bg-foreground/5 hover:bg-foreground/10 items-center justify-center transition-all"
        >
          <ChevronUp size={16} className="text-muted-foreground" />
        </button>
        <button
          onClick={stop}
          aria-label="إغلاق المشغل"
          className="w-9 h-9 rounded-full bg-foreground/5 hover:bg-[hsl(var(--crimson))]/15 hover:text-[hsl(var(--crimson))] flex items-center justify-center transition-all"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;
