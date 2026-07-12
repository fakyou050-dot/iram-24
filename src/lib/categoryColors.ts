// Category → gradient + icon. Premium placeholder for articles without images.

export interface CategoryStyle {
  gradient: string;
  emoji: string;
  accent: string;
}

const STYLES: Record<string, CategoryStyle> = {
  // Arabic — new unified sections
  "سياسة":       { gradient: "linear-gradient(135deg,hsl(0 55% 28%),hsl(0 70% 14%))",     emoji: "🏛️", accent: "0 75% 55%" },
  "اقتصاد":      { gradient: "linear-gradient(135deg,hsl(38 75% 30%),hsl(28 80% 14%))",   emoji: "📈", accent: "38 90% 55%" },
  "رياضة":       { gradient: "linear-gradient(135deg,hsl(140 55% 25%),hsl(150 65% 12%))", emoji: "⚽", accent: "140 65% 50%" },
  "تكنولوجيا":   { gradient: "linear-gradient(135deg,hsl(260 55% 28%),hsl(280 65% 14%))", emoji: "💻", accent: "270 70% 65%" },
  "علوم":        { gradient: "linear-gradient(135deg,hsl(200 70% 26%),hsl(220 75% 12%))", emoji: "🔬", accent: "200 80% 60%" },
  "صحة":         { gradient: "linear-gradient(135deg,hsl(170 60% 26%),hsl(180 70% 12%))", emoji: "🩺", accent: "170 75% 55%" },
  "ثقافة وفنون": { gradient: "linear-gradient(135deg,hsl(320 55% 28%),hsl(340 65% 14%))", emoji: "🎨", accent: "320 75% 60%" },
  "مجتمع":       { gradient: "linear-gradient(135deg,hsl(25 60% 28%),hsl(15 70% 14%))",   emoji: "👥", accent: "25 80% 55%" },
  "مقالات":      { gradient: "linear-gradient(135deg,hsl(220 30% 25%),hsl(220 35% 12%))", emoji: "✍️", accent: "220 50% 60%" },
  "منوعات":      { gradient: "linear-gradient(135deg,hsl(280 35% 25%),hsl(260 45% 12%))", emoji: "📰", accent: "280 55% 60%" },

  // English mirror
  "Politics":   { gradient: "linear-gradient(135deg,hsl(0 55% 28%),hsl(0 70% 14%))",     emoji: "🏛️", accent: "0 75% 55%" },
  "Economy":    { gradient: "linear-gradient(135deg,hsl(38 75% 30%),hsl(28 80% 14%))",   emoji: "📈", accent: "38 90% 55%" },
  "Sports":     { gradient: "linear-gradient(135deg,hsl(140 55% 25%),hsl(150 65% 12%))", emoji: "⚽", accent: "140 65% 50%" },
  "Technology": { gradient: "linear-gradient(135deg,hsl(260 55% 28%),hsl(280 65% 14%))", emoji: "💻", accent: "270 70% 65%" },
  "Science":    { gradient: "linear-gradient(135deg,hsl(200 70% 26%),hsl(220 75% 12%))", emoji: "🔬", accent: "200 80% 60%" },
  "Health":     { gradient: "linear-gradient(135deg,hsl(170 60% 26%),hsl(180 70% 12%))", emoji: "🩺", accent: "170 75% 55%" },
  "Arts":       { gradient: "linear-gradient(135deg,hsl(320 55% 28%),hsl(340 65% 14%))", emoji: "🎨", accent: "320 75% 60%" },
  "Society":    { gradient: "linear-gradient(135deg,hsl(25 60% 28%),hsl(15 70% 14%))",   emoji: "👥", accent: "25 80% 55%" },
  "Articles":   { gradient: "linear-gradient(135deg,hsl(220 30% 25%),hsl(220 35% 12%))", emoji: "✍️", accent: "220 50% 60%" },
  "Lifestyle":  { gradient: "linear-gradient(135deg,hsl(280 35% 25%),hsl(260 45% 12%))", emoji: "📰", accent: "280 55% 60%" },

  // Legacy aliases — old DB rows
  "محلي":  { gradient: "linear-gradient(135deg,hsl(0 55% 28%),hsl(0 70% 14%))", emoji: "🏛️", accent: "0 75% 55%" },
  "عربي":  { gradient: "linear-gradient(135deg,hsl(0 55% 28%),hsl(0 70% 14%))", emoji: "🏛️", accent: "0 75% 55%" },
  "دولي":  { gradient: "linear-gradient(135deg,hsl(0 55% 28%),hsl(0 70% 14%))", emoji: "🏛️", accent: "0 75% 55%" },
  "فنون":  { gradient: "linear-gradient(135deg,hsl(320 55% 28%),hsl(340 65% 14%))", emoji: "🎨", accent: "320 75% 60%" },
  "ثقافة": { gradient: "linear-gradient(135deg,hsl(320 55% 28%),hsl(340 65% 14%))", emoji: "📚", accent: "320 75% 60%" },
  "World": { gradient: "linear-gradient(135deg,hsl(0 55% 28%),hsl(0 70% 14%))", emoji: "🏛️", accent: "0 75% 55%" },
};

const DEFAULT: CategoryStyle = {
  gradient: "linear-gradient(135deg,hsl(220 45% 18%),hsl(220 50% 8%))",
  emoji: "📰",
  accent: "38 70% 55%",
};

export function categoryStyle(category: string | null | undefined): CategoryStyle {
  if (!category) return DEFAULT;
  return STYLES[category] || DEFAULT;
}
