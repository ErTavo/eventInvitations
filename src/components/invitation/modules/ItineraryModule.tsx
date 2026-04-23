"use client";

import { motion } from "framer-motion";
import type { Module } from "@/lib/supabase/types";
import type { ThemeConfig } from "../themes";

interface ItineraryItem { time: string; description: string }
interface Props { module: Module; theme: ThemeConfig }

export default function ItineraryModule({ module: mod, theme }: Props) {
  const cfg = mod.config as { itineraryItems?: ItineraryItem[] };
  const items = cfg.itineraryItems ?? [];
  if (!items.length) return null;

  return (
    <section className={`py-16 ${theme.sectionClass}`}>
      <div className="max-w-lg mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className={`text-sm tracking-widest uppercase ${theme.mutedClass}`}>
            Itinerario
          </p>
          <div className="h-px w-16 mx-auto mt-4" style={{ backgroundColor: theme.accent }} />
        </motion.div>

        <div className="relative">
          <div
            className="absolute left-[calc(50%-0.5px)] top-0 bottom-0 w-px"
            style={{ backgroundColor: theme.accent, opacity: 0.4 }}
          />
          <div className="space-y-8">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-start gap-4 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className={`flex-1 text-${i % 2 === 0 ? "right" : "left"}`}>
                  <p className={`text-xs tracking-widest uppercase ${theme.mutedClass}`}>
                    {item.time}
                  </p>
                  <p className={`text-base font-light mt-1 ${theme.textClass}`}>
                    {item.description}
                  </p>
                </div>
                <div
                  className="w-3 h-3 rounded-full shrink-0 mt-1"
                  style={{ backgroundColor: theme.primary }}
                />
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
