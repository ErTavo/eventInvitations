import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Plus, CalendarDays, Users, Eye, EyeOff } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createAdminClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  const counts: Record<string, number> = {};
  if (events?.length) {
    const { data: participantCounts } = await supabase
      .from("participants")
      .select("event_id")
      .in("event_id", events.map((e) => e.id));
    participantCounts?.forEach((p) => {
      counts[p.event_id] = (counts[p.event_id] ?? 0) + 1;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-stone-800" style={{ fontFamily: "Cormorant Garamond, serif" }}>
          Mis Eventos
        </h1>
        <Link
          href="/dashboard/events/new"
          className="flex items-center gap-2 bg-stone-800 text-white px-4 py-2 text-sm hover:bg-stone-700 transition-colors"
        >
          <Plus size={16} />
          Nuevo Evento
        </Link>
      </div>

      {!events?.length ? (
        <div className="bg-white border border-stone-200 rounded p-12 text-center">
          <CalendarDays className="mx-auto text-stone-300 mb-4" size={48} />
          <p className="text-stone-500 mb-4">No tienes eventos aún</p>
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
            const count = counts[event.id] ?? 0;
            return (
              <Link
                key={event.id}
                href={`/dashboard/events/${event.id}`}
                className="bg-white border border-stone-200 rounded p-5 hover:shadow-md transition-shadow group"
              >
                {event.cover_image && (
                  <div
                    className="w-full h-32 bg-cover bg-center rounded mb-4 opacity-80 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundImage: `url(${event.cover_image})` }}
                  />
                )}
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-medium text-stone-800 leading-tight" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                    {event.name}
                  </h2>
                  {event.is_published ? (
                    <Eye size={16} className="text-green-600 shrink-0 mt-1" />
                  ) : (
                    <EyeOff size={16} className="text-stone-400 shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-stone-500 text-sm mt-1">
                  {formatDate(event.date)}
                </p>
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
