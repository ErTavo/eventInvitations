"use client";

import { useEffect, useRef, useState } from "react";
import { Music2, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Module } from "@/lib/supabase/types";
import type { ThemeConfig } from "../themes";

interface Props { module: Module; theme: ThemeConfig }

export default function MusicModule({ module: mod, theme }: Props) {
  const cfg = mod.config as { musicUrl?: string; musicTitle?: string };
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !cfg.musicUrl) return;
    const handler = () => {
      audio.play().then(() => {
        setPlaying(true);
        setShowTitle(true);
        setTimeout(() => setShowTitle(false), 3000);
      }).catch(() => {});
    };
    document.addEventListener("click", handler, { once: true });
    return () => document.removeEventListener("click", handler);
  }, [cfg.musicUrl]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => {
        setPlaying(true);
        setShowTitle(true);
        setTimeout(() => setShowTitle(false), 3000);
      }).catch(() => {});
    }
  }

  if (!cfg.musicUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={cfg.musicUrl} loop preload="metadata" />

      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end gap-2">

        {/* Song title pill — appears on play */}
        <AnimatePresence>
          {showTitle && cfg.musicTitle && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="text-xs px-3 py-1.5 rounded-full shadow-md max-w-[160px] truncate"
              style={{ backgroundColor: theme.primary, color: "#fff", opacity: 0.92 }}
            >
              ♪ {cfg.musicTitle}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main button */}
        <button
          onClick={toggle}
          aria-label={playing ? "Pausar música" : "Reproducir música"}
          className="relative w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          style={{ backgroundColor: theme.primary, color: "#fff" }}
        >
          {/* Pulse ring when playing */}
          {playing && (
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-25"
              style={{ backgroundColor: theme.primary }}
            />
          )}

          {/* Rotating vinyl disc behind icon */}
          <motion.span
            animate={playing ? { rotate: 360 } : { rotate: 0 }}
            transition={playing ? { repeat: Infinity, duration: 4, ease: "linear" } : { duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center opacity-20"
          >
            <Music2 size={28} />
          </motion.span>

          {/* Play / Pause icon */}
          <span className="relative z-10">
            {playing ? <Pause size={17} /> : <Play size={17} />}
          </span>
        </button>
      </div>
    </>
  );
}
