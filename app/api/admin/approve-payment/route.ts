import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const raw = (await cookies()).get("aaa_user");
    if (!raw) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    const meId = String(JSON.parse(raw.value).id || "");
    const me = await prisma.user.findUnique({ where: { id: meId } });
    if (!me || (me.role !== "ADMIN" && me.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    const body = await req.json();
    const paymentId = String(body.paymentId || "");
    const action = String(body.action || "APPROVE");
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { package: true },
    });
    if (!payment) return NextResponse.json({ error: "Missing payment" }, { status: 404 });

    if (action === "REJECT") {
      await prisma.payment.update({ where: { id: paymentId }, data: { status: "REJECTED" } });
      return NextResponse.json({ ok: true });
    }

    if (payment.status === "APPROVED") return NextResponse.json({ ok: true });

    const diamonds = payment.package ? payment.package.diamonds : 20;
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: payment.userId } });
      if (!user) throw new Error("user");
      const after = user.diamondBalance + diamonds;
      await tx.payment.update({ where: { id: paymentId }, data: { status: "APPROVED" } });
      await tx.user.update({
        where: { id: user.id },
        data: { diamondBalance: after, status: "ACTIVE" },
      });
      await tx.diamondTransaction.create({
        data: {
          userId: user.id,
          type: "PURCHASE",
          amount: diamonds,
          balanceBefore: user.diamondBalance,
          balanceAfter: after,
          reference: payment.reference,
          description: "Admin approved package",
        },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Approve failed" }, { status: 500 });
  }
}
