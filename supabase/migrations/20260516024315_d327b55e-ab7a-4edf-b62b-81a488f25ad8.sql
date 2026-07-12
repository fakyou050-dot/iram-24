
CREATE OR REPLACE FUNCTION public.smart_categorize_ar(_text text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  t text := lower(coalesce(_text, ''));
  s_sports int := 0;
  s_econ int := 0;
  s_tech int := 0;
  s_health int := 0;
  s_arts int := 0;
  s_pol int := 0;
  s_local int := 0;
  s_arab int := 0;
  s_world int := 0;
  best text := 'منوعات';
  best_score int := 0;
BEGIN
  -- Count matches via regex (multiple alternations weighted equally)
  s_sports := (SELECT count(*) FROM regexp_matches(t, '(كرة|مباراة|مباريات|دوري|بطولة|كأس|منتخب|نادي|هدف|أهداف|مدرب|لاعب|الهلال|النصر|الاتحاد|الأهلي|برشلونة|ريال مدريد|تشيلسي|ليفربول|مانشستر|رونالدو|ميسي|الانتقالات|الفيفا|أولمبي|أولمبياد|رماية|سباق|رالي|تنس|سلة|طائرة|ملاكمة|جودو|كاراتيه|سباحة|جمباز|مونديال|كأس العالم|ألعاب الخليج|الجولة|الموسم|رياض)', 'g'));
  s_econ := (SELECT count(*) FROM regexp_matches(t, '(اقتصاد|اقتصادي|مالي|البورصة|بورصة|أسهم|سهم|نفط|دولار|يورو|ذهب|الأسعار|تضخم|البنك|بنوك|استثمار|تجارة|صفقة|السوق|الأسواق|عجز|ميزانية|الناتج|اكتتاب|سبيس إكس|أرامكو|الفائدة|عملة|عملات|مصرف)', 'g'));
  s_tech := (SELECT count(*) FROM regexp_matches(t, '(تكنولوج|تقني|تقنية|ذكاء اصطناعي|روبوت|هاتف|جوال|آيفون|سامسونغ|أبل|جوجل|مايكروسوفت|ميتا|إنترنت|تطبيق|برمج|chatgpt|openai|كهربائية|تسلا|سيليكون|فضاء|قمر صناعي|إيلون ماسك)', 'g'));
  s_health := (SELECT count(*) FROM regexp_matches(t, '(صحة|طبي|الطب|مرض|أمراض|علاج|دواء|أدوية|فيروس|لقاح|مستشفى|أطباء|وباء|جائحة|كوفيد|كورونا|سرطان|سكري|قلب|دماغ|تغذية|سمنة|أنفلونزا)', 'g'));
  s_arts := (SELECT count(*) FROM regexp_matches(t, '(فيلم|أفلام|سينما|مسرح|موسيق|أغنية|أغاني|مغني|مغنية|ممثل|ممثلة|مهرجان|مهرجانات|كان|البندقية|أوسكار|دراما|مسلسل|مسلسلات|فنان|فنانة|ثقاف|كتاب|رواية|معرض)', 'g'));
  s_pol := (SELECT count(*) FROM regexp_matches(t, '(انتخاب|برلمان|الكنيست|الكونغرس|قمة|دبلوماس|سفير|سفارة|عقوبات|ترمب|بايدن|بوتين|الناتو|الأمم المتحدة|محكمة العدل|عسكر|الجيش|قصف|غارة|صاروخ|مسيرة|اغتيال|حماس|حزب الله|الحوثي|غزة|الضفة|الجولان|إسرائيل|إيران|الحرب|هدنة|تفاوض|مفاوضات|وزير|رئيس الوزراء|تشكيل حكومة|اتفاق سلام)', 'g'));
  s_local := (SELECT count(*) FROM regexp_matches(t, '(اليمن|يمني|يمنية|صنعاء|عدن|مأرب|تعز|حضرموت|إب|ذمار|عمران|البيضاء|سقطرى|الحديدة|المهرة|حجة|شبوة|الجوف|أبين|لحج|الضالع|ريمة|الحوثي)', 'g'));
  s_arab := (SELECT count(*) FROM regexp_matches(t, '(سعود|السعودية|الرياض|الإمارات|أبوظبي|دبي|مصر|القاهرة|الكويت|قطر|الدوحة|البحرين|عُمان|سلطنة عمان|لبنان|بيروت|سوري|دمشق|عراق|بغداد|أردن|عمّان|فلسطين|المغرب|الرباط|الجزائر|تونس|ليبيا|طرابلس|السودان|الخرطوم|موريتانيا)', 'g'));
  s_world := (SELECT count(*) FROM regexp_matches(t, '(أوروب|أميرك|أمريك|واشنطن|روسي|موسكو|الصين|بكين|اليابان|طوكيو|الهند|نيودلهي|كوريا|بريطان|لندن|فرنسا|باريس|ألمانيا|برلين|إسبانيا|إيطاليا|تركيا|أنقرة|أوكرانيا|كييف|تايوان|أفريقيا|أستراليا|كندا|البرازيل|المكسيك|البيت الأبيض|البنتاغون)', 'g'));

  -- Priority: specialized topics win over geographic
  IF s_sports >= 1 AND s_sports >= GREATEST(s_econ, s_tech, s_health, s_arts) THEN RETURN 'رياضة'; END IF;
  IF s_econ >= 1 AND s_econ >= GREATEST(s_tech, s_health, s_arts) THEN RETURN 'اقتصاد'; END IF;
  IF s_tech >= 1 AND s_tech >= GREATEST(s_health, s_arts) THEN RETURN 'تكنولوجيا'; END IF;
  IF s_health >= 1 AND s_health >= s_arts THEN RETURN 'صحة'; END IF;
  IF s_arts >= 1 THEN RETURN 'فنون'; END IF;

  -- Politics + geo: prefer politics; if local geo also present strongly, return محلي
  IF s_pol >= 1 THEN
    IF s_local >= 2 THEN RETURN 'محلي'; END IF;
    RETURN 'سياسة';
  END IF;

  IF s_local >= 1 AND s_local >= s_arab AND s_local >= s_world THEN RETURN 'محلي'; END IF;
  IF s_world >= 1 AND s_world > s_arab THEN RETURN 'دولي'; END IF;
  IF s_arab >= 1 THEN RETURN 'عربي'; END IF;
  IF s_world >= 1 THEN RETURN 'دولي'; END IF;

  RETURN 'منوعات';
END;
$$;

CREATE OR REPLACE FUNCTION public.smart_categorize_en(_text text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  t text := lower(coalesce(_text, ''));
  s_sports int; s_econ int; s_tech int; s_health int; s_arts int; s_pol int; s_world int;
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

-- Re-categorize all existing AR articles
UPDATE public.articles
SET category = public.smart_categorize_ar(coalesce(title,'') || ' ' || coalesce(description,''))
WHERE language = 'AR';

-- Re-categorize all existing EN articles
UPDATE public.articles
SET category = public.smart_categorize_en(coalesce(title,'') || ' ' || coalesce(description,''))
WHERE language = 'EN';
