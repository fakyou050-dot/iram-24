import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Image as ImageIcon, Loader2, ArrowUp, ArrowDown, Link as LinkIcon } from "lucide-react";
import { useSliderImages, useSiteSetting } from "@/hooks/useSlider";

const SliderManager = () => {
  const { images, loading, refetch } = useSliderImages();
  const { value: manualMode, save: saveMode } = useSiteSetting<boolean>("slider_manual_mode", false);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) { toast.error("رابط الصورة مطلوب"); return; }
    setAdding(true);
    const nextPos = (images[images.length - 1]?.position ?? -1) + 1;
    const { error } = await (supabase as any).from("slider_images").insert({
      title: title.trim() || null,
      image_url: imageUrl.trim(),
      link_url: linkUrl.trim() || null,
      position: nextPos,
    });
    if (error) toast.error(error.message);
    else { toast.success("تمت الإضافة"); setTitle(""); setImageUrl(""); setLinkUrl(""); refetch(); }
    setAdding(false);
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const a = images[idx]; const b = images[idx + dir];
    if (!a || !b) return;
    await Promise.all([
      (supabase as any).from("slider_images").update({ position: b.position }).eq("id", a.id),
      (supabase as any).from("slider_images").update({ position: a.position }).eq("id", b.id),
    ]);
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("حذف هذه الشريحة؟")) return;
    const { error } = await (supabase as any).from("slider_images").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("تم الحذف"); refetch(); }
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center gap-2">
        <ImageIcon className="text-primary" size={18} />
        <h2 className="text-foreground font-bold">السلايدر الرئيسي</h2>
        <span className="text-muted-foreground text-xs">({images.length})</span>
      </div>

      <label className="bg-secondary rounded-lg p-3 flex items-center justify-between cursor-pointer">
        <div>
          <p className="text-foreground text-sm font-medium">الوضع اليدوي</p>
          <p className="text-muted-foreground text-[10px]">عند التفعيل: تظهر هذه الشرائح فقط بدل أحدث الأخبار.</p>
        </div>
        <input type="checkbox" checked={!!manualMode} onChange={e => saveMode(e.target.checked)}
          className="w-5 h-5 accent-primary" />
      </label>

      <form onSubmit={handleAdd} className="bg-secondary rounded-lg p-3 space-y-2">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="العنوان (اختياري)"
          className="w-full bg-background text-foreground text-sm rounded px-3 py-2 border border-border" />
        <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="رابط الصورة *"
          className="w-full bg-background text-foreground text-sm rounded px-3 py-2 border border-border" />
        <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="رابط الوجهة (اختياري)"
          className="w-full bg-background text-foreground text-sm rounded px-3 py-2 border border-border" />
        <button type="submit" disabled={adding}
          className="w-full bg-primary text-primary-foreground rounded py-2 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50">
          {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          إضافة شريحة
        </button>
      </form>

      {loading ? (
        <p className="text-center text-muted-foreground text-sm py-6">جارٍ التحميل...</p>
      ) : (
        <div className="space-y-2 max-h-[55vh] overflow-y-auto">
          {images.map((img, idx) => (
            <div key={img.id} className="bg-secondary rounded-lg p-2 flex items-center gap-2">
              <img src={img.image_url} alt="" className="w-14 h-14 rounded object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-xs font-medium truncate">{img.title || "بدون عنوان"}</p>
                {img.link_url && (
                  <p className="text-muted-foreground text-[10px] truncate flex items-center gap-1">
                    <LinkIcon size={9} />{img.link_url}
                  </p>
                )}
                <p className="text-muted-foreground text-[10px]">الترتيب: {img.position}</p>
              </div>
              <div className="flex flex-col gap-0.5 shrink-0">
                <button onClick={() => move(idx, -1)} disabled={idx === 0}
                  className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"><ArrowUp size={12} /></button>
                <button onClick={() => move(idx, 1)} disabled={idx === images.length - 1}
                  className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"><ArrowDown size={12} /></button>
              </div>
              <button onClick={() => handleDelete(img.id)} className="p-1.5 text-muted-foreground hover:text-primary shrink-0">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {images.length === 0 && <p className="text-center text-muted-foreground text-sm py-6">لا توجد شرائح</p>}
        </div>
      )}
    </div>
  );
};

export default SliderManager;
