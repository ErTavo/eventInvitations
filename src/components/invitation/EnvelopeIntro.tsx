"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Event, Participant } from "@/lib/supabase/types";
import type { ThemeConfig } from "./themes";

interface Props {
  event: Event;
  participant: Participant;
  theme: ThemeConfig;
  onOpen: () => void;
}

type Phase = "idle" | "opening" | "rising" | "done";

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

// Small botanical branch SVG used on the envelope body (botanical variant only)
function EnvelopeBranch() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M6 44 Q14 30 24 20 Q32 12 40 6"
            stroke="#c9a96e" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      <path d="M24 20 Q33 24 36 16" stroke="#c9a96e" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
      <path d="M32 12 Q38 18 43 14" stroke="#c9a96e" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}

export default function EnvelopeIntro({ event, participant, theme, onOpen }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");

  const isOpen   = phase === "opening" || phase === "rising" || phase === "done";
  const isRising = phase === "rising"  || phase === "done";

  async function handleClick() {
    if (phase !== "idle") return;
    setPhase("opening");
    await delay(700);
    setPhase("rising");
    await delay(900);
    setPhase("done");
    await delay(500);
    onOpen();
  }

  const isBotanical = theme.layoutVariant === "botanical";

  // ── Color palette depending on variant ───────────────────────────────────
  // Botanical: dark forest-green envelope on deep-green screen
  // Default:   light envelope matching the invitation background
  const screenBg   = isBotanical ? "#142209" : theme.secondary;
  const envBody    = isBotanical ? "#2d4a22" : theme.secondary;
  const envBorder  = isBotanical ? "#c9a96e" : theme.accent;
  const cardBg     = isBotanical ? "#f5f0e8" : theme.secondary;
  const cardText   = isBotanical ? "#1e3314" : theme.primary;
  const hintColor  = isBotanical ? "#c9a96e" : theme.primary;
  const sealBg     = isBotanical ? "#c9a96e" : theme.primary;
  const sealFg     = isBotanical ? "#142209" : "#fff";

  const sealInitials = event.style.sealInitials?.trim().slice(0, 2) ?? "";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="envelope-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center select-none"
          style={{
            backgroundColor: screenBg,
            fontFamily: event.style.fontFamily || "Cormorant Garamond, serif",
          }}
          onClick={handleClick}
        >
          {/* Top hint */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 0.75, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.6 }}
                className="text-xs tracking-widest uppercase mb-10"
                style={{ color: hintColor }}
              >
                Tienes una invitación
              </motion.p>
            )}
          </AnimatePresence>

          {/* ── Envelope wrapper — perspective for 3-D flap ── */}
          <div className="relative" style={{ width: 300, height: 210, perspective: 800 }}>

            {/* Envelope body */}
            <div
              className="absolute inset-0 rounded-b-lg shadow-xl overflow-hidden"
              style={{ backgroundColor: envBody, border: `1.5px solid ${envBorder}` }}
            >
              {/* Bottom fold lines */}
              <div className="absolute bottom-0 left-0 w-0 h-0"
                style={{ borderRight: "150px solid transparent", borderBottom: `105px solid ${envBorder}22` }} />
              <div className="absolute bottom-0 right-0 w-0 h-0"
                style={{ borderLeft: "150px solid transparent", borderBottom: `105px solid ${envBorder}22` }} />

              {/* Botanical corner detail (botanical only) */}
              {isBotanical && (
                <>
                  <div className="absolute bottom-2 left-2 opacity-60">
                    <EnvelopeBranch />
                  </div>
                  <div className="absolute bottom-2 right-2 opacity-60" style={{ transform: "scaleX(-1)" }}>
                    <EnvelopeBranch />
                  </div>
                </>
              )}
            </div>

            {/* ── Card rising from envelope ── */}
            <motion.div
              className="absolute left-4 right-4 rounded shadow-lg flex flex-col items-center justify-center gap-2 overflow-hidden pointer-events-none"
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${envBorder}`,
                bottom: 12,
                height: 160,
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={isRising ? { y: -130, opacity: 1 } : { y: 0, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Gold accent lines on card edges (botanical only) */}
              {isBotanical && (
                <>
                  <div className="absolute top-0 left-4 right-4 h-px" style={{ backgroundColor: envBorder, opacity: 0.45 }} />
                  <div className="absolute bottom-0 left-4 right-4 h-px" style={{ backgroundColor: envBorder, opacity: 0.45 }} />
                </>
              )}

              <p className="text-xs tracking-widest uppercase" style={{ color: cardText, opacity: 0.5 }}>
                Para
              </p>
              <p
                className="text-2xl text-center px-4 leading-tight"
                style={{ color: cardText, fontFamily: "Great Vibes, cursive" }}
              >
                {participant.name}
              </p>
              <div className="w-10 h-px" style={{ backgroundColor: envBorder }} />
              <p
                className="text-xs tracking-widest text-center px-4"
                style={{ color: cardText, opacity: 0.5 }}
              >
                {event.name}
              </p>
            </motion.div>

            {/* ── Flap (rotates open) ── */}
            <motion.div
              className="absolute top-0 left-0 right-0 origin-top"
              style={{ height: 105, transformStyle: "preserve-3d", zIndex: 10 }}
              animate={isOpen ? { rotateX: -180 } : { rotateX: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {/* Front */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  backgroundColor: envBody,
                  outline: `1.5px solid ${envBorder}`,
                  outlineOffset: -1,
                  backfaceVisibility: "hidden",
                }}
              />
              {/* Back (visible when open) */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  backgroundColor: isBotanical ? `${envBorder}28` : `${theme.primary}18`,
                  transform: "rotateX(180deg)",
                  backfaceVisibility: "hidden",
                }}
              />
            </motion.div>

            {/* ── Wax seal ── */}
            <AnimatePresence>
              {phase === "idle" && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center rounded-full shadow-lg"
                  style={{
                    width: 48,
                    height: 48,
                    top: 82,
                    backgroundColor: sealBg,
                    // Slight inner shadow to mimic wax texture
                    boxShadow: isBotanical
                      ? "0 2px 8px rgba(0,0,0,0.35), inset 0 1px 3px rgba(255,255,255,0.2)"
                      : "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                >
                  {isBotanical && sealInitials ? (
                    // Customizable cursive initials
                    <span
                      style={{
                        color: sealFg,
                        fontFamily: "Great Vibes, cursive",
                        fontSize: 18,
                        lineHeight: 1,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {sealInitials}
                    </span>
                  ) : (
                    <span style={{ color: sealFg, fontSize: 20, lineHeight: 1 }}>✦</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom hint — pulse animation */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0.4, 1, 0.4], y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.8, duration: 2, repeat: Infinity, repeatType: "loop" }}
                className="mt-12 text-xs tracking-widest uppercase"
                style={{ color: hintColor }}
              >
                Haz clic para abrir
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
