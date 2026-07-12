import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const ADMIN_USERNAME = "Eram";
const ADMIN_PASSWORD = "777492635";
const ADMIN_EMAIL = "eram@iram24.admin";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ensureAdminUser = async (): Promise<{ success: boolean; error?: string }> => {
    // 1. محاولة تسجيل الدخول
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (!signInError && signInData.user) {
      // تسجيل الدخول نجح — تحقق من صلاحية الأدمن
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", signInData.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleData) return { success: true };

      // المستخدم موجود بدون صلاحية أدمن — أضفها
      try {
        await supabase.from("user_roles").upsert(
          { user_id: signInData.user.id, role: "admin" },
          { onConflict: "user_id,role" }
        );
        return { success: true };
      } catch {}

      return { success: true };
    }

    // 2. تسجيل الدخول فشل — استخدم setup-admin لتحديث كلمة المرور
    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke("setup-admin", {
        body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
      });

      if (!fnError && fnData?.success) {
        // setup-admin نجح (إنشاء أو تحديث كلمة المرور) — حاول الدخول مرة أخرى
        const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        });
        if (!retryError && retryData.user) {
          return { success: true };
        }
      }
    } catch {}

    // 3. محاولة أخيرة — إنشاء المستخدم مباشرة
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      options: { emailRedirectTo: undefined },
    });

    if (!signUpError && signUpData.user) {
      // حاول تسجيل الدخول بعد الإنشاء
      const { error: retryError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });

      if (!retryError) {
        try {
          await supabase.from("user_roles").upsert(
            { user_id: signUpData.user.id, role: "admin" },
            { onConflict: "user_id,role" }
          );
        } catch {}
        return { success: true };
      }

      return { success: false, error: "تم إنشاء الحساب لكن قد يحتاج تأكيد البريد. أكمل من Supabase Dashboard." };
    }

    return { success: false, error: "فشل تسجيل الدخول وإنشاء الحساب. تحقق من إعدادات Supabase." };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة");
      setLoading(false);
      return;
    }

    const result = await ensureAdminUser();

    if (!result.success) {
      setError(result.error || "فشل تسجيل الدخول");
      setLoading(false);
      return;
    }

    navigate("/admin-dashboard-ERAM-SECURE");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-secondary rounded-xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary text-2xl font-black">E</span>
          </div>
          <h1 className="text-foreground text-xl font-bold">لوحة تحكم إيرام 24</h1>
          <p className="text-muted-foreground text-xs mt-1">تسجيل دخول المدير</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-4">
            <p className="text-destructive text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-muted-foreground text-xs mb-1 block">اسم المستخدم</label>
            <input
              type="text"
              placeholder="اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-input text-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-muted-foreground text-xs mb-1 block">كلمة المرور</label>
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-input text-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50 transition-opacity"
          >
            {loading ? "جاري الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
