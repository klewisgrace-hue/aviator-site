export type RoundRow = {
  t: string;
  m: number;
  suggested: number;
  result: "WIN" | "LOSS";
  confidence: number;
};

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function crashMultiplier(rand: number) {
  const u = Math.min(0.999, Math.max(0.001, rand));
  const raw = 0.96 / u;
  return Math.max(1.01, Math.round(raw * 100) / 100);
}

export function buildRounds(count: number, seed: number): RoundRow[] {
  const rand = mulberry32(seed);
  const rows: RoundRow[] = [];
  for (let i = 0; i < count; i++) {
    const m = crashMultiplier(rand());
    const suggested = Math.max(1.1, Math.round((m * 0.72 + 0.4) * 100) / 100);
    const result = m >= suggested ? "WIN" : "LOSS";
    const d = new Date(Date.now() - i * 17000);
    const t = d.toLocaleTimeString("en-GB", { hour12: false });
    rows.push({
      t,
      m,
      suggested,
      result,
      confidence: Math.round(38 + rand() * 40),
    });
  }
  return rows;
}

export function estimateNext(rows: RoundRow[]) {
  const last = rows.slice(0, 20).map((r) => r.m);
  const avg = last.reduce((a, b) => a + b, 0) / Math.max(1, last.length);
  const under2 = last.filter((m) => m < 2).length / Math.max(1, last.length);
  const high = last.filter((m) => m >= 4).length;
  let streak = 0;
  for (const r of rows) {
    if (r.result === "WIN") streak += 1;
    else break;
  }
  const predicted = Math.max(1.2, Math.min(3.4, Math.round((avg * (1.15 - under2 * 0.25)) * 100) / 100));
  const confidence = Math.round(48 + (1 - under2) * 28);
  const risk = predicted < 1.6 ? "High" : predicted < 2.3 ? "Low-Medium" : "Medium";
  return { predicted, confidence, risk, avg, under2, high, streak };
}
