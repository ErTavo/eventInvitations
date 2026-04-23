"use client";

import { useRef, useState } from "react";
import { Music, Upload, X, Loader2, Play, Pause } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface Props {
  value?: string;
  title?: string;
  onChange: (url: string, filename: string) => void;
  onRemove?: () => void;
  folder?: string;
  className?: string;
}

export default function AudioUpload({
  value,
  title,
  onChange,
  onRemove,
  folder = "audio",
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [uploading, setUploading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("audio/")) {
      toast.error("Solo se permiten archivos de audio (mp3, m4a, ogg, wav)");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("El audio no debe superar 50 MB");
      return;
    }

    setUploading(true);
    try {
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
      onChange(url, file.name.replace(/\.[^.]+$/, ""));
      toast.success("Audio subido");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al subir audio");
    } finally {
      setUploading(false);
    }
  }

  function handleFiles(files: FileList | null) {
    if (files?.[0]) uploadFile(files[0]);
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  if (value) {
    return (
      <div className={cn("flex items-center gap-3 bg-stone-50 border border-stone-200 rounded px-4 py-3", className)}>
        <audio
          ref={audioRef}
          src={value}
          onEnded={() => setPlaying(false)}
          preload="metadata"
        />
        <button
          type="button"
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-stone-800 text-white flex items-center justify-center shrink-0 hover:bg-stone-700 transition-colors"
        >
          {playing ? <Pause size={15} /> : <Play size={15} />}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-stone-700 truncate">
            {title || "Canción subida"}
          </p>
          <p className="text-xs text-stone-400 truncate">{value.split("/").pop()}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-xs text-stone-500 hover:text-stone-800 underline"
          >
            Cambiar
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-stone-300 hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="audio/mp3,audio/mpeg,audio/ogg,audio/wav,audio/x-m4a,audio/mp4,audio/aac"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded px-6 py-8 cursor-pointer transition-colors",
        dragOver ? "border-stone-500 bg-stone-100" : "border-stone-300 bg-stone-50 hover:border-stone-400",
        uploading && "pointer-events-none opacity-60",
        className
      )}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => !uploading && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
    >
      {uploading ? (
        <Loader2 size={28} className="text-stone-400 animate-spin" />
      ) : (
        <>
          <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center">
            <Music size={22} className="text-stone-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-stone-600 flex items-center gap-1.5">
              <Upload size={14} />
              Subir canción
            </p>
            <p className="text-xs text-stone-400 mt-1">MP3, M4A, OGG, WAV · máx 50 MB</p>
          </div>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="audio/mp3,audio/mpeg,audio/ogg,audio/wav,audio/x-m4a,audio/mp4,audio/aac"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
