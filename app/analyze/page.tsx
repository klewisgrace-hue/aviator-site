import { Nav } from "@/components/Nav";
import { demoRounds } from "@/lib/demo";

export default function AnalyzePage() {
  const avg = demoRounds.reduce((a, b) => a + b, 0) / demoRounds.length;
  const under2pct = (demoRounds.filter((n) => n < 2).length / demoRounds.length) * 100;

  return (
    <>
      <Nav signedIn />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12">
        <h1 className="text-3xl font-semibold">Run analysis</h1>
        <p className="mt-2 text-sm text-white/60">
          Paste recent multipliers. This costs diamonds when the database is live. It describes the
          sample you pasted — it does not know the next crash.
        </p>

        <form className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-[#0e1524] p-5">
          <label className="text-xs text-white/50">Multipliers (comma or space separated)</label>
          <textarea
            className="min-h-32 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2 font-mono text-sm"
            defaultValue={demoRounds.join(", ")}
          />
          <button className="rounded-lg bg-[#ff2d55] px-4 py-2 text-sm font-semibold">
            Analyze sample
          </button>
        </form>

        <section className="mt-6 rounded-2xl border border-white/10 bg-[#0e1524] p-5">
          <h2 className="text-sm text-white/60">Last demo result</h2>
          <p className="mt-3 font-mono text-2xl">{avg.toFixed(2)}x average</p>
          <p className="mt-1 text-sm text-white/60">{under2pct.toFixed(0)}% of this sample crashed under 2x.</p>
          <p className="mt-4 rounded-lg border border-[#f5c518]/20 bg-[#f5c518]/10 p-3 text-sm text-[#f5c518]">
            House edge stays in the game. Do not sell this as a guaranteed predictor.
          </p>
        </section>
      </main>
    </>
  );
}
