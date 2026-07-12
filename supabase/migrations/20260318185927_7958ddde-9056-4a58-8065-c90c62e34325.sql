
-- Fix permissive INSERT on page_views - restrict to non-empty session_id
DROP POLICY "Anyone can insert views" ON public.page_views;
CREATE POLICY "Anyone can insert views with session" ON public.page_views
  FOR INSERT WITH CHECK (session_id IS NOT NULL AND session_id != '');
