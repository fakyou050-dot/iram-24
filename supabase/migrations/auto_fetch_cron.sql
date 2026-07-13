-- ============================================
-- إيرام 24 — Auto-fetch Cron Setup
-- Run this in Supabase Dashboard → SQL Editor
-- AFTER deploying the fetch-news Edge Function
-- ============================================

-- Enable pg_cron extension (requires Supabase Pro plan or higher)
-- If on free plan, skip this and use GitHub Actions instead
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests from SQL
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ─── Cleanup duplicate articles function ─────────────────────────
CREATE OR REPLACE FUNCTION public.cleanup_duplicate_articles()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  removed_count INTEGER := 0;
BEGIN
  -- Delete duplicates keeping the one with the earliest published_at
  WITH ranked AS (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY hash
             ORDER BY published_at DESC, created_at DESC
           ) AS rn
    FROM public.articles
  ),
  to_delete AS (
    SELECT id FROM ranked WHERE rn > 1
  )
  DELETE FROM public.articles
  WHERE id IN (SELECT id FROM to_delete);

  GET DIAGNOSTICS removed_count = ROW_COUNT;
  RETURN removed_count;
END;
$$;

-- ─── Function to call Edge Function via pg_net ───────────────────
-- This is called by pg_cron every 30 minutes
CREATE OR REPLACE FUNCTION public.trigger_auto_fetch()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  project_ref TEXT := 'zifhmbbhqgoqvqeofhtw';
  service_key TEXT := current_setting('app.settings.service_role_key', true);
  edge_url TEXT;
BEGIN
  -- Check if auto-fetch is enabled
  IF NOT EXISTS (
    SELECT 1 FROM public.fetch_settings WHERE auto_fetch_enabled = true
  ) THEN
    RETURN;
  END IF;

  edge_url := 'https://' || project_ref || '.supabase.co/functions/v1/fetch-news';

  -- Use pg_net to make async HTTP request
  PERFORM net.http_post(
    url := edge_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || COALESCE(service_key, ''),
      'apikey', COALESCE(service_key, '')
    ),
    body := '{}'::jsonb
  );
END;
$$;

-- ─── Schedule the cron job (every 30 minutes) ────────────────────
-- Unschedule if exists
SELECT cron.unschedule('auto-fetch-news') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'auto-fetch-news'
);

-- Schedule: every 30 minutes
SELECT cron.schedule(
  'auto-fetch-news',
  '*/30 * * * *',  -- every 30 minutes
  $$SELECT public.trigger_auto_fetch()$$
);

-- ─── Also schedule cleanup of duplicates (daily at 3 AM) ─────────
SELECT cron.unschedule('cleanup-duplicate-articles') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'cleanup-duplicate-articles'
);

SELECT cron.schedule(
  'cleanup-duplicate-articles',
  '0 3 * * *',  -- daily at 3 AM
  $$SELECT public.cleanup_duplicate_articles()$$
);

-- ─── Enable auto_fetch by default ────────────────────────────────
UPDATE public.fetch_settings
SET auto_fetch_enabled = true
WHERE auto_fetch_enabled = false;

-- ─── Verify ──────────────────────────────────────────────────────
-- Check scheduled jobs
SELECT * FROM cron.job;
