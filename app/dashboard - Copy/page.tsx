import { Nav } from "@/components/Nav";
import { demoRounds, demoUser } from "@/lib/demo";
import Link from "next/link";

function avg(n: number[]) {
  return n.reduce((a, b) => a + b, 0) / n.length;
}

export default function DashboardPage() {
  const under2 = demoRounds.filter((n) => n < 2).length;
  const over10 = demoRounds.filter((n) => n >= 10).length;

  return (
    <>
      <Nav signedIn />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="mt-1 text-sm text-white/50">
              {demoUser.fullName} · @{demoUser.username} · {demoUser.status}
            </p>
          </div>
          <div className="rounded-full border border-[#f5c518]/30 bg-[#f5c518]/10 px-4 py-1.5 text-sm text-[#f5c518]">
            {demoUser.diamondBalance} diamonds
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Recent average", `${avg(demoRounds).toFixed(2)}x`],
            ["Under 2x", `${under2}/${demoRounds.length}`],
            ["10x+", String(over10)],
            ["Last round", `${demoRounds[0].toFixed(2)}x`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-[#0e1524] p-4">
              <p className="text-xs uppercase tracking-wide text-white/40">{label}</p>
              <p className="mt-2 font-mono text-2xl">{value}</p>
            </div>
          ))}
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#0e1524] p-5">
            <h2 className="text-sm text-white/60">Latest demo multipliers</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {demoRounds.map((n, i) => (
                <span
                  key={i}
                  className={`rounded-md px-2 py-1 font-mono text-sm ${
                    n < 2 ? "bg-[#ff2d55]/15 text-[#ff2d55]" : n >= 10 ? "bg-[#f5c518]/15 text-[#f5c518]" : "bg-white/5 text-[#22d3a6]"
                  }`}
                >
                  {n.toFixed(2)}x
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0e1524] p-5">
            <h2 className="text-sm text-white/60">Next actions</h2>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link href="/analyze" className="rounded-lg bg-[#ff2d55] px-4 py-3 text-center font-semibold">
                Run analysis (uses diamonds)
              </Link>
              <Link href="/packages" className="rounded-lg border border-white/10 px-4 py-3 text-center">
                Buy diamonds
              </Link>
            </div>
            <p className="mt-4 text-xs text-white/40">
              Demo numbers only until Neon/Postgres and next-auth are connected on Vercel.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
