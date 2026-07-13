/**
 * Free AI module — uses Pollinations.ai (no API key needed).
 * Optionally uses Google Gemini if VITE_GEMINI_API_KEY is set.
 */

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

async function askAI(prompt: string, retries = 2): Promise<string> {
  // Try Gemini first if key is available and valid
  if (GEMINI_KEY && GEMINI_KEY.startsWith("AIza")) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch {}
  }

  // Fallback: Pollinations.ai (free, no key needed)
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Shorten prompt if too long (max ~2000 chars for URL)
      const shortPrompt = prompt.length > 2000 ? prompt.slice(0, 2000) + "\n\nأكمل..." : prompt;
      const encoded = encodeURIComponent(shortPrompt);
      const res = await fetch(`https://text.pollinations.ai/${encoded}`, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(45000),
      });

      if (res.status === 429) {
        // Rate limited — wait and retry
        await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
        continue;
      }

      if (res.ok) {
        const text = await res.text();
        if (text.trim()) return text.trim();
      }
    } catch (e: any) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }
    }
  }

  throw new Error("فشل الاتصال بالذكاء الاصطناعي. حاول مرة أخرى.");
}

// ─── Helper: parse structured response ───────────────────

function parseSections(text: string, sections: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < sections.length; i++) {
    const key = sections[i];
    const nextKey = sections[i + 1];
    const regex = nextKey
      ? new RegExp(`---${key}---\\s*([\\s\\S]*?)(?=---${nextKey}---|$)`)
      : new RegExp(`---${key}---\\s*([\\s\\S]*?)$`);
    const match = text.match(regex);
    result[key] = match?.[1]?.trim() || "";
  }
  return result;
}

// ─── Public API ───────────────────────────────────────────

export async function improveTitle(title: string, language: string): Promise<string> {
  const lang = language === "AR" ? "العربية" : "English";
  const text = await askAI(`حرّر هذا العنوان بال${lang} ليكون أقصر وأجذب:\n"${title}"\nالعنوان فقط:`);
  return text.replace(/^["']|["']$/g, "").trim() || title;
}

export async function generateContent(title: string, language: string): Promise<{ content: string; summary: string }> {
  const lang = language === "AR" ? "العربية" : "English";
  const text = await askAI(
    `اكتب مقال خبري بال${lang}:\n"${title}"\n---CONTENT---\n3 فقرات\n---SUMMARY---\nملخص سطر واحد`
  );
  const parsed = parseSections(text, ["CONTENT", "SUMMARY"]);
  return { content: parsed.CONTENT || text.trim(), summary: parsed.SUMMARY || "" };
}

export async function improveContent(content: string, language: string): Promise<string> {
  const lang = language === "AR" ? "العربية" : "English";
  const shortContent = content.slice(0, 1500);
  const text = await askAI(`حسّن هذا النص بال${lang} - أصلح الأخطاء واجعله احترافي:\n${shortContent}\nالنص المحسّن:`);
  return text.trim() || content;
}

export async function fullRewrite(title: string, content: string, language: string): Promise<{ title: string; content: string; summary: string }> {
  const lang = language === "AR" ? "العربية" : "English";
  const shortContent = content.slice(0, 1000);
  const text = await askAI(
    `أعد كتابة بال${lang}:\nعنوان: "${title}"\nمحتوى: ${shortContent}\n---TITLE---\nعنوان جديد\n---CONTENT---\nمحتوى جديد\n---SUMMARY---\nملخص`
  );
  const parsed = parseSections(text, ["TITLE", "CONTENT", "SUMMARY"]);
  return { title: parsed.TITLE || title, content: parsed.CONTENT || content, summary: parsed.SUMMARY || "" };
}

export async function seoOptimize(title: string, content: string, language: string): Promise<{ keywords: string[]; metaDescription: string }> {
  const shortContent = content.slice(0, 800);
  const text = await askAI(
    `SEO للعنوان: "${title}"\n---KEYWORDS---\n10 كلمات مفتاحية مفصولة بفاصلة\n---META---\nوصف 150 حرف`
  );
  const parsed = parseSections(text, ["KEYWORDS", "META"]);
  return {
    keywords: (parsed.KEYWORDS || "").split(",").map((k) => k.trim()).filter(Boolean),
    metaDescription: parsed.META || "",
  };
}

export async function cleanText(content: string, language: string): Promise<string> {
  const lang = language === "AR" ? "العربية" : "English";
  const shortContent = content.slice(0, 1500);
  const text = await askAI(`نظّف هذا النص بال${lang} - أزل التكرار والأخطاء:\n${shortContent}\nالنص النظيف:`);
  return text.trim() || content;
}

export async function analyzeNews(newsText: string): Promise<{
  betterTitle: string;
  category: string;
  summary: string;
  analysis: string;
  relatedTopics: string[];
}> {
  const shortText = newsText.slice(0, 1200);
  const text = await askAI(
    `حلّل هذا الخبر:\n${shortText}\n---TITLE---\nعنوان أفضل\n---CATEGORY---\nتصنيف واحد\n---SUMMARY---\nملخص\n---ANALYSIS---\nتحليل\n---TOPICS---\nمواضيع متعلقة`
  );
  const parsed = parseSections(text, ["TITLE", "CATEGORY", "SUMMARY", "ANALYSIS", "TOPICS"]);
  return {
    betterTitle: parsed.TITLE || "",
    category: parsed.CATEGORY || "",
    summary: parsed.SUMMARY || "",
    analysis: parsed.ANALYSIS || text.trim(),
    relatedTopics: (parsed.TOPICS || "").split(",").map((t) => t.trim()).filter(Boolean),
  };
}

export function isAIConfigured(): boolean {
  return true; // Pollinations.ai always available
}
