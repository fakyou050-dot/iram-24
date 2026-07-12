import { useEffect, useRef, useState } from "react";
import { Share2, Copy, Check, X } from "lucide-react";
import { RadioStation } from "@/data/defaultStations";
import { toast } from "@/hooks/use-toast";

interface Props {
  station: RadioStation;
  trigger?: "button" | "icon";
  size?: number;
}

const buildShareData = (station: RadioStation) => {
  const url = `${window.location.origin}/?play=${station.id}`;
  const hashtag = `#${station.name.replace(/\s+/g, "_")}`;
  const text = `تعال واستمتع معنا في البث المباشر — ${station.name}\n${hashtag}\n${url}`;
  return { url, text, title: station.name };
};

const ShareMenu = ({ station, size = 18 }: Props) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
    };
  }, [open]);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const data = buildShareData(station);
    // Use native share when available — exposes installed social apps automatically
    if (navigator.share) {
      try {
        await navigator.share({ title: data.title, text: data.text, url: data.url });
        return;
      } catch {/* user cancelled */ return;}
    }
    setOpen((o) => !o);
  };

  const copyLink = async () => {
    const { url, text } = buildShareData(station);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ title: "تم نسخ الرابط ✓", description: station.name });
      setTimeout(() => setCopied(false), 1600);
      setOpen(false);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  const platforms = [
    { name: "WhatsApp", color: "#25D366", href: (t: string) => `https://wa.me/?text=${encodeURIComponent(t)}` },
    { name: "Telegram", color: "#26A5E4", href: (t: string, u: string) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}` },
    { name: "X", color: "#000000", href: (t: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}` },
    { name: "Facebook", color: "#1877F2", href: (_t: string, u: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
  ];

  const { text, url } = buildShareData(station);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleShare}
        aria-label="مشاركة"
        className="w-9 h-9 flex items-center justify-center rounded-full bg-foreground/5 hover:bg-[hsl(var(--gold))]/15 hover:text-[hsl(var(--gold))] transition-all active:scale-90"
      >
        <Share2 size={size} strokeWidth={2.25} />
      </button>

      {open && (
        <div
          className="absolute bottom-full mb-2 right-0 z-[60] w-64 rounded-2xl border border-foreground/10 shadow-luxe overflow-hidden animate-scale-in origin-bottom-right"
          style={{ background: "linear-gradient(160deg, hsl(220 45% 9%) 0%, hsl(220 50% 5%) 100%)" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10">
            <p className="text-[11px] tracking-[0.25em] uppercase font-bold text-[hsl(var(--gold))]">مشاركة</p>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 p-3">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.href(text, url)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-foreground/5 transition-colors"
              >
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name[0]}
                </span>
                <span className="text-[10px] text-muted-foreground">{p.name}</span>
              </a>
            ))}
          </div>
          <button
            onClick={copyLink}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 border-t border-foreground/10 hover:bg-[hsl(var(--gold))]/10 transition-colors group"
          >
            <span className="text-xs text-foreground font-medium">نسخ الرابط</span>
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} className="text-muted-foreground group-hover:text-[hsl(var(--gold))]" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareMenu;
