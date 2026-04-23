"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Play, Pause } from "lucide-react";
import type { Module } from "@/lib/supabase/types";
import type { ThemeConfig } from "../themes";

interface Props { module: Module; theme: ThemeConfig }

export default function MusicModule({ module: mod, theme }: Props) {
  const cfg = mod.config as { musicUrl?: string; musicTitle?: string };
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !cfg.musicUrl) return;
    // Try autoplay after first interaction
    const handler = () => { audio.play().then(() => setPlaying(true)).catch(() => {}); };
    document.addEventListener("click", handler, { once: true });
    return () => document.removeEventListener("click", handler);
  }, [cfg.musicUrl]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().then(() => setPlaying(true)).catch(() => {}); }
  }

  if (!cfg.musicUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={cfg.musicUrl} loop preload="none" />
      <div
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-2 shadow-lg cursor-pointer"
        style={{ backgroundColor: theme.primary, color: "#fff" }}
        onClick={toggle}
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
        <Music size={14} />
        {cfg.musicTitle && (
          <span className="text-xs max-w-24 truncate hidden sm:inline">
            {cfg.musicTitle}
          </span>
        )}
      </div>
    </>
  );
}
