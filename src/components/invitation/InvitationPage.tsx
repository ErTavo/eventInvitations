"use client";

import { useEffect } from "react";
import type { Event, Module, Participant } from "@/lib/supabase/types";
import { themeConfig } from "./themes";
import HeroSection from "./HeroSection";
import CountdownModule from "./modules/CountdownModule";
import CarouselModule from "./modules/CarouselModule";
import MusicModule from "./modules/MusicModule";
import MapModule from "./modules/MapModule";
import DressCodeModule from "./modules/DressCodeModule";
import ItineraryModule from "./modules/ItineraryModule";
import GiftsModule from "./modules/GiftsModule";
import RsvpModule from "./modules/RsvpModule";

interface Props {
  event: Event;
  participant: Participant;
  modules: Module[];
}

export default function InvitationPage({ event, participant, modules }: Props) {
  const theme = themeConfig[event.style.theme ?? "elegant"];

  useEffect(() => {
    if (!participant.invitation_viewed) {
      fetch(`/api/participants/${participant.id}/view`, { method: "POST" });
    }
  }, [participant.id, participant.invitation_viewed]);

  const getModule = (type: string) => modules.find((m) => m.type === type);

  return (
    <div
      className={`min-h-screen ${theme.bgClass}`}
      style={{ fontFamily: event.style.fontFamily || "Cormorant Garamond, serif" }}
    >
      {/* Music auto-player */}
      {getModule("music") && (
        <MusicModule module={getModule("music")!} theme={theme} />
      )}

      {/* Hero */}
      <HeroSection event={event} participant={participant} theme={theme} />

      {/* Modules in order */}
      {getModule("countdown") && (
        <CountdownModule event={event} theme={theme} />
      )}
      {getModule("carousel") && (
        <CarouselModule module={getModule("carousel")!} theme={theme} />
      )}
      {getModule("itinerary") && (
        <ItineraryModule module={getModule("itinerary")!} theme={theme} />
      )}
      {getModule("dress_code") && (
        <DressCodeModule module={getModule("dress_code")!} theme={theme} />
      )}
      {getModule("map") && (
        <MapModule module={getModule("map")!} event={event} theme={theme} />
      )}
      {getModule("gifts") && (
        <GiftsModule module={getModule("gifts")!} theme={theme} />
      )}
      {getModule("rsvp") && (
        <RsvpModule participant={participant} theme={theme} />
      )}

      {/* Footer */}
      <footer className={`text-center py-8 text-xs ${theme.mutedClass} opacity-60`}>
        Creado con Event Invitations
      </footer>
    </div>
  );
}
