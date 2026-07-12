
-- Add show/hide source and alternative source fields to news_sources
ALTER TABLE public.news_sources
  ADD COLUMN IF NOT EXISTS show_source boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS alt_source_name text,
  ADD COLUMN IF NOT EXISTS alt_source_url text;

-- Add show_source and video_url to articles
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS show_source boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS video_url text;

-- Create storage bucket for article videos
INSERT INTO storage.buckets (id, name, public) VALUES ('article-videos', 'article-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Public read policy for article videos
CREATE POLICY "Article videos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'article-videos');

-- Authenticated upload policy for article videos
CREATE POLICY "Admins can upload article videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'article-videos');

-- Admins can delete article videos
CREATE POLICY "Admins can delete article videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'article-videos');
