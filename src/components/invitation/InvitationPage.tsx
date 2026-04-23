"use client";

import { useEffect } from "react";
import type { Event, Module, Participant } from "@/lib/supabase/types";
import { buildThemeConfig } from "./themes";
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
  isPreview?: boolean;
}

export default function InvitationPage({ event, participant, modules, isPreview = false }: Props) {
  const theme = buildThemeConfig(event.style);

  useEffect(() => {
    if (!isPreview && !participant.invitation_viewed) {
      fetch(`/api/participants/${participant.id}/view`, { method: "POST" });
    }
  }, [isPreview, participant.id, participant.invitation_viewed]);

  const getModule = (type: string) => modules.find((m) => m.type === type);

  return (
    <div
      className={`min-h-screen ${theme.bgClass}`}
      style={{ fontFamily: event.style.fontFamily || "Cormorant Garamond, serif", ...theme.cssVars }}
    >
      {isPreview && (
        <div className="sticky top-0 z-50 bg-amber-400 text-amber-900 text-xs text-center py-2 px-4 font-medium tracking-wide">
          Vista previa — así verán la invitación tus invitados
        </div>
      )}
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
      {getModule("rsvp") && !isPreview && (
        <RsvpModule participant={participant} theme={theme} />
      )}
      {getModule("rsvp") && isPreview && (
        <section className={`py-16 ${theme.sectionClass}`}>
          <div className={`max-w-md mx-auto px-6 text-center border-2 border-dashed rounded py-10 ${theme.dividerClass}`}>
            <p className={`text-sm ${theme.mutedClass}`}>Aquí aparecerá la sección de confirmación de asistencia</p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={`text-center py-8 text-xs ${theme.mutedClass} opacity-60`}>
        Creado con Event Invitations
      </footer>
    </div>
  );
}
