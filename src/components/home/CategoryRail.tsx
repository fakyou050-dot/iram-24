import { useRef, useEffect } from "react";

interface Props {
  categories: string[];
  active: string;
  onSelect: (c: string) => void;
  language: "AR" | "EN";
}

const CategoryRail = ({ categories, active, onSelect, language }: Props) => {
  const isRTL = language === "AR";
  const ref = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const btn = btnRefs.current[active];
    if (btn && ref.current) {
      btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [active]);

  return (
    <nav className="sticky top-16 md:top-20 z-40 glass-strong border-b border-foreground/8">
      <div
        ref={ref}
        dir={isRTL ? "rtl" : "ltr"}
        className="max-w-screen-xl mx-auto flex overflow-x-auto scrollbar-hide px-3 md:px-6"
      >
        {categories.map((c) => {
          const isActive = active === c;
          return (
            <button
              key={c}
              ref={(el) => (btnRefs.current[c] = el)}
              onClick={() => onSelect(c)}
              className="relative px-4 md:px-5 py-3.5 text-[13px] md:text-sm whitespace-nowrap transition-colors shrink-0 group"
            >
              <span
                className={`font-bold transition-colors ${
                  isActive
                    ? "text-[hsl(var(--gold))]"
                    : "text-foreground/65 group-hover:text-foreground"
                }`}
              >
                {c}
              </span>
              {isActive && (
                <span className="absolute bottom-0 inset-x-3 h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default CategoryRail;
