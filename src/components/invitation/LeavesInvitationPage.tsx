"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import type { Event, Module, Participant } from "@/lib/supabase/types";
import type { ThemeConfig } from "./themes";
import { formatDate } from "@/lib/utils";
import MusicModule from "./modules/MusicModule";
import EnvelopeIntro from "./EnvelopeIntro";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const THEME: ThemeConfig = {
  id: "leaves",
  layoutVariant: "leaves",
  bgClass: "bg-[#f8f5ef]",
  sectionClass: "bg-[#f8f5ef]",
  headingClass: "text-[#1e3a1f]",
  textClass: "text-[#2c2c2c]",
  mutedClass: "text-[#5a7a4a]",
  accentClass: "text-[#5a7a4a]",
  buttonClass: "bg-[#2c5f2e] hover:bg-[#1e4a20] text-white",
  dividerClass: "border-[#a8c890]",
  cardClass: "bg-white border border-[#c8dfc0]",
  primary: "#2c5f2e",
  secondary: "#f8f5ef",
  accent: "#a8c890",
};

// ─────────────────────────────────────────────────────────────────────────────
// Leaf decorations
// ─────────────────────────────────────────────────────────────────────────────

function CornerLeaves({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  return (
    <div className="absolute pointer-events-none" style={{
      top: position.startsWith("t") ? 0 : undefined,
      bottom: position.startsWith("b") ? 0 : undefined,
      left: position.endsWith("l") ? 0 : undefined,
      right: position.endsWith("r") ? 0 : undefined,
      transform: `${position.endsWith("r") ? "scaleX(-1)" : ""} ${position.startsWith("b") ? "scaleY(-1)" : ""}`,
      zIndex: 1,
    }}>
      <svg width="130" height="130" viewBox="0 0 130 130" fill="none">
        <path d="M10 120 C20 92 48 65 76 46 C96 33 116 18 124 8" stroke="#5a7a4a" strokeWidth="1.4" strokeLinecap="round" opacity="0.4"/>
        <ellipse cx="56" cy="62" rx="20" ry="12" fill="#6b8f60" opacity="0.48" transform="rotate(-40 56 62)"/>
        <ellipse cx="76" cy="48" rx="18" ry="11" fill="#7a9e6e" opacity="0.42" transform="rotate(-50 76 48)"/>
        <ellipse cx="38" cy="80" rx="16" ry="10" fill="#6b8f60" opacity="0.38" transform="rotate(-30 38 80)"/>
        <ellipse cx="96" cy="32" rx="15" ry="9" fill="#8fb07e" opacity="0.34" transform="rotate(-58 96 32)"/>
        <circle cx="60" cy="54" r="3.5" fill="#c8a951" opacity="0.7"/>
        <circle cx="46" cy="72" r="2.5" fill="#c8a951" opacity="0.6"/>
        <circle cx="78" cy="40" r="3" fill="#c8a951" opacity="0.65"/>
      </svg>
    </div>
  );
}

function LeafDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2 px-6">
      <div className="h-px flex-1 max-w-20" style={{ backgroundColor: THEME.accent, opacity: 0.4 }} />
      <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
        <path d="M14 16 C9 12 1 9 0 8 C1 7 9 4 14 0 C19 4 27 7 28 8 C27 9 19 12 14 16Z"
              fill={THEME.accent} opacity="0.5"/>
        <circle cx="14" cy="8" r="2" fill={THEME.accent} opacity="0.7"/>
      </svg>
      <div className="h-px flex-1 max-w-20" style={{ backgroundColor: THEME.accent, opacity: 0.4 }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated circle icon
// ─────────────────────────────────────────────────────────────────────────────

function CircleIcon({ children, clickable = false, onClick }: {
  children: React.ReactNode; clickable?: boolean; onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`relative mx-auto flex items-center justify-center ${clickable ? "cursor-pointer group" : "cursor-default"}`}
      style={{ width: 92, height: 92 }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      whileHover={clickable ? { scale: 1.06 } : {}}
      whileTap={clickable ? { scale: 0.97 } : {}}
    >
      <div className="absolute inset-0 rounded-full transition-colors"
           style={{ border: `1.5px solid ${THEME.primary}`, opacity: clickable ? 0.55 : 0.4 }} />
      <div className="absolute rounded-full" style={{ inset: 8, border: `1px solid ${THEME.primary}`, opacity: 0.2 }} />
      {clickable && (
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
             style={{ backgroundColor: THEME.primary, opacity: 0 }}
             onMouseEnter={e => (e.currentTarget.style.opacity = "0.06")}
             onMouseLeave={e => (e.currentTarget.style.opacity = "0")} />
      )}
      <motion.div initial={{ scale: 0.5, rotate: -10 }} whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }} transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
        className="relative z-10">
        {children}
      </motion.div>
      {clickable && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-70 transition-opacity whitespace-nowrap"
             style={{ color: THEME.primary }}>
          Ver más
        </div>
      )}
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section icon SVGs
// ─────────────────────────────────────────────────────────────────────────────

const Icons = {
  countdown: <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="18" r="11" stroke={THEME.primary} strokeWidth="1.4" fill="none"/>
    <path d="M16 6 L16 3" stroke={THEME.primary} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M12 2 L20 2" stroke={THEME.primary} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M16 18 L16 11" stroke={THEME.primary} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M16 18 L21 21" stroke={THEME.primary} strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="16" cy="18" r="1.5" fill={THEME.primary}/>
  </svg>,
  map: <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 3 C11 3 7 7 7 12 C7 19 16 29 16 29 C16 29 25 19 25 12 C25 7 21 3 16 3Z"
          stroke={THEME.primary} strokeWidth="1.4" fill="none"/>
    <circle cx="16" cy="12" r="3.5" stroke={THEME.primary} strokeWidth="1.2" fill="none"/>
  </svg>,
  rsvp: <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="3" y="8" width="26" height="18" rx="2" stroke={THEME.primary} strokeWidth="1.4" fill="none"/>
    <path d="M3 10 L16 19 L29 10" stroke={THEME.primary} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    <circle cx="16" cy="21" r="2" fill={THEME.primary} opacity="0.7"/>
  </svg>,
  gifts: <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="4" y="14" width="24" height="15" rx="1.5" stroke={THEME.primary} strokeWidth="1.4" fill="none"/>
    <rect x="2" y="10" width="28" height="5" rx="1.5" stroke={THEME.primary} strokeWidth="1.4" fill="none"/>
    <path d="M16 10 L16 29" stroke={THEME.primary} strokeWidth="1.2" opacity="0.5"/>
    <path d="M16 10 C16 10 11 7 10 4 C12 3 16 6 16 10Z" fill={THEME.primary} opacity="0.6"/>
    <path d="M16 10 C16 10 21 7 22 4 C20 3 16 6 16 10Z" fill={THEME.primary} opacity="0.6"/>
  </svg>,
  dresscode: <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 3 C16 3 12 6 9 8 L5 13 L11 13 L11 29 L21 29 L21 13 L27 13 L23 8 C20 6 16 3 16 3Z"
          stroke={THEME.primary} strokeWidth="1.4" fill="none"/>
    <path d="M12 8 L16 11 L20 8" stroke={THEME.primary} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
  </svg>,
  itinerary: <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="4" y="6" width="24" height="22" rx="2" stroke={THEME.primary} strokeWidth="1.4" fill="none"/>
    <path d="M11 3 L11 9" stroke={THEME.primary} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M21 3 L21 9" stroke={THEME.primary} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M4 13 L28 13" stroke={THEME.primary} strokeWidth="1" opacity="0.45"/>
    <path d="M9 18 L23 18" stroke={THEME.primary} strokeWidth="1.2" strokeLinecap="round" opacity="0.65"/>
    <path d="M9 23 L19 23" stroke={THEME.primary} strokeWidth="1.2" strokeLinecap="round" opacity="0.65"/>
  </svg>,
  parents: <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="11" cy="9" r="4" stroke={THEME.primary} strokeWidth="1.4" fill="none"/>
    <circle cx="21" cy="9" r="4" stroke={THEME.primary} strokeWidth="1.4" fill="none"/>
    <path d="M3 27 C3 20 7 16 11 16 C15 16 19 20 19 27" stroke={THEME.primary} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    <path d="M19 27 C19 20 23 16 21 16 C25 16 29 20 29 27" stroke={THEME.primary} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    <path d="M16 6 C16 4 19 3 19 5 C19 7 16 9 16 9 C16 9 13 7 13 5 C13 3 16 4 16 6Z" fill={THEME.primary} opacity="0.6"/>
  </svg>,
  envelope_rain: <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="3" y="7" width="22" height="16" rx="2" stroke={THEME.primary} strokeWidth="1.4" fill="none"/>
    <path d="M3 9 L14 17 L25 9" stroke={THEME.primary} strokeWidth="1.3" strokeLinecap="round" fill="none"/>
    <path d="M27 13 L27 29" stroke={THEME.primary} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    <path d="M27 21 L23 25 L27 29 L31 25 Z" fill={THEME.primary} opacity="0.6"/>
  </svg>,
  gallery: <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="2" y="5" width="28" height="22" rx="2" stroke={THEME.primary} strokeWidth="1.4" fill="none"/>
    <circle cx="10" cy="13" r="3.5" stroke={THEME.primary} strokeWidth="1.2" fill="none"/>
    <path d="M2 23 L10 16 L16 21 L21 16 L30 25" stroke={THEME.primary} strokeWidth="1.3" strokeLinecap="round" fill="none"/>
  </svg>,
  tips: <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="13" r="9" stroke={THEME.primary} strokeWidth="1.4" fill="none"/>
    <path d="M12 20 C12 22 14 24 16 24 C18 24 20 22 20 20" stroke={THEME.primary} strokeWidth="1.3" strokeLinecap="round" fill="none"/>
    <path d="M16 9 L16 9" stroke={THEME.primary} strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 12 L16 17" stroke={THEME.primary} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M13 29 L19 29" stroke={THEME.primary} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
  </svg>,
  instagram: <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="4" y="4" width="24" height="24" rx="6" stroke={THEME.primary} strokeWidth="1.4" fill="none"/>
    <circle cx="16" cy="16" r="5.5" stroke={THEME.primary} strokeWidth="1.3" fill="none"/>
    <circle cx="23" cy="9" r="1.5" fill={THEME.primary} opacity="0.7"/>
  </svg>,
  calendar: <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="3" y="6" width="26" height="23" rx="2" stroke={THEME.primary} strokeWidth="1.4" fill="none"/>
    <path d="M3 13 L29 13" stroke={THEME.primary} strokeWidth="1" opacity="0.5"/>
    <path d="M10 3 L10 9" stroke={THEME.primary} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M22 3 L22 9" stroke={THEME.primary} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M9 19 L14 24 L23 16" stroke={THEME.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
};

// ─────────────────────────────────────────────────────────────────────────────
// Section wrapper
// ─────────────────────────────────────────────────────────────────────────────

function LeavesSection({ icon, title, children, clickable = false, onClick }: {
  icon: React.ReactNode; title: string; children?: React.ReactNode;
  clickable?: boolean; onClick?: () => void;
}) {
  return (
    <section className="py-10">
      <div className="max-w-lg mx-auto px-6 text-center">
        <CircleIcon clickable={clickable} onClick={onClick}>{icon}</CircleIcon>
        <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.25 }}
          className="mt-5 text-sm tracking-widest uppercase"
          style={{ color: THEME.primary, fontFamily: "Cormorant Garamond, serif" }}>
          {title}
        </motion.p>
        {children && (
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.35 }} className="mt-4">
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────────────────────────────────────

function LeavesModal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="modal-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
          <motion.div key="modal-content"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 bottom-0 z-[90] max-w-lg mx-auto rounded-t-2xl overflow-hidden shadow-2xl md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:bottom-auto"
            style={{ backgroundColor: THEME.secondary, fontFamily: "Cormorant Garamond, serif" }}
          >
            {/* Handle bar (mobile) */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full bg-stone-300" />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: THEME.accent + "50" }}>
              <p className="text-sm tracking-widest uppercase" style={{ color: THEME.primary }}>{title}</p>
              <button onClick={onClose} className="text-2xl leading-none" style={{ color: THEME.primary, opacity: 0.5 }}>×</button>
            </div>
            {/* Corner decoration */}
            <div className="absolute top-0 right-0 pointer-events-none opacity-30">
              <CornerLeaves position="tr" />
            </div>
            {/* Body */}
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Add to Calendar
// ─────────────────────────────────────────────────────────────────────────────

function AddToCalendar({ event }: { event: Event }) {
  const [open, setOpen] = useState(false);

  const start = new Date(event.date);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000); // +4h
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${fmt(start)}/${fmt(end)}&location=${encodeURIComponent(event.location ?? "")}&details=${encodeURIComponent(event.description ?? "")}`;

  function downloadIcs() {
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Event Invitations//EN",
      "BEGIN:VEVENT",
      `UID:${event.id}@eventinvitations`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${event.name}`,
      event.location ? `LOCATION:${event.location}` : "",
      event.description ? `DESCRIPTION:${event.description}` : "",
      "END:VEVENT", "END:VCALENDAR",
    ].filter(Boolean).join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${event.name.replace(/\s+/g, "_")}.ics`;
    a.click();
  }

  return (
    <div className="relative inline-block">
      <motion.button
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: 0.6 }}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase border transition-colors mt-4"
        style={{ borderColor: THEME.primary, color: THEME.primary }}
      >
        <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
          <rect x="3" y="6" width="26" height="23" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M3 13 L29 13" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
          <path d="M10 3 L10 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M22 3 L22 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M9 20 L14 25 L23 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Agregar al calendario
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 mt-2 z-20 shadow-lg rounded overflow-hidden"
            style={{ backgroundColor: THEME.secondary, border: `1px solid ${THEME.accent}` }}>
            <a href={googleUrl} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 px-5 py-3 text-xs hover:bg-black/5 transition-colors whitespace-nowrap"
               style={{ color: THEME.primary }}>
              <span>📅</span> Google Calendar
            </a>
            <button onClick={() => { downloadIcs(); setOpen(false); }}
              className="flex items-center gap-2 px-5 py-3 text-xs hover:bg-black/5 transition-colors w-full text-left"
              style={{ color: THEME.primary, borderTop: `1px solid ${THEME.accent}50` }}>
              <span>🍎</span> Apple / Outlook (.ics)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero with parallax
// ─────────────────────────────────────────────────────────────────────────────

function LeavesHero({ event, participant }: { event: Event; participant: Participant }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
             style={{ backgroundColor: THEME.secondary }}>
      <CornerLeaves position="tl" />
      <CornerLeaves position="tr" />
      <CornerLeaves position="bl" />
      <CornerLeaves position="br" />

      {event.cover_image && (
        <>
          <motion.div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${event.cover_image})`, y: bgY }} />
          <div className="absolute inset-0 bg-black/38" />
        </>
      )}

      <div className="relative z-10 max-w-md mx-auto space-y-4">
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8 }}
          className="w-14 h-px mx-auto" style={{ backgroundColor: event.cover_image ? "#c8a951" : THEME.accent }} />

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-2xl" style={{ fontFamily: "Great Vibes, cursive", color: event.cover_image ? "#f5ead0" : THEME.accent }}>
          Estimado/a
        </motion.p>

        <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="text-3xl md:text-4xl font-light"
          style={{ color: event.cover_image ? "#fff" : THEME.primary }}>
          {participant.name}
        </motion.h2>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.65, duration: 0.6 }}
          className="w-10 h-px mx-auto" style={{ backgroundColor: event.cover_image ? "#c8a951" : THEME.accent }} />

        <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }}
          className="text-4xl md:text-6xl font-light leading-tight"
          style={{ fontFamily: "Great Vibes, cursive", color: event.cover_image ? "#fff" : THEME.primary }}>
          {event.name}
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="text-base tracking-widest uppercase"
          style={{ color: event.cover_image ? "rgba(255,255,255,0.85)" : THEME.primary, opacity: 0.85 }}>
          {formatDate(event.date)}
        </motion.p>

        {event.location && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
            className="text-sm tracking-wider"
            style={{ color: event.cover_image ? "rgba(255,255,255,0.7)" : THEME.accent }}>
            {event.location}
          </motion.p>
        )}

        {participant.companions > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="inline-block px-5 py-1.5 rounded-full text-xs tracking-widest uppercase border"
            style={{ borderColor: event.cover_image ? "rgba(255,255,255,0.4)" : THEME.accent,
                     color: event.cover_image ? "rgba(255,255,255,0.85)" : THEME.primary }}>
            Mesa para {1 + participant.companions} personas
          </motion.div>
        )}

        <AddToCalendar event={event} />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-10 mx-auto" style={{ backgroundColor: event.cover_image ? "rgba(255,255,255,0.4)" : THEME.accent }} />
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Countdown (inline)
// ─────────────────────────────────────────────────────────────────────────────

function getTimeLeft(d: string) {
  const diff = new Date(d).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Countdown({ event }: { event: Event }) {
  const [time, setTime] = useState(() => getTimeLeft(event.date));
  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(event.date)), 1000);
    return () => clearInterval(id);
  }, [event.date]);
  if (!time) return null;
  return (
    <LeavesSection icon={Icons.countdown} title="Cuenta Regresiva">
      <div className="grid grid-cols-4 gap-2">
        {[["days","Días"],["hours","Hrs"],["minutes","Min"],["seconds","Seg"]].map(([k, label]) => (
          <div key={k} className={`rounded py-3 ${THEME.cardClass}`}>
            <p className="text-3xl font-light tabular-nums" style={{ color: THEME.primary, fontFamily: "Cormorant Garamond, serif" }}>
              {String(time[k as keyof typeof time]).padStart(2,"0")}
            </p>
            <p className="text-xs tracking-wider uppercase mt-1" style={{ color: THEME.accent }}>{label}</p>
          </div>
        ))}
      </div>
    </LeavesSection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  event: Event; participant: Participant; modules: Module[];
  isPreview?: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onEnvelopeOpen: () => void;
  envelopeOpened: boolean;
}

export default function LeavesInvitationPage({
  event, participant, modules, isPreview = false,
  audioRef, onEnvelopeOpen, envelopeOpened,
}: Props) {
  const [modal, setModal] = useState<string | null>(null);

  const active = modules.filter((m) => m.is_active && m.type !== "music");
  const musicMod = modules.find((m) => m.type === "music" && m.is_active);

  return (
    <>
      {/* Envelope intro (skipped in preview) */}
      {!isPreview && !envelopeOpened && (
        <EnvelopeIntro event={event} participant={participant} theme={THEME} onOpen={onEnvelopeOpen} />
      )}

      {/* Main invitation */}
      <motion.div
        className="min-h-screen" style={{ backgroundColor: THEME.secondary, fontFamily: "Cormorant Garamond, serif" }}
        initial={isPreview ? false : { opacity: 0 }}
        animate={isPreview || envelopeOpened ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {isPreview && (
          <div className="sticky top-0 z-50 bg-amber-400 text-amber-900 text-xs text-center py-2 px-4 font-medium tracking-wide">
            Vista previa — así verán la invitación tus invitados
          </div>
        )}

        {musicMod && <MusicModule module={musicMod} theme={THEME} audioRef={audioRef} />}

        <LeavesHero event={event} participant={participant} />

        {active.map((mod) => (
          <div key={mod.id}>
            <LeafDivider />
            {renderModule(mod, event, participant, isPreview, modal, setModal)}
          </div>
        ))}

        <LeafDivider />
        <footer className="text-center py-10">
          <p className="text-xs tracking-widest uppercase" style={{ color: THEME.accent }}>
            Creado con Event Invitations
          </p>
        </footer>
      </motion.div>

      {/* Modals */}
      <MapModal       open={modal === "map"}           onClose={() => setModal(null)} modules={modules} event={event} />
      <DressCodeModal open={modal === "dress_code"}    onClose={() => setModal(null)} modules={modules} />
      <GiftsModal     open={modal === "gifts"}         onClose={() => setModal(null)} modules={modules} />
      <EnvelopeModal  open={modal === "envelope_rain"} onClose={() => setModal(null)} modules={modules} />
      <TipsModal      open={modal === "tips"}          onClose={() => setModal(null)} modules={modules} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Module renderer
// ─────────────────────────────────────────────────────────────────────────────

function renderModule(
  mod: Module, event: Event, participant: Participant,
  isPreview: boolean,
  modal: string | null,
  setModal: (v: string | null) => void
): React.ReactNode {
  // Modal-based sections: show circle icon + title, click opens modal
  if (["map", "dress_code", "gifts", "envelope_rain", "tips"].includes(mod.type)) {
    const labels: Record<string, string> = {
      map: "Lugar del Evento", dress_code: "Código de Vestimenta",
      gifts: "Mesa de Regalos", envelope_rain: "Lluvia de Sobres", tips: "Tips para el día",
    };
    const iconMap: Record<string, React.ReactNode> = {
      map: Icons.map, dress_code: Icons.dresscode,
      gifts: Icons.gifts, envelope_rain: Icons.envelope_rain, tips: Icons.tips,
    };
    return (
      <LeavesSection
        icon={iconMap[mod.type]}
        title={labels[mod.type]}
        clickable
        onClick={() => setModal(mod.type)}
      />
    );
  }

  switch (mod.type) {
    case "countdown": return <Countdown event={event} />;

    case "carousel":
    case "gallery": {
      const images = (mod.config as { images?: string[] }).images ?? [];
      if (!images.length) return null;
      return (
        <LeavesSection icon={Icons.gallery} title="Galería">
          <div className="grid grid-cols-2 gap-2 mt-2">
            {images.slice(0, 6).map((src, i) => (
              <motion.div key={i} className="aspect-square overflow-hidden rounded"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </LeavesSection>
      );
    }

    case "itinerary": {
      const items = (mod.config as { itineraryItems?: { time: string; description: string }[] }).itineraryItems ?? [];
      if (!items.length) return null;
      return (
        <LeavesSection icon={Icons.itinerary} title="Itinerario">
          <div className="space-y-3 text-left mt-2">
            {items.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex gap-4 items-start">
                <span className="text-xs tracking-widest uppercase pt-0.5 shrink-0 w-20 text-right"
                      style={{ color: THEME.accent }}>{item.time}</span>
                <div className="w-px self-stretch" style={{ backgroundColor: THEME.accent, opacity: 0.35 }} />
                <span className="text-base font-light" style={{ color: THEME.primary }}>{item.description}</span>
              </motion.div>
            ))}
          </div>
        </LeavesSection>
      );
    }

    case "parents": {
      const cfg = mod.config as { sectionTitle?: string; brideParentNames?: string[]; brideParentsLabel?: string; groomParentNames?: string[]; groomParentsLabel?: string; godfathersLabel?: string; godfatherNames?: string[] };
      const bn = cfg.brideParentNames ?? []; const gn = cfg.groomParentNames ?? []; const god = cfg.godfatherNames ?? [];
      if (!bn.length && !gn.length && !god.length) return null;
      return (
        <LeavesSection icon={Icons.parents} title={cfg.sectionTitle || "Nuestros Padres"}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {bn.length > 0 && (
              <div>
                {cfg.brideParentsLabel && <p className="text-xs tracking-widest uppercase mb-2" style={{ color: THEME.accent }}>{cfg.brideParentsLabel}</p>}
                {bn.map((n, i) => <p key={i} className="text-xl font-light" style={{ fontFamily: "Great Vibes, cursive", color: THEME.primary }}>{n}</p>)}
              </div>
            )}
            {gn.length > 0 && (
              <div>
                {cfg.groomParentsLabel && <p className="text-xs tracking-widest uppercase mb-2" style={{ color: THEME.accent }}>{cfg.groomParentsLabel}</p>}
                {gn.map((n, i) => <p key={i} className="text-xl font-light" style={{ fontFamily: "Great Vibes, cursive", color: THEME.primary }}>{n}</p>)}
              </div>
            )}
          </div>
          {god.length > 0 && (
            <div className="border-t pt-3" style={{ borderColor: THEME.accent + "40" }}>
              {cfg.godfathersLabel && <p className="text-xs tracking-widest uppercase mb-2" style={{ color: THEME.accent }}>{cfg.godfathersLabel}</p>}
              {god.map((n, i) => <p key={i} className="text-xl font-light" style={{ fontFamily: "Great Vibes, cursive", color: THEME.primary }}>{n}</p>)}
            </div>
          )}
        </LeavesSection>
      );
    }

    case "rsvp":
      return (
        <LeavesSection icon={Icons.rsvp} title="Confirmar Asistencia" clickable={!isPreview} onClick={!isPreview ? () => {} : undefined}>
          {!isPreview ? (
            <RsvpInline participant={participant} />
          ) : (
            <div className="border-2 border-dashed rounded py-4 text-sm" style={{ borderColor: THEME.accent, color: THEME.accent }}>
              Formulario de confirmación
            </div>
          )}
        </LeavesSection>
      );

    case "instagram": {
      const cfg = mod.config as { hashtag?: string; instagramUrl?: string; message?: string };
      return (
        <LeavesSection icon={Icons.instagram} title="Comparte el Momento">
          {cfg.message && <p className="text-base font-light mb-4" style={{ color: THEME.primary }}>{cfg.message}</p>}
          {cfg.hashtag && (
            <p className="text-3xl mb-4" style={{ fontFamily: "Great Vibes, cursive", color: THEME.primary }}>
              #{cfg.hashtag}
            </p>
          )}
          {cfg.instagramUrl && (
            <a href={cfg.instagramUrl} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-6 py-2.5 text-sm tracking-widest uppercase text-white"
               style={{ backgroundColor: THEME.primary }}>
              <span>📸</span> Ver en Instagram
            </a>
          )}
        </LeavesSection>
      );
    }

    default: return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal contents
// ─────────────────────────────────────────────────────────────────────────────

function MapModal({ open, onClose, modules, event }: { open: boolean; onClose: () => void; modules: Module[]; event: Event }) {
  const mod = modules.find((m) => m.type === "map" && m.is_active);
  const cfg = (mod?.config ?? {}) as { mapAddress?: string; mapEmbedUrl?: string };
  const address = cfg.mapAddress || event.location;
  return (
    <LeavesModal open={open} onClose={onClose} title="Lugar del Evento">
      <div className="space-y-4">
        {address && <p className="text-xl font-light" style={{ color: THEME.primary }}>{address}</p>}
        {cfg.mapEmbedUrl ? (
          <div className="rounded overflow-hidden border" style={{ borderColor: THEME.accent }}>
            <iframe src={cfg.mapEmbedUrl} width="100%" height="300" style={{ border: 0 }}
                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        ) : address ? (
          <a href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer"
             className="flex items-center justify-center gap-2 px-6 py-3 text-sm tracking-widest uppercase border"
             style={{ borderColor: THEME.primary, color: THEME.primary }}>
            📍 Abrir en Google Maps
          </a>
        ) : null}
      </div>
    </LeavesModal>
  );
}

function DressCodeModal({ open, onClose, modules }: { open: boolean; onClose: () => void; modules: Module[] }) {
  const mod = modules.find((m) => m.type === "dress_code" && m.is_active);
  const cfg = (mod?.config ?? {}) as { dressCodeText?: string; dressCodeColors?: string[]; dressCodeFemaleImage?: string; dressCodeFemaleDescription?: string; dressCodeMaleImage?: string; dressCodeMaleDescription?: string };
  return (
    <LeavesModal open={open} onClose={onClose} title="Código de Vestimenta">
      <div className="space-y-5">
        {cfg.dressCodeText && <p className="text-base font-light leading-relaxed" style={{ color: THEME.primary }}>{cfg.dressCodeText}</p>}
        {(cfg.dressCodeColors ?? []).length > 0 && (
          <div className="flex gap-3 flex-wrap justify-center">
            {(cfg.dressCodeColors ?? []).map((c, i) => (
              <div key={i} className="w-10 h-10 rounded-full shadow border-2 border-white" style={{ backgroundColor: c }} />
            ))}
          </div>
        )}
        {(cfg.dressCodeFemaleImage || cfg.dressCodeMaleImage) && (
          <div className="grid grid-cols-2 gap-4">
            {cfg.dressCodeFemaleImage && (
              <div className={`rounded overflow-hidden ${THEME.cardClass}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cfg.dressCodeFemaleImage} alt="Mujer" className="w-full aspect-[3/4] object-cover" />
                <p className="text-xs tracking-widest uppercase text-center py-2" style={{ color: THEME.accent }}>Mujer</p>
                {cfg.dressCodeFemaleDescription && <p className="text-xs text-center pb-3 px-2" style={{ color: THEME.primary }}>{cfg.dressCodeFemaleDescription}</p>}
              </div>
            )}
            {cfg.dressCodeMaleImage && (
              <div className={`rounded overflow-hidden ${THEME.cardClass}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cfg.dressCodeMaleImage} alt="Hombre" className="w-full aspect-[3/4] object-cover" />
                <p className="text-xs tracking-widest uppercase text-center py-2" style={{ color: THEME.accent }}>Hombre</p>
                {cfg.dressCodeMaleDescription && <p className="text-xs text-center pb-3 px-2" style={{ color: THEME.primary }}>{cfg.dressCodeMaleDescription}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </LeavesModal>
  );
}

function GiftsModal({ open, onClose, modules }: { open: boolean; onClose: () => void; modules: Module[] }) {
  const mod = modules.find((m) => m.type === "gifts" && m.is_active);
  const cfg = (mod?.config ?? {}) as { giftsText?: string; giftStoreUrl?: string };
  return (
    <LeavesModal open={open} onClose={onClose} title="Mesa de Regalos">
      <div className="space-y-4 text-center">
        {cfg.giftsText && <p className="text-base font-light leading-relaxed" style={{ color: THEME.primary }}>{cfg.giftsText}</p>}
        {cfg.giftStoreUrl && (
          <a href={cfg.giftStoreUrl} target="_blank" rel="noopener noreferrer"
             className="inline-block px-8 py-3 text-sm tracking-widest uppercase text-white"
             style={{ backgroundColor: THEME.primary }}>
            Ver lista de regalos
          </a>
        )}
      </div>
    </LeavesModal>
  );
}

function EnvelopeModal({ open, onClose, modules }: { open: boolean; onClose: () => void; modules: Module[] }) {
  const [copied, setCopied] = useState<string | null>(null);
  const mod = modules.find((m) => m.type === "envelope_rain" && m.is_active);
  const cfg = (mod?.config ?? {}) as { envelopeRainDescription?: string; envelopeRainAccounts?: { bankName: string; accountHolder: string; clabe?: string; accountNumber?: string; alias?: string }[] };
  const accounts = cfg.envelopeRainAccounts ?? [];

  async function copy(text: string) {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <LeavesModal open={open} onClose={onClose} title="Lluvia de Sobres">
      <div className="space-y-4">
        {cfg.envelopeRainDescription && <p className="text-base font-light leading-relaxed" style={{ color: THEME.primary }}>{cfg.envelopeRainDescription}</p>}
        {accounts.map((acc, i) => (
          <div key={i} className={`rounded p-4 ${THEME.cardClass}`}>
            <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: THEME.accent }}>{acc.bankName}</p>
            <p className="text-xl font-light mb-3" style={{ fontFamily: "Great Vibes, cursive", color: THEME.primary }}>{acc.accountHolder}</p>
            {acc.clabe && (
              <div className="flex items-center justify-between gap-2 py-1">
                <div>
                  <p className="text-xs" style={{ color: THEME.accent }}>CLABE</p>
                  <p className="text-sm font-mono" style={{ color: THEME.primary }}>{acc.clabe}</p>
                </div>
                <button onClick={() => copy(acc.clabe!)}
                  className="text-xs px-3 py-1 border rounded-full" style={{ borderColor: THEME.primary, color: THEME.primary }}>
                  {copied === acc.clabe ? "✓" : "Copiar"}
                </button>
              </div>
            )}
            {acc.alias && <p className="text-xs mt-1" style={{ color: THEME.accent }}>{acc.alias}</p>}
          </div>
        ))}
      </div>
    </LeavesModal>
  );
}

function TipsModal({ open, onClose, modules }: { open: boolean; onClose: () => void; modules: Module[] }) {
  const mod = modules.find((m) => m.type === "tips" && m.is_active);
  const cfg = (mod?.config ?? {}) as { sectionTitle?: string; tips?: string[] };
  const tips = cfg.tips ?? [];
  return (
    <LeavesModal open={open} onClose={onClose} title={cfg.sectionTitle || "Tips para el día"}>
      {tips.length === 0 ? (
        <p className="text-sm text-center" style={{ color: THEME.accent }}>Sin tips configurados aún.</p>
      ) : (
        <ul className="space-y-3">
          {tips.map((tip, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3">
              <span className="mt-1 shrink-0 text-sm" style={{ color: THEME.accent }}>✦</span>
              <p className="text-base font-light" style={{ color: THEME.primary }}>{tip}</p>
            </motion.li>
          ))}
        </ul>
      )}
    </LeavesModal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline RSVP
// ─────────────────────────────────────────────────────────────────────────────

function RsvpInline({ participant }: { participant: Participant }) {
  const [status, setStatus] = useState(participant.attendance);
  const [notes, setNotes] = useState(participant.notes ?? "");
  const [submitted, setSubmitted] = useState(participant.attendance !== "pending");
  const [loading, setLoading] = useState(false);

  async function confirm(att: "confirmed" | "declined") {
    setLoading(true);
    await fetch(`/api/participants/${participant.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendance: att, notes }),
    });
    setStatus(att); setSubmitted(true); setLoading(false);
  }

  if (submitted) return (
    <div className="space-y-3">
      <p className="text-2xl" style={{ fontFamily: "Great Vibes, cursive", color: THEME.primary }}>
        {status === "confirmed" ? "¡Nos vemos pronto!" : "Gracias por avisarnos"}
      </p>
      <button onClick={() => setSubmitted(false)} className="text-xs underline" style={{ color: THEME.accent }}>Cambiar respuesta</button>
    </div>
  );

  return (
    <div className="space-y-3 max-w-xs mx-auto">
      {participant.companions > 0 && (
        <p className="text-sm" style={{ color: THEME.accent }}>Tu lugar incluye {participant.companions} acompañante{participant.companions !== 1 ? "s" : ""}</p>
      )}
      <div className="grid grid-cols-2 gap-2">
        {(["confirmed","declined"] as const).map((v) => (
          <button key={v} onClick={() => confirm(v)} disabled={loading}
            className="py-3 text-sm tracking-widest uppercase transition-all disabled:opacity-50"
            style={v === "confirmed" ? { backgroundColor: THEME.primary, color: "#fff" } : { border: `1px solid ${THEME.primary}`, color: THEME.primary }}>
            {loading ? "…" : v === "confirmed" ? "✓ Asistiré" : "✗ No podré ir"}
          </button>
        ))}
      </div>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
        placeholder="Mensaje opcional…" rows={2}
        className="w-full text-sm font-light px-3 py-2 border resize-none bg-transparent focus:outline-none"
        style={{ borderColor: THEME.accent + "60", color: THEME.primary }} />
    </div>
  );
}
