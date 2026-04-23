"use client";

import { useState } from "react";
import type { Event, Module, Participant } from "@/lib/supabase/types";
import EventSettingsTab from "./EventSettingsTab";
import ModulesTab from "./ModulesTab";
import ParticipantsTab from "./ParticipantsTab";
import { Settings, Puzzle, Users } from "lucide-react";

interface Props {
  event: Event;
  modules: Module[];
  participants: Participant[];
}

const TABS = [
  { id: "settings", label: "Configuración", Icon: Settings },
  { id: "modules", label: "Módulos", Icon: Puzzle },
  { id: "participants", label: "Invitados", Icon: Users },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function EventTabs({ event, modules, participants }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("settings");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1
          className="text-3xl text-stone-800"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          {event.name}
        </h1>
        <a
          href={`/${event.slug}/${participants[0]?.id ?? "preview"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-stone-500 underline hover:text-stone-800"
        >
          Ver invitación de muestra ↗
        </a>
      </div>

      <div className="flex border-b border-stone-200 gap-1">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 transition-colors ${
              activeTab === id
                ? "border-stone-800 text-stone-800 font-medium"
                : "border-transparent text-stone-500 hover:text-stone-700"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "settings" && <EventSettingsTab event={event} />}
      {activeTab === "modules" && (
        <ModulesTab event={event} modules={modules} />
      )}
      {activeTab === "participants" && (
        <ParticipantsTab event={event} participants={participants} />
      )}
    </div>
  );
}
