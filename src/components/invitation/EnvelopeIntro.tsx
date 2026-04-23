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

  // Slightly darker version of primary for envelope body
  const envBody   = theme.secondary;
  const envBorder = theme.accent;
  const envPrimary = theme.primary;

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="envelope-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center select-none"
          style={{ backgroundColor: theme.secondary, fontFamily: event.style.fontFamily || "Cormorant Garamond, serif" }}
          onClick={handleClick}
        >
          {/* Top hint */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.6 }}
                className="text-xs tracking-widest uppercase mb-10"
                style={{ color: envPrimary, opacity: 0.6 }}
              >
                Tienes una invitación
              </motion.p>
            )}
          </AnimatePresence>

          {/* Envelope wrapper — perspective for 3-D flap */}
          <div className="relative" style={{ width: 300, height: 210, perspective: 800 }}>

            {/* ── Envelope body ── */}
            <div
              className="absolute inset-0 rounded-b-lg shadow-xl overflow-hidden"
              style={{ backgroundColor: envBody, border: `1.5px solid ${envBorder}` }}
            >
              {/* Bottom-left fold line */}
              <div
                className="absolute bottom-0 left-0 w-0 h-0"
                style={{
                  borderRight: `150px solid transparent`,
                  borderBottom: `105px solid ${envBorder}22`,
                }}
              />
              {/* Bottom-right fold line */}
              <div
                className="absolute bottom-0 right-0 w-0 h-0"
                style={{
                  borderLeft: `150px solid transparent`,
                  borderBottom: `105px solid ${envBorder}22`,
                }}
              />
            </div>

            {/* ── Letter / card rising from envelope ── */}
            <motion.div
              className="absolute left-4 right-4 rounded shadow-lg flex flex-col items-center justify-center gap-2 overflow-hidden pointer-events-none"
              style={{
                backgroundColor: envBody,
                border: `1px solid ${envBorder}`,
                bottom: 12,
                height: 160,
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={isRising ? { y: -130, opacity: 1 } : { y: 0, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p
                className="text-xs tracking-widest uppercase"
                style={{ color: envPrimary, opacity: 0.5 }}
              >
                Para
              </p>
              <p
                className="text-2xl text-center px-4 leading-tight"
                style={{ color: envPrimary, fontFamily: "Great Vibes, cursive" }}
              >
                {participant.name}
              </p>
              <div className="w-10 h-px" style={{ backgroundColor: envBorder }} />
              <p
                className="text-xs tracking-widest text-center px-4"
                style={{ color: envPrimary, opacity: 0.5 }}
              >
                {event.name}
              </p>
            </motion.div>

            {/* ── Flap (top triangle, rotates open) ── */}
            <motion.div
              className="absolute top-0 left-0 right-0 origin-top"
              style={{ height: 105, transformStyle: "preserve-3d", zIndex: 10 }}
              animate={isOpen ? { rotateX: -180 } : { rotateX: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {/* Front of flap */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  backgroundColor: envBody,
                  border: `0px`,
                  outline: `1.5px solid ${envBorder}`,
                  outlineOffset: -1,
                  backfaceVisibility: "hidden",
                }}
              />
              {/* Back of flap (shown when open) */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  backgroundColor: `${envPrimary}18`,
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
                  className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center rounded-full shadow-md"
                  style={{
                    width: 44,
                    height: 44,
                    top: 84,
                    backgroundColor: envPrimary,
                  }}
                >
                  <span style={{ color: "#fff", fontSize: 20, lineHeight: 1 }}>✦</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom hint — pulse */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0.4, 1, 0.4], y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.8, duration: 2, repeat: Infinity, repeatType: "loop" }}
                className="mt-12 text-xs tracking-widest uppercase"
                style={{ color: envPrimary }}
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
