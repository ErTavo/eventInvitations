import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const token_hash = searchParams.get("token_hash");
  const type       = searchParams.get("type") as "invite" | "recovery" | "signup" | null;
  const next       = searchParams.get("next") ?? "/dashboard";

  if (!token_hash || !type) {
    return NextResponse.redirect(new URL("/dashboard/login?error=invalid_link", req.url));
  }

  const res = NextResponse.redirect(new URL("/auth/update-password", req.url));

  const cookieMethods: CookieMethodsServer = {
    getAll: () => req.cookies.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach(({ name, value, options }) => {
        req.cookies.set(name, value);
        res.cookies.set(name, value, options);
      });
    },
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieMethods }
  );

  const { error } = await supabase.auth.verifyOtp({ token_hash, type });

  if (error) {
    return NextResponse.redirect(
      new URL(`/dashboard/login?error=link_expired`, req.url)
    );
  }

  // On invite/signup → ask user to set a password
  if (type === "invite" || type === "signup") {
    return NextResponse.redirect(new URL("/auth/update-password", req.url));
  }

  return NextResponse.redirect(new URL(next, req.url));
}
