"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Event } from "@/lib/supabase/types";
import type { ThemeConfig } from "../themes";

interface Props { event: Event; theme: ThemeConfig }

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

export default function CountdownModule({ event, theme }: Props) {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft>>(null);

  useEffect(() => {
    setTime(getTimeLeft(event.date));
    const id = setInterval(() => setTime(getTimeLeft(event.date)), 1000);
    return () => clearInterval(id);
  }, [event.date]);

  if (!time) return null;

  const units = [
    { label: "Días", value: time.days },
    { label: "Horas", value: time.hours },
    { label: "Minutos", value: time.minutes },
    { label: "Segundos", value: time.seconds },
  ];

  return (
    <section className={`py-16 ${theme.sectionClass}`}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className={`text-sm tracking-widest uppercase mb-8 ${theme.mutedClass}`}
        >
          Faltan
        </motion.p>
        <div className="grid grid-cols-4 gap-3 md:gap-6">
          {units.map(({ label, value }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`rounded p-3 md:p-5 ${theme.cardClass}`}
            >
              <p
                className={`text-3xl md:text-5xl font-light tabular-nums ${theme.headingClass}`}
              >
                {String(value).padStart(2, "0")}
              </p>
              <p className={`text-xs tracking-widest uppercase mt-1 ${theme.mutedClass}`}>
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
