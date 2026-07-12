import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Ban, Loader2, Search } from "lucide-react";
import { invalidateBlockedWordsCache, persistBlockedWords } from "@/lib/blockedWords";

interface BlockedWord { id: string; word: string; note: string | null; created_at: string; }
type BlockedWordsClient = {
  from: (table: "blocked_words") => {
    select: (columns: string) => { order: (column: string, options: { ascending: boolean }) => Promise<{ data: BlockedWord[] | null; error: { message: string } | null }> };
    insert: (payload: { word: string; note: string | null }) => Promise<{ error: { message: string } | null }>;
    delete: () => { eq: (column: "id", value: string) => Promise<{ error: { message: string } | null }> };
  };
};
const blockedWordsClient = supabase as unknown as BlockedWordsClient;

const BlockedWordsManager = () => {
  const [words, setWords] = useState<BlockedWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [newNote, setNewNote] = useState("");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await blockedWordsClient
        .from("blocked_words")
        .select("id, word, note, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setWords((data as BlockedWord[]) || []);
    } catch (e: unknown) {
      console.error(e);
      const local = JSON.parse(localStorage.getItem("eram_blocked_words_cache") || "[]") as string[];
      setWords(local.map((word, index) => ({ id: `local-${index}-${word}`, word, note: "محفوظ محلياً", created_at: new Date().toISOString() })));
      toast.warning("جدول الكلمات غير متاح حالياً، تم استخدام النسخة المحلية.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const w = newWord.trim().replace(/^#+/, "");
    if (!w) return;
    setAdding(true);
    const { error } = await blockedWordsClient.from("blocked_words").insert({
      word: w, note: newNote.trim() || null,
    });
    if (error) {
      const next = [...words.map(item => item.word), w];
      persistBlockedWords(next);
      setWords(next.map((word, index) => ({ id: `local-${index}-${word}`, word, note: "محفوظ محلياً", created_at: new Date().toISOString() })));
      toast.success("تم حفظ الكلمة محلياً إلى حين جاهزية الجدول");
    } else {
      toast.success("تمت الإضافة");
      setNewWord(""); setNewNote("");
      invalidateBlockedWordsCache();
      load();
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("حذف هذه الكلمة؟")) return;
    if (id.startsWith("local-")) {
      const next = words.filter(item => item.id !== id).map(item => item.word);
      persistBlockedWords(next);
      setWords(next.map((word, index) => ({ id: `local-${index}-${word}`, word, note: "محفوظ محلياً", created_at: new Date().toISOString() })));
      toast.success("تم الحذف محلياً");
      return;
    }
    const { error } = await blockedWordsClient.from("blocked_words").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("تم الحذف"); invalidateBlockedWordsCache(); load(); }
  };

  const filtered = words.filter(w => !search || w.word.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center gap-2">
        <Ban className="text-primary" size={18} />
        <h2 className="text-foreground font-bold">الكلمات المحظورة</h2>
        <span className="text-muted-foreground text-xs">({words.length})</span>
      </div>

      <p className="text-muted-foreground text-xs">
        تُحذف هذه الكلمات تلقائياً من عناوين ووصف الأخبار الواردة من المصادر.
      </p>

      <form onSubmit={handleAdd} className="bg-secondary rounded-lg p-3 space-y-2">
        <input value={newWord} onChange={e => setNewWord(e.target.value)}
          placeholder="الكلمة أو الهاشتاق المحظور"
          className="w-full bg-background text-foreground text-sm rounded px-3 py-2 border border-border" />
        <input value={newNote} onChange={e => setNewNote(e.target.value)}
          placeholder="ملاحظة (اختياري)"
          className="w-full bg-background text-foreground text-sm rounded px-3 py-2 border border-border" />
        <button type="submit" disabled={adding || !newWord.trim()}
          className="w-full bg-primary text-primary-foreground rounded py-2 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50">
          {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          إضافة
        </button>
      </form>

      <div className="relative">
        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="بحث..." className="w-full bg-secondary text-foreground text-sm rounded pr-9 pl-3 py-2 border border-border" />
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground text-sm py-6">جارٍ التحميل...</p>
      ) : (
        <div className="space-y-1.5 max-h-[55vh] overflow-y-auto">
          {filtered.map(w => (
            <div key={w.id} className="bg-secondary rounded-lg p-2.5 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-medium truncate">{w.word}</p>
                {w.note && <p className="text-muted-foreground text-[10px] truncate">{w.note}</p>}
              </div>
              <button onClick={() => handleDelete(w.id)} className="p-1.5 text-muted-foreground hover:text-primary shrink-0">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-6">لا توجد كلمات</p>}
        </div>
      )}
    </div>
  );
};

export default BlockedWordsManager;
