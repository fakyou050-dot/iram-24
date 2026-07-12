
-- Admin roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can view roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- News sources
CREATE TABLE public.news_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('AR', 'EN')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_fetch TIMESTAMPTZ,
  article_count INTEGER DEFAULT 0,
  last_fetch_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.news_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read sources" ON public.news_sources FOR SELECT USING (true);
CREATE POLICY "Admins can insert sources" ON public.news_sources FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update sources" ON public.news_sources FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete sources" ON public.news_sources FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Articles
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES public.news_sources(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  url TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  language TEXT NOT NULL CHECK (language IN ('AR', 'EN')),
  published_at TIMESTAMPTZ,
  hash TEXT UNIQUE NOT NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Admins can insert articles" ON public.articles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update articles" ON public.articles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete articles" ON public.articles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_articles_language ON public.articles(language);
CREATE INDEX idx_articles_category ON public.articles(category);
CREATE INDEX idx_articles_published ON public.articles(published_at DESC);
CREATE INDEX idx_articles_hash ON public.articles(hash);
CREATE INDEX idx_articles_source ON public.articles(source_id);

-- Fetch settings
CREATE TABLE public.fetch_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auto_fetch_enabled BOOLEAN NOT NULL DEFAULT false,
  fetch_interval INTEGER NOT NULL DEFAULT 2,
  last_fetch_time TIMESTAMPTZ,
  last_fetch_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.fetch_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings" ON public.fetch_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update settings" ON public.fetch_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.fetch_settings (auto_fetch_enabled, fetch_interval) VALUES (false, 2);

-- Site analytics
CREATE TABLE public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  page_path TEXT NOT NULL,
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert views" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read views" ON public.page_views FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON public.news_sources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.fetch_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
