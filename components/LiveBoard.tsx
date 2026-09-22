"use client";

import { useEffect, useState } from "react";

type Payload = {
  predicted: number;
  confidence: number;
  risk: string;
  avg: number;
  under2: number;
  high: number;
  streak: number;
  nextIn: number;
  chips: string[];
  recent: { t: string; m: string; suggested: string; result: string; confidence: number }[];
  disclaimer: string;
};

export function LiveBoard() {
  const [data, setData] = useState<Payload | null>(null);

  async function load() {
    const res = await fetch("/api/predict", { cache: "no-store" });
    const json = await res.json();
    setData(json);
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 4000);
    return () => clearInterval(id);
  }, []);

  if (!data) {
    return <div className="rounded-2xl border border-white/10 bg-[#0e1524] p-6 text-white/50">Loading signal...</div>;
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#2a1020] via-[#12182a] to-[#0e1524] p-5">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <span className="rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-semibold">LIVE MODEL</span>
            <p className="mt-3 text-xs uppercase tracking-wide text-white/45">Predicted cashout estimate</p>
            <p className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-6xl font-semibold text-transparent">
              {data.predicted.toFixed(2)}x
            </p>
            <p className="mt-2 text-sm text-emerald-400">{data.disclaimer}</p>
          </div>
          <div className="grid min-w-[240px] gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-white/45">CONFIDENCE</p>
              <p className="text-3xl font-semibold text-violet-400">{data.confidence}%</p>
            </div>
            <div>
              <p className="text-xs text-white/45">RISK LEVEL</p>
              <p className="text-2xl font-semibold text-amber-400">{data.risk}</p>
            </div>
            <div className="sm:col-span-2 text-sm text-red-300">Next refresh in {data.nextIn}s</div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Last 20 Average" value={data.avg.toFixed(2) + "x"} />
        <Stat label="Crash under 2x" value={Math.round(data.under2 * 100) + "%"} />
        <Stat label="High multiplier (4x+)" value={String(data.high)} />
        <Stat label="Win streak" value={String(data.streak)} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#0e1524] p-4 lg:col-span-2">
          <h3 className="font-medium">Recent multipliers</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.chips.map((x) => (
              <span key={x} className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-sm text-red-300">
                {x}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0e1524] p-4 text-sm text-white/60">
          Model updates every few seconds from a crash-style statistical engine. This is not the official Aviator operator feed.
        </div>
      </section>

      <section className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0e1524] text-white/40">
            <tr>
              <th className="px-4 py-2">Time</th>
              <th>Multiplier</th>
              <th>Suggested</th>
              <th>Result</th>
              <th>AI conf.</th>
            </tr>
          </thead>
          <tbody>
            {data.recent.map((row) => (
              <tr key={row.t + row.m} className="border-t border-white/10">
                <td className="px-4 py-2 text-white/60">{row.t}</td>
                <td className="text-red-300">{row.m}</td>
                <td>{row.suggested}</td>
                <td className={row.result === "WIN" ? "text-emerald-400" : "text-red-400"}>{row.result}</td>
                <td className="text-white/50">{row.confidence}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    
      <div className="flex gap-3">
        <a href="/packages" className="rounded-lg bg-[#ff2d55] px-4 py-2 text-sm">Buy diamonds</a>
        <a href="/analyze" className="rounded-lg border border-white/15 px-4 py-2 text-sm">Run AI analysis (2 diamonds)</a>
      </div>
</div>
  );
}

function Stat(props: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0e1524] p-4">
      <p className="text-xs text-white/45">{props.label}</p>
      <p className="mt-2 text-2xl font-semibold">{props.value}</p>
    
      <div className="flex gap-3">
        <a href="/packages" className="rounded-lg bg-[#ff2d55] px-4 py-2 text-sm">Buy diamonds</a>
        <a href="/analyze" className="rounded-lg border border-white/15 px-4 py-2 text-sm">Run AI analysis (2 diamonds)</a>
      </div>
</div>
  );
}
