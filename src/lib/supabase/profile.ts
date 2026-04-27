import { createClient } from "./server";
import { createAdminClient } from "./admin";

export interface Profile {
  id: string;
  name: string | null;
  role: "admin" | "user";
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id, name, role")
    .eq("id", user.id)
    .single();

  return data as Profile | null;
}
