import { useState, useRef, useCallback, useEffect } from "react";
import Hls from "hls.js";
import { setLastPlayed, getLastPlayed } from "@/lib/radioStorage";

export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "error";

export function useRadioPlayer() {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Ensure a single audio element
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
    (id: string, url: string) => {
      const audio = audioRef.current;
      if (!audio) return;

      // Toggle pause/play
      if (currentId === id) {
        if (status === "playing") {
          audio.pause();
          setStatus("paused");
        } else if (status === "paused") {
          audio.play();
          setStatus("playing");
        }
        return;
      }

      // Stop previous
      hlsRef.current?.destroy();
      hlsRef.current = null;
      audio.pause();

      setCurrentId(id);
      setStatus("loading");
      setErrorMsg("");
      setLastPlayed(id);

      const isHls = url.includes(".m3u8");

      const onPlaying = () => setStatus("playing");
      const onError = () => {
        setStatus("error");
        setErrorMsg("البث غير متاح حالياً");
      };

      audio.onplaying = onPlaying;
      audio.onerror = onError;

      if (isHls && Hls.isSupported()) {
        const hls = new Hls({ enableWorker: false });
        hlsRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          audio.play().catch(onError);
        });
        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (data.fatal) onError();
        });
      } else {
        audio.src = url;
        audio.play().catch(onError);
      }
    },
    [currentId, status]
  );

  return { currentId, status, errorMsg, play, stop, getLastPlayed };
}
