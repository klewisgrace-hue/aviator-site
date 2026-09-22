"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LiveBoard() {
  const router = useRouter();
  const [shown, setShown] = useState("5.40");
  const [conf, setConf] = useState<number | null>(null);
  const [risk, setRisk] = useState("");
  const [left, setLeft] = useState<number | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

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
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020] p-5 shadow-[0_0_80px_rgba(255,45,85,0.15)]">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#ff2d55]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[#ff2d55] px-2.5 py-0.5 text-[11px] font-bold">LIVE</span>
          {left !== null ? (
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              {left} diamonds
            </span>
          ) : null}
        </div>
        <div className="mt-8 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">Aviator lineup</p>
            <p className="mt-1 bg-gradient-to-r from-emerald-300 via-white to-amber-300 bg-clip-text text-7xl font-black text-transparent">
              {shown}x
            </p>
          </div>
          <p className="mb-2 text-5xl">✈️</p>
        </div>
        {conf !== null ? (
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/5 p-3">
              <p className="text-[11px] text-white/40">Confidence</p>
              <p className="text-2xl font-semibold text-violet-300">{conf}%</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-3">
              <p className="text-[11px] text-white/40">Risk</p>
              <p className="text-2xl font-semibold text-amber-300">{risk}</p>
            </div>
          </div>
        ) : null}
        <button
          disabled={busy}
          onClick={run}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-[#ff2d55] to-[#ff6b35] py-3.5 text-sm font-bold shadow-lg shadow-[#ff2d55]/30 disabled:opacity-50"
        >
          {busy ? "Taking off..." : "Get next prediction · 2 diamonds"}
        </button>
        {err ? <p className="mt-3 text-center text-sm text-[#ff6b7a]">{err}</p> : null}
      </section>
      <a
        href="/packages"
        className="block rounded-full border border-white/15 py-3 text-center text-sm font-semibold text-white/80"
      >
        Buy diamonds
      </a>
    </div>
  );
}
