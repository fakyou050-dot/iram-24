import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, articleId, title, content, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch context articles
    const { data: recentArticles } = await supabase
      .from("articles")
      .select("title, category, description")
      .order("published_at", { ascending: false })
      .limit(15);

    const context = recentArticles?.map((a: any) => `- [${a.category}] ${a.title}`).join("\n") || "";
    const lang = language === "EN" ? "English" : "Arabic";

    let systemPrompt = "";
    let userPrompt = "";
    let toolDef: any = null;

    switch (action) {
      case "improve_title":
        systemPrompt = `You are an expert journalist and headline writer. Generate a catchy, SEO-optimized title that preserves the original topic. Write in ${lang}. Each call should produce a DIFFERENT variation.`;
        userPrompt = `Original title: "${title}"\n\nGenerate a new, improved title. Keep the same subject matter but make it more engaging and clickable.`;
        toolDef = {
          name: "improved_title",
          description: "Return improved title",
          parameters: {
            type: "object",
            properties: { newTitle: { type: "string" } },
            required: ["newTitle"]
          }
        };
        break;

      case "generate_content":
        systemPrompt = `You are a professional news journalist. Write in ${lang} with proper journalistic style. Use clear paragraphs, avoid repetition. SEO optimized.\n\nRecent articles for context:\n${context}`;
        userPrompt = content
          ? `Rewrite this article without changing the meaning. Title: "${title}"\n\nContent:\n${content}`
          : `Generate a complete news article based on this title: "${title}"\n\nWrite 300-500 words, professional journalistic style.`;
        toolDef = {
          name: "article_content",
          description: "Return article content",
          parameters: {
            type: "object",
            properties: { newContent: { type: "string" }, summary: { type: "string" } },
            required: ["newContent", "summary"]
          }
        };
        break;

      case "improve_content":
        systemPrompt = `You are a senior editor. Improve the writing quality, make it more precise and professional. Preserve the original idea and facts. Write in ${lang}.`;
        userPrompt = `Title: "${title}"\n\nContent to improve:\n${content}`;
        toolDef = {
          name: "improved_content",
          description: "Return improved content",
          parameters: {
            type: "object",
            properties: { newContent: { type: "string" } },
            required: ["newContent"]
          }
        };
        break;

      case "full_rewrite":
        systemPrompt = `You are a top-tier journalist. Create a completely new version of this article using up-to-date information. Write in proper ${lang} style. SEO optimized, no repetition. 400-600 words.\n\nRecent context:\n${context}`;
        userPrompt = `Original title: "${title}"\nOriginal content: ${content || "(no content)"}\n\nFully rewrite this article from scratch.`;
        toolDef = {
          name: "rewritten_article",
          description: "Return fully rewritten article",
          parameters: {
            type: "object",
            properties: {
              newTitle: { type: "string" },
              newContent: { type: "string" },
              summary: { type: "string" }
            },
            required: ["newTitle", "newContent", "summary"]
          }
        };
        break;

      case "seo_optimize":
        systemPrompt = `You are an SEO expert for news websites. Extract keywords and generate hashtags. Write in ${lang}.`;
        userPrompt = `Title: "${title}"\nContent: ${content || "(no content)"}\n\nExtract SEO keywords and generate relevant hashtags.`;
        toolDef = {
          name: "seo_data",
          description: "Return SEO optimization data",
          parameters: {
            type: "object",
            properties: {
              keywords: { type: "array", items: { type: "string" } },
              hashtags: { type: "array", items: { type: "string" } },
              metaDescription: { type: "string" }
            },
            required: ["keywords", "hashtags", "metaDescription"]
          }
        };
        break;

      case "clean_text":
        systemPrompt = `You are a text cleanup engine. Remove special characters, fix spacing, fix minor spelling errors, format paragraphs clearly. Preserve all meaning and facts. Output clean text only in ${lang}.`;
        userPrompt = `Clean up this text:\n\n${content}`;
        toolDef = {
          name: "cleaned_text",
          description: "Return cleaned text",
          parameters: {
            type: "object",
            properties: { cleanedContent: { type: "string" } },
            required: ["cleanedContent"]
          }
        };
        break;

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [{ type: "function", function: { name: toolDef.name, description: toolDef.description, parameters: toolDef.parameters } }],
        tool_choice: { type: "function", function: { name: toolDef.name } }
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI error:", response.status, errText);
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited, try again" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let result: any;
    if (toolCall) {
      result = JSON.parse(toolCall.function.arguments);
    } else {
      const c = data.choices?.[0]?.message?.content || "{}";
      result = JSON.parse(c);
    }

    // Save history if articleId provided
    if (articleId && (action === "improve_title" || action === "generate_content" || action === "improve_content" || action === "full_rewrite")) {
      await supabase.from("article_history").insert({
        article_id: articleId,
        old_title: title,
        old_content: content,
        action_type: action,
        modified_by: "ai"
      });
    }

    return new Response(JSON.stringify({ action, ...result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (e) {
    console.error("AI article tools error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
