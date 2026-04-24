"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
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
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-all shrink-0"
      style={{
        backgroundColor: copied ? theme.primary : "transparent",
        color: copied ? "#fff" : theme.primary,
        border: `1px solid ${theme.primary}`,
        opacity: 0.9,
      }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

function DataRow({ label, value, theme }: { label: string; value: string; theme: ThemeConfig }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b last:border-b-0"
         style={{ borderColor: theme.accent + "30" }}>
      <div className="min-w-0">
        <p className={`text-xs ${theme.mutedClass}`}>{label}</p>
        <p className={`text-sm font-mono tracking-wider ${theme.textClass}`}>{value}</p>
      </div>
      <CopyButton text={value} theme={theme} />
    </div>
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
          className="text-center mb-10 space-y-3"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: "spring", stiffness: 180 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-1"
            style={{ backgroundColor: theme.accent + "22" }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="6" width="24" height="16" rx="2"
                stroke={theme.primary} strokeWidth="1.4" fill="none"/>
              <path d="M2 8 L14 16 L26 8"
                stroke={theme.primary} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
              <circle cx="14" cy="18" r="2" fill={theme.accent} opacity="0.85"/>
            </svg>
          </motion.div>

          <p className={`text-sm tracking-widest uppercase ${theme.mutedClass}`}>
            Lluvia de sobres
          </p>
          <div className="h-px w-16 mx-auto" style={{ backgroundColor: theme.accent }} />

          {cfg.envelopeRainDescription && (
            <p className={`mt-4 text-base font-light leading-relaxed ${theme.textClass}`}
               style={{ fontFamily: "Cormorant Garamond, serif" }}>
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
              transition={{ delay: i * 0.08 }}
              className={`rounded overflow-hidden ${theme.cardClass}`}
            >
              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-3"
                   style={{ backgroundColor: theme.accent + "18", borderBottom: `1px solid ${theme.accent}30` }}>
                <div>
                  <p className={`text-xs tracking-widest uppercase font-medium ${theme.accentClass}`}>
                    {acc.bankName}
                  </p>
                  <p className="text-lg font-light"
                     style={{ fontFamily: "Cormorant Garamond, serif", color: theme.primary }}>
                    {acc.accountHolder}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                     style={{ backgroundColor: theme.primary, color: "#fff", opacity: 0.9 }}>
                  {acc.bankName.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Card data */}
              <div className="px-5 py-1">
                {acc.clabe         && <DataRow label="CLABE"              value={acc.clabe}          theme={theme} />}
                {acc.accountNumber && <DataRow label="Número de cuenta"   value={acc.accountNumber}  theme={theme} />}
                {acc.alias         && <DataRow label="Alias SPEI"         value={acc.alias}           theme={theme} />}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
