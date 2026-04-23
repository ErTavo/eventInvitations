"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface Props {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
  label?: string;
  aspectRatio?: "cover" | "square" | "free";
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  folder = "general",
  label = "Subir imagen",
  aspectRatio = "cover",
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("La imagen no debe superar 10 MB");
      return;
    }

    setUploading(true);
    try {
      // Delete previous image if it came from our storage
      if (value?.includes("/storage/v1/object/public/event-images/")) {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: value }),
        });
      }

      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Error al subir");
      }
      const { url } = await res.json();
      onChange(url);
      toast.success("Imagen subida");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al subir imagen");
    } finally {
      setUploading(false);
    }
  }

  function handleFiles(files: FileList | null) {
    if (files?.[0]) uploadFile(files[0]);
  }

  const heightClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "cover"
      ? "h-44"
      : "h-32";

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative w-full rounded border-2 border-dashed transition-colors overflow-hidden",
          heightClass,
          dragOver
            ? "border-stone-500 bg-stone-100"
            : "border-stone-300 bg-stone-50 hover:border-stone-400",
          uploading && "pointer-events-none opacity-60"
        )}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => !uploading && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt="preview"
              fill
              className="object-cover"
              sizes="600px"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-xs font-medium tracking-wide">
                Cambiar imagen
              </p>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-400">
            {uploading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <>
                <Upload size={24} />
                <p className="text-xs text-center px-4">
                  {label}
                  <br />
                  <span className="text-stone-300">JPG, PNG, WebP · máx 10 MB</span>
                </p>
              </>
            )}
          </div>
        )}

        {uploading && value && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 size={28} className="text-white animate-spin" />
          </div>
        )}
      </div>

      {value && onRemove && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
        >
          <X size={13} />
          Eliminar imagen
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
