import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adminClient() { return createClient<any>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!); }

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { event_id, name, companions } = body;

  if (!event_id || !name) {
    return NextResponse.json({ error: "event_id and name required" }, { status: 400 });
  }

  const supabase = adminClient();
  const { data, error } = await supabase
    .from("participants")
    .insert({ event_id, name, companions: companions ?? 0 })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
