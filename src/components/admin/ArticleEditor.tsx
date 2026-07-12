import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AR_CATEGORIES, EN_CATEGORIES } from "@/lib/newsUtils";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { compressImage } from "@/lib/imageCompression";

const ArticleEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [sourceName, setSourceName] = useState("Eram News");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState<"AR" | "EN">("AR");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
  const [authorImage, setAuthorImage] = useState<File | null>(null);
  const [authorImagePreview, setAuthorImagePreview] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const mainImageRef = useRef<HTMLInputElement>(null);
  const additionalImagesRef = useRef<HTMLInputElement>(null);
  const authorImageRef = useRef<HTMLInputElement>(null);

  const categories = language === "AR" ? AR_CATEGORIES.filter(c => c !== "الرئيسية") : EN_CATEGORIES.filter(c => c !== "Home");

  const handleFileSelect = (file: File, setter: (f: File) => void, previewSetter: (s: string) => void) => {
    setter(file);
    const reader = new FileReader();
    reader.onload = (e) => previewSetter(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAdditionalImages = (files: FileList) => {
    const newFiles = Array.from(files);
    setAdditionalImages(prev => [...prev, ...newFiles]);
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => setAdditionalPreviews(prev => [...prev, e.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    const compressed = await compressImage(file, { maxWidth: 1920, quality: 0.82 });
    const ext = compressed.name.split(".").pop() || "webp";
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("article-images").upload(fileName, compressed, {
      contentType: compressed.type,
      cacheControl: "31536000",
    });
    if (error) {
      console.error("Upload error:", error);
      return null;
    }
    const { data } = supabase.storage.from("article-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handlePublish = async () => {
    if (!title.trim()) { toast.error("عنوان المقال مطلوب"); return; }
    if (!category) { toast.error("اختر القسم"); return; }

    setPublishing(true);
    try {
      let imageUrl: string | null = null;
      let authorImageUrl: string | null = null;

      if (mainImage) {
        imageUrl = await uploadImage(mainImage, "main");
      }
      if (authorImage) {
        authorImageUrl = await uploadImage(authorImage, "authors");
      }

      // Build content with additional images embedded
      let fullContent = content;
      if (additionalImages.length > 0) {
        const uploadedUrls: string[] = [];
        for (const file of additionalImages) {
          const url = await uploadImage(file, "additional");
          if (url) uploadedUrls.push(url);
        }
        if (uploadedUrls.length > 0) {
          fullContent += "\n\n---\n\n" + uploadedUrls.map(u => `![](${u})`).join("\n\n");
        }
      }

      const hash = `manual_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      const { error } = await supabase.from("articles").insert({
        title: title.trim(),
        description: content.substring(0, 300) || null,
        content: fullContent || null,
        url: `#manual-${hash}`,
        image_url: imageUrl,
        category,
        language,
        author_name: authorName || null,
        author_image_url: authorImageUrl,
        is_manual: true,
        hash,
        published_at: new Date().toISOString(),
        source_id: null,
      });

      if (error) throw error;

      toast.success("تم نشر المقال بنجاح!");
      // Reset form
      setTitle(""); setContent(""); setAuthorName(""); setSourceName("Eram News");
      setCategory(""); setMainImage(null); setMainImagePreview(null);
      setAdditionalImages([]); setAdditionalPreviews([]);
      setAuthorImage(null); setAuthorImagePreview(null);
    } catch (e: any) {
      toast.error(e.message || "حدث خطأ أثناء النشر");
    }
    setPublishing(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-foreground font-bold">✍️ نشر مقال جديد</h2>

      <div className="bg-secondary rounded-lg p-4 space-y-4">
        {/* Language */}
        <div>
          <label className="text-foreground text-sm mb-1.5 block">القسم المستهدف</label>
          <div className="flex gap-2">
            <button onClick={() => { setLanguage("AR"); setCategory(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${language === "AR" ? "bg-primary text-primary-foreground" : "bg-input text-muted-foreground"}`}>
              🇸🇦 عربي
            </button>
            <button onClick={() => { setLanguage("EN"); setCategory(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${language === "EN" ? "bg-primary text-primary-foreground" : "bg-input text-muted-foreground"}`}>
              🌍 Global
            </button>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-foreground text-sm mb-1.5 block">التصنيف</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-input text-foreground border border-border text-sm">
            <option value="">اختر التصنيف</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="text-foreground text-sm mb-1.5 block">عنوان المقال *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="أدخل عنوان المقال"
            className="w-full px-3 py-2 rounded-lg bg-input text-foreground border border-border text-sm" />
        </div>

        {/* Content */}
        <div>
          <label className="text-foreground text-sm mb-1.5 block">محتوى المقال</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)}
            placeholder="اكتب محتوى المقال هنا..."
            rows={6}
            className="w-full px-3 py-2 rounded-lg bg-input text-foreground border border-border text-sm resize-y" />
        </div>

        {/* Main Image */}
        <div>
          <label className="text-foreground text-sm mb-1.5 block">صورة المقال الرئيسية</label>
          <input ref={mainImageRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], setMainImage, setMainImagePreview)} />
          {mainImagePreview ? (
            <div className="relative">
              <img src={mainImagePreview} alt="" className="w-full rounded-lg object-contain max-h-48 bg-card" />
              <button onClick={() => { setMainImage(null); setMainImagePreview(null); }}
                className="absolute top-2 left-2 bg-background/80 rounded-full p-1">
                <X size={14} className="text-foreground" />
              </button>
            </div>
          ) : (
            <button onClick={() => mainImageRef.current?.click()}
              className="w-full py-6 border-2 border-dashed border-border rounded-lg flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Upload size={20} />
              <span className="text-xs">اضغط لرفع صورة</span>
            </button>
          )}
        </div>

        {/* Additional Images */}
        <div>
          <label className="text-foreground text-sm mb-1.5 block">صور إضافية</label>
          <input ref={additionalImagesRef} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => e.target.files && handleAdditionalImages(e.target.files)} />
          <div className="flex flex-wrap gap-2">
            {additionalPreviews.map((p, i) => (
              <div key={i} className="relative w-20 h-20">
                <img src={p} alt="" className="w-full h-full rounded-lg object-cover" />
                <button onClick={() => removeAdditionalImage(i)}
                  className="absolute -top-1 -left-1 bg-primary rounded-full p-0.5">
                  <X size={10} className="text-primary-foreground" />
                </button>
              </div>
            ))}
            <button onClick={() => additionalImagesRef.current?.click()}
              className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground">
              <ImageIcon size={16} />
            </button>
          </div>
        </div>

        {/* Author */}
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <div>
            <label className="text-foreground text-sm mb-1.5 block">اسم الكاتب</label>
            <input value={authorName} onChange={(e) => setAuthorName(e.target.value)}
              placeholder="اختياري"
              className="w-full px-3 py-2 rounded-lg bg-input text-foreground border border-border text-sm" />
          </div>
          <div>
            <label className="text-foreground text-sm mb-1.5 block">صورة الكاتب</label>
            <input ref={authorImageRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], setAuthorImage, setAuthorImagePreview)} />
            {authorImagePreview ? (
              <div className="relative w-10 h-10">
                <img src={authorImagePreview} alt="" className="w-10 h-10 rounded-full object-cover" />
                <button onClick={() => { setAuthorImage(null); setAuthorImagePreview(null); }}
                  className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                  <X size={8} className="text-primary-foreground" />
                </button>
              </div>
            ) : (
              <button onClick={() => authorImageRef.current?.click()}
                className="w-10 h-10 rounded-full border-2 border-dashed border-border flex items-center justify-center text-muted-foreground">
                <Upload size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Source Name */}
        <div>
          <label className="text-foreground text-sm mb-1.5 block">اسم الناشر</label>
          <input value={sourceName} onChange={(e) => setSourceName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-input text-foreground border border-border text-sm" />
        </div>

        {/* Publish Button */}
        <button onClick={handlePublish} disabled={publishing}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
          {publishing ? <><Loader2 size={16} className="animate-spin" /> جاري النشر...</> : "نشر المقال"}
        </button>
      </div>
    </div>
  );
};

export default ArticleEditor;
