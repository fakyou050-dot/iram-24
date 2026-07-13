import { ArrowRight, FileText, Scale, AlertTriangle, Copyright, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsPage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: FileText,
      title: "الاستخدام المقبول",
      content: `باستخدامك لموقع إيرام 24، توافق على:
• استخدام الموقع لأغراض مشروعة فقط
• عدم محاولة الوصول غير المصرح به للأنظمة
• عدم نشر أو إعادة توزيع المحتوى بدون إذن
• احترام حقوق الملكية الفكرية للمحتوى`
    },
    {
      icon: Copyright,
      title: "حقوق الملكية الفكرية",
      content: `• جميع المقالات والתמונות والتصاميم محمية بحقوق النشر
• يمكنك مشاركة المقالات عبر الروابط المباشرة
• يُمنع النسخ أو إعادة النشر بدون إذن مسبق
• الصور مصدرها وكالات الأنباء ومواقع الأخبار المرخصة`
    },
    {
      icon: UserCheck,
      title: "المحتوى المنشور",
      content: `• نسعى للدقة والموضوعية في كل ما ننشره
• المقالات تعبر عن مصادرها الأصلية
• قد تحتوي المقالات على روابط لمواقع خارجية غير خاضعة لرقابتنا
• نحن غير مسؤولين عن محتوى المواقع الخارجية`
    },
    {
      icon: Scale,
      title: "إخلاء المسؤولية",
      content: `• المحتوى المقدم "كما هو" دون ضمانات
• قد يحتوي المحتوى على أخطاء غير مقصودة
• لا نتحمل مسؤولية القرارات المتخذة بناءً على المحتوى
• يُنصح بالتحقق من المعلومات من مصادر متعددة`
    },
    {
      icon: AlertTriangle,
      title: "التغييرات على الشروط",
      content: `• قد نقوم بتحديث هذه الشروط من time لآخر
• سيتم إشعارك بأي تغييرات جوهرية
• استمرارك في استخدام الموقع يعني موافقتك على الشروط المحدثة`
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      <header className="h-14 flex items-center gap-3 px-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <button onClick={() => navigate(-1)} className="text-foreground"><ArrowRight size={20} /></button>
        <h1 className="text-foreground font-bold">شروط الاستخدام</h1>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Scale size={32} className="text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">آخر تحديث: يوليو 2026</p>
        </div>

        {sections.map(({ icon: Icon, title, content }, i) => (
          <section key={i} className="bg-card rounded-xl border border-border p-5 space-y-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Icon size={18} className="text-primary shrink-0" />
              {title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{content}</p>
          </section>
        ))}
      </div>
    </div>
  );
};

export default TermsPage;
