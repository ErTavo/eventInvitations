import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/supabase/profile";
import UserManagement from "@/components/dashboard/admin/UserManagement";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") redirect("/dashboard");

  const supabase = createAdminClient();

  const [{ data: profiles }, { data: events }] = await Promise.all([
    supabase.from("profiles").select("id, name, role").order("role"),
    supabase.from("events").select("id, name, date, slug").order("date"),
  ]);

  // Get all assignments
  const { data: assignments } = await supabase
    .from("event_assignments")
    .select("event_id, user_id");

  return (
    <UserManagement
      profiles={(profiles ?? []) as { id: string; name: string | null; role: string }[]}
      events={(events ?? []) as { id: string; name: string; date: string; slug: string }[]}
      assignments={(assignments ?? []) as { event_id: string; user_id: string }[]}
    />
  );
}
