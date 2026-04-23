"use client";

import { motion } from "framer-motion";
import type { Module } from "@/lib/supabase/types";
import type { ThemeConfig } from "../themes";

interface Props { module: Module; theme: ThemeConfig }

export default function DressCodeModule({ module: mod, theme }: Props) {
  const cfg = mod.config as { dressCodeText?: string; dressCodeColors?: string[] };
  const colors = cfg.dressCodeColors ?? [];

  return (
    <section className={`py-16 ${theme.sectionClass}`}>
      <div className="max-w-lg mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className={`text-sm tracking-widest uppercase ${theme.mutedClass}`}>
            Código de vestimenta
          </p>
          <div className={`h-px w-16 mx-auto`} style={{ backgroundColor: theme.accent }} />

          {cfg.dressCodeText && (
            <p className={`text-lg font-light leading-relaxed ${theme.textClass}`}>
              {cfg.dressCodeText}
            </p>
          )}

          {colors.length > 0 && (
            <div className="flex justify-center gap-3 flex-wrap">
              {colors.map((color, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full shadow-sm border border-white/50"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
