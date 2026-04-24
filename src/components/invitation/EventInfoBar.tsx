"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Event, Participant } from "@/lib/supabase/types";
import type { ThemeConfig } from "./themes";

interface Props { event: Event; participant: Participant; theme: ThemeConfig }

function useCalendar(event: Event) {
  const start = new Date(event.date);
  const end   = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  const fmt   = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

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
      event.location    ? `LOCATION:${event.location}` : "",
      event.description ? `DESCRIPTION:${event.description}` : "",
      "END:VEVENT", "END:VCALENDAR",
    ].filter(Boolean).join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = `${event.name.replace(/\s+/g, "_")}.ics`;
    a.click();
  }

  return { googleUrl, downloadIcs };
}

export default function EventInfoBar({ event, participant, theme }: Props) {
  const { googleUrl, downloadIcs } = useCalendar(event);
  const [calOpen, setCalOpen] = useState(false);

  const hasCompanions = participant.companions > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`py-8 ${theme.sectionClass}`}
    >
      <div className="max-w-sm mx-auto px-6 flex flex-col items-center gap-3">

        {/* Companions badge */}
        {hasCompanions && (
          <div
            className="px-5 py-2 rounded-full text-xs tracking-widest uppercase border"
            style={{ borderColor: theme.accent, color: theme.primary }}
          >
            Mesa para {1 + participant.companions} persona{1 + participant.companions !== 1 ? "s" : ""}
          </div>
        )}

        {/* Add to calendar */}
        <div className="relative">
          <button
            onClick={() => setCalOpen((v) => !v)}
            className="flex items-center gap-2 px-5 py-2.5 border text-xs tracking-widest uppercase transition-colors"
            style={{ borderColor: theme.primary, color: theme.primary }}
          >
            <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
              <rect x="3" y="6" width="26" height="23" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M3 13 L29 13" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
              <path d="M10 3 L10 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M22 3 L22 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M9 20 L14 25 L23 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Agregar al calendario
          </button>

          <AnimatePresence>
            {calOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute top-full left-0 right-0 mt-1 z-20 shadow-lg rounded overflow-hidden"
                style={{ backgroundColor: theme.secondary, border: `1px solid ${theme.accent}` }}
              >
                <a href={googleUrl} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-4 py-3 text-xs hover:bg-black/5 transition-colors whitespace-nowrap"
                   style={{ color: theme.primary }}>
                  📅 Google Calendar
                </a>
                <button
                  onClick={() => { downloadIcs(); setCalOpen(false); }}
                  className="flex items-center gap-2 px-4 py-3 text-xs hover:bg-black/5 transition-colors w-full text-left"
                  style={{ color: theme.primary, borderTop: `1px solid ${theme.accent}50` }}
                >
                  🍎 Apple / Outlook (.ics)
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}
