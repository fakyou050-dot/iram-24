interface Props {
  categories: string[];
  active: string;
  onSelect: (c: string) => void;
  language: "AR" | "EN";
}

const EditorialNav = ({ categories, active, onSelect, language }: Props) => {
  const isRTL = language === "AR";
  return (
    <nav className="bg-background border-b border-foreground/10 sticky top-[97px] z-40">
      <div
        className="max-w-screen-xl mx-auto flex overflow-x-auto scrollbar-hide px-2"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {categories.map((c) => {
          const isActive = active === c;
          return (
            <button
              key={c}
              onClick={() => onSelect(c)}
              className={`relative px-4 py-3 text-[13px] font-bold whitespace-nowrap transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-[3px] bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default EditorialNav;
