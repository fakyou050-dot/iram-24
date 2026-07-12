-- ============================================
-- إيرام 24 — Migration for NEW Supabase Project
-- Project: zifhmbbhqgoqvqeofhtw
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- ═══════════════════════════════════════════
-- 1. الأنواع والجداول الأساسية
-- ═══════════════════════════════════════════

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

-- ═══════════════════════════════════════════
-- 2. مصادر الأخبار
-- ═══════════════════════════════════════════

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
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  slug TEXT,
  website_url TEXT,
  feed_url TEXT,
  fetch_type TEXT NOT NULL DEFAULT 'rss',
  category TEXT DEFAULT 'none',
  show_source BOOLEAN NOT NULL DEFAULT true,
  alt_source_name TEXT,
  alt_source_url TEXT
);
ALTER TABLE public.news_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read sources" ON public.news_sources FOR SELECT USING (true);
CREATE POLICY "Admins can insert sources" ON public.news_sources FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update sources" ON public.news_sources FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete sources" ON public.news_sources FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ═══════════════════════════════════════════
-- 3. المقالات
-- ═══════════════════════════════════════════

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
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  author_name TEXT,
  author_image_url TEXT,
  is_manual BOOLEAN NOT NULL DEFAULT false,
  seo_keywords TEXT,
  is_breaking BOOLEAN NOT NULL DEFAULT false,
  breaking_duration INTEGER,
  show_source BOOLEAN NOT NULL DEFAULT true,
  video_url TEXT
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
CREATE UNIQUE INDEX articles_hash_unique ON public.articles(hash);
CREATE INDEX idx_articles_source ON public.articles(source_id);

-- ═══════════════════════════════════════════
-- 4. إعدادات الجلب
-- ═══════════════════════════════════════════

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

-- ═══════════════════════════════════════════
-- 5. التحليلات
-- ═══════════════════════════════════════════

CREATE TABLE public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  page_path TEXT NOT NULL,
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert views with session" ON public.page_views
  FOR INSERT WITH CHECK (session_id IS NOT NULL AND session_id != '');
CREATE POLICY "Admins can read views" ON public.page_views FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ═══════════════════════════════════════════
-- 6. سجل التعديلات
-- ═══════════════════════════════════════════

CREATE TABLE public.article_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  old_title TEXT,
  old_content TEXT,
  old_seo_keywords TEXT,
  action_type TEXT NOT NULL,
  modified_by TEXT NOT NULL DEFAULT 'user',
  modified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.article_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage article history" ON public.article_history
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ═══════════════════════════════════════════
-- 7. إعدادات الأخبار العاجلة
-- ═══════════════════════════════════════════

CREATE TABLE public.breaking_news_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  scroll_speed INTEGER NOT NULL DEFAULT 5,
  scroll_direction TEXT NOT NULL DEFAULT 'rtl',
  separator_style TEXT NOT NULL DEFAULT '●',
  auto_refresh BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.breaking_news_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read breaking settings" ON public.breaking_news_settings
  FOR SELECT TO public USING (true);
CREATE POLICY "Admins can update breaking settings" ON public.breaking_news_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.breaking_news_settings (is_active, scroll_speed, scroll_direction, separator_style, auto_refresh)
VALUES (true, 5, 'rtl', '●', false);

-- ═══════════════════════════════════════════
-- 8. العملات
-- ═══════════════════════════════════════════

CREATE TABLE public.currencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  price NUMERIC(10,4),
  change_percent NUMERIC(5,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read currencies" ON public.currencies
  FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage currencies" ON public.currencies
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.currencies (name, code, price, change_percent, is_active) VALUES
  ('ذهب', 'GOLD', 2150.0000, 0.50, true),
  ('فضة', 'SILVER', 24.5000, -0.30, true),
  ('دولار/ريال يمني', 'USD/YER', 1650.0000, 0.10, true),
  ('ريال سعودي/ريال يمني', 'SAR/YER', 435.0000, 0.05, true);

CREATE TABLE public.currency_ticker_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scroll_speed INTEGER NOT NULL DEFAULT 3,
  scroll_direction TEXT NOT NULL DEFAULT 'ltr',
  auto_refresh BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.currency_ticker_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read currency ticker settings" ON public.currency_ticker_settings
  FOR SELECT TO public USING (true);
CREATE POLICY "Admins can update currency ticker settings" ON public.currency_ticker_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.currency_ticker_settings (scroll_speed, scroll_direction, auto_refresh)
VALUES (3, 'ltr', false);

-- ═══════════════════════════════════════════
-- 9. Storage buckets
-- ═══════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public) VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read article images" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'article-images');
CREATE POLICY "Admin upload article images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'article-images' AND public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Admin delete article images" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'article-images' AND public.has_role(auth.uid(), 'admin')
  );

INSERT INTO storage.buckets (id, name, public) VALUES ('article-videos', 'article-videos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Article videos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'article-videos');
CREATE POLICY "Admins can upload article videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'article-videos');
CREATE POLICY "Admins can delete article videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'article-videos');

-- ═══════════════════════════════════════════
-- 10. الدوال المساعدة
-- ═══════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON public.news_sources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.fetch_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Smart categorize AR
CREATE OR REPLACE FUNCTION public.smart_categorize_ar(_text text)
RETURNS text
LANGUAGE plpgsql IMMUTABLE SET search_path = public
AS $$
DECLARE
  t text := lower(coalesce(_text, ''));
  s_sports int := 0; s_econ int := 0; s_tech int := 0; s_health int := 0;
  s_arts int := 0; s_pol int := 0; s_local int := 0; s_arab int := 0; s_world int := 0;
BEGIN
  s_sports := (SELECT count(*) FROM regexp_matches(t, '(كرة|مباراة|مباريات|دوري|بطولة|كأس|منتخب|نادي|هدف|أهداف|مدرب|لاعب|الهلال|النصر|الاتحاد|الأهلي|برشلونة|ريال مدريد|تشيلسي|ليفربول|مانشستر|رونالدو|ميسي|الانتقالات|الفيفا|أولمبي|أولمبياد|رماية|سباق|رالي|تنس|سلة|طائرة|ملاكمة|جودو|كاراتيه|سباحة|جمباز|مونديال|كأس العالم|ألعاب الخليج|الجولة|الموسم|رياض)', 'g'));
  s_econ := (SELECT count(*) FROM regexp_matches(t, '(اقتصاد|اقتصادي|مالي|البورصة|بورصة|أسهم|سهم|نفط|دولار|يورو|ذهب|الأسعار|تضخم|البنك|بنوك|استثمار|تجارة|صفقة|السوق|الأسواق|عجز|ميزانية|الناتج|اكتتاب|سبيس إكس|أرامكو|الفائدة|عملة|عملات|مصرف)', 'g'));
  s_tech := (SELECT count(*) FROM regexp_matches(t, '(تكنولوج|تقني|تقنية|ذكاء اصطناعي|روبوت|هاتف|جوال|آيفون|سامسونغ|أبل|جوجل|مايكروسوفت|ميتا|إنترنت|تطبيق|برمج|chatgpt|openai|كهربائية|تسلا|سيليكون|فضاء|قمر صناعي|إيلون ماسك)', 'g'));
  s_health := (SELECT count(*) FROM regexp_matches(t, '(صحة|طبي|الطب|مرض|أمراض|علاج|دواء|أدوية|فيروس|لقاح|مستشفى|أطباء|وباء|جائحة|كوفيد|كورونا|سرطان|سكري|قلب|دماغ|تغذية|سمنة|أنفلونزا)', 'g'));
  s_arts := (SELECT count(*) FROM regexp_matches(t, '(فيلم|أفلام|سينما|مسرح|موسيق|أغنية|أغاني|مغني|مغنية|ممثل|ممثلة|مهرجان|مهرجانات|كان|البندقية|أوسكار|دراما|مسلسل|مسلسلات|فنان|فنانة|ثقاف|كتاب|رواية|معرض)', 'g'));
  s_pol := (SELECT count(*) FROM regexp_matches(t, '(انتخاب|برلمان|الكنيست|الكونغرس|قمة|دبلوماس|سفير|سفارة|عقوبات|ترمب|بايدن|بوتين|الناتو|الأمم المتحدة|محكمة العدل|عسكر|الجيش|قصف|غارة|صاروخ|مسيرة|اغتيال|حماس|حزب الله|الحوثي|غزة|الضفة|الجولان|إسرائيل|إيران|الحرب|هدنة|تفاوض|مفاوضات|وزير|رئيس الوزراء|تشكيل حكومة|اتفاق سلام)', 'g'));
  s_local := (SELECT count(*) FROM regexp_matches(t, '(اليمن|يمني|يمنية|صنعاء|عدن|مأرب|تعز|حضرموت|إب|ذمار|عمران|البيضاء|سقطرى|الحديدة|المهرة|حجة|شبوة|الجوف|أبين|لحج|الضالع|ريمة|الحوثي)', 'g'));
  s_arab := (SELECT count(*) FROM regexp_matches(t, '(سعود|السعودية|الرياض|الإمارات|أبوظبي|دبي|مصر|القاهرة|الكويت|قطر|الدوحة|البحرين|عُمان|سلطنة عمان|لبنان|بيروت|سوري|دمشق|عراق|بغداد|أردن|عمّان|فلسطين|المغرب|الرباط|الجزائر|تونس|ليبيا|طرابلس|السودان|الخرطوم|موريتانيا)', 'g'));
  s_world := (SELECT count(*) FROM regexp_matches(t, '(أوروب|أميرك|أمريك|واشنطن|روسي|موسكو|الصين|بكين|اليابان|طوكيو|الهند|نيودلهي|كوريا|بريطان|لندن|فرنسا|باريس|ألمانيا|برلين|إسبانيا|إيطاليا|تركيا|أنقرة|أوكرانيا|كييف|تايوان|أفريقيا|أستراليا|كندا|البرازيل|المكسيك|البيت الأبيض|البنتاغون)', 'g'));

  IF s_sports >= 1 AND s_sports >= GREATEST(s_econ, s_tech, s_health, s_arts) THEN RETURN 'رياضة'; END IF;
  IF s_econ >= 1 AND s_econ >= GREATEST(s_tech, s_health, s_arts) THEN RETURN 'اقتصاد'; END IF;
  IF s_tech >= 1 AND s_tech >= GREATEST(s_health, s_arts) THEN RETURN 'تكنولوجيا'; END IF;
  IF s_health >= 1 AND s_health >= s_arts THEN RETURN 'صحة'; END IF;
  IF s_arts >= 1 THEN RETURN 'فنون'; END IF;
  IF s_pol >= 1 THEN IF s_local >= 2 THEN RETURN 'محلي'; END IF; RETURN 'سياسة'; END IF;
  IF s_local >= 1 AND s_local >= s_arab AND s_local >= s_world THEN RETURN 'محلي'; END IF;
  IF s_world >= 1 AND s_world > s_arab THEN RETURN 'دولي'; END IF;
  IF s_arab >= 1 THEN RETURN 'عربي'; END IF;
  IF s_world >= 1 THEN RETURN 'دولي'; END IF;
  RETURN 'منوعات';
END;
$$;

-- Smart categorize EN
CREATE OR REPLACE FUNCTION public.smart_categorize_en(_text text)
RETURNS text
LANGUAGE plpgsql IMMUTABLE SET search_path = public
AS $$
DECLARE
  t text := lower(coalesce(_text, ''));
  s_sports int := 0; s_econ int := 0; s_tech int := 0; s_health int := 0;
  s_arts int := 0; s_pol int := 0; s_world int := 0;
BEGIN
  s_sports := (SELECT count(*) FROM regexp_matches(t, '(football|soccer|basketball|tennis|formula|fifa|uefa|championship|match|goal|club|coach|player|transfer|premier league|la liga|serie a|nba|nfl|mlb|olympic|cricket|rugby|golf|boxing|mma)', 'g'));
  s_econ := (SELECT count(*) FROM regexp_matches(t, '(economy|economic|finance|market|stocks?|oil|gold|trade|inflation|gdp|recession|bank|investment|ipo|crypto|bitcoin|currency|dollar|euro)', 'g'));
  s_tech := (SELECT count(*) FROM regexp_matches(t, '(\btech\b|\bai\b|artificial intelligence|software|app\b|internet|cyber|digital|robot|iphone|samsung|google|microsoft|meta|tesla|spacex|chatgpt|openai|startup|silicon|smartphone)', 'g'));
  s_health := (SELECT count(*) FROM regexp_matches(t, '(health|medic|disease|vaccine|treatment|hospital|cancer|diabetes|covid|virus|pandemic|mental health|nutrition)', 'g'));
  s_arts := (SELECT count(*) FROM regexp_matches(t, '(cinema|theater|theatre|music|culture|festival|oscar|cannes|movie|film|album|concert|art exhibit|museum|netflix|hbo)', 'g'));
  s_pol := (SELECT count(*) FROM regexp_matches(t, '(politic|government|president|election|parliament|congress|senate|trump|biden|putin|nato|united nations|sanctions|war|military|airstrike|missile|israel|iran|gaza|ukraine|russia)', 'g'));
  s_world := (SELECT count(*) FROM regexp_matches(t, '(europe|america|washington|china|beijing|japan|tokyo|india|korea|britain|london|france|paris|germany|berlin|spain|italy|turkey|africa|australia|canada|brazil)', 'g'));

  IF s_sports >= 1 AND s_sports >= GREATEST(s_econ, s_tech, s_health, s_arts) THEN RETURN 'Sports'; END IF;
  IF s_econ >= 1 AND s_econ >= GREATEST(s_tech, s_health, s_arts) THEN RETURN 'Economy'; END IF;
  IF s_tech >= 1 AND s_tech >= GREATEST(s_health, s_arts) THEN RETURN 'Technology'; END IF;
  IF s_health >= 1 AND s_health >= s_arts THEN RETURN 'Health'; END IF;
  IF s_arts >= 1 THEN RETURN 'Arts'; END IF;
  IF s_pol >= 1 THEN RETURN 'Politics'; END IF;
  IF s_world >= 1 THEN RETURN 'World'; END IF;
  RETURN 'Lifestyle';
END;
$$;

-- ═══════════════════════════════════════════
-- 11. Realtime
-- ═══════════════════════════════════════════

ALTER PUBLICATION supabase_realtime ADD TABLE public.breaking_news_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.currencies;

-- ═══════════════════════════════════════════
-- 12. إضافة أدمن (eram@iram24.admin)
--    ⚠️ شغّل هذا AFTER إنشاء المستخدم من Auth
-- ═══════════════════════════════════════════

-- استبدل USER_ID_HERE بمعرف المستخدم الحقيقي
-- لتحصل عليه: اذهب لـ Authentication → Users → انسخ UUID
-- أو شغّل: SELECT id FROM auth.users WHERE email = 'eram@iram24.admin';

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'eram@iram24.admin'
ON CONFLICT (user_id, role) DO NOTHING;

-- ✅ تم! قاعدة البيانات جاهزة.
