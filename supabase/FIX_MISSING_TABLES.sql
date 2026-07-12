-- ============================================
-- إصلاح الجداول المفقودة — شغّل هذا في Supabase Dashboard > SQL Editor
-- ============================================

-- 1. slider_images (للسلايدر)
CREATE TABLE IF NOT EXISTS public.slider_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.slider_images ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read slider images' AND tablename = 'slider_images') THEN
    CREATE POLICY "Anyone can read slider images" ON public.slider_images FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage slider images' AND tablename = 'slider_images') THEN
    CREATE POLICY "Admins can manage slider images" ON public.slider_images FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END$$;

-- 2. site_settings (لإعدادات الموقع)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read site settings' AND tablename = 'site_settings') THEN
    CREATE POLICY "Anyone can read site settings" ON public.site_settings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage site settings' AND tablename = 'site_settings') THEN
    CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END$$;

-- 3. blocked_words (للكلمات المحظورة)
CREATE TABLE IF NOT EXISTS public.blocked_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL UNIQUE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blocked_words ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read blocked words' AND tablename = 'blocked_words') THEN
    CREATE POLICY "Anyone can read blocked words" ON public.blocked_words FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage blocked words' AND tablename = 'blocked_words') THEN
    CREATE POLICY "Admins can manage blocked words" ON public.blocked_words FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END$$;

-- ✅ تم! بعد تشغيل هذا، ستعمل السلايدر وإعدادات الموقع والكلمات المحظورة.
