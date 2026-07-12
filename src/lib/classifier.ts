// ============================================================================
// Smart article classifier (AR + EN)
// - Single primary category from a closed list (10 sections)
// - Independent tags: geo (اليمن / عربي / دولي) + breaking
// - Confidence score 0..1 — admin can review low-confidence items
// - Designed to be extensible: add a new section by appending one entry to RULES
// ============================================================================

export const AR_SECTIONS = [
  "سياسة",
  "اقتصاد",
  "رياضة",
  "تكنولوجيا",
  "علوم",
  "صحة",
  "ثقافة وفنون",
  "مجتمع",
  "مقالات",
  "منوعات",
] as const;

export const EN_SECTIONS = [
  "Politics",
  "Economy",
  "Sports",
  "Technology",
  "Science",
  "Health",
  "Arts",
  "Society",
  "Articles",
  "Lifestyle",
] as const;

export type Section = typeof AR_SECTIONS[number] | typeof EN_SECTIONS[number];

// Legacy → new mapping (any leftover data in the DB)
const LEGACY_MAP: Record<string, string> = {
  "محلي": "سياسة",
  "عربي": "سياسة",
  "دولي": "سياسة",
  "فنون": "ثقافة وفنون",
  "ثقافة": "ثقافة وفنون",
  "World": "Politics",
};

export function normalizeCategory(cat: string | null | undefined): string {
  if (!cat) return "منوعات";
  return LEGACY_MAP[cat] || cat;
}

interface Rule {
  ar: string;
  en: string;
  // Strong keywords (weight 3) — almost certain
  strong: RegExp;
  // Normal keywords (weight 1)
  normal: RegExp;
}

const RULES: Rule[] = [
  {
    ar: "رياضة", en: "Sports",
    strong: /\b(كرة القدم|مباراة|مباريات|دوري|بطولة|كأس|منتخب|الفيفا|أولمبياد|تشامبيونزليج|الفورمولا|football|soccer|fifa|uefa|premier league|champions league|nba|nfl|mlb|olympic|formula 1)\b/i,
    normal: /(نادي|هدف|أهداف|مدرب|لاعب|رونالدو|ميسي|الهلال|النصر|الاتحاد|الأهلي|برشلونة|ريال مدريد|تشيلسي|ليفربول|مانشستر|تنس|سلة|طائرة|ملاكمة|سباحة|جمباز|كأس العالم|الجولة|الموسم|match|goal|coach|player|club|tennis|basketball|cricket|rugby|golf|boxing)/i,
  },
  {
    ar: "اقتصاد", en: "Economy",
    strong: /\b(البورصة|بورصة|أسهم|سهم|تضخم|الناتج المحلي|أرامكو|البنك المركزي|بنك مركزي|سعر الفائدة|stock market|inflation|gdp|central bank|interest rate|bitcoin|crypto|ipo|nasdaq|dow jones)\b/i,
    normal: /(اقتصاد|مالي|نفط|دولار|يورو|ذهب|تجارة|صفقة|السوق|الأسواق|عجز|ميزانية|اكتتاب|عملة|عملات|مصرف|بنوك|استثمار|economy|finance|market|oil|gold|trade|recession|bank|investment|currency|dollar|euro|tesla)/i,
  },
  {
    ar: "تكنولوجيا", en: "Technology",
    strong: /\b(ذكاء اصطناعي|chatgpt|openai|آيفون|سامسونغ|أبل|جوجل|مايكروسوفت|ميتا|تسلا|سبيس إكس|artificial intelligence|iphone|samsung|google|microsoft|meta|spacex|chatgpt|android|ios|gpt-)\b/i,
    normal: /(تكنولوج|تقني|تقنية|روبوت|هاتف|جوال|إنترنت|تطبيق|برمج|سيليكون|smartphone|software|app\b|internet|cyber|digital|robot|startup|silicon|\btech\b|\bai\b)/i,
  },
  {
    ar: "علوم", en: "Science",
    strong: /\b(ناسا|nasa|spacex|قمر صناعي|محطة فضائية|اكتشاف علمي|دراسة علمية|بحث علمي|hubble|james webb|كوكب|مجرة|black hole|galaxy|astronomy|paleontolog|archaeolog)\b/i,
    normal: /(فضاء|فلك|فيزياء|كيمياء|أحياء|جينات|الحمض النووي|تطور|مناخ|انقراض|عالم\b|علماء|الجاذبية|space|physics|chemistry|biology|gene|dna|climate|extinct|scientist|research|telescope|particle)/i,
  },
  {
    ar: "صحة", en: "Health",
    strong: /\b(منظمة الصحة العالمية|كوفيد|كورونا|سرطان|سكري|قلب|أنفلونزا|who|covid|cancer|diabetes|heart disease|pandemic|epidemic|alzheimer)\b/i,
    normal: /(صحة|طبي|الطب|مرض|أمراض|علاج|دواء|أدوية|فيروس|لقاح|مستشفى|أطباء|وباء|جائحة|دماغ|تغذية|سمنة|health|medic|disease|vaccine|treatment|hospital|virus|nutrition|mental health|drug)/i,
  },
  {
    ar: "ثقافة وفنون", en: "Arts",
    strong: /\b(مهرجان كان|البندقية|أوسكار|غرامي|cannes|venice film festival|oscar|grammy|emmy|netflix|hbo|disney\+)\b/i,
    normal: /(فيلم|أفلام|سينما|مسرح|موسيق|أغنية|أغاني|مغني|مغنية|ممثل|ممثلة|مهرجان|دراما|مسلسل|مسلسلات|فنان|فنانة|ثقاف|كتاب|رواية|معرض|cinema|theater|theatre|music|culture|festival|movie|film|album|concert|museum|book|novel|exhibit)/i,
  },
  {
    ar: "مجتمع", en: "Society",
    strong: /\b(التعليم|مدارس|الجامعة|الزواج|الطلاق|العنف الأسري|حقوق المرأة|عمالة الأطفال|education|school|university|marriage|divorce|domestic violence|women rights|child labor|refugees)\b/i,
    normal: /(أسرة|عائلة|مجتمع|شباب|نساء|أطفال|طلاب|معلم|قضية اجتماعية|تعليمي|family|society|youth|community|teacher|student|social issue|poverty|homeless)/i,
  },
  {
    ar: "مقالات", en: "Articles",
    strong: /\b(رأي|مقال رأي|تحليل|افتتاحية|وجهة نظر|opinion|op-ed|editorial|analysis|commentary|perspective|column)\b/i,
    normal: /(يكتب|قراءة في|تأمل|رؤية|essay|viewpoint)/i,
  },
  {
    ar: "سياسة", en: "Politics",
    strong: /\b(انتخابات|الكنيست|الكونغرس|البيت الأبيض|البنتاغون|الناتو|الأمم المتحدة|مجلس الأمن|election|parliament|congress|senate|white house|pentagon|nato|united nations|security council)\b/i,
    normal: /(انتخاب|برلمان|قمة|دبلوماس|سفير|سفارة|عقوبات|ترامب|ترمب|بايدن|بوتين|عسكر|الجيش|قصف|غارة|صاروخ|اغتيال|حماس|حزب الله|الحوثي|غزة|إسرائيل|إيران|الحرب|هدنة|مفاوضات|وزير|رئيس الوزراء|الحكومة|government|president|trump|biden|putin|sanctions|war|military|missile|airstrike|israel|iran|gaza|ukraine|russia|minister|diplomat|treaty)/i,
  },
];

export interface Classification {
  category: string;       // primary section in target language
  confidence: number;     // 0..1
  tags: string[];         // geo + breaking, language-aware
  breaking: boolean;
  needsReview: boolean;   // confidence < 0.35
}

const BREAKING_RE = /(عاجل|خبر عاجل|breaking|just in|developing)/i;
const YEMEN_RE = /(اليمن|يمني|يمنية|صنعاء|عدن|مأرب|تعز|حضرموت|إب|ذمار|عمران|البيضاء|سقطرى|الحديدة|المهرة|حجة|شبوة|الجوف|أبين|لحج|الضالع|ريمة|الحوثي|yemen)/i;
const ARAB_RE = /(سعود|السعودية|الرياض|الإمارات|أبوظبي|دبي|مصر|القاهرة|الكويت|قطر|الدوحة|البحرين|عُمان|سلطنة عمان|لبنان|بيروت|سوري|دمشق|عراق|بغداد|أردن|عمّان|فلسطين|المغرب|الرباط|الجزائر|تونس|ليبيا|طرابلس|السودان|الخرطوم|موريتانيا|saudi|emirates|egypt|kuwait|qatar|bahrain|oman|lebanon|syria|iraq|jordan|palestine|morocco|tunisia|libya|sudan)/i;
const WORLD_RE = /(أوروب|أميرك|أمريك|واشنطن|روسي|موسكو|الصين|بكين|اليابان|طوكيو|الهند|كوريا|بريطان|لندن|فرنسا|باريس|ألمانيا|برلين|إسبانيا|إيطاليا|تركيا|أنقرة|أوكرانيا|كييف|تايوان|أفريقيا|أستراليا|كندا|البرازيل|europe|america|washington|china|japan|india|korea|britain|france|germany|spain|italy|turkey|ukraine|taiwan|africa|australia|canada|brazil)/i;

function score(text: string, rule: Rule): number {
  let s = 0;
  const strongMatches = text.match(new RegExp(rule.strong.source, rule.strong.flags + "g"));
  if (strongMatches) s += strongMatches.length * 3;
  const normalMatches = text.match(new RegExp(rule.normal.source, rule.normal.flags + "g"));
  if (normalMatches) s += normalMatches.length;
  return s;
}

export function classify(
  title: string,
  description: string | null | undefined,
  language: "AR" | "EN" = "AR",
  content?: string | null,
): Classification {
  const text = `${title || ""} ${description || ""} ${content || ""}`.slice(0, 4000);
  const scored = RULES.map((r) => ({ rule: r, s: score(text, r) }));
  scored.sort((a, b) => b.s - a.s);

  const top = scored[0];
  const second = scored[1];

  let category: string;
  let confidence: number;

  if (!top || top.s === 0) {
    category = language === "AR" ? "منوعات" : "Lifestyle";
    confidence = 0.2;
  } else {
    category = language === "AR" ? top.rule.ar : top.rule.en;
    // Confidence = how much top wins vs runner-up, scaled by absolute score
    const gap = (top.s - (second?.s || 0)) / Math.max(top.s, 1);
    const magnitude = Math.min(1, top.s / 6);
    confidence = Math.min(1, 0.4 * magnitude + 0.6 * gap + 0.15);
  }

  // Tags (independent of section)
  const tags: string[] = [];
  const isYemen = YEMEN_RE.test(text);
  const isArab = !isYemen && ARAB_RE.test(text);
  const isWorld = !isYemen && !isArab && WORLD_RE.test(text);
  if (language === "AR") {
    if (isYemen) tags.push("اليمن");
    if (isArab) tags.push("عربي");
    if (isWorld) tags.push("دولي");
  } else {
    if (isYemen) tags.push("Yemen");
    if (isArab) tags.push("Arab");
    if (isWorld) tags.push("World");
  }

  const breaking = BREAKING_RE.test(`${title} ${description || ""}`);
  if (breaking) tags.push(language === "AR" ? "عاجل" : "Breaking");

  return {
    category,
    confidence: Number(confidence.toFixed(2)),
    tags,
    breaking,
    needsReview: confidence < 0.35,
  };
}

// Backwards-compatible helper
export function categorizeArticle(
  title: string,
  description: string | null,
  language: "AR" | "EN",
): string {
  return classify(title, description, language).category;
}
