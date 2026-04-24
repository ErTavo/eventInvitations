"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Module } from "@/lib/supabase/types";
import type { ThemeConfig } from "../themes";

interface Props { module: Module; theme: ThemeConfig }

export default function DressCodeModule({ module: mod, theme }: Props) {
  const cfg = mod.config as {
    dressCodeText?: string;
    dressCodeColors?: string[];
    dressCodeFemaleImage?: string;
    dressCodeFemaleDescription?: string;
    dressCodeMaleImage?: string;
    dressCodeMaleDescription?: string;
  };

  const colors          = cfg.dressCodeColors ?? [];
  const hasFemalePhoto  = !!cfg.dressCodeFemaleImage;
  const hasMalePhoto    = !!cfg.dressCodeMaleImage;
  const hasExamples     = hasFemalePhoto || hasMalePhoto;

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
          <div className="h-px w-16 mx-auto" style={{ backgroundColor: theme.accent }} />

          {cfg.dressCodeText && (
            <p className={`text-lg font-light leading-relaxed ${theme.textClass}`}>
              {cfg.dressCodeText}
            </p>
          )}

          {/* Color palette */}
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

          {/* Example photos — female & male */}
          {hasExamples && (
            <div className="grid grid-cols-2 gap-5 mt-6">

              {/* Female example */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={`rounded overflow-hidden ${theme.cardClass}`}
              >
                {hasFemalePhoto ? (
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={cfg.dressCodeFemaleImage!}
                      alt="Ejemplo mujer"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 220px"
                    />
                  </div>
                ) : (
                  <div className="aspect-[3/4] flex items-center justify-center"
                       style={{ backgroundColor: theme.accent + "18" }}>
                    <span className="text-4xl opacity-30">👗</span>
                  </div>
                )}
                <div className="px-3 py-2.5 text-center space-y-1">
                  <p className={`text-xs font-medium tracking-widest uppercase ${theme.accentClass}`}>
                    Mujer
                  </p>
                  {cfg.dressCodeFemaleDescription && (
                    <p className={`text-xs font-light leading-snug ${theme.mutedClass}`}>
                      {cfg.dressCodeFemaleDescription}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Male example */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={`rounded overflow-hidden ${theme.cardClass}`}
              >
                {hasMalePhoto ? (
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={cfg.dressCodeMaleImage!}
                      alt="Ejemplo hombre"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 220px"
                    />
                  </div>
                ) : (
                  <div className="aspect-[3/4] flex items-center justify-center"
                       style={{ backgroundColor: theme.accent + "18" }}>
                    <span className="text-4xl opacity-30">🤵</span>
                  </div>
                )}
                <div className="px-3 py-2.5 text-center space-y-1">
                  <p className={`text-xs font-medium tracking-widest uppercase ${theme.accentClass}`}>
                    Hombre
                  </p>
                  {cfg.dressCodeMaleDescription && (
                    <p className={`text-xs font-light leading-snug ${theme.mutedClass}`}>
                      {cfg.dressCodeMaleDescription}
                    </p>
                  )}
                </div>
              </motion.div>

            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
