import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "event-images";
const STORAGE_MARKER = `/object/public/${BUCKET}/`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adminClient() {
  return createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function extractPath(url: string | null | undefined): string | null {
  if (!url) return null;
  const idx = url.indexOf(STORAGE_MARKER);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + STORAGE_MARKER.length));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const supabase = adminClient();

  const { data, error } = await supabase
    .from("events")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = adminClient();

  // 1. Collect all storage paths to delete
  const storagePaths: string[] = [];

  // Cover image
  const { data: event } = await supabase
    .from("events")
    .select("cover_image")
    .eq("id", id)
    .single();

  const coverPath = extractPath(event?.cover_image);
  if (coverPath) storagePaths.push(coverPath);

  // Module files (carousel images, gallery images, music)
  const { data: modules } = await supabase
    .from("modules")
    .select("type, config")
    .eq("event_id", id);

  for (const mod of modules ?? []) {
    const cfg = mod.config as Record<string, unknown>;
    if (mod.type === "music") {
      const p = extractPath(cfg.musicUrl as string);
      if (p) storagePaths.push(p);
    }
    if (mod.type === "carousel" || mod.type === "gallery") {
      const images = (cfg.images as string[]) ?? [];
      for (const img of images) {
        const p = extractPath(img);
        if (p) storagePaths.push(p);
      }
    }
  }

  // 2. Delete storage files (ignore errors — files may not exist)
  if (storagePaths.length > 0) {
    await supabase.storage.from(BUCKET).remove(storagePaths);
  }

  // 3. Delete event — modules and participants cascade via FK
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, deletedFiles: storagePaths.length });
}
