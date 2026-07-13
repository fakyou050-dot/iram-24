import { ArrowRight, Mail, MessageCircle, Globe, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const ContactPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }
    setSending(true);
    // Simulate send (no backend yet)
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً");
    setName("");
    setEmail("");
    setMessage("");
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      <header className="h-14 flex items-center gap-3 px-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <button onClick={() => navigate(-1)} className="text-foreground"><ArrowRight size={20} /></button>
        <h1 className="text-foreground font-bold">اتصل بنا</h1>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Mail size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-foreground font-medium text-sm">البريد الإلكتروني</p>
              <p className="text-muted-foreground text-sm">info@iram24.com</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Globe size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-foreground font-medium text-sm">الموقع</p>
              <p className="text-muted-foreground text-sm">iram24.com</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <MessageCircle size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-foreground font-medium text-sm">واتساب</p>
              <p className="text-muted-foreground text-sm">تواصل معنا</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-foreground font-medium text-sm">العنوان</p>
              <p className="text-muted-foreground text-sm">اليمن</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">أرسل رسالة</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-muted-foreground text-xs mb-1 block">الاسم</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسمك الكامل"
                className="w-full px-4 py-3 rounded-lg bg-input text-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div>
              <label className="text-muted-foreground text-xs mb-1 block">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-lg bg-input text-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-xs mb-1 block">الرسالة</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-input text-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50 transition-opacity"
            >
              {sending ? "جاري الإرسال..." : "إرسال الرسالة"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
