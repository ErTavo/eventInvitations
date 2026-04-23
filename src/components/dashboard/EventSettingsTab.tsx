"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { Event } from "@/lib/supabase/types";
import ImageUpload from "@/components/ui/ImageUpload";

interface Props { event: Event }

interface FormValues {
  name: string;
  date: string;
  location: string;
  description: string;
  is_published: boolean;
}

export default function EventSettingsTab({ event }: Props) {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState(event.cover_image ?? "");
  const { register, handleSubmit, formState: { isSubmitting } } =
    useForm<FormValues>({
      defaultValues: {
        name: event.name,
        date: event.date.slice(0, 16),
        location: event.location ?? "",
        description: event.description ?? "",
        is_published: event.is_published,
      },
    });

  async function onSubmit(values: FormValues) {
    const res = await fetch(`/api/events/${event.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, cover_image: coverImage || null }),
    });
    if (!res.ok) { toast.error("Error al guardar"); return; }
    toast.success("Guardado");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4 bg-white border border-stone-200 rounded p-6">
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
        <ImageUpload
          value={coverImage}
          onChange={setCoverImage}
          onRemove={() => setCoverImage("")}
          folder="covers"
          label="Subir imagen de portada"
          aspectRatio="cover"
        />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" {...register("is_published")} className="w-4 h-4" />
        <span className="text-sm text-stone-700">Publicar evento (invitaciones accesibles)</span>
      </label>
      <button type="submit" disabled={isSubmitting} className="bg-stone-800 text-white px-6 py-2 text-sm hover:bg-stone-700 transition-colors disabled:opacity-50">
        {isSubmitting ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
