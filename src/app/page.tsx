import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-stone-50">
      <div className="text-center space-y-6 px-4">
        <h1
          className="text-5xl md:text-7xl text-stone-800"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Event Invitations
        </h1>
        <p className="text-stone-500 text-lg max-w-md mx-auto">
          Crea invitaciones digitales elegantes para tus eventos especiales
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-stone-800 text-white px-8 py-3 rounded-none hover:bg-stone-700 transition-colors tracking-widest text-sm uppercase"
        >
          Ir al Panel
        </Link>
      </div>
    </main>
  );
}
