import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2, Edit } from "lucide-react";

const DIRECTIONS = [
  { value: "rtl", label: "يمين ← يسار" },
  { value: "ltr", label: "يسار ← يمين" },
];

const CurrencyManager = () => {
  const [settings, setSettings] = useState<any>(null);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", code: "", price: "", change_percent: "" });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [settingsRes, currenciesRes] = await Promise.all([
      supabase.from("currency_ticker_settings").select("*").limit(1).single(),
      supabase.from("currencies").select("*").order("updated_at", { ascending: false }),
    ]);
    if (settingsRes.data) setSettings(settingsRes.data);
    setCurrencies((currenciesRes.data as any[]) || []);
    setLoading(false);
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase.from("currency_ticker_settings").update({
      scroll_speed: settings.scroll_speed,
      scroll_direction: settings.scroll_direction,
      auto_refresh: settings.auto_refresh,
    } as any).eq("id", settings.id);
    if (error) toast.error(error.message);
    else toast.success("تم حفظ إعدادات الشريط");
    setSaving(false);
  };

  const saveCurrency = async () => {
    const payload = {
      name: form.name,
      code: form.code,
      price: parseFloat(form.price) || 0,
      change_percent: parseFloat(form.change_percent) || 0,
      is_active: true,
    };
    let error;
    if (editId) {
      ({ error } = await supabase.from("currencies").update(payload as any).eq("id", editId));
    } else {
      ({ error } = await supabase.from("currencies").insert(payload as any));
    }
    if (error) toast.error(error.message);
    else { toast.success(editId ? "تم التحديث" : "تمت الإضافة"); setShowForm(false); setEditId(null); setForm({ name: "", code: "", price: "", change_percent: "" }); loadData(); }
  };

  const deleteCurrency = async (id: string) => {
    if (!confirm("حذف هذه العملة؟")) return;
    const { error } = await supabase.from("currencies").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("تم الحذف"); loadData(); }
  };

  const editCurrency = (c: any) => {
    setEditId(c.id);
    setForm({ name: c.name, code: c.code, price: String(c.price || ""), change_percent: String(c.change_percent || "") });
    setShowForm(true);
  };

  if (loading) return <p className="text-muted-foreground text-sm text-center py-8">جاري التحميل...</p>;

  // Preview
  const activeList = currencies.filter(c => c.is_active);
  const previewText = activeList.map(c => `${c.name}: ${c.price}`).join(" | ");

  return (
    <div className="space-y-4">
      <h2 className="text-foreground font-bold">💱 إدارة شريط العملات</h2>

      {/* Ticker Settings */}
      {settings && (
        <div className="bg-secondary rounded-lg p-4 space-y-3">
          <div>
            <label className="text-foreground text-xs mb-1 block">سرعة التمرير: {settings.scroll_speed}s</label>
            <input type="range" min={1} max={15} value={settings.scroll_speed}
              onChange={(e) => setSettings({ ...settings, scroll_speed: +e.target.value })}
              className="w-full accent-primary" />
          </div>

          <div>
            <label className="text-foreground text-xs mb-1 block">اتجاه التمرير</label>
            <div className="flex gap-1">
              {DIRECTIONS.map(d => (
                <button key={d.value} onClick={() => setSettings({ ...settings, scroll_direction: d.value })}
                  className={`flex-1 py-1.5 rounded text-xs ${settings.scroll_direction === d.value ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={settings.auto_refresh}
              onChange={(e) => setSettings({ ...settings, auto_refresh: e.target.checked })}
              className="rounded border-border" />
            <span className="text-foreground text-xs">تحديث تلقائي للأسعار</span>
          </label>

          {/* Preview */}
          {previewText && (
            <div className="bg-card rounded-lg py-1.5 px-3 border border-border overflow-hidden">
              <div className="whitespace-nowrap animate-ticker-rtl text-foreground text-xs" style={{ animationDuration: `${settings.scroll_speed * 3}s` }}>
                {previewText}
              </div>
            </div>
          )}

          <button onClick={saveSettings} disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            حفظ إعدادات الشريط
          </button>
        </div>
      )}

      {/* Currency List */}
      <div className="bg-secondary rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-foreground text-xs font-bold">العملات ({currencies.length})</p>
          <button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: "", code: "", price: "", change_percent: "" }); }}
            className="flex items-center gap-1 text-primary text-xs">
            <Plus size={12} /> إضافة
          </button>
        </div>

        {showForm && (
          <div className="bg-card rounded-lg p-3 space-y-2 border border-border">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="الاسم (مثال: ذهب)"
              className="w-full px-3 py-1.5 rounded bg-input text-foreground border border-border text-xs" />
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="الرمز (مثال: GOLD)"
              className="w-full px-3 py-1.5 rounded bg-input text-foreground border border-border text-xs" />
            <div className="grid grid-cols-2 gap-2">
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="السعر" type="number"
                className="px-3 py-1.5 rounded bg-input text-foreground border border-border text-xs" />
              <input value={form.change_percent} onChange={(e) => setForm({ ...form, change_percent: e.target.value })} placeholder="% التغيير" type="number"
                className="px-3 py-1.5 rounded bg-input text-foreground border border-border text-xs" />
            </div>
            <div className="flex gap-2">
              <button onClick={saveCurrency} className="flex-1 py-1.5 bg-primary text-primary-foreground rounded text-xs font-bold">حفظ</button>
              <button onClick={() => { setShowForm(false); setEditId(null); }} className="px-3 py-1.5 text-muted-foreground text-xs">إلغاء</button>
            </div>
          </div>
        )}

        {currencies.map(c => (
          <div key={c.id} className="flex items-center gap-2 bg-card rounded p-2 border border-border">
            <span className="text-foreground text-xs font-medium flex-1">{c.name} ({c.code})</span>
            <span className="text-foreground text-xs">{c.price}</span>
            <span className={`text-xs ${(c.change_percent || 0) >= 0 ? "text-green-400" : "text-primary"}`}>
              {(c.change_percent || 0) >= 0 ? "▲" : "▼"}{Math.abs(c.change_percent || 0)}%
            </span>
            <button onClick={() => editCurrency(c)} className="p-1 text-muted-foreground hover:text-foreground"><Edit size={12} /></button>
            <button onClick={() => deleteCurrency(c.id)} className="p-1 text-muted-foreground hover:text-primary"><Trash2 size={12} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrencyManager;
