-- إصلاح الجداول المفقودة — إيرام 24
-- شغّل كل قسم على حدة إذا ظهر خطأ

-- ═══════════════════════════════════════
-- القسم 1: جدول slider_images
-- ═══════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.slider_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.slider_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read slider images"
  ON public.slider_images FOR SELECT USING (true);

CREATE POLICY "Admins can manage slider images"
  ON public.slider_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- ═══════════════════════════════════════
-- القسم 2: جدول site_settings
-- ═══════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- ═══════════════════════════════════════
-- القسم 3: جدول blocked_words
-- ═══════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.blocked_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL UNIQUE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blocked_words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read blocked words"
  ON public.blocked_words FOR SELECT USING (true);

CREATE POLICY "Admins can manage blocked words"
  ON public.blocked_words FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
