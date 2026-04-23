"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { Module, Event } from "@/lib/supabase/types";
import type { ThemeConfig } from "../themes";

interface Props { module: Module; event: Event; theme: ThemeConfig }

export default function MapModule({ module: mod, event, theme }: Props) {
  const cfg = mod.config as { mapAddress?: string; mapEmbedUrl?: string };
  const address = cfg.mapAddress || event.location;

  return (
    <section className={`py-16 ${theme.sectionClass}`}>
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className={`text-sm tracking-widest uppercase mb-3 ${theme.mutedClass}`}>
            Lugar del evento
          </p>
          <div className="flex items-center justify-center gap-2">
            <MapPin size={18} style={{ color: theme.primary }} />
            <h2
              className={`text-2xl md:text-3xl font-light ${theme.headingClass}`}
            >
              {address}
            </h2>
          </div>
        </motion.div>

        {cfg.mapEmbedUrl ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded overflow-hidden shadow-sm border"
            style={{ borderColor: theme.accent }}
          >
            <iframe
              src={cfg.mapEmbedUrl}
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        ) : address ? (
          <motion.a
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`block text-center py-3 border text-sm tracking-widest uppercase rounded ${theme.mutedClass}`}
            style={{ borderColor: theme.accent }}
          >
            Abrir en Google Maps ↗
          </motion.a>
        ) : null}
      </div>
    </section>
  );
}
