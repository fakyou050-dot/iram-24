import { useNavigate } from "react-router-dom";
import { Facebook, Twitter, Youtube, Instagram, Send, Mail, ArrowUp } from "lucide-react";

interface Props {
  language: "AR" | "EN";
  categories: string[];
  onCategorySelect: (c: string) => void;
}

const SiteFooter = ({ language, categories, onCategorySelect }: Props) => {
  const isRTL = language === "AR";
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const sections = isRTL
    ? [
        { title: "الأقسام", links: categories.slice(0, 8).map((c) => ({ label: c, onClick: () => onCategorySelect(c) })) },
        {
          title: "الموقع",
          links: [
            { label: "الرئيسية", onClick: () => navigate("/") },
            { label: "الأقسام", onClick: () => navigate("/categories") },
            { label: "المفضلة", onClick: () => navigate("/favorites") },
            { label: "الراديو", onClick: () => navigate("/radio") },
            { label: "الإعدادات", onClick: () => navigate("/settings") },
          ],
        },
        {
          title: "معلومات",
          links: [
            { label: "من نحن", onClick: () => navigate("/settings") },
            { label: "سياسة الخصوصية", onClick: () => navigate("/settings") },
            { label: "شروط الاستخدام", onClick: () => navigate("/settings") },
            { label: "اتصل بنا", onClick: () => navigate("/settings") },
          ],
        },
      ]
    : [
        { title: "Sections", links: categories.slice(0, 8).map((c) => ({ label: c, onClick: () => onCategorySelect(c) })) },
        {
          title: "Site",
          links: [
            { label: "Home", onClick: () => navigate("/") },
            { label: "Categories", onClick: () => navigate("/categories") },
            { label: "Favorites", onClick: () => navigate("/favorites") },
            { label: "Radio", onClick: () => navigate("/radio") },
            { label: "Settings", onClick: () => navigate("/settings") },
          ],
        },
        {
          title: "Info",
          links: [
            { label: "About", onClick: () => navigate("/settings") },
            { label: "Privacy", onClick: () => navigate("/settings") },
            { label: "Terms", onClick: () => navigate("/settings") },
            { label: "Contact", onClick: () => navigate("/settings") },
          ],
        },
      ];

  const socials = [
    { Icon: Twitter, href: "#", label: "X" },
    { Icon: Facebook, href: "#", label: "Facebook" },
    { Icon: Instagram, href: "#", label: "Instagram" },
    { Icon: Youtube, href: "#", label: "Youtube" },
    { Icon: Send, href: "#", label: "Telegram" },
    { Icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <footer
      dir={isRTL ? "rtl" : "ltr"}
      className="mt-16 bg-[hsl(var(--ink))] text-white"
    >
      {/* Top decorative rule */}
      <div className="editorial-rule" />

      {/* Brand + newsletter */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 pt-12 pb-8 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-4xl md:text-5xl text-white leading-none">
              {isRTL ? "إيرام24" : "ERAM 24"}
            </h2>
            <p className="text-white/60 text-sm mt-4 max-w-md leading-relaxed">
              {isRTL
                ? "صحافة مستقلة تنقل خبر العالم بعدسة عربية. تغطية لحظية، تحليل عميق، ومحتوى يصنع الفرق."
                : "Independent journalism bringing world news through an Arab lens. Live coverage, deep analysis, and content that matters."}
            </p>
            <div className="flex items-center gap-2 mt-6">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-primary hover:text-primary transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          <div className="lg:pr-0">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[hsl(var(--gold))]">
              {isRTL ? "النشرة البريدية" : "Newsletter"}
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-white leading-tight mt-1">
              {isRTL ? "اشترك ليصلك أهم الأخبار" : "The brief, in your inbox"}
            </h3>
            <p className="text-white/60 text-sm mt-2">
              {isRTL
                ? "ملخص يومي بأبرز ما حدث، كل صباح."
                : "A daily digest of what matters, every morning."}
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex mt-4 border border-white/20 focus-within:border-primary"
            >
              <input
                type="email"
                placeholder={isRTL ? "بريدك الإلكتروني" : "Your email"}
                className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-5 text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
              >
                {isRTL ? "اشترك" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Link sections */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {sections.map((sec) => (
            <div key={sec.title}>
              <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[hsl(var(--gold))] mb-4">
                {sec.title}
              </h4>
              <ul className="space-y-2.5">
                {sec.links.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={l.onClick}
                      className="text-sm text-white/70 hover:text-white transition-colors text-start"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-[11px] text-white/50 uppercase tracking-wider">
          © {year} {isRTL ? "إيرام24 — جميع الحقوق محفوظة" : "ERAM 24 — All rights reserved"}
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-[11px] uppercase tracking-[0.2em] text-white/70 hover:text-white flex items-center gap-2"
        >
          <ArrowUp size={14} />
          {isRTL ? "للأعلى" : "Back to top"}
        </button>
      </div>
    </footer>
  );
};

export default SiteFooter;
