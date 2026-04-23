import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase
    .from("participants")
    .update({ invitation_viewed: true, invitation_viewed_at: new Date().toISOString() })
    .eq("id", id)
    .eq("invitation_viewed", false);

  return NextResponse.json({ ok: true });
}
