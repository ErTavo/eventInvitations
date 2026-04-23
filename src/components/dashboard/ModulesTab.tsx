"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { Event, Module, ModuleType } from "@/lib/supabase/types";
import { ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from "lucide-react";

const MODULE_LABELS: Record<ModuleType, string> = {
  carousel: "Carrusel de imágenes",
  music: "Música de fondo",
  map: "Mapa del lugar",
  rsvp: "Confirmación de asistencia",
  countdown: "Cuenta regresiva",
  gallery: "Galería",
  dress_code: "Código de vestimenta",
  itinerary: "Itinerario",
  gifts: "Mesa de regalos",
};

const MODULE_ICONS: Record<ModuleType, string> = {
  carousel: "🖼️",
  music: "🎵",
  map: "📍",
  rsvp: "✉️",
  countdown: "⏰",
  gallery: "📸",
  dress_code: "👗",
  itinerary: "📋",
  gifts: "🎁",
};

interface Props { event: Event; modules: Module[] }

export default function ModulesTab({ event, modules: initial }: Props) {
  const router = useRouter();
  const [modules, setModules] = useState(initial);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function toggle(mod: Module) {
    const newActive = !mod.is_active;
    setModules((prev) =>
      prev.map((m) => (m.id === mod.id ? { ...m, is_active: newActive } : m))
    );
    const res = await fetch(`/api/modules/${mod.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: newActive }),
    });
    if (!res.ok) {
      toast.error("Error al actualizar");
      setModules(initial);
    } else {
      router.refresh();
    }
  }

  async function saveConfig(mod: Module, config: Record<string, unknown>) {
    const res = await fetch(`/api/modules/${mod.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config }),
    });
    if (!res.ok) { toast.error("Error al guardar"); return; }
    toast.success("Guardado");
    setModules((prev) =>
      prev.map((m) => (m.id === mod.id ? { ...m, config } : m))
    );
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {modules.map((mod) => (
        <div key={mod.id} className="bg-white border border-stone-200 rounded overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-lg">{MODULE_ICONS[mod.type]}</span>
              <div>
                <p className="text-sm font-medium text-stone-800">{MODULE_LABELS[mod.type]}</p>
                <p className="text-xs text-stone-400">{mod.is_active ? "Activo" : "Inactivo"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggle(mod)} className="text-stone-500 hover:text-stone-800 transition-colors">
                {mod.is_active
                  ? <ToggleRight size={24} className="text-stone-800" />
                  : <ToggleLeft size={24} />}
              </button>
              {mod.is_active && (
                <button
                  onClick={() => setExpanded(expanded === mod.id ? null : mod.id)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  {expanded === mod.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              )}
            </div>
          </div>

          {expanded === mod.id && mod.is_active && (
            <div className="border-t border-stone-100 px-4 py-4">
              <ModuleConfigEditor mod={mod} onSave={(cfg) => saveConfig(mod, cfg)} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ModuleConfigEditor({
  mod,
  onSave,
}: {
  mod: Module;
  onSave: (cfg: Record<string, unknown>) => void;
}) {
  const [cfg, setCfg] = useState<Record<string, unknown>>(mod.config as Record<string, unknown>);

  function field(key: string, label: string, type = "text") {
    return (
      <div key={key}>
        <label className="block text-xs font-medium text-stone-600 mb-1">{label}</label>
        <input
          type={type}
          value={(cfg[key] as string) ?? ""}
          onChange={(e) => setCfg((p) => ({ ...p, [key]: e.target.value }))}
          className="w-full border border-stone-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
        />
      </div>
    );
  }

  const fields: React.ReactNode[] = [];

  if (mod.type === "music") {
    fields.push(field("musicUrl", "URL del audio (mp3)"));
    fields.push(field("musicTitle", "Título de la canción"));
  }
  if (mod.type === "map") {
    fields.push(field("mapAddress", "Dirección"));
    fields.push(field("mapEmbedUrl", "URL embed de Google Maps"));
  }
  if (mod.type === "dress_code") {
    fields.push(field("dressCodeText", "Descripción del código de vestimenta"));
  }
  if (mod.type === "gifts") {
    fields.push(field("giftsText", "Texto (ej: En lugar de regalos...)"));
    fields.push(field("giftStoreUrl", "Link a tienda / lista de regalos"));
  }
  if (mod.type === "carousel" || mod.type === "gallery") {
    const images: string[] = (cfg.images as string[]) ?? [];
    fields.push(
      <div key="images">
        <label className="block text-xs font-medium text-stone-600 mb-1">
          URLs de imágenes (una por línea)
        </label>
        <textarea
          rows={4}
          value={images.join("\n")}
          onChange={(e) =>
            setCfg((p) => ({
              ...p,
              images: e.target.value.split("\n").filter(Boolean),
            }))
          }
          className="w-full border border-stone-200 rounded px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-stone-400 resize-none"
        />
      </div>
    );
  }

  if (!fields.length) {
    return (
      <p className="text-xs text-stone-400 italic">
        Este módulo no tiene configuración adicional.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {fields}
      <button
        onClick={() => onSave(cfg)}
        className="bg-stone-800 text-white px-4 py-1.5 text-xs hover:bg-stone-700 transition-colors"
      >
        Guardar configuración
      </button>
    </div>
  );
}
