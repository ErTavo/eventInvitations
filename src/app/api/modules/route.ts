import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adminClient() {
  return createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { event_id, type, order, config } = body;

  if (!event_id || !type) {
    return NextResponse.json({ error: "event_id and type are required" }, { status: 400 });
  }

  const supabase = adminClient();

  const { data, error } = await supabase
    .from("modules")
    .insert({
      event_id,
      type,
      is_active: true,
      order: order ?? 99,
      config: config ?? {},
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
