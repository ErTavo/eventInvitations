"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { EventStyle, ThemeId } from "@/lib/supabase/types";
import ImageUpload from "@/components/ui/ImageUpload";

const THEMES: {
  id: ThemeId;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  textColor: string;
}[] = [
  { id: "vintage", label: "Vintage",   primary: "#8b6c42", secondary: "#fdf6ec", accent: "#c9a96e", textColor: "#5a4030" },
  { id: "elegant", label: "Elegante",  primary: "#2d4a22", secondary: "#f5f0e8", accent: "#c9a96e", textColor: "#2c2c2c" },
  { id: "modern",  label: "Moderno",   primary: "#9b5de5", secondary: "#ffffff", accent: "#c490f5", textColor: "#2d2d45" },
  { id: "floral",  label: "Floral",    primary: "#c2547a", secondary: "#fff9fb", accent: "#f4a5be", textColor: "#5a2a3d" },
  { id: "minimal", label: "Minimal",   primary: "#2d2d2d", secondary: "#ffffff", accent: "#888888", textColor: "#444444" },
];

interface FormValues {
  name: string;
  date: string;
  location: string;
  description: string;
  theme: ThemeId;
  sealInitials: string;
}

export default function EventForm() {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState("");
  const { register, handleSubmit, watch, formState: { isSubmitting } } =
    useForm<FormValues>({ defaultValues: { theme: "elegant", sealInitials: "" } });

  const selectedTheme = watch("theme");
  const isElegant     = selectedTheme === "elegant";

  async function onSubmit(values: FormValues) {
    const themeData = THEMES.find((t) => t.id === values.theme)!;
    const style: EventStyle = {
      theme:          values.theme,
      primaryColor:   themeData.primary,
      secondaryColor: themeData.secondary ?? "#fafaf8",
      accentColor:    themeData.accent    ?? themeData.primary,
      textColor:      themeData.textColor ?? "#444444",
      fontFamily:     "Cormorant Garamond",
      ...(isElegant && values.sealInitials.trim()
        ? { sealInitials: values.sealInitials.trim().slice(0, 2) }
        : {}),
    };

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, cover_image: coverImage || null, style }),
    });

    if (!res.ok) {
      toast.error("Error al crear el evento");
      return;
    }

    const event = await res.json();
    toast.success("Evento creado");
    router.push(`/dashboard/events/${event.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white border border-stone-200 rounded p-6">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Nombre del evento *
        </label>
        <input
          {...register("name", { required: true })}
          className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"
          placeholder="Boda de Ana & Carlos"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Fecha y hora *
        </label>
        <input
          type="datetime-local"
          {...register("date", { required: true })}
          className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Lugar
        </label>
        <input
          {...register("location")}
          className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"
          placeholder="Salón Las Flores, Ciudad de Guatemala"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Descripción
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500 resize-none"
          placeholder="Con mucha alegría los invitamos a..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Imagen de portada
        </label>
        <ImageUpload
          value={coverImage}
          onChange={setCoverImage}
          onRemove={() => setCoverImage("")}
          folder="covers"
          label="Subir imagen de portada"
          aspectRatio="cover"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-3">
          Tema / Diseño
        </label>
        <div className="grid grid-cols-5 gap-2">
          {THEMES.map((theme) => (
            <label key={theme.id} className="cursor-pointer">
              <input
                type="radio"
                value={theme.id}
                {...register("theme")}
                className="sr-only"
              />
              <div
                className={`rounded p-2 text-center border-2 transition-all ${
                  selectedTheme === theme.id
                    ? "border-stone-800 shadow-md"
                    : "border-stone-200 hover:border-stone-400"
                }`}
              >
                {/* Swatch shows both the primary and secondary color */}
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-1 border-2"
                  style={{
                    backgroundColor: theme.secondary,
                    borderColor: theme.primary,
                    boxShadow: `inset 0 0 0 4px ${theme.primary}`,
                  }}
                />
                <span className="text-xs text-stone-600">{theme.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Sello de cera — solo visible para el tema Elegante */}
      {isElegant && (
        <div className="rounded border border-[#c9a96e] bg-[#f5f0e8] p-4 space-y-2">
          <label className="block text-sm font-medium text-[#2d4a22]">
            Iniciales del sello de cera
          </label>
          <p className="text-xs text-[#5a7a4a]">
            Escribe hasta 2 iniciales en cursiva que aparecerán en el sello dorado del sobre.
            Ejemplo: <span style={{ fontFamily: "Great Vibes, cursive" }} className="text-base text-[#2d4a22]">AC</span>
          </p>
          <div className="flex items-center gap-3">
            <input
              {...register("sealInitials")}
              maxLength={2}
              placeholder="AB"
              className="w-20 border border-[#c9a96e] rounded px-3 py-2 text-sm text-center uppercase focus:outline-none focus:ring-1 focus:ring-[#2d4a22] bg-white tracking-widest"
            />
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-md shrink-0"
              style={{ backgroundColor: "#c9a96e", boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
            >
              <span style={{ fontFamily: "Great Vibes, cursive", fontSize: 15, color: "#142209" }}>
                {watch("sealInitials")?.trim().slice(0, 2) || "AB"}
              </span>
            </div>
            <p className="text-xs text-stone-400">Vista previa del sello</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-stone-800 text-white py-2.5 text-sm hover:bg-stone-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Creando..." : "Crear Evento"}
      </button>
    </form>
  );
}
