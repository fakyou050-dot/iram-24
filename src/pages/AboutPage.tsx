import { ArrowRight, ArrowLeft, Newspaper, Target, Eye, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      <header className="h-14 flex items-center gap-3 px-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <button onClick={() => navigate(-1)} className="text-foreground"><ArrowRight size={20} /></button>
        <h1 className="text-foreground font-bold">من نحن</h1>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
        {/* Hero */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Newspaper size={36} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">إيرام 24</h2>
          <p className="text-muted-foreground">نبض الحدث · ألاخبار لحظة بلحظة</p>
        </div>

        {/* About */}
        <section className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Target size={18} className="text-primary" />
            من نحن
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            إيرام 24 هي منصة إخبارية رقمية مستقلة تأسست بهدف تقديم تغطية إخبارية شاملة وموثوقة
            للقراء العرب في كل مكان. نركز على الأخبار المحلية اليمنية والعربية والدولية، مع
            اهتمام خاص بالسياسة والاقتصاد والرياضة والتكنولوجيا والصحة.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            نعمل على مدار الساعة لنقل الحدث كما يحدث، مع الحرص على الدقة والموضوعية
            في كل ما ننشره.
          </p>
        </section>

        {/* Vision */}
        <section className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Eye size={18} className="text-primary" />
            رؤيتنا
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            نطمح أن نكون المرجع الإخباري الأول للقارئ العربي، من خلال تقديم محتوى
            إخباري عالي الجودة يجمع بين السرعة في نقل الحدث والعمق في التحليل.
          </p>
        </section>

        {/* Team */}
        <section className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Users size={18} className="text-primary" />
            فريقنا
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            يتكون فريق إيرام 24 من مجموعة من الصحفيين والمحررين والتقنيين المتخصصين
            يعملون بشغف لتقرب الخبر من القارئ بأفضل صورة ممكنة.
          </p>
          <div className="bg-secondary rounded-lg p-4 border border-border">
            <p className="text-foreground font-medium text-sm">رئيس التحرير</p>
            <p className="text-muted-foreground text-sm">عبدالملك حميد الكوكباني</p>
          </div>
        </section>

        {/* Contact CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate("/contact")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
          >
            تواصل معنا
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
