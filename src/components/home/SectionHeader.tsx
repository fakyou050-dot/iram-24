import { ChevronLeft, ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  accent?: string;
  language?: "AR" | "EN";
  onMore?: () => void;
  icon?: React.ReactNode;
}

const SectionHeader = ({ title, accent, language = "AR", onMore, icon }: SectionHeaderProps) => {
  const isRTL = language === "AR";
  return (
    <div className="flex items-end justify-between mb-3 pb-2 border-b-2 border-primary/80" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-7 bg-primary rounded-full" />
        {icon && <span className="text-primary">{icon}</span>}
        <div>
          <h2 className="text-foreground font-extrabold text-base md:text-lg leading-none">{title}</h2>
          {accent && <span className="text-muted-foreground text-[10px] mt-0.5 block">{accent}</span>}
        </div>
      </div>
      {onMore && (
        <button
          onClick={onMore}
          className="flex items-center gap-1 text-primary text-xs font-semibold hover:gap-2 transition-all"
        >
          <span>{isRTL ? "المزيد" : "More"}</span>
          {isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
