import { ArrowRight, Shield, Lock, Eye, Cookie, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Shield,
      title: "المعلومات التي نجمعها",
      content: `نجمع معلومات محدودة لتحسين تجربتك:
• معرّف الجلسة (session) لتتبع المشاهدات بشكل مجهول
• تفضيلاتك مثل الوضع الداكن/الفاتح واللغة المختارة
• المقالات المحفوظة في المفضلة (تُخزن محلياً على جهازك)
• لا نجمع أي بيانات شخصية تعريفية (الاسم، البريد، الموقع)`
    },
    {
      icon: Cookie,
      title: "ملفات تعريف الارتباط",
      content: `نستخدم localStorage و sessionStorage فقط:
• eram_theme: تفضيل المظهر (داكن/فاتح)
• eram_lang: اللغة المختارة (عربي/إنجليزي)
• eram_favorites: المقالات المحفوظة
• eram_session_id: معرّف جلسة مجهول لتحليل المشاهدات
• لا نستخدم cookies تتبعية أو إعلانية`
    },
    {
      icon: Eye,
      title: "استخدام المعلومات",
      content: `نستخدم المعلومات المجمّعة لـ:
• تحسين تجربة التصفح和个人ية المحتوى
• تحليل المشاهدات لفهم المحتوى الأكثر قراءة
• ضمان عمل الموقع بشكل صحيح
• لا نشارك أي بيانات مع أطراف ثالثة لأغراض إعلانية`
    },
    {
      icon: Lock,
      title: "أمان البيانات",
      content: `• جميع الاتصالات مشفرة عبر HTTPS
• بيانات المستخدمين_admin_ محمية بـ Row Level Security
• لا نخزن كلمات مرور في الكود المصدري
• نستخدم Supabase مع سياسات أمان صارمة`
    },
    {
      icon: Mail,
      title: "حقوقك",
      content: `• يمكنك حذف بياناتك المحلية في أي time من إعدادات المتصفح
• يمكنك الاتصال بنا لأي استفسار متعلق بالخصوصية
• لا نرسل رسائل بريد إلكتروني غير مرغوبة
• يمكنك إلغاء الإشعارات من إعدادات المتصفح`
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      <header className="h-14 flex items-center gap-3 px-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <button onClick={() => navigate(-1)} className="text-foreground"><ArrowRight size={20} /></button>
        <h1 className="text-foreground font-bold">سياسة الخصوصية</h1>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield size={32} className="text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">آخر تحديث: يوليو 2026</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-muted-foreground leading-relaxed text-sm">
            تلتزم إيرام 24 بحماية خصوصيتك. توضح هذه السياسة كيفية جمع واستخدام
            المعلومات عند زيارتك لموقعنا.
          </p>
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

        <div className="bg-secondary rounded-xl border border-border p-5 text-center">
          <p className="text-muted-foreground text-sm">
            لأي استفسار متعلق بالخصوصية، تواصل معنا عبر صفحة{" "}
            <button onClick={() => navigate("/contact")} className="text-primary underline">اتصل بنا</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
