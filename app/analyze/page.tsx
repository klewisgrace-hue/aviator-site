"use client";

import { useState } from "react";
import Link from "next/link";

export default function AnalyzePage() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState<{ predicted: number; confidence: number; risk: string; diamondsLeft: number; disclaimer: string } | null>(null);

  async function run() {
    setBusy(true);
    setErr("");
    setResult(null);
    const res = await fetch("/api/analyze", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setErr(data.error || "Could not run");
      return;
    }
    setResult(data);
  }

  return (
    <main className="min-h-screen bg-[#070b14] px-5 py-10 text-[#eef3ff]">
      <div className="mx-auto max-w-lg">
        <p className="text-xs tracking-[0.2em] text-[#ff2d55]">AVIATOR AI</p>
        <h1 className="mt-2 text-3xl font-semibold">Run analysis</h1>
        <p className="mt-2 text-white/55">Each prediction costs <span className="text-[#ff2d55]">2 diamonds</span>. Buy diamonds after registration via the pay wizard.</p>
        <button
          disabled={busy}
          onClick={run}
          className="mt-8 w-full rounded-full bg-[#ff2d55] py-3 font-semibold disabled:opacity-50"
        >
          {busy ? "Running..." : "Get next prediction (2 diamonds)"}
        </button>
        {err ? <p className="mt-4 text-sm text-[#ff2d55]">{err}</p> : null}
        {result ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#0e1524] p-5">
            <p className="text-xs text-white/40">Estimate</p>
            <p className="text-5xl font-semibold text-emerald-400">{result.predicted.toFixed(2)}x</p>
            <p className="mt-2 text-sm">Confidence {result.confidence}% · Risk {result.risk}</p>
            <p className="mt-1 text-sm text-white/50">Diamonds left: {result.diamondsLeft}</p>
            <p className="mt-3 text-xs text-white/40">{result.disclaimer}</p>
          </div>
        ) : null}
        <p className="mt-8 flex gap-4 text-sm">
          <Link href="/pay" className="text-orange-400">Buy diamonds</Link>
          <Link href="/dashboard" className="text-white/50">Dashboard</Link>
        </p>
      </div>
    </main>
  );
}
