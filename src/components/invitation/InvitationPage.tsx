"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Event, Module, Participant } from "@/lib/supabase/types";
import { buildThemeConfig } from "./themes";
import type { ThemeConfig } from "./themes";
import EnvelopeIntro from "./EnvelopeIntro";
import HeroSection from "./HeroSection";
import CountdownModule from "./modules/CountdownModule";
import CarouselModule from "./modules/CarouselModule";
import MusicModule from "./modules/MusicModule";
import MapModule from "./modules/MapModule";
import DressCodeModule from "./modules/DressCodeModule";
import ItineraryModule from "./modules/ItineraryModule";
import GiftsModule from "./modules/GiftsModule";
import RsvpModule from "./modules/RsvpModule";
import ParentsModule from "./modules/ParentsModule";
import EnvelopeRainModule from "./modules/EnvelopeRainModule";

interface Props {
  event: Event;
  participant: Participant;
  modules: Module[];
  isPreview?: boolean;
}

// ── Botanical section divider — shown between modules in the elegant template ─
function BotanicalSectionDivider({ theme }: { theme: ThemeConfig }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex items-center justify-center gap-4 py-2 px-6"
    >
      {/* Left arm */}
      <div className="flex items-center gap-2">
        <div className="h-px w-16 md:w-24" style={{ backgroundColor: theme.accent, opacity: 0.45 }} />
        <svg width="36" height="24" viewBox="0 0 36 24" fill="none">
          <path d="M18 22 C14 18 4 14 2 12 C4 10 14 6 18 2"
                stroke={theme.accent} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.55"/>
          <ellipse cx="10" cy="12" rx="7" ry="4" fill={theme.accent} opacity="0.18"
                   transform="rotate(0 10 12)" />
        </svg>
      </div>

      {/* Center motif */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        {/* Vertical stem */}
        <path d="M14 26 L14 2" stroke={theme.accent} strokeWidth="0.8" opacity="0.5"/>
        {/* Left leaf */}
        <path d="M14 10 C10 8 6 10 6 14 C6 14 10 12 14 10Z"
              fill={theme.primary} opacity="0.35"/>
        {/* Right leaf */}
        <path d="M14 10 C18 8 22 10 22 14 C22 14 18 12 14 10Z"
              fill={theme.primary} opacity="0.35"/>
        {/* Lower left leaf */}
        <path d="M14 17 C10 15 7 17 8 20 C8 20 11 17 14 17Z"
              fill={theme.primary} opacity="0.28"/>
        {/* Lower right leaf */}
        <path d="M14 17 C18 15 21 17 20 20 C20 20 17 17 14 17Z"
              fill={theme.primary} opacity="0.28"/>
        {/* Dot */}
        <circle cx="14" cy="14" r="1.8" fill={theme.accent} opacity="0.7"/>
      </svg>

      {/* Right arm (mirror) */}
      <div className="flex items-center gap-2">
        <svg width="36" height="24" viewBox="0 0 36 24" fill="none"
             style={{ transform: "scaleX(-1)" }}>
          <path d="M18 22 C14 18 4 14 2 12 C4 10 14 6 18 2"
                stroke={theme.accent} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.55"/>
          <ellipse cx="10" cy="12" rx="7" ry="4" fill={theme.accent} opacity="0.18"/>
        </svg>
        <div className="h-px w-16 md:w-24" style={{ backgroundColor: theme.accent, opacity: 0.45 }} />
      </div>
    </motion.div>
  );
}

export default function InvitationPage({ event, participant, modules, isPreview = false }: Props) {
  const theme = buildThemeConfig(event.style);
  const [opened, setOpened] = useState(isPreview);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isBotanical = theme.layoutVariant === "botanical";

  useEffect(() => {
    if (!isPreview && !participant.invitation_viewed) {
      fetch(`/api/participants/${participant.id}/view`, { method: "POST" });
    }
  }, [isPreview, participant.id, participant.invitation_viewed]);

  const getModule = (type: string) => modules.find((m) => m.type === type);
  const musicModule = getModule("music");
  const musicCfg = musicModule?.config as { musicUrl?: string } | undefined;

  function handleEnvelopeOpen() {
    setOpened(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }

  // Collect active module slots (excluding music which floats)
  const activeModules = [
    getModule("countdown")  && { key: "countdown",  el: <CountdownModule event={event} theme={theme} /> },
    getModule("carousel")   && { key: "carousel",   el: <CarouselModule module={getModule("carousel")!} theme={theme} /> },
    getModule("itinerary")  && { key: "itinerary",  el: <ItineraryModule module={getModule("itinerary")!} theme={theme} /> },
    getModule("dress_code") && { key: "dress_code", el: <DressCodeModule module={getModule("dress_code")!} theme={theme} /> },
    getModule("map")        && { key: "map",        el: <MapModule module={getModule("map")!} event={event} theme={theme} /> },
    getModule("gifts")      && { key: "gifts",      el: <GiftsModule module={getModule("gifts")!} theme={theme} /> },
    getModule("parents")       && { key: "parents",       el: <ParentsModule module={getModule("parents")!} theme={theme} /> },
    getModule("envelope_rain") && { key: "envelope_rain", el: <EnvelopeRainModule module={getModule("envelope_rain")!} theme={theme} /> },
    (getModule("rsvp") && !isPreview) && {
      key: "rsvp",
      el: <RsvpModule participant={participant} theme={theme} />,
    },
    (getModule("rsvp") && isPreview) && {
      key: "rsvp-preview",
      el: (
        <section className={`py-16 ${theme.sectionClass}`}>
          <div className={`max-w-md mx-auto px-6 text-center border-2 border-dashed rounded py-10 ${theme.dividerClass}`}>
            <p className={`text-sm ${theme.mutedClass}`}>Aquí aparecerá la sección de confirmación de asistencia</p>
          </div>
        </section>
      ),
    },
  ].filter(Boolean) as { key: string; el: React.ReactNode }[];

  return (
    <>
      {musicCfg?.musicUrl && (
        <audio ref={audioRef} src={musicCfg.musicUrl} loop preload="auto" style={{ display: "none" }} />
      )}

      {!isPreview && !opened && (
        <EnvelopeIntro event={event} participant={participant} theme={theme} onOpen={handleEnvelopeOpen} />
      )}

      <motion.div
        initial={isPreview ? false : { opacity: 0 }}
        animate={opened ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className={`min-h-screen ${theme.bgClass}`}
        style={{ fontFamily: event.style.fontFamily || "Cormorant Garamond, serif", ...theme.cssVars }}
      >
        {isPreview && (
          <div className="sticky top-0 z-50 bg-amber-400 text-amber-900 text-xs text-center py-2 px-4 font-medium tracking-wide">
            Vista previa — así verán la invitación tus invitados
          </div>
        )}

        {musicModule && (
          <MusicModule module={musicModule} theme={theme} audioRef={audioRef} />
        )}

        <HeroSection event={event} participant={participant} theme={theme} />

        {/* Modules — with botanical dividers between them for the elegant template */}
        {activeModules.map((mod, i) => (
          <div key={mod.key}>
            {/* Divider before every module (botanical for elegant, nothing for others) */}
            {isBotanical && i === 0 && (
              <BotanicalSectionDivider theme={theme} />
            )}

            {mod.el}

            {/* Divider after each module except the last */}
            {isBotanical && i < activeModules.length - 1 && (
              <BotanicalSectionDivider theme={theme} />
            )}
          </div>
        ))}

        <footer className={`text-center py-10 text-xs ${theme.mutedClass} opacity-60`}>
          {isBotanical && (
            <div className="flex justify-center mb-4">
              <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
                <path d="M30 28 C20 22 4 16 2 15 C4 14 20 8 30 2 C40 8 56 14 58 15 C56 16 40 22 30 28Z"
                      stroke={theme.accent} strokeWidth="0.8" fill="none" opacity="0.45"/>
                <circle cx="30" cy="15" r="2" fill={theme.accent} opacity="0.55"/>
              </svg>
            </div>
          )}
          Creado por ErTavo
        </footer>
      </motion.div>
    </>
  );
}
