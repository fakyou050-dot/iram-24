import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SliderImage {
  id: string;
  title: string | null;
  image_url: string;
  link_url: string | null;
  position: number;
  created_at: string;
}

export function useSliderImages() {
  const [images, setImages] = useState<SliderImage[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await (supabase as any)
        .from("slider_images")
        .select("id, title, image_url, link_url, position, created_at")
        .order("position", { ascending: true })
        .order("created_at", { ascending: false });
      setImages((data as SliderImage[]) || []);
    } catch (e) {
      console.error("[useSliderImages]", e);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { images, loading, refetch };
}

export function useSiteSetting<T = any>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const { data } = await (supabase as any)
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (data && data.value !== null && data.value !== undefined) setValue(data.value as T);
    } catch (e) { console.error("[useSiteSetting]", e); }
    finally { setLoading(false); }
  }, [key]);

  useEffect(() => { refetch(); }, [refetch]);

  const save = useCallback(async (newValue: T) => {
    const { error } = await (supabase as any).from("site_settings").upsert({
      key, value: newValue as any, updated_at: new Date().toISOString(),
    });
    if (!error) setValue(newValue);
    return !error;
  }, [key]);

  return { value, loading, save, refetch };
}
