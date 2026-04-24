"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { Event, EventStyle, ThemeId } from "@/lib/supabase/types";
import ImageUpload from "@/components/ui/ImageUpload";

interface Props { event: Event }

interface FormValues {
  name: string;
  date: string;
  location: string;
  description: string;
  is_published: boolean;
}

const PRESET_THEMES: {
  id: Exclude<ThemeId, "custom">;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  textColor: string;
  font: string;
}[] = [
  { id: "vintage",  label: "Vintage",  primary: "#8b6c42", secondary: "#fdf6ec", accent: "#c9a96e", textColor: "#5a4030", font: "Cormorant Garamond" },
  { id: "elegant",  label: "Elegante", primary: "#2d4a22", secondary: "#f5f0e8", accent: "#c9a96e", textColor: "#2c2c2c", font: "Cormorant Garamond" },
  { id: "modern",   label: "Moderno",  primary: "#9b5de5", secondary: "#ffffff", accent: "#c490f5", textColor: "#2d2d45", font: "Inter"              },
  { id: "floral",   label: "Floral",   primary: "#c2547a", secondary: "#fff9fb", accent: "#f4a5be", textColor: "#5a2a3d", font: "Cormorant Garamond" },
  { id: "minimal",  label: "Minimal",  primary: "#2d2d2d", secondary: "#ffffff", accent: "#888888", textColor: "#444444", font: "Inter"              },
];

const FONTS = [
  { value: "Cormorant Garamond", label: "Cormorant Garamond — clásico" },
  { value: "Great Vibes",        label: "Great Vibes — caligráfico"    },
  { value: "Inter",              label: "Inter — moderno"               },
];

const COLOR_FIELDS: {
  key: keyof Pick<EventStyle, "primaryColor" | "secondaryColor" | "accentColor" | "textColor">;
  label: string;
  hint: string;
}[] = [
  { key: "primaryColor",   label: "Color principal",  hint: "Títulos, botones y acentos"        },
  { key: "secondaryColor", label: "Color de fondo",   hint: "Fondo de la página"                },
  { key: "accentColor",    label: "Color de acento",  hint: "Líneas divisorias y bordes"        },
  { key: "textColor",      label: "Color de texto",   hint: "Texto del cuerpo de la invitación" },
];

function ColorPicker({
  label, hint, value, onChange,
}: {
  label: string; hint: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-9 h-9 rounded cursor-pointer border border-stone-200 p-0.5 bg-white shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-stone-700 leading-none">{label}</p>
        <p className="text-xs text-stone-400 mt-0.5">{hint}</p>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) onChange(e.target.value);
        }}
        className="w-20 border border-stone-200 rounded px-2 py-1 text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-stone-400"
      />
    </div>
  );
}

export default function EventSettingsTab({ event }: Props) {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState(event.cover_image ?? "");

  const [selectedTheme, setSelectedTheme] = useState<ThemeId>(event.style.theme ?? "elegant");
  const [primaryColor,   setPrimaryColor]   = useState(event.style.primaryColor   ?? "#2d4a22");
  const [secondaryColor, setSecondaryColor] = useState(event.style.secondaryColor ?? "#f5f0e8");
  const [accentColor,    setAccentColor]    = useState(event.style.accentColor    ?? "#c9a96e");
  const [textColor,      setTextColor]      = useState(event.style.textColor      ?? "#2c2c2c");
  const [fontFamily,     setFontFamily]     = useState(event.style.fontFamily     ?? "Cormorant Garamond");
  const [sealInitials,   setSealInitials]   = useState(event.style.sealInitials   ?? "");

  const isCustom    = selectedTheme === "custom";
  const isElegant   = selectedTheme === "elegant";

  function applyPreset(t: typeof PRESET_THEMES[number]) {
    setSelectedTheme(t.id);
    setPrimaryColor(t.primary);
    setSecondaryColor(t.secondary);
    setAccentColor(t.accent);
    setTextColor(t.textColor);
    setFontFamily(t.font);
  }

  const colorValues: Record<string, string> = {
    primaryColor, secondaryColor, accentColor, textColor,
  };
  const colorSetters: Record<string, (v: string) => void> = {
    primaryColor: setPrimaryColor,
    secondaryColor: setSecondaryColor,
    accentColor: setAccentColor,
    textColor: setTextColor,
  };

  const { register, handleSubmit, formState: { isSubmitting } } =
    useForm<FormValues>({
      defaultValues: {
        name:         event.name,
        date:         event.date.slice(0, 16),
        location:     event.location ?? "",
        description:  event.description ?? "",
        is_published: event.is_published,
      },
    });

  async function onSubmit(values: FormValues) {
    const style: EventStyle = {
      theme: selectedTheme,
      primaryColor,
      secondaryColor,
      accentColor,
      textColor,
      fontFamily,
      ...(isElegant && sealInitials.trim()
        ? { sealInitials: sealInitials.trim().slice(0, 2) }
        : {}),
    };
    const res = await fetch(`/api/events/${event.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, cover_image: coverImage || null, style }),
    });
    if (!res.ok) { toast.error("Error al guardar"); return; }
    toast.success("Guardado");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-5 bg-white border border-stone-200 rounded p-6">

      {/* ── Basic info ── */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Nombre</label>
        <input {...register("name")} className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Fecha y hora</label>
        <input type="datetime-local" {...register("date")} className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Lugar</label>
        <input {...register("location")} className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Descripción</label>
        <textarea {...register("description")} rows={3} className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500 resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">Imagen de portada</label>
        <ImageUpload value={coverImage} onChange={setCoverImage} onRemove={() => setCoverImage("")} folder="covers" label="Subir imagen de portada" aspectRatio="cover" />
      </div>

      {/* ── Style section ── */}
      <div className="border-t border-stone-100 pt-5 space-y-5">
        <p className="text-sm font-medium text-stone-700">Estilo de la invitación</p>

        {/* Preset themes */}
        <div>
          <p className="text-xs text-stone-500 mb-2 tracking-wide uppercase">Temas predefinidos</p>
          <div className="grid grid-cols-5 gap-2">
            {PRESET_THEMES.map((t) => {
              const active = selectedTheme === t.id;
              return (
                <button key={t.id} type="button" onClick={() => applyPreset(t)}
                  className={`rounded overflow-hidden border-2 transition-all text-center ${active ? "border-stone-800 shadow-md" : "border-stone-200 hover:border-stone-400"}`}
                >
                  <div className="h-10 flex items-center justify-center" style={{ backgroundColor: t.secondary }}>
                    <div className="w-5 h-5 rounded-full border-2" style={{ backgroundColor: t.secondary, borderColor: t.primary, boxShadow: `inset 0 0 0 3px ${t.primary}` }} />
                  </div>
                  <div className="py-1.5 px-1 bg-white">
                    <span className="text-xs text-stone-600">{t.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom option */}
        <button
          type="button"
          onClick={() => setSelectedTheme("custom")}
          className={`w-full flex items-center gap-3 border-2 rounded px-4 py-3 transition-all ${isCustom ? "border-stone-800 bg-stone-50" : "border-stone-200 hover:border-stone-400"}`}
        >
          <div className="w-7 h-7 rounded-full shrink-0 border border-stone-200" style={{
            background: "conic-gradient(#e57373, #f4b942, #66bb6a, #42a5f5, #ab47bc, #e57373)",
          }} />
          <div className="text-left">
            <p className="text-sm font-medium text-stone-700">Personalizado</p>
            <p className="text-xs text-stone-400">Elige cada color por separado</p>
          </div>
          {isCustom && <span className="ml-auto text-stone-800 text-xs font-medium">Activo</span>}
        </button>

        {/* Wax seal initials — only for elegant template */}
        {isElegant && (
          <div className="rounded border border-[#c9a96e] bg-[#f5f0e8] p-4 space-y-2">
            <label className="block text-sm font-medium text-[#2d4a22]">
              Iniciales del sello de cera
            </label>
            <p className="text-xs text-[#5a7a4a]">
              Hasta 2 iniciales en cursiva sobre el sello dorado del sobre.
            </p>
            <div className="flex items-center gap-3">
              <input
                value={sealInitials}
                onChange={(e) => setSealInitials(e.target.value.slice(0, 2))}
                maxLength={2}
                placeholder="AB"
                className="w-20 border border-[#c9a96e] rounded px-3 py-2 text-sm text-center uppercase focus:outline-none focus:ring-1 focus:ring-[#2d4a22] bg-white tracking-widest"
              />
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-md shrink-0"
                style={{ backgroundColor: "#c9a96e", boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
              >
                <span style={{ fontFamily: "Great Vibes, cursive", fontSize: 15, color: "#142209" }}>
                  {sealInitials.trim().slice(0, 2) || "AB"}
                </span>
              </div>
              <p className="text-xs text-stone-400">Vista previa</p>
            </div>
          </div>
        )}

        {/* Live preview strip */}
        <div className="rounded overflow-hidden border border-stone-100">
          <div className="px-4 py-4 flex items-center gap-3" style={{ backgroundColor: secondaryColor }}>
            <div className="w-8 h-8 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} />
            <div>
              <p className="text-base leading-tight" style={{ fontFamily, color: primaryColor }}>
                Nombre del Evento
              </p>
              <p className="text-xs mt-0.5" style={{ color: accentColor }}>
                Sábado, 10 de Mayo de 2026
              </p>
            </div>
          </div>
          <div className="px-4 py-3 border-t" style={{ backgroundColor: secondaryColor, borderColor: accentColor }}>
            <p className="text-sm" style={{ color: textColor, fontFamily }}>
              Con mucha alegría los invitamos a compartir este momento especial.
            </p>
            <div className="mt-3 inline-block px-4 py-1.5 rounded text-white text-xs" style={{ backgroundColor: primaryColor }}>
              Confirmar asistencia
            </div>
          </div>
        </div>

        {/* Color pickers */}
        <div className="space-y-3 bg-stone-50 rounded border border-stone-100 p-4">
          <p className="text-xs text-stone-500 tracking-wide uppercase mb-1">
            {isCustom ? "Colores personalizados" : "Ajustar colores del tema"}
          </p>
          {COLOR_FIELDS.map(({ key, label, hint }) => (
            <ColorPicker
              key={key}
              label={label}
              hint={hint}
              value={colorValues[key]}
              onChange={colorSetters[key]}
            />
          ))}
          {!isCustom && (
            <button
              type="button"
              onClick={() => {
                const preset = PRESET_THEMES.find(t => t.id === selectedTheme);
                if (preset) {
                  setPrimaryColor(preset.primary);
                  setSecondaryColor(preset.secondary);
                  setAccentColor(preset.accent);
                  setTextColor(preset.textColor);
                }
              }}
              className="text-xs text-stone-400 hover:text-stone-700 underline mt-1"
            >
              Restablecer colores del tema
            </button>
          )}
        </div>

        {/* Font picker */}
        <div className="space-y-2">
          <p className="text-xs text-stone-500 tracking-wide uppercase">Tipografía</p>
          {FONTS.map((f) => (
            <label key={f.value} className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="font" value={f.value} checked={fontFamily === f.value}
                     onChange={() => setFontFamily(f.value)} className="accent-stone-800" />
              <span style={{ fontFamily: f.value, fontSize: "1.15rem", color: primaryColor }}>Aa</span>
              <span className="text-sm text-stone-600 group-hover:text-stone-800 transition-colors">{f.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Publish */}
      <label className="flex items-center gap-2 cursor-pointer border-t border-stone-100 pt-4">
        <input type="checkbox" {...register("is_published")} className="w-4 h-4" />
        <span className="text-sm text-stone-700">Publicar evento (invitaciones accesibles)</span>
      </label>

      <button type="submit" disabled={isSubmitting}
              className="w-full bg-stone-800 text-white py-2.5 text-sm hover:bg-stone-700 transition-colors disabled:opacity-50">
        {isSubmitting ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
