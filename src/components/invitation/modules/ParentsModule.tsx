"use client";

import { motion } from "framer-motion";
import type { Module } from "@/lib/supabase/types";
import type { ThemeConfig } from "../themes";

interface Props { module: Module; theme: ThemeConfig }

export default function ParentsModule({ module: mod, theme }: Props) {
  const cfg = mod.config as {
    sectionTitle?: string;
    brideParentsLabel?: string;
    brideParentNames?: string[];
    groomParentsLabel?: string;
    groomParentNames?: string[];
    godfathersLabel?: string;
    godfatherNames?: string[];
  };

  const brideNames     = cfg.brideParentNames  ?? [];
  const groomNames     = cfg.groomParentNames  ?? [];
  const godfatherNames = cfg.godfatherNames    ?? [];
  const hasParents     = brideNames.length > 0 || groomNames.length > 0;
  const hasGodparents  = godfatherNames.length > 0;

  if (!hasParents && !hasGodparents) return null;

  return (
    <section className={`py-16 ${theme.sectionClass}`}>
      <div className="max-w-lg mx-auto px-6 text-center">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 space-y-3"
        >
          <p className={`text-sm tracking-widest uppercase ${theme.mutedClass}`}>
            {cfg.sectionTitle || "Nuestros padres"}
          </p>
          <div className="h-px w-16 mx-auto" style={{ backgroundColor: theme.accent }} />
        </motion.div>

        {/* Parents columns */}
        {hasParents && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-8 mb-10"
          >
            {[
              { label: cfg.brideParentsLabel, names: brideNames },
              { label: cfg.groomParentsLabel, names: groomNames },
            ].map(({ label, names }, col) =>
              names.length > 0 ? (
                <div key={col} className="space-y-2">
                  {label && (
                    <p className={`text-xs tracking-widest uppercase mb-4 ${theme.mutedClass}`}>
                      {label}
                    </p>
                  )}
                  {names.map((name, i) => (
                    <p
                      key={i}
                      className="text-xl font-light leading-snug"
                      style={{ fontFamily: "Cormorant Garamond, serif", color: theme.primary }}
                    >
                      {name}
                    </p>
                  ))}
                </div>
              ) : null
            )}
          </motion.div>
        )}

        {/* Godparents */}
        {hasGodparents && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {hasParents && (
              <div className="h-px w-16 mx-auto" style={{ backgroundColor: theme.accent, opacity: 0.4 }} />
            )}
            <p className={`text-sm tracking-widest uppercase ${theme.mutedClass}`}>
              {cfg.godfathersLabel || "Nuestros padrinos"}
            </p>
            <div className="space-y-2">
              {godfatherNames.map((name, i) => (
                <p
                  key={i}
                  className="text-xl font-light leading-snug"
                  style={{ fontFamily: "Cormorant Garamond, serif", color: theme.primary }}
                >
                  {name}
                </p>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
