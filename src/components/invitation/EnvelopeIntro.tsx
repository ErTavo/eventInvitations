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

// ─── Desk decorations ──────────────────────────────────────────────────────────

function QuillPen({ color }: { color: string }) {
  return (
    <svg width="120" height="48" viewBox="0 0 120 48" fill="none">
      {/* Quill shaft */}
      <path d="M8 40 Q40 28 80 18 Q100 13 114 8"
            stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
      {/* Barbs left */}
      <path d="M40 30 Q36 24 30 26" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
      <path d="M55 26 Q50 19 44 21" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
      <path d="M70 22 Q65 15 59 17" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
      <path d="M85 18 Q80 11 74 13" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
      {/* Barbs right */}
      <path d="M40 30 Q44 36 50 34" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
      <path d="M55 26 Q60 32 66 30" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
      <path d="M70 22 Q76 28 82 26" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
      {/* Nib */}
      <path d="M114 8 L118 6 L116 10 Z" fill={color} opacity="0.8"/>
      {/* Ink tip */}
      <circle cx="117" cy="8" r="1.5" fill={color} opacity="0.6"/>
    </svg>
  );
}

function FloralSprig({ color, accent }: { color: string; accent: string }) {
  return (
    <svg width="80" height="100" viewBox="0 0 80 100" fill="none">
      {/* Main stem */}
      <path d="M40 98 C38 80 34 60 30 40 C26 22 22 10 28 2"
            stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.65"/>
      {/* Branch left */}
      <path d="M34 55 C24 50 16 54 14 62" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.55"/>
      {/* Branch right */}
      <path d="M31 38 C42 34 50 38 52 46" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.55"/>
      {/* Small branch */}
      <path d="M29 22 C20 18 14 22 12 28" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.45"/>
      {/* Leaf cluster left */}
      <ellipse cx="20" cy="56" rx="10" ry="6" fill={color} opacity="0.55" transform="rotate(-20 20 56)"/>
      <ellipse cx="16" cy="62" rx="8" ry="5" fill={color} opacity="0.42" transform="rotate(-10 16 62)"/>
      {/* Leaf cluster right */}
      <ellipse cx="46" cy="40" rx="9" ry="5.5" fill={color} opacity="0.52" transform="rotate(15 46 40)"/>
      <ellipse cx="50" cy="46" rx="7" ry="4" fill={color} opacity="0.4" transform="rotate(20 50 46)"/>
      {/* Top leaf */}
      <ellipse cx="26" cy="14" rx="8" ry="5" fill={color} opacity="0.5" transform="rotate(-35 26 14)"/>
      {/* Berries */}
      <circle cx="16" cy="50" r="3.5" fill={accent} opacity="0.75"/>
      <circle cx="22" cy="46" r="2.5" fill={accent} opacity="0.65"/>
      <circle cx="48" cy="36" r="3"   fill={accent} opacity="0.70"/>
      <circle cx="12" cy="26" r="2.5" fill={accent} opacity="0.60"/>
    </svg>
  );
}

function WaxKit({ color }: { color: string }) {
  return (
    <svg width="56" height="72" viewBox="0 0 56 72" fill="none">
      {/* Candle body */}
      <rect x="18" y="28" width="20" height="38" rx="3" fill={color} opacity="0.35"
            stroke={color} strokeWidth="1"/>
      {/* Wax drips */}
      <path d="M18 32 Q14 36 16 42" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M38 34 Q42 38 40 45" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.45"/>
      {/* Wick */}
      <path d="M28 28 L28 20" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      {/* Flame */}
      <path d="M28 20 C26 16 24 12 28 8 C32 12 30 16 28 20Z"
            fill={color} opacity="0.65"/>
      <ellipse cx="28" cy="18" rx="3" ry="4" fill={color} opacity="0.25"/>
      {/* Wax pool glow */}
      <ellipse cx="28" cy="28" rx="12" ry="4" fill={color} opacity="0.18"/>
      {/* Stamp seal (below candle) */}
      <circle cx="28" cy="60" r="8" fill={color} opacity="0.22" stroke={color} strokeWidth="0.8"/>
      <text x="28" y="64" textAnchor="middle" fontSize="8" fill={color} opacity="0.6"
            fontFamily="serif">✦</text>
    </svg>
  );
}

function EnvelopeBranch({ color }: { color: string }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M6 44 Q14 30 24 20 Q32 12 40 6"
            stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      <path d="M24 20 Q33 24 36 16" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
      <path d="M32 12 Q38 18 43 14" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}

function DeskSurface({ color }: { color: string }) {
  return (
    <svg width="100%" height="32" viewBox="0 0 400 32" preserveAspectRatio="none" fill="none">
      {/* Wood grain lines */}
      <line x1="0" y1="4"  x2="400" y2="4"  stroke={color} strokeWidth="0.6" opacity="0.25"/>
      <line x1="0" y1="9"  x2="400" y2="9"  stroke={color} strokeWidth="0.4" opacity="0.18"/>
      <line x1="0" y1="14" x2="400" y2="14" stroke={color} strokeWidth="0.6" opacity="0.22"/>
      <line x1="0" y1="20" x2="400" y2="20" stroke={color} strokeWidth="0.4" opacity="0.15"/>
      <line x1="0" y1="26" x2="400" y2="26" stroke={color} strokeWidth="0.5" opacity="0.20"/>
      {/* Subtle knots */}
      <ellipse cx="80"  cy="12" rx="12" ry="3" stroke={color} strokeWidth="0.5" opacity="0.12" fill="none"/>
      <ellipse cx="280" cy="18" rx="9"  ry="2" stroke={color} strokeWidth="0.5" opacity="0.10" fill="none"/>
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

  const screenBg  = isBotanical ? "#0e1c09" : theme.secondary;
  const envBody   = isBotanical ? "#2d4a22" : theme.secondary;
  const envBorder = isBotanical ? "#c9a96e" : theme.accent;
  const cardBg    = isBotanical ? "#f5f0e8" : theme.secondary;
  const cardText  = isBotanical ? "#1e3314" : theme.primary;
  const hintColor = isBotanical ? "#c9a96e" : theme.primary;
  const sealBg    = isBotanical ? "#c9a96e" : theme.primary;
  const sealFg    = isBotanical ? "#0e1c09" : "#fff";
  const deskColor = isBotanical ? "#c9a96e" : theme.accent;
  const greenLeaf = isBotanical ? "#5a8f5e" : theme.primary;

  const sealInitials = event.style.sealInitials?.trim().slice(0, 2) ?? "";

  const decorExit = { opacity: 0, y: 24, transition: { duration: 0.4 } };

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="envelope-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center select-none overflow-hidden"
          style={{ backgroundColor: screenBg, fontFamily: event.style.fontFamily || "Cormorant Garamond, serif" }}
          onClick={handleClick}
        >

          {/* ── DESK SURFACE at the bottom ── */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.div
                key="desk"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={decorExit}
                transition={{ delay: 0.3 }}
                className="absolute bottom-0 left-0 right-0 h-8"
                style={{ backgroundColor: isBotanical ? "#1a2e12" : theme.accent + "22" }}
              >
                <DeskSurface color={deskColor} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── DESK SHADOW under envelope ── */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.div
                key="shadow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute"
                style={{
                  bottom: 26,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 320,
                  height: 20,
                  borderRadius: "50%",
                  background: `radial-gradient(ellipse, ${deskColor}55 0%, transparent 70%)`,
                  filter: "blur(4px)",
                }}
              />
            )}
          </AnimatePresence>

          {/* ── QUILL PEN — left side ── */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.div
                key="quill"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ ...decorExit, x: -30 }}
                transition={{ delay: 0.5 }}
                className="absolute"
                style={{ bottom: 24, left: "calc(50% - 250px)" }}
              >
                <div style={{ transform: "rotate(-18deg)", transformOrigin: "right bottom" }}>
                  <QuillPen color={deskColor} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── FLORAL SPRIG — far right ── */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.div
                key="sprig"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ ...decorExit, x: 30 }}
                transition={{ delay: 0.6 }}
                className="absolute"
                style={{ bottom: 20, right: "calc(50% - 270px)" }}
              >
                <FloralSprig color={greenLeaf} accent={deskColor} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── WAX CANDLE — right side ── */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.div
                key="wax"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ ...decorExit, x: 20 }}
                transition={{ delay: 0.7 }}
                className="absolute"
                style={{ bottom: 20, right: "calc(50% - 210px)" }}
              >
                <WaxKit color={deskColor} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── SMALL LEAF CORNER — top left ── */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.div
                key="corner-tl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.45 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute top-4 left-4"
                style={{ transform: "rotate(15deg)" }}
              >
                <FloralSprig color={greenLeaf} accent={deskColor} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── SMALL LEAF CORNER — top right (mirrored) ── */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.div
                key="corner-tr"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.45 }}
                className="absolute top-4 right-4"
                style={{ transform: "scaleX(-1) rotate(15deg)" }}
              >
                <FloralSprig color={greenLeaf} accent={deskColor} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── TOP HINT ── */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.p
                key="hint-top"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 0.75, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.8 }}
                className="text-xs tracking-widest uppercase mb-10"
                style={{ color: hintColor }}
              >
                Tienes una invitación
              </motion.p>
            )}
          </AnimatePresence>

          {/* ── ENVELOPE ── */}
          <div className="relative z-10" style={{ width: 300, height: 210, perspective: 800 }}>

            {/* Body */}
            <div
              className="absolute inset-0 rounded-b-lg shadow-2xl overflow-hidden"
              style={{ backgroundColor: envBody, border: `1.5px solid ${envBorder}` }}
            >
              <div className="absolute bottom-0 left-0 w-0 h-0"
                   style={{ borderRight: "150px solid transparent", borderBottom: `105px solid ${envBorder}22` }} />
              <div className="absolute bottom-0 right-0 w-0 h-0"
                   style={{ borderLeft: "150px solid transparent", borderBottom: `105px solid ${envBorder}22` }} />

              {isBotanical && (
                <>
                  <div className="absolute bottom-2 left-2 opacity-50">
                    <EnvelopeBranch color={envBorder} />
                  </div>
                  <div className="absolute bottom-2 right-2 opacity-50" style={{ transform: "scaleX(-1)" }}>
                    <EnvelopeBranch color={envBorder} />
                  </div>
                </>
              )}
            </div>

            {/* Rising card */}
            <motion.div
              className="absolute left-4 right-4 rounded shadow-lg flex flex-col items-center justify-center gap-2 overflow-hidden pointer-events-none"
              style={{ backgroundColor: cardBg, border: `1px solid ${envBorder}`, bottom: 12, height: 160 }}
              initial={{ y: 0, opacity: 0 }}
              animate={isRising ? { y: -130, opacity: 1 } : { y: 0, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {isBotanical && (
                <>
                  <div className="absolute top-0 left-4 right-4 h-px" style={{ backgroundColor: envBorder, opacity: 0.4 }} />
                  <div className="absolute bottom-0 left-4 right-4 h-px" style={{ backgroundColor: envBorder, opacity: 0.4 }} />
                </>
              )}
              <p className="text-xs tracking-widest uppercase" style={{ color: cardText, opacity: 0.5 }}>Para</p>
              <p className="text-2xl text-center px-4 leading-tight"
                 style={{ color: cardText, fontFamily: "Great Vibes, cursive" }}>
                {participant.name}
              </p>
              <div className="w-10 h-px" style={{ backgroundColor: envBorder }} />
              <p className="text-xs tracking-widest text-center px-4" style={{ color: cardText, opacity: 0.5 }}>
                {event.name}
              </p>
            </motion.div>

            {/* Flap */}
            <motion.div
              className="absolute top-0 left-0 right-0 origin-top"
              style={{ height: 105, transformStyle: "preserve-3d", zIndex: 10, perspective: 600 }}
              animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
              transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Front face — downward triangle (closed) */}
              <div className="absolute inset-0"
                   style={{
                     clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                     backgroundColor: envBody,
                     outline: `1.5px solid ${envBorder}`,
                     outlineOffset: -1,
                     backfaceVisibility: "hidden",
                   }} />
              {/* Back face — upward triangle (open), inverted on X axis */}
              <div className="absolute inset-0"
                   style={{
                     clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                     backgroundColor: isBotanical ? `${envBorder}30` : `${theme.primary}14`,
                     transform: "rotateX(180deg)",
                     backfaceVisibility: "hidden",
                   }} />
            </motion.div>

            {/* Wax seal */}
            <AnimatePresence>
              {phase === "idle" && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center rounded-full"
                  style={{
                    width: 48, height: 48, top: 82,
                    backgroundColor: sealBg,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.35), inset 0 1px 3px rgba(255,255,255,0.15)",
                  }}
                >
                  {sealInitials ? (
                    <span style={{ color: sealFg, fontFamily: "Great Vibes, cursive", fontSize: 18, lineHeight: 1 }}>
                      {sealInitials}
                    </span>
                  ) : (
                    <span style={{ color: sealFg, fontSize: 20, lineHeight: 1 }}>✦</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── BOTTOM HINT ── */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.div
                key="hint-bottom"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0.5, 1, 0.5], y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 1, duration: 2, repeat: Infinity, repeatType: "loop" }}
                className="mt-10 text-xs tracking-widest uppercase"
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
