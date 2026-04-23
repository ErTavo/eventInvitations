import EventForm from "@/components/dashboard/EventForm";

export default function NewEventPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1
        className="text-3xl text-stone-800 mb-6"
        style={{ fontFamily: "Cormorant Garamond, serif" }}
      >
        Nuevo Evento
      </h1>
      <EventForm />
    </div>
  );
}
