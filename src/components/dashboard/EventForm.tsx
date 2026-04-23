"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { EventStyle, ThemeId } from "@/lib/supabase/types";
import ImageUpload from "@/components/ui/ImageUpload";

const THEMES: { id: ThemeId; label: string; primary: string; secondary: string; accent: string; textColor: string }[] = [
  { id: "vintage", label: "Vintage",  primary: "#8b6c42", secondary: "#fdf6ec", accent: "#c9a96e", textColor: "#5a4030" },
  { id: "elegant", label: "Elegante", primary: "#b8974a", secondary: "#fafaf8", accent: "#d4b896", textColor: "#444444" },
  { id: "modern",  label: "Moderno",  primary: "#9b5de5", secondary: "#ffffff", accent: "#c490f5", textColor: "#2d2d45" },
  { id: "floral",  label: "Floral",   primary: "#c2547a", secondary: "#fff9fb", accent: "#f4a5be", textColor: "#5a2a3d" },
  { id: "minimal", label: "Minimal",  primary: "#2d2d2d", secondary: "#ffffff", accent: "#888888", textColor: "#444444" },
];

interface FormValues {
  name: string;
  date: string;
  location: string;
  description: string;
  theme: ThemeId;
}

export default function EventForm() {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState("");
  const { register, handleSubmit, watch, formState: { isSubmitting } } =
    useForm<FormValues>({ defaultValues: { theme: "elegant" } });

  const selectedTheme = watch("theme");

  async function onSubmit(values: FormValues) {
    const themeData = THEMES.find((t) => t.id === values.theme)!;
    const style: EventStyle = {
      theme: values.theme,
      primaryColor:   themeData.primary,
      secondaryColor: themeData.secondary ?? "#fafaf8",
      accentColor:    themeData.accent    ?? themeData.primary,
      textColor:      themeData.textColor ?? "#444444",
      fontFamily:     "Cormorant Garamond",
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
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: theme.primary }}
                />
                <span className="text-xs text-stone-600">{theme.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

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
