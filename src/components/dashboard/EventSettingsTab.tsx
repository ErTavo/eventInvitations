"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { Event, EventStyle, ThemeId, EventType } from "@/lib/supabase/types";
type RibbonStyle = "classic" | "crossed" | "minimal" | "floral" | "romantic" | "luxury";
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
  badge?: string;
}[] = [
  { id: "vintage",  label: "Vintage",  primary: "#8b6c42", secondary: "#fdf6ec", accent: "#c9a96e", textColor: "#5a4030", font: "Cormorant Garamond" },
  { id: "elegant",  label: "Elegante", primary: "#2d4a22", secondary: "#f5f0e8", accent: "#c9a96e", textColor: "#2c2c2c", font: "Cormorant Garamond" },
  { id: "leaves",   label: "Hojas",    primary: "#2c5f2e", secondary: "#f8f5ef", accent: "#a8c890", textColor: "#2c2c2c", font: "Cormorant Garamond", badge: "Nuevo" },
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
  const [sealTextColor,  setSealTextColor]  = useState(event.style.sealTextColor  ?? "");
  const [eventType,      setEventType]      = useState<EventType>(event.style.eventType ?? "general");
  const [person1Name,    setPerson1Name]    = useState(event.style.person1Name   ?? "");
  const [person2Name,    setPerson2Name]    = useState(event.style.person2Name   ?? "");
  const [greetingText,   setGreetingText]   = useState(event.style.greetingText  ?? "");

  const [ribbonStyle, setRibbonStyle] = useState<RibbonStyle>((event.style.ribbonStyle as RibbonStyle) ?? "classic");

  const isCustom    = selectedTheme === "custom";
  const isElegant   = selectedTheme === "elegant";
  const isLeaves    = selectedTheme === "leaves";
  const isWedding   = eventType === "wedding";
  const showSeal    = isElegant || isLeaves; // themes that use the wax seal

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
      eventType,
      ...(person1Name.trim()  ? { person1Name:  person1Name.trim()  } : {}),
      ...(person2Name.trim()  ? { person2Name:  person2Name.trim()  } : {}),
      ...(greetingText.trim() ? { greetingText: greetingText.trim() } : {}),
      ribbonStyle,
      ...(showSeal && sealInitials.trim()   ? { sealInitials: sealInitials.trim().slice(0, 2) } : {}),
      ...(showSeal && sealTextColor.trim() ? { sealTextColor: sealTextColor.trim() } : {}),
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

      {/* ── Event type ── */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">Tipo de evento</label>
        <div className="grid grid-cols-4 gap-2">
          {([
            { id: "general",     label: "General",     emoji: "🎉" },
            { id: "wedding",     label: "Boda",        emoji: "💍" },
            { id: "quinceanera", label: "Quinceaños",  emoji: "👑" },
            { id: "birthday",    label: "Cumpleaños",  emoji: "🎂" },
          ] as { id: EventType; label: string; emoji: string }[]).map((t) => (
            <button key={t.id} type="button" onClick={() => setEventType(t.id)}
              className={`rounded border-2 py-2 text-center transition-all ${eventType === t.id ? "border-stone-800 bg-stone-50 shadow-sm" : "border-stone-200 hover:border-stone-400"}`}>
              <p className="text-lg">{t.emoji}</p>
              <p className="text-xs text-stone-600 mt-0.5">{t.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Wedding names */}
      {isWedding && (
        <div className="bg-stone-50 border border-stone-200 rounded p-4 space-y-3">
          <p className="text-xs text-stone-500 tracking-wide uppercase">Nombres de la pareja</p>
          <p className="text-xs text-stone-400">Se mostrarán en la invitación con un &amp; entre ellos, en lugar del nombre del evento.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Novia / Persona 1</label>
              <input value={person1Name} onChange={(e) => setPerson1Name(e.target.value)}
                placeholder="Ana García"
                className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Novio / Persona 2</label>
              <input value={person2Name} onChange={(e) => setPerson2Name(e.target.value)}
                placeholder="Carlos López"
                className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500" />
            </div>
          </div>
          {/* Live preview */}
          {(person1Name || person2Name) && (
            <div className="text-center pt-1 pb-2">
              <p className="text-2xl" style={{ fontFamily: "Great Vibes, cursive", color: primaryColor }}>
                {person1Name || "Novia"}
              </p>
              <p className="text-xl font-light" style={{ color: accentColor }}>&amp;</p>
              <p className="text-2xl" style={{ fontFamily: "Great Vibes, cursive", color: primaryColor }}>
                {person2Name || "Novio"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Basic info ── */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Saludo de la invitación</label>
        <input
          value={greetingText}
          onChange={(e) => setGreetingText(e.target.value)}
          className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"
          placeholder='Estimado/a  (por defecto)'
        />
        <p className="text-xs text-stone-400 mt-1">Aparece antes del nombre del invitado. Ej: "Con mucha alegría te invitamos", "Es un honor contar con tu presencia"</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Nombre del evento</label>
        <input {...register("name")} className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500" />
        {isWedding && <p className="text-xs text-stone-400 mt-1">Se usa en el dashboard y URL. En la invitación se muestran los nombres de la pareja.</p>}
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
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PRESET_THEMES.map((t) => {
              const active = selectedTheme === t.id;
              return (
                <button key={t.id} type="button" onClick={() => applyPreset(t)}
                  className={`rounded overflow-hidden border-2 transition-all text-center relative ${active ? "border-stone-800 shadow-md" : "border-stone-200 hover:border-stone-400"}`}
                >
                  {t.badge && (
                    <span className="absolute top-0.5 right-0.5 text-[9px] bg-emerald-500 text-white px-1 rounded-sm leading-4">
                      {t.badge}
                    </span>
                  )}
                  <div className="h-10 flex items-center justify-center" style={{ backgroundColor: t.secondary }}>
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.primary }} />
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

        {/* Wax seal initials — elegant and leaves templates */}
        {showSeal && (
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
            {/* Seal text color */}
            <div className="flex items-center gap-3 pt-1">
              <label className="text-xs font-medium text-stone-600 shrink-0">Color de las iniciales</label>
              <input
                type="color"
                value={sealTextColor || (selectedTheme === "leaves" ? "#2c5f2e" : "#142209")}
                onChange={(e) => setSealTextColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-stone-200 p-0.5 bg-white"
              />
              <input
                type="text"
                value={sealTextColor}
                onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setSealTextColor(e.target.value); }}
                placeholder="Auto"
                className="w-20 border border-stone-200 rounded px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
              {sealTextColor && (
                <button type="button" onClick={() => setSealTextColor("")}
                  className="text-xs text-stone-400 hover:text-stone-700 underline">
                  Auto
                </button>
              )}
            </div>
          </div>
        )}

        {/* Ribbon style picker */}
        {showSeal && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">Diseño del moño / listón</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: "classic",  label: "Clásico",   preview: "M16 20 C5 5 -5 4 2 14 C5 20 12 22 16 20Z M24 20 C35 5 45 4 38 14 C35 20 28 22 24 20Z" },
                { id: "crossed",  label: "Cruzado",   preview: "M4 0 L22 40 L26 40 L8 0Z M36 0 L14 40 L18 40 L40 0Z" },
                { id: "minimal",  label: "Minimal",   preview: "M0 19 L40 19 M0 21 L40 21 M6 20 C2 12 -2 11 2 17 C3 21 5 22 6 20Z M6 20 C2 28 -2 29 2 23Z M34 20 C38 12 42 11 38 17Z M34 20 C38 28 42 29 38 23Z" },
                { id: "floral",   label: "Floral",    preview: "M0 20 L40 20 M20 12 C17 8 12 9 15 13 C17 16 20 12 20 12 C20 12 23 16 25 13 C28 9 23 8 20 12Z M20 28 C17 32 12 31 15 27Z M20 28 C23 32 28 31 25 27Z" },
                { id: "romantic", label: "Romántico", preview: "M16 20 C12 12 2 14 6 19 C8 22 12 23 16 20Z M24 20 C28 12 38 14 34 19 C32 22 28 23 24 20Z M20 22 C20 19 14 15 14 18 C14 21 20 26 20 26 C20 26 26 21 26 18 C26 15 20 19 20 22Z" },
                { id: "luxury",   label: "Lujo",      preview: "M0 16 L40 16 M0 24 L40 24 M0 20 L40 20 M16 20 L4 2 L8 5 L18 20 L8 35 L4 38 Z M24 20 L36 2 L32 5 L22 20 L32 35 L36 38Z M13 14 L27 14 L27 26 L13 26Z" },
              ] as { id: RibbonStyle; label: string; preview: string }[]).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRibbonStyle(r.id)}
                  className={`rounded border-2 p-2 text-center transition-all ${
                    ribbonStyle === r.id ? "border-stone-800 shadow-sm bg-stone-50" : "border-stone-200 hover:border-stone-400"
                  }`}
                >
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mx-auto mb-1">
                    {r.id === "crossed" ? (
                      <>
                        <path d="M4 0 L22 40 L26 40 L8 0Z" fill={accentColor} opacity="0.7"/>
                        <path d="M36 0 L14 40 L18 40 L40 0Z" fill={accentColor} opacity="0.7"/>
                        <circle cx="20" cy="20" r="4" fill={accentColor} opacity="0.95"/>
                      </>
                    ) : r.id === "minimal" ? (
                      <>
                        <rect x="0" y="18" width="40" height="4" fill={accentColor} opacity="0.7" rx="2"/>
                        <path d="M7 20 C3 13 -1 12 1 17 C2 21 5 22 7 20Z" fill={accentColor} opacity="0.85"/>
                        <path d="M7 20 C3 27 -1 28 1 23Z" fill={accentColor} opacity="0.75"/>
                        <path d="M33 20 C37 13 41 12 39 17Z" fill={accentColor} opacity="0.85"/>
                        <path d="M33 20 C37 27 41 28 39 23Z" fill={accentColor} opacity="0.75"/>
                        <circle cx="20" cy="20" r="2.5" fill={accentColor}/>
                      </>
                    ) : r.id === "floral" ? (
                      <>
                        <rect x="0" y="18" width="40" height="4" fill={accentColor} opacity="0.6" rx="1"/>
                        {[0,60,120,180,240,300].map((deg,i)=>(
                          <ellipse key={i} cx={20+Math.cos(deg*Math.PI/180)*5} cy={20+Math.sin(deg*Math.PI/180)*5} rx="5" ry="3"
                                   fill={accentColor} opacity={0.65-i*0.05} transform={`rotate(${deg} ${20+Math.cos(deg*Math.PI/180)*5} ${20+Math.sin(deg*Math.PI/180)*5})`}/>
                        ))}
                        <circle cx="20" cy="20" r="2.5" fill={accentColor} opacity="0.9"/>
                      </>
                    ) : r.id === "romantic" ? (
                      // Teardrop loops + heart — matches full-size
                      <>
                        <rect x="0" y="19" width="40" height="4" fill={accentColor} opacity="0.62" rx="1"/>
                        {/* Left teardrop */}
                        <path d="M16 21 C15 13,9 3,5 5 C1 7,1 16,6 20 C9 23,14 24,16 21Z" fill={accentColor} opacity="0.75"/>
                        <path d="M16 21 C14 14,8 5,5 6" stroke="white" strokeWidth="0.8" opacity="0.25" fill="none"/>
                        {/* Right teardrop */}
                        <path d="M24 21 C25 13,31 3,35 5 C39 7,39 16,34 20 C31 23,26 24,24 21Z" fill={accentColor} opacity="0.75"/>
                        {/* Heart */}
                        <path d="M20 25 C19.8 23.5,17 21.5,17 23 C17 24.5,20 27,20 27 C20 27,23 24.5,23 23 C23 21.5,20.2 23.5,20 25Z" fill={accentColor} opacity="1"/>
                        <ellipse cx="18.5" cy="22.5" rx="1.2" ry="0.8" fill="white" opacity="0.35"/>
                      </>
                    ) : r.id === "luxury" ? (
                      // Angular fan-wing bow — matches full-size
                      <>
                        <rect x="0" y="15" width="40" height="10" fill={accentColor} opacity="0.68" rx="1"/>
                        <rect x="0" y="12" width="40" height="3"  fill={accentColor} opacity="0.4"  rx="1"/>
                        <rect x="0" y="25" width="40" height="3"  fill={accentColor} opacity="0.32" rx="1"/>
                        {/* Left top fan */}
                        <polygon points="14,20 0,1 5,3"   fill={accentColor} opacity="0.82"/>
                        <polygon points="14,20 5,3 9,7"   fill={accentColor} opacity="0.65"/>
                        <polygon points="14,20 9,7 12,11" fill={accentColor} opacity="0.5"/>
                        {/* Left bottom fan */}
                        <polygon points="14,20 0,39 5,37" fill={accentColor} opacity="0.82"/>
                        <polygon points="14,20 5,37 9,33" fill={accentColor} opacity="0.65"/>
                        {/* Right top fan */}
                        <polygon points="26,20 40,1 35,3"   fill={accentColor} opacity="0.82"/>
                        <polygon points="26,20 35,3 31,7"   fill={accentColor} opacity="0.65"/>
                        <polygon points="26,20 31,7 28,11" fill={accentColor} opacity="0.5"/>
                        {/* Right bottom fan */}
                        <polygon points="26,20 40,39 35,37" fill={accentColor} opacity="0.82"/>
                        <polygon points="26,20 35,37 31,33" fill={accentColor} opacity="0.65"/>
                        {/* Center knot */}
                        <rect x="13" y="13" width="14" height="14" fill={accentColor} opacity="0.95" rx="1"/>
                        <line x1="17" y1="14" x2="17" y2="26" stroke="white" strokeWidth="0.8" opacity="0.2"/>
                        <line x1="21" y1="14" x2="21" y2="26" stroke="white" strokeWidth="0.6" opacity="0.15"/>
                        <rect x="15" y="15" width="5" height="10" fill="white" opacity="0.15" rx="0.5"/>
                      </>
                    ) : (
                      // classic
                      <>
                        <rect x="0" y="18" width="40" height="6" fill={accentColor} opacity="0.7" rx="1"/>
                        <path d="M16 21 C8 6 -2 4 4 14 C7 20 12 23 16 21Z" fill={accentColor} opacity="0.8"/>
                        <path d="M24 21 C32 6 42 4 36 14 C33 20 28 23 24 21Z" fill={accentColor} opacity="0.8"/>
                        <ellipse cx="20" cy="21" rx="6" ry="5" fill={accentColor} opacity="0.95"/>
                        <ellipse cx="18" cy="19" rx="2" ry="1.2" fill="white" opacity="0.35"/>
                        <path d="M17 26 C14 32 11 38 14 40" stroke={accentColor} strokeWidth="4" strokeLinecap="round" opacity="0.75"/>
                        <path d="M23 26 C26 32 29 38 26 40" stroke={accentColor} strokeWidth="4" strokeLinecap="round" opacity="0.75"/>
                      </>
                    )}
                  </svg>
                  <span className="text-xs text-stone-600">{r.label}</span>
                </button>
              ))}
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
