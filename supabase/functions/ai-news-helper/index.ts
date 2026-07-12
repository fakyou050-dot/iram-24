import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text } = await req.json();
    if (!text) return new Response(JSON.stringify({ error: "No text provided" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Fetch recent articles from DB for context
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: recentArticles } = await supabase
      .from("articles")
      .select("title, category, description")
      .order("published_at", { ascending: false })
      .limit(20);

    const recentContext = recentArticles?.map((a: any) => `- [${a.category}] ${a.title}`).join("\n") || "No recent articles available.";

    const systemPrompt = `You are a senior political analyst and news researcher who studied political science at the University of Oxford. You provide expert-level analysis of news content.

Your capabilities:
1. **Deep Analysis**: Analyze news text with the depth of an academic researcher — identify key actors, motivations, geopolitical implications, and historical context.
2. **Cross-referencing**: Compare the provided text against the latest published articles on the website (provided below) to identify related coverage, contradictions, or complementary angles.
3. **Structured Output**: Produce professional, fact-based analysis — not simple text generation.

RECENT ARTICLES ON THE WEBSITE:
${recentContext}

When analyzing, you MUST return a JSON object with these fields:
- betterTitle: An improved, engaging, journalistically sound title in the same language as the input text
- category: Best category from [سياسة, اقتصاد, رياضة, تكنولوجيا, علوم, صحة, ثقافة وفنون, مجتمع, مقالات, منوعات, Politics, Economy, Sports, Technology, Science, Health, Arts, Society, Articles, Lifestyle]
- hashtags: Array of 5-7 relevant hashtags (without # symbol), including trending topic tags
- summary: A concise 2-3 sentence summary
- analysis: A detailed analytical paragraph (150-300 words) that includes:
  * Key context and background
  * Geopolitical or economic implications
  * Comparison with related recent coverage on the website
  * Professional assessment of the significance and potential developments
- relatedTopics: Array of 3-5 related topics or angles worth exploring
- credibilityNotes: Brief note on what to verify or potential bias in the source

Respond ONLY with valid JSON, no markdown.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text }
        ],
        tools: [{
          type: "function",
          function: {
            name: "analyze_news",
            description: "Perform deep analytical research on news content",
            parameters: {
              type: "object",
              properties: {
                betterTitle: { type: "string", description: "Improved journalistic title" },
                category: { type: "string", description: "Best category" },
                hashtags: { type: "array", items: { type: "string" }, description: "5-7 relevant hashtags" },
                summary: { type: "string", description: "2-3 sentence summary" },
                analysis: { type: "string", description: "Detailed analytical paragraph 150-300 words" },
                relatedTopics: { type: "array", items: { type: "string" }, description: "3-5 related topics" },
                credibilityNotes: { type: "string", description: "Credibility and bias notes" }
              },
              required: ["betterTitle", "category", "hashtags", "summary", "analysis", "relatedTopics", "credibilityNotes"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "analyze_news" } }
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited, try again later" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const content = data.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);
    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("AI helper error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
