"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { Event, Module, ModuleType } from "@/lib/supabase/types";
import { ToggleLeft, ToggleRight, ChevronDown, ChevronUp, X, Plus, GripVertical } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import AudioUpload from "@/components/ui/AudioUpload";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const MODULE_LABELS: Record<ModuleType, string> = {
  carousel:   "Carrusel de imágenes",
  music:      "Música de fondo",
  map:        "Mapa del lugar",
  rsvp:       "Confirmación de asistencia",
  countdown:  "Cuenta regresiva",
  gallery:    "Galería",
  dress_code: "Código de vestimenta",
  itinerary:  "Itinerario",
  gifts:      "Mesa de regalos",
  parents:       "Padres y padrinos",
  envelope_rain: "Lluvia de sobres",
};

const MODULE_ICONS: Record<ModuleType, string> = {
  carousel:   "🖼️",
  music:      "🎵",
  map:        "📍",
  rsvp:       "✉️",
  countdown:  "⏰",
  gallery:    "📸",
  dress_code: "👗",
  itinerary:  "📋",
  gifts:      "🎁",
  parents:       "👨‍👩‍👧",
  envelope_rain: "💌",
};

interface Props { event: Event; modules: Module[] }

// ── Sortable module card wrapper ─────────────────────────────────────────────
function SortableModuleCard({
  mod,
  expanded,
  onToggle,
  onExpand,
  onSave,
}: {
  mod: Module;
  expanded: boolean;
  onToggle: () => void;
  onExpand: () => void;
  onSave: (cfg: Record<string, unknown>) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: mod.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-stone-200 rounded overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-stone-300 hover:text-stone-500 transition-colors cursor-grab active:cursor-grabbing mr-2 shrink-0 touch-none"
          aria-label="Reordenar"
        >
          <GripVertical size={18} />
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-lg shrink-0">{MODULE_ICONS[mod.type as ModuleType] ?? "📦"}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-stone-800 truncate">
              {MODULE_LABELS[mod.type as ModuleType] ?? mod.type}
            </p>
            <p className="text-xs text-stone-400">{mod.is_active ? "Activo" : "Inactivo"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onToggle} className="text-stone-500 hover:text-stone-800 transition-colors">
            {mod.is_active
              ? <ToggleRight size={24} className="text-stone-800" />
              : <ToggleLeft size={24} />}
          </button>
          <button
            onClick={onExpand}
            className="text-stone-400 hover:text-stone-700"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-stone-100 px-4 py-4">
          {mod.is_active ? (
            <ModuleConfigEditor mod={mod} onSave={onSave} />
          ) : (
            <p className="text-xs text-stone-400 italic">
              Activa el módulo para configurarlo.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ModulesTab({ event, modules: initial }: Props) {
  const router = useRouter();
  const [modules, setModules] = useState(initial);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [addingParents,      setAddingParents]      = useState(false);
  const [addingEnvelopeRain, setAddingEnvelopeRain] = useState(false);
  const [saving, setSaving] = useState(false);

  const hasParents      = modules.some((m) => m.type === "parents");
  const hasEnvelopeRain = modules.some((m) => m.type === "envelope_rain");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const oldIndex = modules.findIndex((m) => m.id === active.id);
    const newIndex = modules.findIndex((m) => m.id === over.id);
    const reordered = arrayMove(modules, oldIndex, newIndex).map((m, i) => ({
      ...m,
      order: i + 1,
    }));

    setModules(reordered);
    setSaving(true);

    // Persist new order for each moved module
    await Promise.all(
      reordered.map((m, i) =>
        fetch(`/api/modules/${m.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: i + 1 }),
        })
      )
    );

    setSaving(false);
    router.refresh();
  }

  async function toggle(mod: Module) {
    const newActive = !mod.is_active;
    setModules((prev) => prev.map((m) => (m.id === mod.id ? { ...m, is_active: newActive } : m)));
    const res = await fetch(`/api/modules/${mod.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: newActive }),
    });
    if (!res.ok) { toast.error("Error al actualizar"); setModules(initial); }
    else { router.refresh(); }
  }

  async function saveConfig(mod: Module, config: Record<string, unknown>) {
    const res = await fetch(`/api/modules/${mod.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config }),
    });
    if (!res.ok) { toast.error("Error al guardar"); return; }
    toast.success("Guardado");
    setModules((prev) => prev.map((m) => (m.id === mod.id ? { ...m, config } : m)));
    router.refresh();
  }

  async function addParentsModule() {
    setAddingParents(true);
    const res = await fetch("/api/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_id: event.id,
        type: "parents",
        order: modules.length + 1,
        config: {
          sectionTitle: "Nuestros padres",
          brideParentsLabel: "Padres de la novia",
          brideParentNames: [],
          groomParentsLabel: "Padres del novio",
          groomParentNames: [],
          godfathersLabel: "Nuestros padrinos",
          godfatherNames: [],
        },
      }),
    });
    if (!res.ok) { toast.error("Error al agregar módulo"); }
    else { toast.success("Módulo de padres agregado"); router.refresh(); }
    setAddingParents(false);
  }

  async function addEnvelopeRainModule() {
    setAddingEnvelopeRain(true);
    const res = await fetch("/api/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_id: event.id,
        type: "envelope_rain",
        order: modules.length + 1,
        config: {
          envelopeRainDescription: "Tu presencia es el mejor regalo. Si deseas hacernos un obsequio, puedes hacerlo a través de las siguientes cuentas:",
          envelopeRainAccounts: [],
        },
      }),
    });
    if (!res.ok) { toast.error("Error al agregar módulo"); }
    else { toast.success("Módulo agregado"); router.refresh(); }
    setAddingEnvelopeRain(false);
  }

  return (
    <div className="space-y-3">
      {/* Saving indicator */}
      {saving && (
        <p className="text-xs text-stone-400 text-right animate-pulse">Guardando orden…</p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={modules.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          {modules.map((mod) => (
            <SortableModuleCard
              key={mod.id}
              mod={mod}
              expanded={expanded === mod.id}
              onToggle={() => toggle(mod)}
              onExpand={() => setExpanded(expanded === mod.id ? null : mod.id)}
              onSave={(cfg) => saveConfig(mod, cfg)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add parents module button */}
      {/* "+" buttons only for events created before these modules were auto-generated */}
      {!hasParents && (
        <button onClick={addParentsModule} disabled={addingParents}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-stone-300 rounded py-3 text-sm text-stone-500 hover:border-stone-500 hover:text-stone-700 transition-colors disabled:opacity-50">
          <Plus size={16} />
          {addingParents ? "Agregando..." : "Agregar módulo de Padres y Padrinos"}
        </button>
      )}
      {!hasEnvelopeRain && (
        <button onClick={addEnvelopeRainModule} disabled={addingEnvelopeRain}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-stone-300 rounded py-3 text-sm text-stone-500 hover:border-stone-500 hover:text-stone-700 transition-colors disabled:opacity-50">
          <Plus size={16} />
          {addingEnvelopeRain ? "Agregando..." : "Agregar módulo de Lluvia de Sobres"}
        </button>
      )}
    </div>
  );
}

// ── Module config editors ─────────────────────────────────────────────────────
function ModuleConfigEditor({
  mod,
  onSave,
}: {
  mod: Module;
  onSave: (cfg: Record<string, unknown>) => void;
}) {
  const [cfg, setCfg] = useState<Record<string, unknown>>(mod.config as Record<string, unknown>);

  function field(key: string, label: string, type = "text", placeholder = "") {
    return (
      <div key={key}>
        <label className="block text-xs font-medium text-stone-600 mb-1">{label}</label>
        <input
          type={type}
          value={(cfg[key] as string) ?? ""}
          onChange={(e) => setCfg((p) => ({ ...p, [key]: e.target.value }))}
          placeholder={placeholder}
          className="w-full border border-stone-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
        />
      </div>
    );
  }

  const fields: React.ReactNode[] = [];

  // ── Music ──────────────────────────────────────────────────────────────────
  if (mod.type === "music") {
    fields.push(
      <div key="music" className="space-y-3">
        <label className="block text-xs font-medium text-stone-600">Canción</label>
        <AudioUpload
          value={(cfg.musicUrl as string) || ""}
          title={(cfg.musicTitle as string) || ""}
          onChange={(url, filename) =>
            setCfg((p) => ({ ...p, musicUrl: url, musicTitle: p.musicTitle || filename }))
          }
          onRemove={() => setCfg((p) => ({ ...p, musicUrl: "", musicTitle: "" }))}
          folder="audio"
        />
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">
            Título mostrado en la invitación
          </label>
          <input
            type="text"
            value={(cfg.musicTitle as string) ?? ""}
            onChange={(e) => setCfg((p) => ({ ...p, musicTitle: e.target.value }))}
            placeholder="Ej: Perfect – Ed Sheeran"
            className="w-full border border-stone-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
          />
        </div>
      </div>
    );
  }

  // ── Map ────────────────────────────────────────────────────────────────────
  if (mod.type === "map") {
    fields.push(field("mapAddress", "Dirección", "text", "Calle Hidalgo #27, Cholula"));
    fields.push(field("mapEmbedUrl", "URL embed de Google Maps"));
  }

  // ── Itinerary ──────────────────────────────────────────────────────────────
  if (mod.type === "itinerary") {
    const items: { time: string; description: string }[] =
      (cfg.itineraryItems as { time: string; description: string }[]) ?? [];
    fields.push(
      <div key="itinerary" className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-stone-600">
            Momentos del evento ({items.length})
          </label>
          <button
            type="button"
            onClick={() =>
              setCfg((p) => ({
                ...p,
                itineraryItems: [...((p.itineraryItems as typeof items) ?? []), { time: "", description: "" }],
              }))
            }
            className="text-xs bg-stone-800 text-white px-2.5 py-1 hover:bg-stone-700 transition-colors"
          >
            + Agregar
          </button>
        </div>
        {items.length === 0 && (
          <p className="text-xs text-stone-400 italic text-center py-3 border border-dashed border-stone-200 rounded">
            Agrega los momentos del evento (ceremonia, recepción, cena…)
          </p>
        )}
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2 items-start">
              <input
                type="text" value={item.time}
                onChange={(e) =>
                  setCfg((p) => {
                    const next = [...((p.itineraryItems as typeof items) ?? [])];
                    next[i] = { ...next[i], time: e.target.value };
                    return { ...p, itineraryItems: next };
                  })
                }
                placeholder="4:00 PM"
                className="w-28 shrink-0 border border-stone-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
              <input
                type="text" value={item.description}
                onChange={(e) =>
                  setCfg((p) => {
                    const next = [...((p.itineraryItems as typeof items) ?? [])];
                    next[i] = { ...next[i], description: e.target.value };
                    return { ...p, itineraryItems: next };
                  })
                }
                placeholder="Ceremonia civil"
                className="flex-1 border border-stone-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
              <button
                type="button"
                onClick={() =>
                  setCfg((p) => ({
                    ...p,
                    itineraryItems: ((p.itineraryItems as typeof items) ?? []).filter((_, idx) => idx !== i),
                  }))
                }
                className="text-stone-300 hover:text-rose-500 transition-colors pt-1.5"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Dress code ─────────────────────────────────────────────────────────────
  if (mod.type === "dress_code") {
    fields.push(
      <div key="dress_code" className="space-y-4">
        {field("dressCodeText", "Descripción general", "text", "Ej: Formal, colores claros")}

        {/* Color swatches */}
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-2">
            Paleta de colores (haz clic en + para agregar)
          </label>
          <div className="flex gap-2 flex-wrap items-center">
            {((cfg.dressCodeColors as string[]) ?? []).map((color, i) => (
              <div key={i} className="relative group">
                <input
                  type="color" value={color}
                  onChange={(e) =>
                    setCfg((p) => {
                      const next = [...((p.dressCodeColors as string[]) ?? [])];
                      next[i] = e.target.value;
                      return { ...p, dressCodeColors: next };
                    })
                  }
                  className="w-9 h-9 rounded-full cursor-pointer border-2 border-white shadow-sm p-0"
                />
                <button
                  type="button"
                  onClick={() =>
                    setCfg((p) => ({
                      ...p,
                      dressCodeColors: ((p.dressCodeColors as string[]) ?? []).filter((_, idx) => idx !== i),
                    }))
                  }
                  className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setCfg((p) => ({
                  ...p,
                  dressCodeColors: [...((p.dressCodeColors as string[]) ?? []), "#c9a96e"],
                }))
              }
              className="w-9 h-9 rounded-full border-2 border-dashed border-stone-300 flex items-center justify-center text-stone-400 hover:border-stone-500 hover:text-stone-600 transition-colors text-lg"
            >
              +
            </button>
          </div>
        </div>

        <hr className="border-stone-100" />
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Foto de ejemplo</p>

        {/* Female photo */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-stone-600">Foto ejemplo — Mujer</label>
          {cfg.dressCodeFemaleImage ? (
            <div className="flex items-start gap-3">
              <div className="relative w-20 h-28 rounded overflow-hidden border border-stone-200 shrink-0">
                <Image src={cfg.dressCodeFemaleImage as string} alt="Mujer" fill className="object-cover" sizes="80px" />
              </div>
              <button
                type="button"
                onClick={() => setCfg((p) => ({ ...p, dressCodeFemaleImage: "" }))}
                className="text-xs text-rose-500 hover:underline mt-1"
              >
                Quitar foto
              </button>
            </div>
          ) : (
            <ImageUpload
              onChange={(url) => setCfg((p) => ({ ...p, dressCodeFemaleImage: url }))}
              folder="dresscode"
              label="Subir foto mujer"
              aspectRatio="free"
            />
          )}
          <input
            type="text"
            value={(cfg.dressCodeFemaleDescription as string) ?? ""}
            onChange={(e) => setCfg((p) => ({ ...p, dressCodeFemaleDescription: e.target.value }))}
            placeholder="Ej: Vestido largo, colores pastel"
            className="w-full border border-stone-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
          />
        </div>

        {/* Male photo */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-stone-600">Foto ejemplo — Hombre</label>
          {cfg.dressCodeMaleImage ? (
            <div className="flex items-start gap-3">
              <div className="relative w-20 h-28 rounded overflow-hidden border border-stone-200 shrink-0">
                <Image src={cfg.dressCodeMaleImage as string} alt="Hombre" fill className="object-cover" sizes="80px" />
              </div>
              <button
                type="button"
                onClick={() => setCfg((p) => ({ ...p, dressCodeMaleImage: "" }))}
                className="text-xs text-rose-500 hover:underline mt-1"
              >
                Quitar foto
              </button>
            </div>
          ) : (
            <ImageUpload
              onChange={(url) => setCfg((p) => ({ ...p, dressCodeMaleImage: url }))}
              folder="dresscode"
              label="Subir foto hombre"
              aspectRatio="free"
            />
          )}
          <input
            type="text"
            value={(cfg.dressCodeMaleDescription as string) ?? ""}
            onChange={(e) => setCfg((p) => ({ ...p, dressCodeMaleDescription: e.target.value }))}
            placeholder="Ej: Traje formal, corbata oscura"
            className="w-full border border-stone-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
          />
        </div>
      </div>
    );
  }

  // ── Gifts ──────────────────────────────────────────────────────────────────
  if (mod.type === "gifts") {
    fields.push(field("giftsText", "Texto (ej: En lugar de regalos...)"));
    fields.push(field("giftStoreUrl", "Link a tienda / lista de regalos"));
  }

  // ── Carousel / Gallery ─────────────────────────────────────────────────────
  if (mod.type === "carousel" || mod.type === "gallery") {
    const images: string[] = (cfg.images as string[]) ?? [];
    fields.push(
      <div key="images" className="space-y-3">
        <label className="block text-xs font-medium text-stone-600">
          Imágenes ({images.length})
        </label>
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((src, i) => (
              <div key={i} className="relative group aspect-square rounded overflow-hidden border border-stone-200">
                <Image src={src} alt="" fill className="object-cover" sizes="150px" />
                <button
                  type="button"
                  onClick={() =>
                    setCfg((p) => ({ ...p, images: (p.images as string[]).filter((_, idx) => idx !== i) }))
                  }
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        <ImageUpload
          onChange={(url) =>
            setCfg((p) => ({ ...p, images: [...((p.images as string[]) ?? []), url] }))
          }
          folder="gallery"
          label="Agregar imagen"
          aspectRatio="square"
        />
      </div>
    );
  }

  // ── Parents ────────────────────────────────────────────────────────────────
  if (mod.type === "parents") {
    function namesField(
      cfgKey: string,
      label: string,
      placeholder: string
    ) {
      const names: string[] = (cfg[cfgKey] as string[]) ?? [];
      return (
        <div key={cfgKey} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-stone-600">{label}</label>
            <button
              type="button"
              onClick={() =>
                setCfg((p) => ({ ...p, [cfgKey]: [...((p[cfgKey] as string[]) ?? []), ""] }))
              }
              className="text-xs bg-stone-800 text-white px-2 py-0.5 hover:bg-stone-700 transition-colors"
            >
              + Nombre
            </button>
          </div>
          {names.map((name, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text" value={name} placeholder={placeholder}
                onChange={(e) =>
                  setCfg((p) => {
                    const next = [...((p[cfgKey] as string[]) ?? [])];
                    next[i] = e.target.value;
                    return { ...p, [cfgKey]: next };
                  })
                }
                className="flex-1 border border-stone-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
              <button
                type="button"
                onClick={() =>
                  setCfg((p) => ({
                    ...p,
                    [cfgKey]: ((p[cfgKey] as string[]) ?? []).filter((_, idx) => idx !== i),
                  }))
                }
                className="text-stone-300 hover:text-rose-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      );
    }

    fields.push(
      <div key="parents" className="space-y-4">
        {field("sectionTitle", "Título de la sección", "text", "Nuestros padres")}

        <hr className="border-stone-100" />

        {field("brideParentsLabel", "Etiqueta padres novia", "text", "Padres de la novia")}
        {namesField("brideParentNames", "Nombres — padres de la novia", "Ej: María García López")}

        <hr className="border-stone-100" />

        {field("groomParentsLabel", "Etiqueta padres novio", "text", "Padres del novio")}
        {namesField("groomParentNames", "Nombres — padres del novio", "Ej: Juan Pérez Ramírez")}

        <hr className="border-stone-100" />

        {field("godfathersLabel", "Etiqueta padrinos", "text", "Nuestros padrinos")}
        {namesField("godfatherNames", "Nombres — padrinos", "Ej: Roberto Flores")}
      </div>
    );
  }

  // ── Envelope Rain ──────────────────────────────────────────────────────────
  if (mod.type === "envelope_rain") {
    type Account = {
      bankName: string;
      accountHolder: string;
      clabe: string;
      accountNumber?: string;
      alias?: string;
    };
    const accounts: Account[] = (cfg.envelopeRainAccounts as Account[]) ?? [];

    fields.push(
      <div key="envelope_rain" className="space-y-4">
        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Texto introductorio</label>
          <textarea
            value={(cfg.envelopeRainDescription as string) ?? ""}
            onChange={(e) => setCfg((p) => ({ ...p, envelopeRainDescription: e.target.value }))}
            rows={3}
            placeholder="Tu presencia es el mejor regalo..."
            className="w-full border border-stone-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400 resize-none"
          />
        </div>

        <hr className="border-stone-100" />

        {/* Accounts list */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-stone-600">
            Cuentas bancarias ({accounts.length})
          </label>
          <button
            type="button"
            onClick={() =>
              setCfg((p) => ({
                ...p,
                envelopeRainAccounts: [
                  ...((p.envelopeRainAccounts as Account[]) ?? []),
                  { bankName: "", accountHolder: "", clabe: "", accountNumber: "", alias: "" },
                ],
              }))
            }
            className="text-xs bg-stone-800 text-white px-2.5 py-1 hover:bg-stone-700 transition-colors"
          >
            + Agregar cuenta
          </button>
        </div>

        {accounts.length === 0 && (
          <p className="text-xs text-stone-400 italic text-center py-3 border border-dashed border-stone-200 rounded">
            Agrega las cuentas donde pueden enviarte el regalo
          </p>
        )}

        <div className="space-y-4">
          {accounts.map((acc, i) => (
            <div key={i} className="border border-stone-200 rounded p-3 space-y-2.5 relative">
              <button
                type="button"
                onClick={() =>
                  setCfg((p) => ({
                    ...p,
                    envelopeRainAccounts: ((p.envelopeRainAccounts as Account[]) ?? []).filter((_, idx) => idx !== i),
                  }))
                }
                className="absolute top-2 right-2 text-stone-300 hover:text-rose-500 transition-colors"
              >
                <X size={14} />
              </button>

              {/* Bank name */}
              <div>
                <label className="block text-xs text-stone-500 mb-0.5">Banco</label>
                <input
                  type="text" value={acc.bankName} placeholder="BBVA, Banamex, HSBC…"
                  onChange={(e) =>
                    setCfg((p) => {
                      const next = [...((p.envelopeRainAccounts as Account[]) ?? [])];
                      next[i] = { ...next[i], bankName: e.target.value };
                      return { ...p, envelopeRainAccounts: next };
                    })
                  }
                  className="w-full border border-stone-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>

              {/* Account holder */}
              <div>
                <label className="block text-xs text-stone-500 mb-0.5">Titular</label>
                <input
                  type="text" value={acc.accountHolder} placeholder="Nombre completo"
                  onChange={(e) =>
                    setCfg((p) => {
                      const next = [...((p.envelopeRainAccounts as Account[]) ?? [])];
                      next[i] = { ...next[i], accountHolder: e.target.value };
                      return { ...p, envelopeRainAccounts: next };
                    })
                  }
                  className="w-full border border-stone-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>

              {/* CLABE */}
              <div>
                <label className="block text-xs text-stone-500 mb-0.5">CLABE interbancaria</label>
                <input
                  type="text" value={acc.clabe} placeholder="18 dígitos"
                  maxLength={18}
                  onChange={(e) =>
                    setCfg((p) => {
                      const next = [...((p.envelopeRainAccounts as Account[]) ?? [])];
                      next[i] = { ...next[i], clabe: e.target.value.replace(/\D/g, "") };
                      return { ...p, envelopeRainAccounts: next };
                    })
                  }
                  className="w-full border border-stone-200 rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>

              {/* Account number (optional) */}
              <div>
                <label className="block text-xs text-stone-500 mb-0.5">Número de cuenta <span className="text-stone-400">(opcional)</span></label>
                <input
                  type="text" value={acc.accountNumber ?? ""} placeholder="10 dígitos"
                  onChange={(e) =>
                    setCfg((p) => {
                      const next = [...((p.envelopeRainAccounts as Account[]) ?? [])];
                      next[i] = { ...next[i], accountNumber: e.target.value.replace(/\D/g, "") };
                      return { ...p, envelopeRainAccounts: next };
                    })
                  }
                  className="w-full border border-stone-200 rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>

              {/* Alias SPEI (optional) */}
              <div>
                <label className="block text-xs text-stone-500 mb-0.5">Alias SPEI <span className="text-stone-400">(opcional)</span></label>
                <input
                  type="text" value={acc.alias ?? ""} placeholder="Ej: bodaana2025"
                  onChange={(e) =>
                    setCfg((p) => {
                      const next = [...((p.envelopeRainAccounts as Account[]) ?? [])];
                      next[i] = { ...next[i], alias: e.target.value };
                      return { ...p, envelopeRainAccounts: next };
                    })
                  }
                  className="w-full border border-stone-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>
            </div>
          ))}
        </div>
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
