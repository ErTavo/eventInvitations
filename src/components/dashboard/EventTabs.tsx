"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import type { Event, Module, Participant } from "@/lib/supabase/types";
import EventSettingsTab from "./EventSettingsTab";
import ModulesTab from "./ModulesTab";
import ParticipantsTab from "./ParticipantsTab";
import { Settings, Puzzle, Users, Trash2, AlertTriangle, Eye, EyeOff } from "lucide-react";

interface Props {
  event: Event;
  modules: Module[];
  participants: Participant[];
}

const TABS = [
  { id: "settings",     label: "Configuración", Icon: Settings },
  { id: "modules",      label: "Módulos",        Icon: Puzzle   },
  { id: "participants", label: "Invitados",       Icon: Users    },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function EventTabs({ event, modules, participants }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab]       = useState<TabId>("settings");
  const [showDeleteModal, setShowDelete] = useState(false);
  const [deleteInput, setDeleteInput]   = useState("");
  const [deleting, setDeleting]         = useState(false);

  async function handleDelete() {
    if (deleteInput !== event.name) return;
    setDeleting(true);
    const res = await fetch(`/api/events/${event.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Error al eliminar el evento");
      setDeleting(false);
      return;
    }
    const { deletedFiles } = await res.json();
    toast.success(`Evento eliminado${deletedFiles ? ` · ${deletedFiles} archivo(s) borrados` : ""}`);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl text-stone-800" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            {event.name}
          </h1>
          {event.is_published
            ? <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full"><Eye size={11} /> Publicado</span>
            : <span className="flex items-center gap-1 text-xs text-stone-400 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full"><EyeOff size={11} /> Borrador</span>
          }
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/${event.slug}/${participants[0]?.id ?? "preview"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-500 underline hover:text-stone-800"
          >
            Ver invitación ↗
          </a>
          <button
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 border border-rose-200 hover:border-rose-400 px-3 py-1.5 rounded transition-colors"
          >
            <Trash2 size={13} />
            Eliminar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-1">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 transition-colors ${
              activeTab === id
                ? "border-stone-800 text-stone-800 font-medium"
                : "border-transparent text-stone-500 hover:text-stone-700"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "settings"     && <EventSettingsTab event={event} />}
      {activeTab === "modules"      && <ModulesTab event={event} modules={modules} />}
      {activeTab === "participants" && <ParticipantsTab event={event} participants={participants} />}

      {/* ── Delete confirmation modal ── */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              key="del-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
              onClick={() => !deleting && setShowDelete(false)}
            />
            <motion.div
              key="del-modal"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md bg-white border border-stone-200 shadow-xl rounded-sm overflow-hidden">
                <div className="h-1 w-full bg-rose-500" />

                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                      <AlertTriangle size={17} className="text-rose-500" />
                    </div>
                    <div>
                      <h2 className="text-lg text-stone-800 font-medium">Eliminar evento</h2>
                      <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                        Esta acción es <strong>irreversible</strong>. Se eliminarán todos los invitados,
                        módulos e imágenes y audios subidos asociados a este evento.
                      </p>
                    </div>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 rounded px-4 py-3 text-sm text-stone-600">
                    Escribe <span className="font-semibold text-stone-800">{event.name}</span> para confirmar:
                  </div>

                  <input
                    type="text"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    placeholder={event.name}
                    className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-400"
                    disabled={deleting}
                  />

                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => { setShowDelete(false); setDeleteInput(""); }}
                      disabled={deleting}
                      className="flex-1 border border-stone-200 text-stone-600 py-2 text-sm hover:bg-stone-50 transition-colors disabled:opacity-40"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleteInput !== event.name || deleting}
                      className="flex-1 bg-rose-600 text-white py-2 text-sm hover:bg-rose-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {deleting ? "Eliminando..." : "Sí, eliminar"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
