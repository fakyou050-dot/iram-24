import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Currency {
  id: string;
  name: string;
  code: string;
  price: number | null;
  change_percent: number | null;
  is_active: boolean;
}

const TickerBar = () => {
  const [currencies, setCurrencies] = useState<Currency[]>(() => {
    try { return JSON.parse(localStorage.getItem("eram_currency_ticker") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("currencies").select("*").eq("is_active", true);
      if (data?.length) {
        setCurrencies(data as Currency[]);
        try { localStorage.setItem("eram_currency_ticker", JSON.stringify(data)); } catch {}
      }
    };
    fetch();

    const channel = supabase
      .channel("currencies-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "currencies" }, () => fetch())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (currencies.length === 0) return null;

  // Natural medium speed scaled by number of items.
  const duration = Math.min(52, Math.max(24, currencies.length * 4));

  const Row = ({ ariaHidden = false }: { ariaHidden?: boolean }) => (
    <div className="flex items-center gap-6 px-3 shrink-0 min-w-full" aria-hidden={ariaHidden}>
      {currencies.map(c => (
        <span key={`${ariaHidden ? "b" : "a"}-${c.id}`} className="flex items-center gap-1">
          <span className="text-muted-foreground">{c.name}:</span>
          <span className="text-foreground font-medium">{c.price}</span>
          {c.change_percent !== null && (
            <span className={c.change_percent >= 0 ? "text-green-400" : "text-destructive"}>
              {c.change_percent >= 0 ? "▲" : "▼"}{Math.abs(c.change_percent)}%
            </span>
          )}
        </span>
      ))}
    </div>
  );

  return (
    <div className="bg-secondary border-y border-border py-1.5 overflow-hidden" dir="rtl">
      <div
        className="flex w-max min-w-full whitespace-nowrap text-xs tabular-nums marquee-track animate-marquee-rtl"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <Row />
        <Row ariaHidden />
      </div>
    </div>
  );
};

export default TickerBar;
