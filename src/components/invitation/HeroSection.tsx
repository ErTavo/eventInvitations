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

export default function HeroSection({ event, participant, theme }: Props) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Background image */}
      {event.cover_image && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${event.cover_image})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}

      <div className="relative z-10 max-w-lg mx-auto space-y-6">
        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-24 h-px mx-auto"
          style={{ backgroundColor: event.cover_image ? "#fff" : theme.accent }}
        />

        {/* Script greeting */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl"
          style={{
            fontFamily: "Great Vibes, cursive",
            color: event.cover_image ? "#f5e6d0" : theme.primary,
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
          style={{ color: event.cover_image ? "#ffffff" : theme.headingClass.replace("text-", "") }}
        >
          {participant.name}
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="w-16 h-px mx-auto"
          style={{ backgroundColor: event.cover_image ? "#fff" : theme.accent }}
        />

        {/* Event name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-4xl md:text-6xl font-light leading-tight"
          style={{ color: event.cover_image ? "#ffffff" : theme.primary }}
        >
          {event.name}
        </motion.h1>

        {/* Date */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-base md:text-lg tracking-widest uppercase"
          style={{ color: event.cover_image ? "rgba(255,255,255,0.85)" : theme.accent }}
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
            style={{ color: event.cover_image ? "rgba(255,255,255,0.7)" : theme.mutedClass.replace("text-", "") }}
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
              borderColor: event.cover_image ? "rgba(255,255,255,0.4)" : theme.accent,
              color: event.cover_image ? "rgba(255,255,255,0.85)" : theme.primary,
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
          style={{ backgroundColor: event.cover_image ? "rgba(255,255,255,0.5)" : theme.accent }}
        />
      </motion.div>
    </section>
  );
}
