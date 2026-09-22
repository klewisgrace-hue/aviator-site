import { NextResponse } from "next/server";
import { buildRounds, estimateNext } from "@/lib/prediction";

export async function GET() {
  const seed = Math.floor(Date.now() / 8000);
  const rows = buildRounds(30, seed);
  const est = estimateNext(rows);
  return NextResponse.json({
    ok: true,
    source: "statistical-model",
    disclaimer: "Estimate from recent simulated crash-style distribution. Not a guaranteed cashout.",
    nextIn: 8 - (Math.floor(Date.now() / 1000) % 8),
    ...est,
    recent: rows.slice(0, 8).map((r) => ({
      t: r.t,
      m: r.m.toFixed(2) + "x",
      suggested: r.suggested.toFixed(2) + "x",
      result: r.result,
      confidence: r.confidence,
    })),
    chips: rows.slice(0, 5).map((r) => r.m.toFixed(2) + "x"),
  });
}
