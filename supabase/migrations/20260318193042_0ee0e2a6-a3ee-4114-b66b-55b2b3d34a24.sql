-- Add columns for manual articles
ALTER TABLE public.articles 
  ADD COLUMN IF NOT EXISTS author_name text,
  ADD COLUMN IF NOT EXISTS author_image_url text,
  ADD COLUMN IF NOT EXISTS is_manual boolean NOT NULL DEFAULT false;

-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public) VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read article images
CREATE POLICY "Public read article images" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'article-images');

-- Allow authenticated admins to upload article images
CREATE POLICY "Admin upload article images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'article-images' AND public.has_role(auth.uid(), 'admin')
  );

-- Allow authenticated admins to delete article images
CREATE POLICY "Admin delete article images" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'article-images' AND public.has_role(auth.uid(), 'admin')
  );