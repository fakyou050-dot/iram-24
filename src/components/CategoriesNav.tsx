interface CategoriesNavProps {
  categories: string[];
  activeCategory: string;
  onSelect: (cat: string) => void;
  language?: "AR" | "EN";
}

const CategoriesNav = ({ categories, activeCategory, onSelect, language = "AR" }: CategoriesNavProps) => {
  return (
    <nav className="bg-background border-b border-border">
      <div className="flex overflow-x-auto scrollbar-hide gap-1 px-4 py-2" dir={language === "AR" ? "rtl" : "ltr"}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default CategoriesNav;
