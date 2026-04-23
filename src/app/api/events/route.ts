import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { slugify } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adminClient() { return createClient<any>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!); }

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, date, location, description, cover_image, style } = body;

  if (!name || !date) {
    return NextResponse.json({ error: "name and date are required" }, { status: 400 });
  }

  const supabase = adminClient();
  const slug = slugify(name) + "-" + Date.now().toString(36);

  const { data: event, error } = await supabase
    .from("events")
    .insert({ name, date, location, description, cover_image, style, slug })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Create default modules
  await supabase.rpc("create_default_modules", { p_event_id: event.id });

  return NextResponse.json(event, { status: 201 });
}
