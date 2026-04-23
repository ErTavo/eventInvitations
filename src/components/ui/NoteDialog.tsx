"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquareQuote } from "lucide-react";
import type { Participant } from "@/lib/supabase/types";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmará",
  declined: "No asistirá",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "text-amber-600 bg-amber-50 border-amber-200",
  confirmed: "text-emerald-700 bg-emerald-50 border-emerald-200",
  declined: "text-rose-600 bg-rose-50 border-rose-200",
};

interface Props {
  participant: Participant | null;
  onClose: () => void;
}

export default function NoteDialog({ participant, onClose }: Props) {
  useEffect(() => {
    if (!participant) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [participant, onClose]);

  return (
    <AnimatePresence>
      {participant && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-modal
            role="dialog"
          >
            <div className="relative w-full max-w-md bg-[#fafaf8] border border-stone-200 shadow-xl rounded-sm overflow-hidden">

              {/* Decorative top bar */}
              <div className="h-1 w-full bg-gradient-to-r from-stone-300 via-[#b8974a] to-stone-300" />

              {/* Header */}
              <div className="px-7 pt-6 pb-4 border-b border-stone-100 flex items-start justify-between gap-4">
                <div>
                  <p
                    className="text-xl text-stone-800 leading-snug"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {participant.name}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                      className={`inline-block text-xs px-2.5 py-0.5 rounded-full border font-medium ${STATUS_COLOR[participant.attendance]}`}
                    >
                      {STATUS_LABEL[participant.attendance]}
                    </span>
                    {participant.companions > 0 && (
                      <span className="text-xs text-stone-400">
                        +{participant.companions} acompañante{participant.companions !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-stone-400 hover:text-stone-700 transition-colors mt-0.5"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Note body */}
              <div className="px-7 py-6">
                {participant.notes ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MessageSquareQuote size={14} className="text-[#b8974a] shrink-0" />
                      <p className="text-xs tracking-widest uppercase text-stone-400">
                        Mensaje del invitado
                      </p>
                    </div>
                    {/* Quote styling */}
                    <blockquote
                      className="relative pl-5 border-l-2 border-[#d4b896]"
                    >
                      <p
                        className="text-stone-700 text-base leading-relaxed"
                        style={{ fontFamily: "Cormorant Garamond, serif" }}
                      >
                        {participant.notes}
                      </p>
                    </blockquote>
                  </div>
                ) : (
                  <p className="text-stone-400 text-sm italic text-center py-4">
                    Este invitado no dejó ningún mensaje.
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="px-7 pb-5 flex justify-end">
                <button
                  onClick={onClose}
                  className="text-xs tracking-widest uppercase text-stone-500 hover:text-stone-800 transition-colors border border-stone-200 hover:border-stone-400 px-5 py-2"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
