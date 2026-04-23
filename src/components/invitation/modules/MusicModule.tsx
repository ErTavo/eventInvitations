"use client";

import { useEffect, useRef, useState } from "react";
import { Music2, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Module } from "@/lib/supabase/types";
import type { ThemeConfig } from "../themes";

interface Props {
  module: Module;
  theme: ThemeConfig;
  // When provided, MusicModule controls this shared audio element
  // (started by the envelope click). Otherwise it manages its own.
  audioRef?: React.RefObject<HTMLAudioElement | null>;
}

export default function MusicModule({ module: mod, theme, audioRef: externalRef }: Props) {
  const cfg = mod.config as { musicUrl?: string; musicTitle?: string };
  const internalRef = useRef<HTMLAudioElement>(null);
  const audioRef = externalRef ?? internalRef;

  const [playing, setPlaying] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  // Sync playing state with the external audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay  = () => { setPlaying(true);  setShowTitle(true); setTimeout(() => setShowTitle(false), 3500); };
    const onPause = () => setPlaying(false);

    audio.addEventListener("play",  onPlay);
    audio.addEventListener("pause", onPause);

    // Reflect current state immediately (envelope may have already started it)
    if (!audio.paused) { setPlaying(true); }

    return () => {
      audio.removeEventListener("play",  onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [audioRef]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }

  if (!cfg.musicUrl) return null;

  return (
    <>
      {/* Own audio element only when no external ref */}
      {!externalRef && (
        <audio ref={internalRef} src={cfg.musicUrl} loop preload="auto" style={{ display: "none" }} />
      )}

      {/* Floating play/pause button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end gap-2">
        <AnimatePresence>
          {showTitle && cfg.musicTitle && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="text-xs px-3 py-1.5 rounded-full shadow-md max-w-[160px] truncate"
              style={{ backgroundColor: theme.primary, color: "#fff" }}
            >
              ♪ {cfg.musicTitle}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={toggle}
          aria-label={playing ? "Pausar música" : "Reproducir música"}
          className="relative w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          style={{ backgroundColor: theme.primary, color: "#fff" }}
        >
          {playing && (
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-25"
              style={{ backgroundColor: theme.primary }}
            />
          )}
          <motion.span
            animate={playing ? { rotate: 360 } : { rotate: 0 }}
            transition={playing ? { repeat: Infinity, duration: 4, ease: "linear" } : { duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center opacity-20"
          >
            <Music2 size={28} />
          </motion.span>
          <span className="relative z-10">
            {playing ? <Pause size={17} /> : <Play size={17} />}
          </span>
        </button>
      </div>
    </>
  );
}
