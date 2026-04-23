import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EventTabs from "@/components/dashboard/EventTabs";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: event }, { data: modules }, { data: participants }] =
    await Promise.all([
      supabase.from("events").select("*").eq("id", id).single(),
      supabase.from("modules").select("*").eq("event_id", id).order("order"),
      supabase
        .from("participants")
        .select("*")
        .eq("event_id", id)
        .order("created_at", { ascending: false }),
    ]);

  if (!event) notFound();

  return (
    <EventTabs
      event={event}
      modules={modules ?? []}
      participants={participants ?? []}
    />
  );
}
