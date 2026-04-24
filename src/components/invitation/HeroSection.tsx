"use client";

import { motion } from "framer-motion";
import type { Event, Participant } from "@/lib/supabase/types";
import type { ThemeConfig } from "./themes";
import { formatDate } from "@/lib/utils";

interface Props {
  event: Event;
  participant: Participant;
  theme: ThemeConfig;
}

// ── Botanical branch decoration for the elegant/botanical template ────────────
// Rendered top-left; mirrored horizontally for top-right.
function BotanicalBranch({ side }: { side: "left" | "right" }) {
  return (
    <div
      className="absolute top-0 pointer-events-none"
      style={{
        [side]: 0,
        transform: side === "right" ? "scaleX(-1)" : undefined,
        transformOrigin: side === "right" ? "top right" : "top left",
      }}
    >
      <svg width="140" height="220" viewBox="0 0 140 220" fill="none">
        {/* Main curving stem */}
        <path
          d="M18 220 C22 180 40 150 60 118 C75 92 80 65 70 32"
          stroke="#2d4a22" strokeWidth="1.5" strokeLinecap="round"
        />
        {/* Leaf cluster — lower */}
        <ellipse cx="70" cy="128" rx="23" ry="9" fill="#2d4a22" opacity="0.42"
                 transform="rotate(-32 70 128)" />
        {/* Leaf cluster — middle */}
        <ellipse cx="78" cy="97" rx="19" ry="8" fill="#3d6030" opacity="0.38"
                 transform="rotate(-22 78 97)" />
        {/* Leaf cluster — upper */}
        <ellipse cx="72" cy="66" rx="16" ry="6" fill="#2d4a22" opacity="0.36"
                 transform="rotate(-12 72 66)" />
        {/* Secondary branch */}
        <path
          d="M60 118 C74 108 90 116 98 106"
          stroke="#2d4a22" strokeWidth="1" strokeLinecap="round" opacity="0.38"
        />
        <ellipse cx="98" cy="106" rx="12" ry="5" fill="#3d6030" opacity="0.32"
                 transform="rotate(8 98 106)" />
        {/* Pampas grass plumes — gold, fan from the top of the stem */}
        <path d="M70 32 C56 16 38 6 16 0"   stroke="#c9a96e" strokeWidth="1.3" strokeLinecap="round" opacity="0.72"/>
        <path d="M70 32 C62 12 50 2 34 -2"  stroke="#c9a96e" strokeWidth="1.3" strokeLinecap="round" opacity="0.72"/>
        <path d="M70 32 C68 10 62 0 54 -4"  stroke="#c9a96e" strokeWidth="1.3" strokeLinecap="round" opacity="0.68"/>
        <path d="M70 32 C74 12 80 2 86 -2"  stroke="#c9a96e" strokeWidth="1.2" strokeLinecap="round" opacity="0.62"/>
        <path d="M70 32 C78 14 94 6 106 2"  stroke="#c9a96e" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
        {/* Small leaf near pampas base */}
        <ellipse cx="70" cy="46" rx="14" ry="5" fill="#2d4a22" opacity="0.28"
                 transform="rotate(-6 70 46)" />
      </svg>
    </div>
  );
}

// ── Gold botanical divider used between content sections ──────────────────────
function BotanicalDivider({ accent }: { accent: string }) {
  return (
    <div className="flex items-center justify-center gap-3 my-2">
      <div className="h-px w-12" style={{ backgroundColor: accent, opacity: 0.6 }} />
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 1 C9 1 5 5 5 9 C5 13 9 17 9 17 C9 17 13 13 13 9 C13 5 9 1 9 1Z"
              stroke={accent} strokeWidth="1" fill="none" opacity="0.7"/>
        <circle cx="9" cy="9" r="1.5" fill={accent} opacity="0.7"/>
      </svg>
      <div className="h-px w-12" style={{ backgroundColor: accent, opacity: 0.6 }} />
    </div>
  );
}

export default function HeroSection({ event, participant, theme }: Props) {
  const isBotanical = theme.layoutVariant === "botanical";
  const hasCover    = !!event.cover_image;

  // Resolved colors for inline styles (avoids the theme.headingClass regex hack)
  const headingColor = hasCover ? "#ffffff" : theme.primary;
  const subColor     = hasCover ? "rgba(255,255,255,0.85)" : theme.accent;
  const mutedColor   = hasCover ? "rgba(255,255,255,0.7)"  : theme.primary;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">

      {/* ── Background image (optional) ── */}
      {hasCover && (
        <>
          <div className="absolute inset-0 bg-cover bg-center"
               style={{ backgroundImage: `url(${event.cover_image})` }} />
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}

      {/* ── Botanical corner decorations (only when no cover image) ── */}
      {isBotanical && !hasCover && (
        <>
          <BotanicalBranch side="left" />
          <BotanicalBranch side="right" />
        </>
      )}

      <div className="relative z-10 max-w-lg mx-auto space-y-5">

        {/* Top accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-24 h-px mx-auto"
          style={{ backgroundColor: hasCover ? "#fff" : theme.accent }}
        />

        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl"
          style={{
            fontFamily: "Great Vibes, cursive",
            color: hasCover ? "#f5e6d0" : theme.primary,
          }}
        >
          Estimado/a
        </motion.p>

        {/* Participant name */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl md:text-4xl font-light"
          style={{ color: headingColor }}
        >
          {participant.name}
        </motion.h2>

        {/* Divider — botanical for elegant, plain line otherwise */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {isBotanical && !hasCover ? (
            <BotanicalDivider accent={theme.accent} />
          ) : (
            <div className="w-16 h-px mx-auto" style={{ backgroundColor: hasCover ? "#fff" : theme.accent }} />
          )}
        </motion.div>

        {/* Event name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-4xl md:text-6xl font-light leading-tight"
          style={{ color: headingColor }}
        >
          {event.name}
        </motion.h1>

        {/* Date */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-base md:text-lg tracking-widest uppercase"
          style={{ color: subColor }}
        >
          {formatDate(event.date)}
        </motion.p>

        {/* Location */}
        {event.location && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-sm tracking-wider"
            style={{ color: mutedColor, opacity: 0.75 }}
          >
            {event.location}
          </motion.p>
        )}

        {/* Companions note */}
        {participant.companions > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="inline-block px-5 py-2 rounded-full text-xs tracking-widest uppercase border"
            style={{
              borderColor: hasCover ? "rgba(255,255,255,0.4)" : theme.accent,
              color:        hasCover ? "rgba(255,255,255,0.85)" : theme.primary,
            }}
          >
            Mesa para {1 + participant.companions} personas
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-10 mx-auto"
          style={{ backgroundColor: hasCover ? "rgba(255,255,255,0.5)" : theme.accent }}
        />
      </motion.div>
    </section>
  );
}
