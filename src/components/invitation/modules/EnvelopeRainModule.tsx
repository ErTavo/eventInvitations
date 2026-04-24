"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Module } from "@/lib/supabase/types";
import type { ThemeConfig } from "../themes";

interface Account {
  bankName: string;
  accountHolder: string;
  clabe: string;
  accountNumber?: string;
  alias?: string;
}

interface Props { module: Module; theme: ThemeConfig }

function CopyButton({ text, theme }: { text: string; theme: ThemeConfig }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs px-2.5 py-1 rounded transition-all shrink-0"
      style={{
        backgroundColor: copied ? theme.primary : "transparent",
        color: copied ? "#fff" : theme.primary,
        border: `1px solid ${theme.primary}`,
        opacity: 0.85,
      }}
    >
      {copied ? "¡Copiado!" : "Copiar"}
    </button>
  );
}

export default function EnvelopeRainModule({ module: mod, theme }: Props) {
  const cfg = mod.config as {
    envelopeRainDescription?: string;
    envelopeRainAccounts?: Account[];
  };

  const accounts = cfg.envelopeRainAccounts ?? [];
  if (!accounts.length && !cfg.envelopeRainDescription) return null;

  return (
    <section className={`py-16 ${theme.sectionClass}`}>
      <div className="max-w-lg mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          {/* Envelope icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: "spring", stiffness: 180 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: theme.accent + "22" }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              {/* Envelope body */}
              <rect x="2" y="7" width="28" height="18" rx="2" stroke={theme.primary} strokeWidth="1.5" fill="none"/>
              {/* Flap lines */}
              <path d="M2 9 L16 18 L30 9" stroke={theme.primary} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              {/* Wax seal dot */}
              <circle cx="16" cy="20" r="2.5" fill={theme.accent} opacity="0.8"/>
            </svg>
          </motion.div>

          <p className={`text-sm tracking-widest uppercase ${theme.mutedClass}`}>
            Lluvia de sobres
          </p>
          <div className="h-px w-16 mx-auto mt-4" style={{ backgroundColor: theme.accent }} />

          {cfg.envelopeRainDescription && (
            <p className={`mt-5 text-base font-light leading-relaxed ${theme.textClass}`}>
              {cfg.envelopeRainDescription}
            </p>
          )}
        </motion.div>

        {/* Account cards */}
        <div className="space-y-4">
          {accounts.map((acc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-lg p-5 ${theme.cardClass}`}
            >
              {/* Bank name + holder */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className={`text-xs tracking-widest uppercase font-medium ${theme.accentClass}`}>
                    {acc.bankName}
                  </p>
                  <p className={`text-base font-light mt-0.5 ${theme.headingClass}`}>
                    {acc.accountHolder}
                  </p>
                </div>
                {/* Bank initial badge */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                  style={{ backgroundColor: theme.accent + "25", color: theme.primary }}
                >
                  {acc.bankName.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="space-y-2.5">
                {/* CLABE */}
                {acc.clabe && (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className={`text-xs ${theme.mutedClass}`}>CLABE</p>
                      <p className={`text-sm font-mono tracking-wider ${theme.textClass}`}>
                        {acc.clabe}
                      </p>
                    </div>
                    <CopyButton text={acc.clabe} theme={theme} />
                  </div>
                )}

                {/* Account number */}
                {acc.accountNumber && (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className={`text-xs ${theme.mutedClass}`}>Número de cuenta</p>
                      <p className={`text-sm font-mono tracking-wider ${theme.textClass}`}>
                        {acc.accountNumber}
                      </p>
                    </div>
                    <CopyButton text={acc.accountNumber} theme={theme} />
                  </div>
                )}

                {/* Alias SPEI */}
                {acc.alias && (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className={`text-xs ${theme.mutedClass}`}>Alias SPEI</p>
                      <p className={`text-sm font-mono tracking-wider ${theme.textClass}`}>
                        {acc.alias}
                      </p>
                    </div>
                    <CopyButton text={acc.alias} theme={theme} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
