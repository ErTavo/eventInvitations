import type { Event } from "@/lib/supabase/types";

export default function InvitationUnavailable({ event }: { event: Event }) {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#fafaf8]"
      style={{ fontFamily: "Cormorant Garamond, serif" }}
    >
      <div className="space-y-5 max-w-sm">
        <div className="text-5xl">✉️</div>
        <h1 className="text-3xl text-stone-700 font-light">{event.name}</h1>
        <div className="w-12 h-px bg-stone-300 mx-auto" />
        <p className="text-stone-500 text-base font-light leading-relaxed">
          Esta invitación aún no está disponible.
          <br />
          Por favor espera a que el organizador la active.
        </p>
        <p className="text-xs text-stone-300 tracking-widest uppercase pt-4">
          Próximamente
        </p>
      </div>
    </main>
  );
}
