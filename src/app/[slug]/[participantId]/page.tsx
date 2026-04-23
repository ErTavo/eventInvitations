import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import InvitationPage from "@/components/invitation/InvitationPage";
import type { Event, Participant, Module } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function PublicInvitationPage({
  params,
}: {
  params: Promise<{ slug: string; participantId: string }>;
}) {
  const { slug, participantId } = await params;
  const supabase = createAdminClient();

  const [eventResult, participantResult] = await Promise.all([
    supabase.from("events").select("*").eq("slug", slug).single(),
    supabase.from("participants").select("*").eq("id", participantId).single(),
  ]);

  const event = eventResult.data as Event | null;
  const participant = participantResult.data as Participant | null;

  if (!event || !participant || participant.event_id !== event.id) notFound();

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
    />
  );
}
