import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "event-images";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "general";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const isImage = file.type.startsWith("image/");
  const isAudio = file.type.startsWith("audio/");

  if (!isImage && !isAudio) {
    return NextResponse.json({ error: "Solo se permiten imágenes y audio" }, { status: 400 });
  }

  const maxSize = isAudio ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: `El archivo supera el límite de ${isAudio ? "50" : "10"} MB` },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? (isAudio ? "mp3" : "jpg");
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = adminClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return NextResponse.json({ url: data.publicUrl }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "No url" }, { status: 400 });

  // Extract path from URL: .../storage/v1/object/public/event-images/PATH
  const marker = `/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return NextResponse.json({ ok: true });

  const path = url.slice(idx + marker.length);
  const supabase = adminClient();
  await supabase.storage.from(BUCKET).remove([path]);
  return NextResponse.json({ ok: true });
}
