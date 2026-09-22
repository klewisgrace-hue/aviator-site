"use client";

import { useState } from "react";

export function LiveBoard() {
  const [shown, setShown] = useState("5.40");
  const [conf, setConf] = useState<number | null>(null);
  const [risk, setRisk] = useState("");
  const [left, setLeft] = useState<number | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [fly, setFly] = useState(true);

  async function run() {
    setBusy(true);
    setErr("");
    const res = await fetch("/api/analyze", { method: "POST" });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setErr(json.error || "Need 2 diamonds. Buy diamonds first.");
      return;
    }
    setShown(Number(json.predicted).toFixed(2));
    setConf(json.confidence);
    setRisk(json.risk);
    setLeft(json.diamondsLeft);
    setFly(true);
  }

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a0b14] to-[#0b1220] p-5">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-semibold">AVIATOR</span>
          <span className="text-xs text-white/40">LINE UP</span>
        </div>
        <div className="relative mt-6 h-28">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
          <p className={"absolute text-4xl transition-all duration-700 " + (fly ? "bottom-16 left-2/3" : "bottom-2 left-4")}>
            ✈️
          </p>
        </div>
        <p className="text-xs uppercase tracking-wide text-white/40">Next Round Signal</p>
        <p className="bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-6xl font-semibold text-transparent">
          {shown}x
        </p>
        {conf !== null ? (
          <p className="mt-2 text-sm text-white/50">
            {conf}% · {risk} · {left} diamonds left
          </p>
        ) : (
          <p className="mt-2 text-sm text-white/40">Tap below to use 2 diamonds.</p>
        )}
        <button
          disabled={busy}
          onClick={run}
          className="mt-5 w-full rounded-full bg-[#ff2d55] py-3 text-sm font-semibold disabled:opacity-50"
        >
          {busy ? "Flying..." : "Get next prediction (2 diamonds)"}
        </button>
        {err ? <p className="mt-3 text-sm text-[#ff2d55]">{err}</p> : null}
      </section>
      <a href="/packages" className="inline-block rounded-full bg-[#ff2d55] px-5 py-2 text-sm font-semibold">
        Buy diamonds
      </a>
    </div>
  );
}
