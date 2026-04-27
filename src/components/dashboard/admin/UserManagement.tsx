"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Shield, User, ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Profile { id: string; name: string | null; role: string }
interface Event   { id: string; name: string; date: string; slug: string }
interface Assignment { event_id: string; user_id: string }

interface Props {
  profiles: Profile[];
  events: Event[];
  assignments: Assignment[];
}

export default function UserManagement({ profiles, events, assignments }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function userAssignments(userId: string) {
    return assignments.filter((a) => a.user_id === userId).map((a) => a.event_id);
  }

  async function toggleRole(profile: Profile) {
    const newRole = profile.role === "admin" ? "user" : "admin";
    setSaving(true);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: profile.id, role: newRole }),
    });
    if (!res.ok) { toast.error("Error al cambiar rol"); }
    else { toast.success("Rol actualizado"); router.refresh(); }
    setSaving(false);
  }

  async function toggleAssignment(userId: string, eventId: string, currentlyAssigned: boolean) {
    const res = await fetch("/api/admin/assignments", {
      method: currentlyAssigned ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, eventId }),
    });
    if (!res.ok) { toast.error("Error al actualizar asignación"); }
    else { router.refresh(); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-stone-800" style={{ fontFamily: "Cormorant Garamond, serif" }}>
          Gestión de Usuarios
        </h1>
        <span className="text-xs text-stone-400">{profiles.length} usuario{profiles.length !== 1 ? "s" : ""}</span>
      </div>

      <p className="text-sm text-stone-500 bg-amber-50 border border-amber-200 rounded px-4 py-3">
        Los usuarios se crean desde <strong>Supabase → Authentication → Users → Invite user</strong>.
        Aquí puedes gestionar roles y asignar eventos.
      </p>

      <div className="space-y-3">
        {profiles.map((profile) => {
          const assigned = userAssignments(profile.id);
          const isExpanded = expanded === profile.id;

          return (
            <div key={profile.id} className="bg-white border border-stone-200 rounded overflow-hidden">
              {/* User header */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${profile.role === "admin" ? "bg-amber-100" : "bg-stone-100"}`}>
                    {profile.role === "admin"
                      ? <Shield size={16} className="text-amber-600" />
                      : <User size={16} className="text-stone-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-800">{profile.name ?? "Sin nombre"}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${profile.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-500"}`}>
                        {profile.role === "admin" ? "Administrador" : "Usuario"}
                      </span>
                      <span className="text-xs text-stone-400">{assigned.length} evento{assigned.length !== 1 ? "s" : ""} asignado{assigned.length !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRole(profile)}
                    disabled={saving}
                    className="text-xs px-3 py-1.5 border border-stone-200 hover:border-stone-400 text-stone-600 hover:text-stone-800 transition-colors disabled:opacity-40 rounded"
                  >
                    {profile.role === "admin" ? "Quitar admin" : "Hacer admin"}
                  </button>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : profile.id)}
                    className="text-stone-400 hover:text-stone-700"
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Event assignments */}
              {isExpanded && (
                <div className="border-t border-stone-100 px-5 py-4">
                  <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">
                    Eventos asignados
                  </p>
                  {events.length === 0 ? (
                    <p className="text-xs text-stone-400 italic">No hay eventos creados aún.</p>
                  ) : (
                    <div className="space-y-2">
                      {events.map((event) => {
                        const isAssigned = assigned.includes(event.id);
                        return (
                          <div key={event.id} className="flex items-center justify-between gap-3 py-1.5 border-b border-stone-50 last:border-0">
                            <div className="min-w-0">
                              <p className="text-sm text-stone-700 truncate">{event.name}</p>
                              <p className="text-xs text-stone-400">{formatDate(event.date)}</p>
                            </div>
                            <button
                              onClick={() => toggleAssignment(profile.id, event.id, isAssigned)}
                              className={`shrink-0 flex items-center gap-1 text-xs px-3 py-1 rounded-full border transition-all ${
                                isAssigned
                                  ? "bg-green-50 border-green-300 text-green-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                                  : "bg-stone-50 border-stone-200 text-stone-500 hover:border-stone-400"
                              }`}
                            >
                              {isAssigned
                                ? <><Check size={11} /> Asignado</>
                                : <><X size={11} /> Sin asignar</>}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
