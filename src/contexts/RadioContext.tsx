import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRadioPlayer } from "@/hooks/useRadioPlayer";
import { getStations } from "@/lib/radioStorage";
import { RadioStation } from "@/data/defaultStations";

interface RadioCtx {
  sheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  currentId: string | null;
  status: ReturnType<typeof useRadioPlayer>["status"];
  errorMsg: string;
  play: (id: string, url: string) => void;
  stop: () => void;
  currentStation: RadioStation | null;
  flashId: string | null;
  triggerFlash: (id: string) => void;
  volume: number;
  setVolume: (v: number) => void;
  muted: boolean;
  setMuted: (b: boolean) => void;
}

const Ctx = createContext<RadioCtx | null>(null);

export const useRadio = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useRadio outside provider");
  return c;
};

export const RadioProvider = ({ children }: { children: ReactNode }) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [flashId, setFlashId] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(() => {
    const v = localStorage.getItem("radio_volume");
    return v ? parseFloat(v) : 0.85;
  });
  const [muted, setMuted] = useState(false);
  const { currentId, status, errorMsg, play, stop } = useRadioPlayer();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const handledRef = useRef(false);

  const setVolume = (v: number) => {
    setVolumeState(v);
    localStorage.setItem("radio_volume", String(v));
  };

  // Sync volume
  useEffect(() => {
    const audio = document.querySelector("audio") as HTMLAudioElement | null;
    if (audio) audio.volume = muted ? 0 : volume;
  }, [volume, muted, currentId, status]);

  const stations = getStations();
  const currentStation = stations.find((s) => s.id === currentId) || null;

  const triggerFlash = useCallback((id: string) => {
    setFlashId(id);
    setTimeout(() => setFlashId(null), 2400);
  }, []);

  // Deep link ?play=stationId — autoplay + flash + open sheet
  useEffect(() => {
    if (handledRef.current) return;
    const playId = searchParams.get("play");
    if (!playId) return;
    const all = getStations();
    const st = all.find((s) => s.id === playId);
    if (st) {
      handledRef.current = true;
      // open sheet + play + flash
      setSheetOpen(true);
      setTimeout(() => {
        play(st.id, st.stream_url);
        triggerFlash(st.id);
      }, 250);
      // remove param without reload
      const next = new URLSearchParams(searchParams);
      next.delete("play");
      setSearchParams(next, { replace: true });
    }
  }, []);

  return (
    <Ctx.Provider
      value={{
        sheetOpen,
        openSheet: () => setSheetOpen(true),
        closeSheet: () => setSheetOpen(false),
        currentId,
        status,
        errorMsg,
        play,
        stop,
        currentStation,
        flashId,
        triggerFlash,
        volume,
        setVolume,
        muted,
        setMuted,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};
