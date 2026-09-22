"use client";

import { useState } from "react";

type Payload = {
  predicted: number;
  confidence: number;
  risk: string;
  diamondsLeft: number;
};

export function LiveBoard() {
  const [data, setData] = useState<Payload | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setErr("");
    const res = await fetch("/api/analyze", { method: "POST" });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setErr(json.error || "Need 2 diamonds");
      return;
    }
    setData({
      predicted: json.predicted,
      confidence: json.confidence,
      risk: json.risk,
      diamondsLeft: json.diamondsLeft,
    });
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#2a1020] via-[#12182a] to-[#0e1524] p-5">
        <span className="rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-semibold">LIVE</span>
        <p className="mt-3 text-xs uppercase tracking-wide text-white/45">Next Round Signal</p>
        <p className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-6xl font-semibold text-transparent">
          {data ? data.predicted.toFixed(2) + "x" : "—"}
        </p>
        {data ? (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/45">CONFIDENCE</p>
              <p className="text-3xl font-semibold text-violet-400">{data.confidence}%</p>
            </div>
            <div>
              <p className="text-xs text-white/45">RISK LEVEL</p>
              <p className="text-2xl font-semibold text-amber-400">{data.risk}</p>
            </div>
            <p className="col-span-2 text-sm text-white/50">{data.diamondsLeft} diamonds left</p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-white/45">Press the button to spend 2 diamonds.</p>
        )}
        <button
          disabled={busy}
          onClick={run}
          className="mt-5 w-full rounded-full bg-[#ff2d55] py-3 text-sm font-semibold disabled:opacity-50"
        >
          {busy ? "Running..." : "Get next prediction (2 diamonds)"}
        </button>
        {err ? <p className="mt-3 text-sm text-[#ff2d55]">{err}</p> : null}
      </section>
      <a href="/packages" className="inline-block rounded-full bg-[#ff2d55] px-5 py-2 text-sm font-semibold">
        Buy diamonds
      </a>
    </div>
  );
}
