import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") return null;
  return profile;
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, eventId } = await req.json();
  if (!userId || !eventId) {
    return NextResponse.json({ error: "userId and eventId required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const ssrClient = await createClient();
  const { data: { user } } = await ssrClient.auth.getUser();

  const { error } = await supabase
    .from("event_assignments")
    .insert({ event_id: eventId, user_id: userId, assigned_by: user?.id ?? null });

  if (error && error.code !== "23505") { // ignore duplicate
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, eventId } = await req.json();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("event_assignments")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
