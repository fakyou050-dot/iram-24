import { useState, useEffect, useMemo } from "react";
import { RadioStation } from "@/data/defaultStations";
import { getStations, saveStations } from "@/lib/radioStorage";
import { useAdmin } from "@/hooks/useAdmin";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, ArrowRight, Save, X } from "lucide-react";
import { toast } from "sonner";

const emptyStation: Omit<RadioStation, "id"> = {
  name: "", city: "", country: "", stream_url: "", logo: "", category: "", enabled: true,
};

const RadioAdmin = () => {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<RadioStation | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin-dashboard-ERAM-SECURE/login");
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    setStations(getStations());
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return stations;
    const q = search.toLowerCase();
    return stations.filter(
      (s) => s.name.toLowerCase().includes(q) || s.country.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
    );
  }, [stations, search]);

  const save = () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.stream_url.trim()) {
      toast.error("الاسم ورابط البث مطلوبان");
      return;
    }
    let updated: RadioStation[];
    if (isNew) {
      updated = [...stations, editing];
    } else {
      updated = stations.map((s) => (s.id === editing.id ? editing : s));
    }
    saveStations(updated);
    setStations(updated);
    setEditing(null);
    toast.success(isNew ? "تمت الإضافة" : "تم التحديث");
  };

  const remove = (id: string) => {
    const updated = stations.filter((s) => s.id !== id);
    saveStations(updated);
    setStations(updated);
    toast.success("تم الحذف");
  };

  const toggleEnabled = (id: string) => {
    const updated = stations.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    saveStations(updated);
    setStations(updated);
  };

  const startNew = () => {
    setIsNew(true);
    setEditing({ ...emptyStation, id: `custom_${Date.now()}` });
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">جاري التحميل...</p></div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="bg-secondary border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/admin-dashboard-ERAM-SECURE")} className="text-muted-foreground"><ArrowRight size={20} /></button>
          <h1 className="text-foreground font-bold text-lg">إدارة الراديو</h1>
        </div>
        <button onClick={startNew} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1">
          <Plus size={14} /> إضافة محطة
        </button>
      </header>

      <div className="p-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث..."
            className="w-full bg-secondary border border-border rounded-lg pr-9 pl-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Edit modal */}
        {editing && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card rounded-xl border border-border w-full max-w-md p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-foreground">{isNew ? "إضافة محطة" : "تعديل محطة"}</h2>
                <button onClick={() => setEditing(null)}><X size={18} className="text-muted-foreground" /></button>
              </div>
              {(["name", "stream_url", "city", "country", "category", "logo"] as const).map((field) => (
                <div key={field}>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    {field === "name" ? "الاسم" : field === "stream_url" ? "رابط البث" : field === "city" ? "المدينة" : field === "country" ? "الدولة" : field === "category" ? "التصنيف" : "الشعار (URL)"}
                  </label>
                  <input
                    value={(editing as any)[field]}
                    onChange={(e) => setEditing({ ...editing, [field]: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    dir={field === "stream_url" || field === "logo" ? "ltr" : "rtl"}
                  />
                </div>
              ))}
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">مفعّلة</label>
                <button onClick={() => setEditing({ ...editing, enabled: !editing.enabled })}>
                  {editing.enabled ? <ToggleRight size={24} className="text-primary" /> : <ToggleLeft size={24} className="text-muted-foreground" />}
                </button>
              </div>
              <button onClick={save} className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                <Save size={14} /> حفظ
              </button>
            </div>
          </div>
        )}

        {/* Stations list */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground mb-2">{filtered.length} محطة</p>
          {filtered.map((s) => (
            <div key={s.id} className={`flex items-center gap-3 p-3 rounded-xl border ${s.enabled ? "bg-card border-border" : "bg-secondary/50 border-border opacity-60"}`}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{s.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{s.city} · {s.country}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => toggleEnabled(s.id)} className="p-1.5">
                  {s.enabled ? <ToggleRight size={18} className="text-primary" /> : <ToggleLeft size={18} className="text-muted-foreground" />}
                </button>
                <button onClick={() => { setIsNew(false); setEditing(s); }} className="p-1.5">
                  <Pencil size={15} className="text-muted-foreground" />
                </button>
                <button onClick={() => remove(s.id)} className="p-1.5">
                  <Trash2 size={15} className="text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadioAdmin;
