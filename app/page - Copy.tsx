import Link from "next/link";
import { Nav } from "@/components/Nav";
import { packages } from "@/lib/demo";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-[#ff2d55]">Ghana · diamonds · analysis</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
          Crash-round stats.
          <span className="text-white/45"> Not a magic cashout button.</span>
        </h1>
        <p className="mt-5 max-w-xl text-white/70">
          Buy diamonds, run an analysis on recent multipliers, and read distribution + streaks.
          Accounts stay pending until an admin approves them.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/register" className="rounded-full bg-[#ff2d55] px-5 py-2.5 text-sm font-semibold">
            Create account
          </Link>
          <Link href="/login" className="rounded-full border border-white/15 px-5 py-2.5 text-sm">
            Login
          </Link>
          <Link href="/dashboard" className="rounded-full border border-white/15 px-5 py-2.5 text-sm">
            Preview dashboard
          </Link>
        </div>

        <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((p) => (
            <div key={p.name} className="rounded-2xl border border-white/10 bg-[#0e1524] p-5">
              <p className="text-xs text-[#f5c518]">{p.name}</p>
              <p className="mt-2 text-3xl font-semibold">GHS {p.price}</p>
              <p className="mt-1 text-sm text-white/55">
                {p.diamonds} diamonds · {p.analysesCount} analyses
              </p>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
