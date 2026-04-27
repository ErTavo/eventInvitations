import Link from "next/link";
import { CalendarDays, LogOut, Shield, Users } from "lucide-react";
import { getCurrentProfile } from "@/lib/supabase/profile";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CalendarDays className="text-stone-700" size={22} />
          <Link
            href="/dashboard"
            className="text-xl font-semibold text-stone-800"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Event Invitations
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Admin panel link */}
          {profile?.role === "admin" && (
            <Link
              href="/dashboard/admin/users"
              className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors"
            >
              <Users size={14} />
              Usuarios
            </Link>
          )}

          {/* Role badge */}
          {profile?.role === "admin" && (
            <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              <Shield size={11} />
              Admin
            </span>
          )}

          {/* User name */}
          <span className="text-sm text-stone-600 hidden sm:block truncate max-w-40">
            {profile?.name ?? "Usuario"}
          </span>

          {/* Sign out */}
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
