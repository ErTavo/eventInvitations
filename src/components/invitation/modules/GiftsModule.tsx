"use client";

import { motion } from "framer-motion";
import type { Module } from "@/lib/supabase/types";
import type { ThemeConfig } from "../themes";

interface Props { module: Module; theme: ThemeConfig }

export default function GiftsModule({ module: mod, theme }: Props) {
  const cfg = mod.config as { giftsText?: string; giftStoreUrl?: string };

  return (
    <section className={`py-16 ${theme.sectionClass}`}>
      <div className="max-w-md mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <span className="text-4xl">🎁</span>
          <p className={`text-sm tracking-widest uppercase ${theme.mutedClass}`}>
            Mesa de regalos
          </p>
          <div className="h-px w-16 mx-auto" style={{ backgroundColor: theme.accent }} />

          {cfg.giftsText && (
            <p className={`text-base font-light leading-relaxed ${theme.textClass}`}>
              {cfg.giftsText}
            </p>
          )}

          {cfg.giftStoreUrl && (
            <a
              href={cfg.giftStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block px-8 py-3 text-sm tracking-widest uppercase rounded ${theme.buttonClass}`}
            >
              Ver lista de regalos
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
