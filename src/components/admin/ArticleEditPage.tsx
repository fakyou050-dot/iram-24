import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { compressImage } from "@/lib/imageCompression";
import {
  Sparkles, Loader2, Upload, X, Wand2, RefreshCw, PenLine,
  FileText, Hash, Eraser, Save, ArrowRight, Image as ImageIcon,
  ExternalLink, Eye, EyeOff, Download, Video, Link, AlertTriangle
} from "lucide-react";
import { improveTitle, generateContent, improveContent, fullRewrite, seoOptimize, cleanText, isAIConfigured } from "@/lib/ai";

interface ArticleEditPageProps {
  articleId: string;
  onBack: () => void;
}

const ArticleEditPage = ({ articleId, onBack }: ArticleEditPageProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("AR");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [isBreaking, setIsBreaking] = useState(false);
  const [breakingDuration, setBreakingDuration] = useState(60);
  const [sourceUrl, setSourceUrl] = useState("");
  const [showSource, setShowSource] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [fetchingContent, setFetchingContent] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [newVideo, setNewVideo] = useState<File | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [sourceEditable, setSourceEditable] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("articles").select("*").eq("id", articleId).single();
      if (data) {
        setTitle(data.title);
        setContent(data.content || "");
        setDescription(data.description || "");
        setImageUrl(data.image_url || "");
        setAuthorName(data.author_name || "");
        setCategory(data.category);
        setLanguage(data.language);
        setSourceUrl(data.url || "");
        setSeoKeywords((data as any).seo_keywords || "");
        setIsBreaking((data as any).is_breaking || false);
        setBreakingDuration((data as any).breaking_duration || 60);
        setShowSource((data as any).show_source !== false);
        setVideoUrl((data as any).video_url || "");
      }
    };
    load();
  }, [articleId]);

  const callAI = async (action: string) => {
    if (!isAIConfigured()) {
      toast.error("مفتاح Gemini غير مُعرّف. أضف VITE_GEMINI_API_KEY في .env");
      return;
    }
    setAiLoading(action);
    try {
      switch (action) {
        case "improve_title": {
          const newTitle = await improveTitle(title, language);
          setTitle(newTitle);
          toast.success("تم تحسين العنوان");
          break;
        }
        case "generate_content": {
          const gen = await generateContent(title, language);
          setContent(gen.content);
          if (gen.summary) setDescription(gen.summary);
          toast.success("تم توليد المحتوى");
          break;
        }
        case "improve_content": {
          const improved = await improveContent(content, language);
          setContent(improved);
          toast.success("تم تحسين المحتوى");
          break;
        }
        case "full_rewrite": {
          const rewritten = await fullRewrite(title, content, language);
          setTitle(rewritten.title);
          setContent(rewritten.content);
          if (rewritten.summary) setDescription(rewritten.summary);
          toast.success("تمت إعادة الكتابة بالكامل");
          break;
        }
        case "seo_optimize": {
          const seo = await seoOptimize(title, content, language);
          if (seo.keywords.length) setSeoKeywords(seo.keywords.join(", "));
          if (seo.metaDescription) setDescription(seo.metaDescription);
          toast.success("تم تحسين SEO");
          break;
        }
        case "clean_text": {
          const cleaned = await cleanText(content, language);
          setContent(cleaned);
          toast.success("تم تنظيف النص");
          break;
        }
      }
    } catch (e: any) { toast.error(e.message || "خطأ في الذكاء الاصطناعي"); }
    setAiLoading(null);
  };

  const fetchOriginalContent = async () => {
    if (!sourceUrl || sourceUrl.startsWith("#")) { toast.error("لا يوجد رابط مصدر صالح"); return; }
    setFetchingContent(true);
    try {
      // Use CORS proxy to fetch article content
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(sourceUrl)}`;
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      // Extract text content from HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      // Try article or main content first
      const article = doc.querySelector("article, .article-content, .post-content, .entry-content, main")
        || doc.body;
      // Remove scripts and styles
      article.querySelectorAll("script, style, nav, header, footer, .ad, .advertisement").forEach((el) => el.remove());
      const text = article.textContent?.replace(/\s+/g, " ").trim().slice(0, 5000) || "";
      const descMeta = doc.querySelector("meta[name='description']")?.getAttribute("content") || "";
      if (text.length > 50) {
        setContent(text);
        if (descMeta) setDescription(descMeta.slice(0, 300));
        toast.success("تم جلب المحتوى من المصدر");
      } else {
        toast.error("لم يتم العثور على محتوى كافٍ");
      }
    } catch { toast.error("فشل جلب المحتوى من المصدر"); }
    setFetchingContent(false);
  };

  const handleImageSelect = (file: File) => {
    setNewImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setNewImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleVideoSelect = (file: File) => {
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) { toast.error("حجم الفيديو أكبر من 500MB"); return; }
    setNewVideo(file);
    toast.info(`تم اختيار الفيديو: ${file.name}`);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalImageUrl = imageUrl;
      if (newImage) {
        const compressed = await compressImage(newImage, { maxWidth: 1920, quality: 0.82 });
        const ext = compressed.name.split(".").pop() || "webp";
        const fileName = `main/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("article-images").upload(fileName, compressed, {
          contentType: compressed.type,
          cacheControl: "31536000",
        });
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("article-images").getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      }

      let finalVideoUrl = videoUrl;
      if (newVideo) {
        setUploadingVideo(true);
        const ext = newVideo.name.split(".").pop();
        const fileName = `videos/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: vErr } = await supabase.storage.from("article-videos").upload(fileName, newVideo);
        if (vErr) throw vErr;
        const { data: vUrl } = supabase.storage.from("article-videos").getPublicUrl(fileName);
        finalVideoUrl = vUrl.publicUrl;
        setUploadingVideo(false);
      }

      const { error } = await supabase.from("articles").update({
        title,
        content: content || null,
        description: description || null,
        image_url: finalImageUrl || null,
        author_name: authorName || null,
        category,
        seo_keywords: seoKeywords || null,
        is_breaking: isBreaking,
        breaking_duration: isBreaking ? breakingDuration : null,
        url: sourceUrl,
        show_source: showSource,
        video_url: finalVideoUrl || null,
      } as any).eq("id", articleId);

      if (error) throw error;
      toast.success("تم الحفظ والنشر");
    } catch (e: any) { toast.error(e.message || "خطأ في الحفظ"); }
    setSaving(false);
    setUploadingVideo(false);
  };

  const aiTools = [
    { action: "improve_title", label: "تحسين العنوان", icon: Wand2, color: "text-yellow-400" },
    { action: "generate_content", label: content ? "إعادة صياغة" : "توليد محتوى", icon: FileText, color: "text-blue-400" },
    { action: "improve_content", label: "تحسين المحتوى", icon: PenLine, color: "text-green-400" },
    { action: "full_rewrite", label: "إعادة كتابة كاملة", icon: RefreshCw, color: "text-purple-400" },
    { action: "seo_optimize", label: "تحسين SEO", icon: Hash, color: "text-orange-400" },
    { action: "clean_text", label: "تنظيف النص", icon: Eraser, color: "text-cyan-400" },
  ];

  const displayImage = newImagePreview || imageUrl;

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1 text-primary text-sm font-medium">
        <ArrowRight size={16} /> العودة للقائمة
      </button>

      <div className="bg-secondary rounded-lg p-4 space-y-4">
        {/* AI Tools Bar */}
        <div>
          <p className="text-foreground text-xs font-bold mb-2">🤖 أدوات الذكاء الاصطناعي</p>
          <div className="grid grid-cols-3 gap-1.5">
            {aiTools.map(({ action, label, icon: Icon, color }) => (
              <button key={action} onClick={() => callAI(action)}
                disabled={aiLoading !== null}
                className="flex items-center justify-center gap-1 py-2 px-1 bg-card rounded-lg text-xs font-medium border border-border hover:border-primary transition-colors disabled:opacity-50">
                {aiLoading === action ? <Loader2 size={12} className="animate-spin" /> : <Icon size={12} className={color} />}
                <span className="text-foreground truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Source URL with Show/Hide & Edit */}
        <div className="bg-card rounded-lg p-3 border border-border space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-foreground text-xs font-bold flex items-center gap-1">
              <ExternalLink size={12} className="text-primary" /> رابط المصدر
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setSourceEditable(!sourceEditable)}
                className="text-muted-foreground hover:text-foreground p-1" title="تعديل الرابط">
                <Link size={13} />
              </button>
              <button onClick={() => setShowSource(!showSource)}
                className={`p-1 transition-colors ${showSource ? 'text-green-400' : 'text-orange-400'}`}
                title={showSource ? "إخفاء الرابط من واجهة الخبر" : "إظهار الرابط في واجهة الخبر"}>
                {showSource ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${showSource ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
              {showSource ? "ظاهر للمستخدم" : "مخفي عن المستخدم"}
            </span>
          </div>
          <input
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            readOnly={!sourceEditable}
            dir="ltr"
            placeholder="رابط المصدر الأصلي"
            className={`w-full px-3 py-1.5 rounded-lg bg-input text-foreground border border-border text-xs font-mono ${!sourceEditable ? 'opacity-70' : ''}`}
          />
          {sourceUrl && !sourceUrl.startsWith("#") && (
            <button onClick={fetchOriginalContent} disabled={fetchingContent}
              className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium disabled:opacity-50 transition-colors">
              {fetchingContent ? <><Loader2 size={12} className="animate-spin" /> جاري الجلب...</> : <><Download size={12} /> جلب المحتوى من المصدر</>}
            </button>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="text-foreground text-sm mb-1 block">العنوان</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-input text-foreground border border-border text-sm" />
        </div>

        {/* Content */}
        <div>
          <label className="text-foreground text-sm mb-1 block">المحتوى</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10}
            className="w-full px-3 py-2 rounded-lg bg-input text-foreground border border-border text-sm resize-y" />
        </div>

        {/* Description */}
        <div>
          <label className="text-foreground text-sm mb-1 block">الوصف المختصر</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
            className="w-full px-3 py-2 rounded-lg bg-input text-foreground border border-border text-sm resize-y" />
        </div>

        {/* Image */}
        <div>
          <label className="text-foreground text-sm mb-1 block">الصورة</label>
          <input ref={imageRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])} />
          {displayImage ? (
            <div className="relative">
              <img src={displayImage} alt="" className="w-full rounded-lg object-contain max-h-48 bg-card" />
              <div className="absolute top-2 left-2 flex gap-1">
                <button onClick={() => imageRef.current?.click()} className="bg-background/80 rounded-full p-1.5"><Upload size={12} className="text-foreground" /></button>
                <button onClick={() => { setImageUrl(""); setNewImage(null); setNewImagePreview(null); }} className="bg-background/80 rounded-full p-1.5"><X size={12} className="text-foreground" /></button>
              </div>
            </div>
          ) : (
            <button onClick={() => imageRef.current?.click()}
              className="w-full py-6 border-2 border-dashed border-border rounded-lg flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground">
              <ImageIcon size={20} /><span className="text-xs">رفع صورة</span>
            </button>
          )}
        </div>

        {/* Video Upload */}
        <div>
          <label className="text-foreground text-sm mb-1 block flex items-center gap-1.5">
            <Video size={14} className="text-primary" /> فيديو (اختياري)
          </label>
          <input ref={videoRef} type="file" accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,video/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleVideoSelect(e.target.files[0])} />
          {videoUrl || newVideo ? (
            <div className="space-y-2">
              {videoUrl && !newVideo && (
                <video src={videoUrl} controls className="w-full rounded-lg max-h-48 bg-card" />
              )}
              {newVideo && (
                <p className="text-xs text-muted-foreground bg-card rounded-lg p-2 border border-border">
                  📹 {newVideo.name} ({(newVideo.size / 1024 / 1024).toFixed(1)} MB)
                </p>
              )}
              <div className="flex gap-2">
                <button onClick={() => videoRef.current?.click()} className="text-xs text-primary hover:underline">تغيير الفيديو</button>
                <button onClick={() => { setVideoUrl(""); setNewVideo(null); }} className="text-xs text-destructive hover:underline">حذف الفيديو</button>
              </div>
            </div>
          ) : (
            <button onClick={() => videoRef.current?.click()}
              className="w-full py-4 border-2 border-dashed border-border rounded-lg flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Video size={20} /><span className="text-xs">رفع فيديو (MP4, WEBM, MOV)</span>
            </button>
          )}
        </div>

        {/* Author */}
        <div>
          <label className="text-foreground text-sm mb-1 block">الكاتب</label>
          <input value={authorName} onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-input text-foreground border border-border text-sm" />
        </div>

        {/* SEO Keywords */}
        <div>
          <label className="text-foreground text-sm mb-1 block">كلمات مفتاحية / هاشتاقات</label>
          <input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="كلمة1, كلمة2, كلمة3"
            className="w-full px-3 py-2 rounded-lg bg-input text-foreground border border-border text-sm" />
          {seoKeywords && (
            <div className="flex flex-wrap gap-1 mt-2">
              {seoKeywords.split(",").map((k, i) => k.trim() && (
                <span key={i} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">#{k.trim()}</span>
              ))}
            </div>
          )}
        </div>

        {/* Breaking News Toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isBreaking} onChange={(e) => setIsBreaking(e.target.checked)} className="rounded border-border" />
            <span className="text-foreground text-sm">🚨 خبر عاجل</span>
          </label>
          {isBreaking && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-xs">مدة:</span>
              <input type="number" value={breakingDuration} onChange={(e) => setBreakingDuration(+e.target.value)} min={10} max={3600}
                className="w-16 px-2 py-1 rounded bg-input text-foreground border border-border text-xs" />
              <span className="text-muted-foreground text-xs">ث</span>
            </div>
          )}
        </div>

        {/* Save / Cancel */}
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving || uploadingVideo}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-bold disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {uploadingVideo ? "جاري رفع الفيديو..." : saving ? "جاري الحفظ..." : "💾 حفظ ونشر"}
          </button>
          <button onClick={onBack} className="px-6 py-3 text-muted-foreground rounded-lg text-sm border border-border">❌ إلغاء</button>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditPage;
