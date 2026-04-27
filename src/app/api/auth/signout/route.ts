import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const loginUrl = new URL("/dashboard/login", req.url);
  return NextResponse.redirect(loginUrl);
}
