import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import InvitationPage from "@/components/invitation/InvitationPage";
import InvitationUnavailable from "@/components/invitation/InvitationUnavailable";
import type { Event, Participant, Module } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

function previewParticipant(eventId: string): Participant {
  return {
    id: "preview",
    created_at: new Date().toISOString(),
    event_id: eventId,
    name: "Invitado de Muestra",
    companions: 1,
    attendance: "pending",
    notes: null,
    invitation_viewed: false,
    invitation_viewed_at: null,
  };
}

export default async function PublicInvitationPage({
  params,
}: {
  params: Promise<{ slug: string; participantId: string }>;
}) {
  const { slug, participantId } = await params;
  const isPreview = participantId === "preview";
  const supabase = createAdminClient();

  const eventResult = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  const event = eventResult.data as Event | null;
  if (!event) notFound();

  // Block access if event is not published (previews bypass this)
  if (!event.is_published && !isPreview) {
    return <InvitationUnavailable event={event} />;
  }

  let participant: Participant;

  if (isPreview) {
    participant = previewParticipant(event.id);
  } else {
    const participantResult = await supabase
      .from("participants")
      .select("*")
      .eq("id", participantId)
      .single();

    const found = participantResult.data as Participant | null;
    if (!found || found.event_id !== event.id) notFound();
    participant = found;
  }

  const { data: modulesData } = await supabase
    .from("modules")
    .select("*")
    .eq("event_id", event.id)
    .eq("is_active", true)
    .order("order");

  const modules = (modulesData ?? []) as Module[];

  return (
    <InvitationPage
      event={event}
      participant={participant}
      modules={modules}
      isPreview={isPreview}
    />
  );
}
