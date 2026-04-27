import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { Plus, CalendarDays, Users, Eye, EyeOff } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [profile, supabaseUser] = await Promise.all([
    getCurrentProfile(),
    createClient().then((s) => s.auth.getUser()),
  ]);

  const userId = supabaseUser.data.user?.id;
  const isAdmin = profile?.role === "admin";
  const supabase = createAdminClient();

  let events: Record<string, unknown>[] = [];

  if (isAdmin) {
    // Admin sees all events
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });
    events = (data ?? []) as Record<string, unknown>[];
  } else if (userId) {
    // Regular user: events they created OR are assigned to
    const [{ data: created }, { data: assigned }] = await Promise.all([
      supabase.from("events").select("*").eq("created_by", userId),
      supabase
        .from("event_assignments")
        .select("event_id")
        .eq("user_id", userId),
    ]);

    const assignedIds = (assigned ?? []).map((a) => (a as { event_id: string }).event_id);
    const createdIds  = (created ?? []).map((e) => (e as { id: string }).id);
    const allIds      = [...new Set([...createdIds, ...assignedIds])];

    if (allIds.length > 0) {
      const { data } = await supabase
        .from("events")
        .select("*")
        .in("id", allIds)
        .order("date", { ascending: true });
      events = (data ?? []) as Record<string, unknown>[];
    }
  }

  // Participant counts
  const counts: Record<string, number> = {};
  if (events.length > 0) {
    const { data: participantCounts } = await supabase
      .from("participants")
      .select("event_id")
      .in("event_id", events.map((e) => (e as { id: string }).id));
    participantCounts?.forEach((p) => {
      const pid = (p as { event_id: string }).event_id;
      counts[pid] = (counts[pid] ?? 0) + 1;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className="text-3xl text-stone-800"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          {isAdmin ? "Todos los Eventos" : "Mis Eventos"}
        </h1>
        <Link
          href="/dashboard/events/new"
          className="flex items-center gap-2 bg-stone-800 text-white px-4 py-2 text-sm hover:bg-stone-700 transition-colors"
        >
          <Plus size={16} />
          Nuevo Evento
        </Link>
      </div>

      {!events.length ? (
        <div className="bg-white border border-stone-200 rounded p-12 text-center">
          <CalendarDays className="mx-auto text-stone-300 mb-4" size={48} />
          <p className="text-stone-500 mb-4">
            {isAdmin
              ? "No hay eventos aún"
              : "No tienes eventos asignados o creados aún"}
          </p>
          <Link
            href="/dashboard/events/new"
            className="inline-flex items-center gap-2 bg-stone-800 text-white px-6 py-2 text-sm hover:bg-stone-700 transition-colors"
          >
            <Plus size={16} />
            Crear primer evento
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const ev = event as {
              id: string; name: string; date: string;
              cover_image: string | null; is_published: boolean;
              slug: string;
            };
            const count = counts[ev.id] ?? 0;
            return (
              <Link
                key={ev.id}
                href={`/dashboard/events/${ev.id}`}
                className="bg-white border border-stone-200 rounded p-5 hover:shadow-md transition-shadow group"
              >
                {ev.cover_image && (
                  <div
                    className="w-full h-32 bg-cover bg-center rounded mb-4 opacity-80 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundImage: `url(${ev.cover_image})` }}
                  />
                )}
                <div className="flex items-start justify-between gap-2">
                  <h2
                    className="text-lg font-medium text-stone-800 leading-tight"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {ev.name}
                  </h2>
                  {ev.is_published ? (
                    <Eye size={16} className="text-green-600 shrink-0 mt-1" />
                  ) : (
                    <EyeOff size={16} className="text-stone-400 shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-stone-500 text-sm mt-1">{formatDate(ev.date)}</p>
                <div className="flex items-center gap-1 mt-3 text-stone-400 text-xs">
                  <Users size={13} />
                  <span>{count} invitados</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
