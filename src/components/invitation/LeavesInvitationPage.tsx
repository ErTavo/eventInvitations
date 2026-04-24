"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Event, Module, Participant } from "@/lib/supabase/types";
import type { ThemeConfig } from "./themes";
import { formatDate } from "@/lib/utils";
import MusicModule from "./modules/MusicModule";
import RsvpModule from "./modules/RsvpModule";

// ─── Leaf SVG decorations ──────────────────────────────────────────────────────

function CornerLeaves({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const isMirrorX = position === "tr" || position === "br";
  const isMirrorY = position === "bl" || position === "br";
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top: position.startsWith("t") ? 0 : undefined,
        bottom: position.startsWith("b") ? 0 : undefined,
        left: position.endsWith("l") ? 0 : undefined,
        right: position.endsWith("r") ? 0 : undefined,
        transform: `${isMirrorX ? "scaleX(-1)" : ""} ${isMirrorY ? "scaleY(-1)" : ""}`,
        zIndex: 1,
      }}
    >
      <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
        <path d="M10 130 C20 100 50 70 80 50 C100 36 120 20 130 10"
              stroke="#5a7a4a" strokeWidth="1.5" strokeLinecap="round" opacity="0.45"/>
        <ellipse cx="60" cy="68" rx="22" ry="13" fill="#6b8f60" opacity="0.5"  transform="rotate(-40 60 68)"/>
        <ellipse cx="80" cy="52" rx="20" ry="12" fill="#7a9e6e" opacity="0.45" transform="rotate(-50 80 52)"/>
        <ellipse cx="42" cy="86" rx="18" ry="11" fill="#6b8f60" opacity="0.42" transform="rotate(-30 42 86)"/>
        <ellipse cx="100" cy="36" rx="17" ry="10" fill="#8fb07e" opacity="0.38" transform="rotate(-60 100 36)"/>
        <ellipse cx="22" cy="106" rx="16" ry="9"  fill="#7a9e6e" opacity="0.35" transform="rotate(-20 22 106)"/>
        {/* Gold berries */}
        <circle cx="65"  cy="60"  r="4" fill="#c8a951" opacity="0.7"/>
        <circle cx="50"  cy="78"  r="3" fill="#c8a951" opacity="0.6"/>
        <circle cx="82"  cy="44"  r="3.5" fill="#c8a951" opacity="0.65"/>
        <circle cx="32"  cy="98"  r="3" fill="#c8a951" opacity="0.55"/>
      </svg>
    </div>
  );
}

function LeafDivider({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-2 px-6">
      <div className="h-px flex-1 max-w-16" style={{ backgroundColor: color, opacity: 0.35 }} />
      <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
        <path d="M16 18 C10 14 2 10 0 9 C2 8 10 4 16 0 C22 4 30 8 32 9 C30 10 22 14 16 18Z"
              fill={color} opacity="0.4"/>
        <circle cx="16" cy="9" r="2.5" fill={color} opacity="0.65"/>
      </svg>
      <div className="h-px flex-1 max-w-16" style={{ backgroundColor: color, opacity: 0.35 }} />
    </div>
  );
}

// ─── Animated circular section icon ───────────────────────────────────────────

function CircleIcon({ children, color, size = 88 }: {
  children: React.ReactNode; color: string; size?: number;
}) {
  return (
    <motion.div
      className="relative mx-auto flex items-center justify-center"
      style={{ width: size, height: size }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
    >
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full" style={{ border: `1.5px solid ${color}`, opacity: 0.5 }} />
      {/* Inner ring */}
      <div className="absolute rounded-full" style={{
        inset: 8, border: `1px solid ${color}`, opacity: 0.25,
      }} />
      {/* Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ─── Section icon SVGs ─────────────────────────────────────────────────────────

const Icons = {
  countdown: (color: string) => (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="19" r="12" stroke={color} strokeWidth="1.5" fill="none"/>
      <path d="M17 7 L17 3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M13 2 L21 2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M17 19 L17 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M17 19 L22 22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="17" cy="19" r="1.5" fill={color}/>
    </svg>
  ),
  map: (color: string) => (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <path d="M17 4 C12 4 8 8 8 13 C8 20 17 30 17 30 C17 30 26 20 26 13 C26 8 22 4 17 4Z"
            stroke={color} strokeWidth="1.5" fill="none"/>
      <circle cx="17" cy="13" r="3.5" stroke={color} strokeWidth="1.2" fill="none"/>
      {/* Leaf accent */}
      <path d="M17 4 C15 2 12 3 11 5 C12 5 15 4 17 4Z" fill={color} opacity="0.5"/>
    </svg>
  ),
  rsvp: (color: string) => (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <rect x="4" y="9" width="26" height="18" rx="2" stroke={color} strokeWidth="1.5" fill="none"/>
      <path d="M4 11 L17 20 L30 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <circle cx="17" cy="22" r="2.5" fill={color} opacity="0.7"/>
    </svg>
  ),
  gifts: (color: string) => (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <rect x="5" y="15" width="24" height="16" rx="1.5" stroke={color} strokeWidth="1.5" fill="none"/>
      <rect x="3" y="11" width="28" height="5" rx="1.5" stroke={color} strokeWidth="1.5" fill="none"/>
      <path d="M17 11 L17 31" stroke={color} strokeWidth="1.2" opacity="0.6"/>
      <path d="M17 11 C17 11 12 8 11 5 C13 4 17 7 17 11Z" fill={color} opacity="0.6"/>
      <path d="M17 11 C17 11 22 8 23 5 C21 4 17 7 17 11Z" fill={color} opacity="0.6"/>
    </svg>
  ),
  dresscode: (color: string) => (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <path d="M17 4 C17 4 13 7 10 9 L6 14 L12 14 L12 30 L22 30 L22 14 L28 14 L24 9 C21 7 17 4 17 4Z"
            stroke={color} strokeWidth="1.5" fill="none"/>
      <path d="M13 9 L17 12 L21 9" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  itinerary: (color: string) => (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <rect x="5" y="7" width="24" height="22" rx="2" stroke={color} strokeWidth="1.5" fill="none"/>
      <path d="M12 4 L12 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M22 4 L22 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 14 L29 14" stroke={color} strokeWidth="1" opacity="0.5"/>
      <path d="M10 19 L24 19" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
      <path d="M10 24 L20 24" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
    </svg>
  ),
  parents: (color: string) => (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="12" cy="10" r="4" stroke={color} strokeWidth="1.5" fill="none"/>
      <circle cx="22" cy="10" r="4" stroke={color} strokeWidth="1.5" fill="none"/>
      <path d="M4 28 C4 21 8 17 12 17 C16 17 20 21 20 28" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M20 28 C20 21 24 17 22 17 C26 17 30 21 30 28" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M17 7 C17 5 20 4 20 6 C20 8 17 10 17 10 C17 10 14 8 14 6 C14 4 17 5 17 7Z"
            fill={color} opacity="0.6"/>
    </svg>
  ),
  envelope_rain: (color: string) => (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <rect x="4" y="8" width="22" height="16" rx="2" stroke={color} strokeWidth="1.5" fill="none"/>
      <path d="M4 10 L15 18 L26 10" stroke={color} strokeWidth="1.3" strokeLinecap="round" fill="none"/>
      <path d="M28 14 L28 30" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      <path d="M28 22 L24 26 L28 30 L32 26 Z" fill={color} opacity="0.6"/>
    </svg>
  ),
  gallery: (color: string) => (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <rect x="3" y="6" width="28" height="22" rx="2" stroke={color} strokeWidth="1.5" fill="none"/>
      <circle cx="11" cy="14" r="3.5" stroke={color} strokeWidth="1.2" fill="none"/>
      <path d="M3 24 L11 17 L17 22 L22 17 L31 26" stroke={color} strokeWidth="1.3" strokeLinecap="round" fill="none"/>
    </svg>
  ),
};

// ─── Section wrapper with animated icon ───────────────────────────────────────

function LeavesSection({
  icon, title, children, theme, noPadding = false,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  theme: ThemeConfig;
  noPadding?: boolean;
}) {
  return (
    <section className={`${noPadding ? "" : "py-12"}`}>
      <div className="max-w-lg mx-auto px-6 text-center">
        <CircleIcon color={theme.primary}>{icon}</CircleIcon>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="mt-4 text-sm tracking-widest uppercase"
          style={{ color: theme.primary, fontFamily: "Cormorant Garamond, serif" }}
        >
          {title}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="mt-5"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Music entry screen ────────────────────────────────────────────────────────

function MusicEntryScreen({
  event, participant, theme, onEnter,
}: {
  event: Event; participant: Participant; theme: ThemeConfig;
  onEnter: (withMusic: boolean) => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: theme.secondary, fontFamily: "Cormorant Garamond, serif" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <CornerLeaves position="tl" />
      <CornerLeaves position="tr" />
      <CornerLeaves position="bl" />
      <CornerLeaves position="br" />

      <div className="relative z-10 text-center space-y-6 max-w-sm">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm tracking-widest uppercase"
          style={{ color: theme.accent }}
        >
          Tienes una invitación
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-5xl leading-tight"
          style={{ fontFamily: "Great Vibes, cursive", color: theme.primary }}
        >
          {event.name}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="h-px w-16 mx-auto"
          style={{ backgroundColor: theme.accent }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-base font-light"
          style={{ color: theme.primary }}
        >
          Para{" "}
          <span style={{ fontFamily: "Great Vibes, cursive", fontSize: "1.4rem" }}>
            {participant.name}
          </span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.1 }}
          className="text-xs tracking-widest uppercase"
          style={{ color: theme.primary }}
        >
          ¿Cómo deseas ingresar?
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={() => onEnter(true)}
            className="flex items-center justify-center gap-2 px-8 py-3 text-sm tracking-widest uppercase text-white"
            style={{ backgroundColor: theme.primary }}
          >
            <span>🎵</span> Con música
          </button>
          <button
            onClick={() => onEnter(false)}
            className="px-8 py-3 text-sm tracking-widest uppercase border"
            style={{ borderColor: theme.primary, color: theme.primary }}
          >
            Sin música
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Hero section ──────────────────────────────────────────────────────────────

function LeavesHero({ event, participant, theme }: {
  event: Event; participant: Participant; theme: ThemeConfig;
}) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
             style={{ backgroundColor: theme.secondary }}>
      <CornerLeaves position="tl" />
      <CornerLeaves position="tr" />
      <CornerLeaves position="bl" />
      <CornerLeaves position="br" />

      {event.cover_image && (
        <>
          <div className="absolute inset-0 bg-cover bg-center"
               style={{ backgroundImage: `url(${event.cover_image})` }} />
          <div className="absolute inset-0 bg-black/35" />
        </>
      )}

      <div className="relative z-10 max-w-md mx-auto space-y-5">
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8 }}
          className="w-16 h-px mx-auto" style={{ backgroundColor: event.cover_image ? "#c8a951" : theme.accent }} />

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-2xl"
          style={{ fontFamily: "Great Vibes, cursive", color: event.cover_image ? "#f5ead0" : theme.accent }}>
          Estimado/a
        </motion.p>

        <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="text-3xl md:text-4xl font-light"
          style={{ color: event.cover_image ? "#ffffff" : theme.primary }}>
          {participant.name}
        </motion.h2>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.65, duration: 0.6 }}
          className="w-10 h-px mx-auto" style={{ backgroundColor: event.cover_image ? "#c8a951" : theme.accent }} />

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="text-4xl md:text-6xl font-light leading-tight"
          style={{ fontFamily: "Great Vibes, cursive", color: event.cover_image ? "#ffffff" : theme.primary }}>
          {event.name}
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="text-base tracking-widest uppercase"
          style={{ color: event.cover_image ? "rgba(255,255,255,0.8)" : theme.primary, opacity: 0.8 }}>
          {formatDate(event.date)}
        </motion.p>

        {event.location && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
            className="text-sm tracking-wider"
            style={{ color: event.cover_image ? "rgba(255,255,255,0.65)" : theme.accent }}>
            {event.location}
          </motion.p>
        )}

        {participant.companions > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="inline-block px-5 py-1.5 rounded-full text-xs tracking-widest uppercase border"
            style={{ borderColor: event.cover_image ? "rgba(255,255,255,0.4)" : theme.accent,
                     color: event.cover_image ? "rgba(255,255,255,0.85)" : theme.primary }}>
            Mesa para {1 + participant.companions} personas
          </motion.div>
        )}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-10 mx-auto" style={{ backgroundColor: event.cover_image ? "rgba(255,255,255,0.4)" : theme.accent }} />
      </motion.div>
    </section>
  );
}

// ─── Countdown ─────────────────────────────────────────────────────────────────

function LeavesCountdown({ event, theme }: { event: Event; theme: ThemeConfig }) {
  const [time, setTime] = useState(() => getTimeLeft(event.date));
  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(event.date)), 1000);
    return () => clearInterval(id);
  }, [event.date]);
  if (!time) return null;
  const units = [
    { label: "Días", value: time.days },
    { label: "Horas", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Seg", value: time.seconds },
  ];
  return (
    <LeavesSection icon={Icons.countdown(theme.primary)} title="Cuenta Regresiva" theme={theme}>
      <div className="grid grid-cols-4 gap-3">
        {units.map(({ label, value }) => (
          <div key={label} className={`rounded py-3 ${theme.cardClass}`}>
            <p className="text-3xl font-light tabular-nums" style={{ color: theme.primary, fontFamily: "Cormorant Garamond, serif" }}>
              {String(value).padStart(2, "0")}
            </p>
            <p className="text-xs tracking-wider uppercase mt-1" style={{ color: theme.accent }}>
              {label}
            </p>
          </div>
        ))}
      </div>
    </LeavesSection>
  );
}

function getTimeLeft(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

// ─── Main component ────────────────────────────────────────────────────────────

interface Props {
  event: Event;
  participant: Participant;
  modules: Module[];
  isPreview?: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onMusicEnter: (withMusic: boolean) => void;
  musicChosen: boolean;
}

export default function LeavesInvitationPage({
  event, participant, modules, isPreview = false,
  audioRef, onMusicEnter, musicChosen,
}: Props) {
  const theme: ThemeConfig = {
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

  const hasMusic = modules.some((m) => m.type === "music" && m.is_active);
  const musicModule = modules.find((m) => m.type === "music" && m.is_active);
  const getModule = (type: string) => modules.find((m) => m.type === type && m.is_active);

  // Active modules sorted by order, excluding music (floating button)
  const active = modules.filter((m) => m.is_active && m.type !== "music");

  return (
    <>
      {/* Music entry screen */}
      <AnimatePresence>
        {!isPreview && hasMusic && !musicChosen && (
          <MusicEntryScreen
            event={event}
            participant={participant}
            theme={theme}
            onEnter={onMusicEnter}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        className="min-h-screen"
        style={{ backgroundColor: theme.secondary, fontFamily: "Cormorant Garamond, serif" }}
        initial={isPreview || !hasMusic ? false : { opacity: 0 }}
        animate={isPreview || !hasMusic || musicChosen ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {isPreview && (
          <div className="sticky top-0 z-50 bg-amber-400 text-amber-900 text-xs text-center py-2 px-4 font-medium tracking-wide">
            Vista previa — así verán la invitación tus invitados
          </div>
        )}

        {/* Music floating button */}
        {musicModule && <MusicModule module={musicModule} theme={theme} audioRef={audioRef} />}

        {/* Hero */}
        <LeavesHero event={event} participant={participant} theme={theme} />

        {/* Module sections in DB order */}
        {active.map((mod, i) => (
          <div key={mod.id}>
            <LeafDivider color={theme.accent} />
            {renderModule(mod, event, participant, theme, isPreview)}
          </div>
        ))}

        {/* Footer */}
        <LeafDivider color={theme.accent} />
        <footer className="text-center py-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <CornerLeaves position="tl" />
          </div>
          <p className="text-xs tracking-widest uppercase" style={{ color: theme.accent }}>
            Creado con Event Invitations
          </p>
        </footer>
      </motion.div>
    </>
  );
}

// ─── Module renderer ───────────────────────────────────────────────────────────

function renderModule(
  mod: Module,
  event: Event,
  participant: Participant,
  theme: ThemeConfig,
  isPreview: boolean
): React.ReactNode {
  switch (mod.type) {
    case "countdown": return <LeavesCountdown event={event} theme={theme} />;

    case "map": {
      const cfg = mod.config as { mapAddress?: string; mapEmbedUrl?: string };
      const address = cfg.mapAddress || event.location;
      return (
        <LeavesSection icon={Icons.map(theme.primary)} title="Lugar del Evento" theme={theme}>
          <p className="text-xl font-light mb-4" style={{ color: theme.primary }}>{address}</p>
          {cfg.mapEmbedUrl ? (
            <div className="rounded overflow-hidden border" style={{ borderColor: theme.accent }}>
              <iframe src={cfg.mapEmbedUrl} width="100%" height="280" style={{ border: 0 }}
                      allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          ) : address ? (
            <a href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
               target="_blank" rel="noopener noreferrer"
               className="inline-block px-8 py-2.5 text-sm tracking-widest uppercase border"
               style={{ borderColor: theme.primary, color: theme.primary }}>
              Abrir en Google Maps ↗
            </a>
          ) : null}
        </LeavesSection>
      );
    }

    case "rsvp":
      if (isPreview) return (
        <LeavesSection icon={Icons.rsvp(theme.primary)} title="Confirmar Asistencia" theme={theme}>
          <div className="border-2 border-dashed rounded py-6 px-4 text-sm"
               style={{ borderColor: theme.accent, color: theme.accent }}>
            Aquí aparecerá el formulario de confirmación
          </div>
        </LeavesSection>
      );
      return (
        <LeavesSection icon={Icons.rsvp(theme.primary)} title="Confirmar Asistencia" theme={theme}>
          <RsvpInline participant={participant} theme={theme} />
        </LeavesSection>
      );

    case "gifts": {
      const cfg = mod.config as { giftsText?: string; giftStoreUrl?: string };
      return (
        <LeavesSection icon={Icons.gifts(theme.primary)} title="Mesa de Regalos" theme={theme}>
          {cfg.giftsText && (
            <p className="text-base font-light leading-relaxed mb-5" style={{ color: theme.textClass }}>
              {cfg.giftsText}
            </p>
          )}
          {cfg.giftStoreUrl && (
            <a href={cfg.giftStoreUrl} target="_blank" rel="noopener noreferrer"
               className="inline-block px-8 py-2.5 text-sm tracking-widest uppercase text-white"
               style={{ backgroundColor: theme.primary }}>
              Ver lista de regalos
            </a>
          )}
        </LeavesSection>
      );
    }

    case "dress_code": {
      const cfg = mod.config as { dressCodeText?: string; dressCodeColors?: string[] };
      return (
        <LeavesSection icon={Icons.dresscode(theme.primary)} title="Código de Vestimenta" theme={theme}>
          {cfg.dressCodeText && (
            <p className="text-base font-light leading-relaxed mb-5" style={{ color: theme.primary }}>
              {cfg.dressCodeText}
            </p>
          )}
          {(cfg.dressCodeColors ?? []).length > 0 && (
            <div className="flex justify-center gap-3 flex-wrap">
              {(cfg.dressCodeColors ?? []).map((color, i) => (
                <div key={i} className="w-10 h-10 rounded-full shadow-sm border-2 border-white" style={{ backgroundColor: color }} />
              ))}
            </div>
          )}
        </LeavesSection>
      );
    }

    case "itinerary": {
      const cfg = mod.config as { itineraryItems?: { time: string; description: string }[] };
      const items = cfg.itineraryItems ?? [];
      if (!items.length) return null;
      return (
        <LeavesSection icon={Icons.itinerary(theme.primary)} title="Itinerario" theme={theme}>
          <div className="space-y-3 text-left">
            {items.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 items-start">
                <span className="text-xs tracking-widest uppercase pt-0.5 shrink-0 w-20 text-right"
                      style={{ color: theme.accent }}>{item.time}</span>
                <div className="w-px self-stretch" style={{ backgroundColor: theme.accent, opacity: 0.4 }} />
                <span className="text-base font-light" style={{ color: theme.primary }}>{item.description}</span>
              </motion.div>
            ))}
          </div>
        </LeavesSection>
      );
    }

    case "carousel":
    case "gallery": {
      const cfg = mod.config as { images?: string[] };
      const images = cfg.images ?? [];
      if (!images.length) return null;
      return (
        <LeavesSection icon={Icons.gallery(theme.primary)} title="Galería" theme={theme}>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {images.slice(0, 6).map((src, i) => (
              <motion.div key={i} className="aspect-square overflow-hidden rounded"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </LeavesSection>
      );
    }

    case "parents": {
      const cfg = mod.config as {
        sectionTitle?: string;
        brideParentNames?: string[];
        groomParentNames?: string[];
        brideParentsLabel?: string;
        groomParentsLabel?: string;
        godfathersLabel?: string;
        godfatherNames?: string[];
      };
      const brideNames = cfg.brideParentNames ?? [];
      const groomNames = cfg.groomParentNames ?? [];
      const godfathers = cfg.godfatherNames ?? [];
      if (!brideNames.length && !groomNames.length && !godfathers.length) return null;
      return (
        <LeavesSection icon={Icons.parents(theme.primary)} title={cfg.sectionTitle || "Nuestros Padres"} theme={theme}>
          <div className="grid grid-cols-2 gap-6 mb-6">
            {brideNames.length > 0 && (
              <div className="space-y-1">
                {cfg.brideParentsLabel && <p className="text-xs tracking-widest uppercase mb-2" style={{ color: theme.accent }}>{cfg.brideParentsLabel}</p>}
                {brideNames.map((n, i) => <p key={i} className="text-lg font-light" style={{ fontFamily: "Great Vibes, cursive", color: theme.primary }}>{n}</p>)}
              </div>
            )}
            {groomNames.length > 0 && (
              <div className="space-y-1">
                {cfg.groomParentsLabel && <p className="text-xs tracking-widest uppercase mb-2" style={{ color: theme.accent }}>{cfg.groomParentsLabel}</p>}
                {groomNames.map((n, i) => <p key={i} className="text-lg font-light" style={{ fontFamily: "Great Vibes, cursive", color: theme.primary }}>{n}</p>)}
              </div>
            )}
          </div>
          {godfathers.length > 0 && (
            <div className="space-y-1 border-t pt-4" style={{ borderColor: theme.accent + "40" }}>
              {cfg.godfathersLabel && <p className="text-xs tracking-widest uppercase mb-2" style={{ color: theme.accent }}>{cfg.godfathersLabel}</p>}
              {godfathers.map((n, i) => <p key={i} className="text-lg font-light" style={{ fontFamily: "Great Vibes, cursive", color: theme.primary }}>{n}</p>)}
            </div>
          )}
        </LeavesSection>
      );
    }

    case "envelope_rain": {
      const cfg = mod.config as { envelopeRainDescription?: string; envelopeRainAccounts?: { bankName: string; accountHolder: string; clabe?: string; accountNumber?: string; alias?: string }[] };
      const accounts = cfg.envelopeRainAccounts ?? [];
      return (
        <LeavesSection icon={Icons.envelope_rain(theme.primary)} title="Lluvia de Sobres" theme={theme}>
          {cfg.envelopeRainDescription && (
            <p className="text-base font-light leading-relaxed mb-6" style={{ color: theme.primary }}>
              {cfg.envelopeRainDescription}
            </p>
          )}
          <div className="space-y-3 text-left">
            {accounts.map((acc, i) => (
              <div key={i} className={`rounded p-4 ${theme.cardClass}`}>
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: theme.accent }}>{acc.bankName}</p>
                <p className="text-lg font-light" style={{ color: theme.primary, fontFamily: "Great Vibes, cursive" }}>{acc.accountHolder}</p>
                {acc.clabe && <p className="text-sm font-mono mt-1 text-stone-600">{acc.clabe}</p>}
                {acc.alias && <p className="text-xs text-stone-500 mt-0.5">{acc.alias}</p>}
              </div>
            ))}
          </div>
        </LeavesSection>
      );
    }

    default: return null;
  }
}

// ─── Inline RSVP (compact version for leaves) ─────────────────────────────────

function RsvpInline({ participant, theme }: { participant: Participant; theme: ThemeConfig }) {
  const [status, setStatus] = useState(participant.attendance);
  const [notes, setNotes] = useState(participant.notes ?? "");
  const [submitted, setSubmitted] = useState(participant.attendance !== "pending");
  const [loading, setLoading] = useState(false);

  async function confirm(attendance: "confirmed" | "declined") {
    setLoading(true);
    await fetch(`/api/participants/${participant.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendance, notes }),
    });
    setStatus(attendance);
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) return (
    <div className="space-y-4">
      <p className="text-2xl" style={{ fontFamily: "Great Vibes, cursive", color: theme.primary }}>
        {status === "confirmed" ? "¡Nos vemos pronto!" : "Gracias por avisarnos"}
      </p>
      <p className="text-sm font-light" style={{ color: theme.primary, opacity: 0.7 }}>
        {status === "confirmed"
          ? "Tu asistencia ha sido confirmada."
          : "Lamentamos que no puedas acompañarnos."}
      </p>
      <button onClick={() => setSubmitted(false)} className="text-xs underline" style={{ color: theme.accent }}>
        Cambiar respuesta
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {participant.companions > 0 && (
        <p className="text-sm font-light" style={{ color: theme.accent }}>
          Tu lugar incluye {participant.companions} acompañante{participant.companions !== 1 ? "s" : ""}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        {(["confirmed", "declined"] as const).map((val) => (
          <button key={val} onClick={() => confirm(val)} disabled={loading}
            className={`py-3 text-sm tracking-widest uppercase border transition-all disabled:opacity-50 ${
              val === "confirmed"
                ? "text-white"
                : "border"
            }`}
            style={val === "confirmed"
              ? { backgroundColor: theme.primary }
              : { borderColor: theme.primary, color: theme.primary }}>
            {loading ? "…" : val === "confirmed" ? "✓ Asistiré" : "✗ No podré ir"}
          </button>
        ))}
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Mensaje opcional…"
        rows={2}
        className="w-full text-sm font-light px-3 py-2 border resize-none bg-transparent focus:outline-none"
        style={{ borderColor: theme.accent + "60", color: theme.primary }}
      />
    </div>
  );
}
