/**
 * Free AI module using Google Gemini API (no Edge Functions needed).
 * Uses the free tier: https://ai.google.dev/
 * 
 * To activate:
 * 1. Go to https://aistudio.google.com/apikey
 * 2. Create a free API key
 * 3. Add it to .env as VITE_GEMINI_API_KEY
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface AIResponse {
  text: string;
  error?: string;
}

async function callGemini(prompt: string): Promise<AIResponse> {
  if (!GEMINI_API_KEY) {
    return { text: "", error: "مفتاح Gemini غير مُعرّف. أضف VITE_GEMINI_API_KEY في .env" };
  }

  try {
    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 0.9,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { text: "", error: err?.error?.message || `API Error ${res.status}` };
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return { text };
  } catch (e: any) {
    return { text: "", error: e.message || "Network error" };
  }
}

// ─── Public API ───────────────────────────────────────────

export async function improveTitle(title: string, language: string): Promise<string> {
  const lang = language === "AR" ? "العربية" : "English";
  const { text } = await callGemini(
    `أنت محرر أخبار محترف. حسّن هذا العنوان الخبري ليكون أكثر جاذبية ووضوحًا باللغة ${lang}.\n\nالعنوان الأصلي: ${title}\n\nأعد العنوان المحسّن فقط بدون أي شرح إضافي.`
  );
  return text.trim() || title;
}

export async function generateContent(title: string, language: string): Promise<{ content: string; summary: string }> {
  const lang = language === "AR" ? "العربية" : "English";
  const { text } = await callGemini(
    `أنت كاتب أخبار محترف. اكتب مقالًا إخباريًا كاملًا باللغة ${lang} بناءً على هذا العنوان.\n\nالعنوان: ${title}\n\nالمطلوب:\n1. محتوى المقال (3-5 فقرات)\n2. ملخص في سطر واحد\n\nالصيغة:\n---CONTENT---\n[المحتوى]\n---SUMMARY---\n[الملخص]`
  );

  const contentMatch = text.match(/---CONTENT---\s*([\s\S]*?)(?=---SUMMARY---|$)/);
  const summaryMatch = text.match(/---SUMMARY---\s*([\s\S]*?)$/);

  return {
    content: contentMatch?.[1]?.trim() || text.trim(),
    summary: summaryMatch?.[1]?.trim() || "",
  };
}

export async function improveContent(content: string, language: string): Promise<string> {
  const lang = language === "AR" ? "العربية" : "English";
  const { text } = await callGemini(
    `أنت محرر أخبار محترف. حسّن هذا المحتوى الخبري باللغة ${lang}:\n\n- اجعله أكثر وضوحًا واحترافية\n- أصلح الأخطاء الإملائية والنحوية\n- حافظ على نفس المعنى\n\n${content}\n\nأعد المحتوى المحسّن فقط.`
  );
  return text.trim() || content;
}

export async function fullRewrite(title: string, content: string, language: string): Promise<{ title: string; content: string; summary: string }> {
  const lang = language === "AR" ? "العربية" : "English";
  const { text } = await callGemini(
    `أنت كاتب أخبار محترف. أعد كتابة هذا المقال بالكامل باللغة ${lang}:\n\nالعنوان: ${title}\nالمحتوى: ${content}\n\nالمطلوب:\n1. عنوان جديد جذاب\n2. محتوى جديد احترافي\n3. ملخص\n\nالصيغة:\n---TITLE---\n[العنوان]\n---CONTENT---\n[المحتوى]\n---SUMMARY---\n[الملخص]`
  );

  const titleMatch = text.match(/---TITLE---\s*([\s\S]*?)(?=---CONTENT---|$)/);
  const contentMatch = text.match(/---CONTENT---\s*([\s\S]*?)(?=---SUMMARY---|$)/);
  const summaryMatch = text.match(/---SUMMARY---\s*([\s\S]*?)$/);

  return {
    title: titleMatch?.[1]?.trim() || title,
    content: contentMatch?.[1]?.trim() || content,
    summary: summaryMatch?.[1]?.trim() || "",
  };
}

export async function seoOptimize(title: string, content: string, language: string): Promise<{ keywords: string[]; metaDescription: string }> {
  const lang = language === "AR" ? "العربية" : "English";
  const { text } = await callGemini(
    `أنت خبير SEO. حلّل هذا المقال وأعطِ:\n1. كلمات مفتاحية (10 كلمات مفصولة بفاصلة)\n2. وصف meta للبحث (150 حرف)\n\nالعنوان: ${title}\nالمحتوى: ${content}\n\nالصيغة:\n---KEYWORDS---\n[الكلمات]\n---META---\n[الوصف]`
  );

  const keywordsMatch = text.match(/---KEYWORDS---\s*([\s\S]*?)(?=---META---|$)/);
  const metaMatch = text.match(/---META---\s*([\s\S]*?)$/);

  return {
    keywords: (keywordsMatch?.[1]?.trim() || "").split(",").map((k) => k.trim()).filter(Boolean),
    metaDescription: metaMatch?.[1]?.trim() || "",
  };
}

export async function cleanText(content: string, language: string): Promise<string> {
  const lang = language === "AR" ? "العربية" : "English";
  const { text } = await callGemini(
    `نظّف هذا النص باللغة ${lang}:\n\n- أزل التكرار\n- أصلح الأخطاء\n- اجعله متسقًا\n\n${content}\n\nأعد النص النظيف فقط.`
  );
  return text.trim() || content;
}

export async function analyzeNews(newsText: string): Promise<{
  betterTitle: string;
  category: string;
  summary: string;
  analysis: string;
  relatedTopics: string[];
}> {
  const { text } = await callGemini(
    `أنت باحث سياسي وتحليلي محترف. حلّل هذا الخبر:

${newsText}

المطلوب:
1. عنوان أفضل
2. تصنيف (سياسة/اقتصاد/رياضة/تكنولوجيا/صحة/عربي/دولي/محلي)
3. ملخص في سطرين
4. تحليل عميق (3 فقرات)
5. مواضيع ذات صلة (5 مواضيع)

الصيغة:
---TITLE---
[العنوان]
---CATEGORY---
[التصنيف]
---SUMMARY---
[الملخص]
---ANALYSIS---
[التحليل]
---TOPICS---
[الموضوع1, الموضوع2, ...]`
  );

  const titleMatch = text.match(/---TITLE---\s*([\s\S]*?)(?=---CATEGORY---|$)/);
  const catMatch = text.match(/---CATEGORY---\s*([\s\S]*?)(?=---SUMMARY---|$)/);
  const sumMatch = text.match(/---SUMMARY---\s*([\s\S]*?)(?=---ANALYSIS---|$)/);
  const anaMatch = text.match(/---ANALYSIS---\s*([\s\S]*?)(?=---TOPICS---|$)/);
  const topicsMatch = text.match(/---TOPICS---\s*([\s\S]*?)$/);

  return {
    betterTitle: titleMatch?.[1]?.trim() || "",
    category: catMatch?.[1]?.trim() || "",
    summary: sumMatch?.[1]?.trim() || "",
    analysis: anaMatch?.[1]?.trim() || text.trim(),
    relatedTopics: (topicsMatch?.[1]?.trim() || "").split(",").map((t) => t.trim()).filter(Boolean),
  };
}

export function isAIConfigured(): boolean {
  return !!GEMINI_API_KEY;
}
