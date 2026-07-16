import { useState, useRef, useCallback, useEffect } from "react";
import { setLastPlayed, getLastPlayed } from "@/lib/radioStorage";

export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "error";
type HlsModule = typeof import("hls.js");
type HlsInstance = InstanceType<HlsModule["default"]>;

export function useRadioPlayer() {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<HlsInstance | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "none";
    }

    return () => {
      hlsRef.current?.destroy();
      audioRef.current?.pause();
    };
  }, []);

  const stop = useCallback(() => {
    hlsRef.current?.destroy();
    hlsRef.current = null;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    setStatus("idle");
    setCurrentId(null);
    setErrorMsg("");
  }, []);

  const play = useCallback(
    async (id: string, url: string) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (currentId === id) {
        if (status === "playing") {
          audio.pause();
          setStatus("paused");
        } else if (status === "paused") {
          audio.play().catch(() => {
            setStatus("error");
            setErrorMsg("البث غير متاح حالياً");
          });
          setStatus("playing");
        }
        return;
      }

      hlsRef.current?.destroy();
      hlsRef.current = null;
      audio.pause();

      setCurrentId(id);
      setStatus("loading");
      setErrorMsg("");
      setLastPlayed(id);

      const isHlsStream = url.includes(".m3u8");
      const onPlaying = () => setStatus("playing");
      const onError = () => {
        setStatus("error");
        setErrorMsg("البث غير متاح حالياً");
      };

      audio.onplaying = onPlaying;
      audio.onerror = onError;

      if (!isHlsStream) {
        audio.src = url;
        audio.play().catch(onError);
        return;
      }

      try {
        const { default: Hls } = await import("hls.js");

        if (Hls.isSupported()) {
          const hls = new Hls({ enableWorker: false });
          hlsRef.current = hls;
          hls.loadSource(url);
          hls.attachMedia(audio);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            audio.play().catch(onError);
          });
          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) onError();
          });
          return;
        }
      } catch {
        // Fallback to native audio below.
      }

      audio.src = url;
      audio.play().catch(onError);
    },
    [currentId, status]
  );

  return { currentId, status, errorMsg, play, stop, getLastPlayed };
}
