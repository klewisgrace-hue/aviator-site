import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { buildRounds, estimateNext } from "@/lib/prediction";

const COST = 2;

export async function POST() {
  try {
    const raw = (await cookies()).get("aaa_user");
    if (!raw) return NextResponse.json({ error: "Login first" }, { status: 401 });
    const userId = String(JSON.parse(raw.value).id || "");
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "Login first" }, { status: 401 });
    if (user.status !== "ACTIVE") {
      return NextResponse.json({ error: "Account not active. Pay and wait for admin approval." }, { status: 403 });
    }
    if (user.diamondBalance < COST) {
      return NextResponse.json({ error: "Need 2 diamonds. Buy a package." }, { status: 402 });
    }

    const before = user.diamondBalance;
    const after = before - COST;
    const seed = Math.floor(Date.now() / 8000);
    const rows = buildRounds(30, seed);
    const est = estimateNext(rows);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: userId }, data: { diamondBalance: after } });
      await tx.diamondTransaction.create({
        data: {
          userId,
          type: "ANALYSIS_USAGE",
          amount: -COST,
          balanceBefore: before,
          balanceAfter: after,
          description: "AI next-round estimate",
        },
      });
      await tx.analysis.create({
        data: {
          userId,
          inputData: { seed },
          statisticalResults: est as object,
          aiResponse: "Predicted " + est.predicted.toFixed(2) + "x · conf " + est.confidence + "%",
          creditsUsed: COST,
        },
      });
    });

    return NextResponse.json({
      ok: true,
      cost: COST,
      diamondsLeft: after,
      predicted: est.predicted,
      confidence: est.confidence,
      risk: est.risk,
      disclaimer: "Statistical estimate only. Not a guaranteed cashout.",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
