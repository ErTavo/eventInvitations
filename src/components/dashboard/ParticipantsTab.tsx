"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { Event, Participant } from "@/lib/supabase/types";
import { Copy, Trash2, UserPlus, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react";
import NoteDialog from "@/components/ui/NoteDialog";

interface Props { event: Event; participants: Participant[] }

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending:   <Clock size={14} className="text-amber-500" />,
  confirmed: <CheckCircle size={14} className="text-emerald-600" />,
  declined:  <XCircle size={14} className="text-rose-500" />,
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  declined: "Declinó",
};

const STATUS_ROW: Record<string, string> = {
  pending: "",
  confirmed: "bg-emerald-50/40",
  declined: "bg-rose-50/30",
};

interface FormValues { name: string; companions: number }

export default function ParticipantsTab({ event, participants: initial }: Props) {
  const router = useRouter();
  const [participants, setParticipants] = useState(initial);
  const [selectedNote, setSelectedNote] = useState<Participant | null>(null);

  const { register, handleSubmit, reset, formState: { isSubmitting } } =
    useForm<FormValues>({ defaultValues: { companions: 0 } });

  async function addParticipant(values: FormValues) {
    const res = await fetch("/api/participants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_id: event.id, ...values }),
    });
    if (!res.ok) { toast.error("Error al agregar invitado"); return; }
    const p = await res.json();
    setParticipants((prev) => [p, ...prev]);
    reset();
    router.refresh();
  }

  async function deleteParticipant(id: string) {
    if (!confirm("¿Eliminar este invitado?")) return;
    const res = await fetch(`/api/participants/${id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Error al eliminar"); return; }
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  }

  function copyLink(participantId: string) {
    const url = `${window.location.origin}/${event.slug}/${participantId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado");
  }

  const confirmed = participants.filter((p) => p.attendance === "confirmed").length;
  const declined  = participants.filter((p) => p.attendance === "declined").length;
  const withNotes = participants.filter((p) => p.notes).length;
  const total     = participants.reduce((acc, p) => acc + 1 + p.companions, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total invitados",    value: participants.length },
          { label: "Confirmados",        value: confirmed,  color: "text-emerald-700" },
          { label: "Declinaron",         value: declined,   color: "text-rose-600" },
          { label: "Asistentes totales", value: total },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-stone-200 rounded p-4 text-center">
            <p className={`text-2xl font-light ${s.color ?? "text-stone-800"}`} style={{ fontFamily: "Cormorant Garamond, serif" }}>
              {s.value}
            </p>
            <p className="text-xs text-stone-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Notes banner */}
      {withNotes > 0 && (
        <div className="flex items-center gap-2.5 bg-[#fefce8] border border-amber-200 rounded px-4 py-2.5 text-sm text-amber-800">
          <MessageSquare size={15} className="shrink-0" />
          <span>
            {withNotes} invitado{withNotes !== 1 ? "s" : ""} dejaron un mensaje — haz click en{" "}
            <MessageSquare size={12} className="inline" /> para leerlo.
          </span>
        </div>
      )}

      {/* Add participant */}
      <form
        onSubmit={handleSubmit(addParticipant)}
        className="bg-white border border-stone-200 rounded p-4 flex flex-wrap gap-3 items-end"
      >
        <div className="flex-1 min-w-40">
          <label className="block text-xs font-medium text-stone-600 mb-1">Nombre</label>
          <input
            {...register("name", { required: true })}
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"
            placeholder="Ana García"
          />
        </div>
        <div className="w-32">
          <label className="block text-xs font-medium text-stone-600 mb-1">Acompañantes</label>
          <input
            type="number"
            min={0}
            {...register("companions", { valueAsNumber: true })}
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-stone-800 text-white px-4 py-2 text-sm hover:bg-stone-700 transition-colors disabled:opacity-50"
        >
          <UserPlus size={15} />
          Agregar
        </button>
      </form>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded overflow-hidden">
        {!participants.length ? (
          <p className="text-center text-stone-400 text-sm py-8">Sin invitados aún</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-stone-500 font-medium text-xs tracking-wide uppercase">Nombre</th>
                <th className="text-center px-4 py-2.5 text-stone-500 font-medium text-xs tracking-wide uppercase">+</th>
                <th className="text-center px-4 py-2.5 text-stone-500 font-medium text-xs tracking-wide uppercase">Estado</th>
                <th className="text-center px-4 py-2.5 text-stone-500 font-medium text-xs tracking-wide uppercase">Vio</th>
                <th className="text-center px-4 py-2.5 text-stone-500 font-medium text-xs tracking-wide uppercase">Msg</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr
                  key={p.id}
                  className={`border-b border-stone-100 hover:bg-stone-50 transition-colors ${STATUS_ROW[p.attendance]}`}
                >
                  {/* Name */}
                  <td className="px-4 py-3">
                    <span
                      className="font-medium text-stone-800"
                      style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}
                    >
                      {p.name}
                    </span>
                  </td>

                  {/* Companions */}
                  <td className="px-4 py-3 text-center text-stone-500 text-xs">
                    {p.companions > 0 ? `+${p.companions}` : "—"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {STATUS_ICON[p.attendance]}
                      <span className="text-xs text-stone-600">{STATUS_LABEL[p.attendance]}</span>
                    </div>
                  </td>

                  {/* Viewed */}
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs ${p.invitation_viewed ? "text-emerald-600" : "text-stone-300"}`}>
                      {p.invitation_viewed ? "✓" : "—"}
                    </span>
                  </td>

                  {/* Note button */}
                  <td className="px-4 py-3 text-center">
                    {p.notes ? (
                      <button
                        onClick={() => setSelectedNote(p)}
                        title="Ver mensaje"
                        className="relative inline-flex items-center justify-center text-[#b8974a] hover:text-[#8a6e32] transition-colors"
                      >
                        <MessageSquare size={16} />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#b8974a] rounded-full" />
                      </button>
                    ) : (
                      <span className="text-stone-200">
                        <MessageSquare size={15} />
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => copyLink(p.id)}
                        title="Copiar link de invitación"
                        className="text-stone-300 hover:text-stone-700 transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => deleteParticipant(p.id)}
                        className="text-stone-200 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Note dialog */}
      <NoteDialog participant={selectedNote} onClose={() => setSelectedNote(null)} />
    </div>
  );
}
