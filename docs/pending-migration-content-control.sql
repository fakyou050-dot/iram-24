-- Pending migration: run via Supabase migration tool when DB connection stabilizes.
-- ============================================================
-- Content Control Wave (Blocked Words / Slider / Trending / Featured)
-- Imported & adapted from saber-news → IRAM24
-- ============================================================

-- 1) blocked_words
CREATE TABLE IF NOT EXISTS public.blocked_words (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT NOT NULL UNIQUE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blocked_words TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blocked_words TO authenticated;
GRANT ALL ON public.blocked_words TO service_role;
ALTER TABLE public.blocked_words ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blocked_words public read" ON public.blocked_words FOR SELECT USING (true);
CREATE POLICY "blocked_words admin write" ON public.blocked_words FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2) slider_images
CREATE TABLE IF NOT EXISTS public.slider_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.slider_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.slider_images TO authenticated;
GRANT ALL ON public.slider_images TO service_role;
ALTER TABLE public.slider_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "slider public read" ON public.slider_images FOR SELECT USING (true);
CREATE POLICY "slider admin write" ON public.slider_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3) site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "settings admin write" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
