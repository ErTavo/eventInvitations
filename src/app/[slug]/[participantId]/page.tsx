import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import InvitationPage from "@/components/invitation/InvitationPage";
import type { Event, Participant } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function PublicInvitationPage({
  params,
}: {
  params: Promise<{ slug: string; participantId: string }>;
}) {
  const { slug, participantId } = await params;
  const supabase = await createClient();

  const [eventResult, participantResult] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single(),
    supabase
      .from("participants")
      .select("*")
      .eq("id", participantId)
      .single(),
  ]);

  const event = eventResult.data as Event | null;
  const participant = participantResult.data as Participant | null;

  if (!event || !participant || participant.event_id !== event.id) notFound();

  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("event_id", event.id)
    .eq("is_active", true)
    .order("order");

  return (
    <InvitationPage
      event={event}
      participant={participant}
      modules={modules ?? []}
    />
  );
}
