"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { Participant } from "@/lib/supabase/types";
import type { ThemeConfig } from "../themes";
import { CheckCircle, XCircle } from "lucide-react";

interface Props { participant: Participant; theme: ThemeConfig }

interface FormValues { attendance: "confirmed" | "declined"; notes: string }

export default function RsvpModule({ participant, theme }: Props) {
  const [submitted, setSubmitted] = useState(
    participant.attendance !== "pending"
  );
  const [currentStatus, setCurrentStatus] = useState(participant.attendance);

  const { register, handleSubmit, watch, formState: { isSubmitting } } =
    useForm<FormValues>({
      defaultValues: {
        attendance: participant.attendance !== "pending" ? participant.attendance : undefined,
        notes: participant.notes ?? "",
      },
    });

  const selectedAttendance = watch("attendance");

  async function onSubmit(values: FormValues) {
    const res = await fetch(`/api/participants/${participant.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) { toast.error("Error al confirmar asistencia"); return; }
    setCurrentStatus(values.attendance);
    setSubmitted(true);
    toast.success(
      values.attendance === "confirmed"
        ? "¡Asistencia confirmada! Te esperamos."
        : "Recibimos tu respuesta. Gracias."
    );
  }

  if (submitted) {
    return (
      <section className={`py-20 ${theme.sectionClass}`}>
        <div className="max-w-md mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-5"
          >
            {currentStatus === "confirmed" ? (
              <>
                <CheckCircle size={48} className="mx-auto" style={{ color: theme.primary }} />
                <h2 className={`text-3xl font-light ${theme.headingClass}`}>
                  ¡Nos vemos pronto!
                </h2>
                <p className={`text-base font-light ${theme.textClass}`}>
                  Tu asistencia ha sido confirmada. Estamos emocionados de compartir este momento contigo.
                </p>
              </>
            ) : (
              <>
                <XCircle size={48} className="mx-auto text-stone-400" />
                <h2 className={`text-3xl font-light ${theme.headingClass}`}>
                  Gracias por avisarnos
                </h2>
                <p className={`text-base font-light ${theme.textClass}`}>
                  Lamentamos que no puedas acompañarnos, pero te tenemos en mente.
                </p>
              </>
            )}
            <button
              onClick={() => setSubmitted(false)}
              className={`text-sm underline ${theme.mutedClass}`}
            >
              Cambiar respuesta
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 ${theme.sectionClass}`}>
      <div className="max-w-md mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className={`text-sm tracking-widest uppercase mb-3 ${theme.mutedClass}`}>
            Confirmar asistencia
          </p>
          <div className="h-px w-16 mx-auto" style={{ backgroundColor: theme.accent }} />
          <p className={`mt-5 text-base font-light ${theme.textClass}`}>
            Por favor confirma tu asistencia al evento.
          </p>
          {participant.companions > 0 && (
            <p className={`text-sm mt-2 ${theme.mutedClass}`}>
              Tu confirmación incluye {participant.companions} acompañante
              {participant.companions !== 1 ? "s" : ""}.
            </p>
          )}
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {(["confirmed", "declined"] as const).map((val) => (
              <label key={val} className="cursor-pointer">
                <input
                  type="radio"
                  value={val}
                  {...register("attendance", { required: true })}
                  className="sr-only"
                />
                <div
                  className={`rounded p-4 text-center border-2 transition-all ${
                    selectedAttendance === val
                      ? "border-current shadow-md"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                  style={selectedAttendance === val ? { borderColor: theme.primary } : {}}
                >
                  <span className="text-2xl block mb-1">
                    {val === "confirmed" ? "✓" : "✗"}
                  </span>
                  <span className={`text-sm font-medium ${theme.textClass}`}>
                    {val === "confirmed" ? "Asistiré" : "No podré ir"}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <div>
            <label className={`block text-xs tracking-widest uppercase mb-2 ${theme.mutedClass}`}>
              Mensaje (opcional)
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              className={`w-full border rounded px-4 py-3 text-sm font-light focus:outline-none resize-none bg-transparent ${theme.textClass}`}
              style={{ borderColor: theme.accent }}
              placeholder="¿Alguna nota o restricción alimentaria?"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !selectedAttendance}
            className={`w-full py-4 text-sm tracking-widest uppercase rounded ${theme.buttonClass} disabled:opacity-40 transition-all`}
          >
            {isSubmitting ? "Enviando..." : "Confirmar"}
          </button>
        </form>
      </div>
    </section>
  );
}
