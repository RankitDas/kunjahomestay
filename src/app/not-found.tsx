import Link from "next/link";
import { ArrowLeft, Building, MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--warm-cream)] text-[var(--dark-charcoal)]">
      <header className="border-b border-gray-200/70 bg-white/80">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-terracotta)] text-white"><Building size={20} /></span>
          <span className="text-xl font-bold tracking-tight">Kunja Homestay</span>
        </div>
      </header>
      <section className="mx-auto flex min-h-[75vh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--muted-ivory)] text-[var(--primary-terracotta)]"><MapPin size={42} /></div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary-terracotta)]">404 · Page not found</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">Looks like you took a wrong turn.</h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--dark-charcoal)]/70">The page you’re looking for isn’t here. Let’s get you back to the warmth of Kunja Homestay.</p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--primary-terracotta)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--deep-burnt-sienna)]"><ArrowLeft size={18} /> Back to home</Link>
      </section>
      <footer className="border-t border-gray-200/70 py-6 text-center text-sm text-[var(--dark-charcoal)]/60">Bolpur–Shantiniketan, West Bengal</footer>
    </main>
  );
}
