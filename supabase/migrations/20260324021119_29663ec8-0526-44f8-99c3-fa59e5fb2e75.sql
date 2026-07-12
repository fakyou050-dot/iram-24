
ALTER TABLE public.news_sources
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS feed_url text,
  ADD COLUMN IF NOT EXISTS fetch_type text NOT NULL DEFAULT 'rss',
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'none';
