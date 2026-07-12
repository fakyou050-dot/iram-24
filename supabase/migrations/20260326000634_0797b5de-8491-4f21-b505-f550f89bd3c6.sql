
-- Add new columns to articles table
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS seo_keywords text,
ADD COLUMN IF NOT EXISTS is_breaking boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS breaking_duration integer;

-- Article history table for tracking edits
CREATE TABLE IF NOT EXISTS public.article_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  old_title text,
  old_content text,
  old_seo_keywords text,
  action_type text NOT NULL,
  modified_by text NOT NULL DEFAULT 'user',
  modified_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.article_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage article history" ON public.article_history
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read article history" ON public.article_history
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Breaking news settings
CREATE TABLE IF NOT EXISTS public.breaking_news_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active boolean NOT NULL DEFAULT true,
  scroll_speed integer NOT NULL DEFAULT 5,
  scroll_direction text NOT NULL DEFAULT 'rtl',
  separator_style text NOT NULL DEFAULT '●',
  auto_refresh boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.breaking_news_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read breaking settings" ON public.breaking_news_settings
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can update breaking settings" ON public.breaking_news_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Insert default settings
INSERT INTO public.breaking_news_settings (is_active, scroll_speed, scroll_direction, separator_style, auto_refresh)
VALUES (true, 5, 'rtl', '●', false);

-- Currencies table
CREATE TABLE IF NOT EXISTS public.currencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  price numeric(10,4),
  change_percent numeric(5,2),
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read currencies" ON public.currencies
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage currencies" ON public.currencies
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Currency ticker settings
CREATE TABLE IF NOT EXISTS public.currency_ticker_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scroll_speed integer NOT NULL DEFAULT 3,
  scroll_direction text NOT NULL DEFAULT 'ltr',
  auto_refresh boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.currency_ticker_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read currency ticker settings" ON public.currency_ticker_settings
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can update currency ticker settings" ON public.currency_ticker_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.currency_ticker_settings (scroll_speed, scroll_direction, auto_refresh)
VALUES (3, 'ltr', false);

-- Insert some default currencies
INSERT INTO public.currencies (name, code, price, change_percent, is_active) VALUES
  ('ذهب', 'GOLD', 2150.0000, 0.50, true),
  ('فضة', 'SILVER', 24.5000, -0.30, true),
  ('دولار/ريال يمني', 'USD/YER', 1650.0000, 0.10, true),
  ('ريال سعودي/ريال يمني', 'SAR/YER', 435.0000, 0.05, true);

-- Enable realtime for breaking_news_settings and currencies
ALTER PUBLICATION supabase_realtime ADD TABLE public.breaking_news_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.currencies;
