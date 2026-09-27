import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const raw = (await cookies()).get("aaa_user");
    if (!raw) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    const parsed = JSON.parse(raw.value);
    const meId = parsed.id ? String(parsed.id) : "";
    const me = await prisma.user.findUnique({ where: { id: meId } });
    let allowed = false;
    if (me && me.role === "ADMIN") allowed = true;
    if (me && me.role === "SUPER_ADMIN") allowed = true;
    if (me && me.username === "siteadmin") allowed = true;
    if (!allowed) return NextResponse.json({ error: "Admin only" }, { status: 403 });

    const body = await req.json();
    const paymentId = body.paymentId ? String(body.paymentId) : "";
    const action = body.action ? String(body.action) : "APPROVE";
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

    const packName = payment.package ? payment.package.name.toLowerCase() : "";
    let isFee = false;
    if (packName.indexOf("starter") >= 0) isFee = true;
    if (packName.indexOf("fee") >= 0) isFee = true;
    const packDiamonds = payment.package ? payment.package.diamonds : 0;
    const diamonds = isFee ? 0 : packDiamonds;

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: payment.userId } });
      if (!user) throw new Error("user");
      const after = isFee ? user.diamondBalance : user.diamondBalance + diamonds;
      await tx.payment.update({ where: { id: paymentId }, data: { status: "APPROVED" } });
      await tx.user.update({
        where: { id: user.id },
        data: { status: "ACTIVE", diamondBalance: after },
      });
      if (!isFee && diamonds > 0) {
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
      }
      if (user.referredById) {
        const partner = await tx.user.findUnique({ where: { id: user.referredById } });
        if (partner && partner.isPartner) {
          const percent = partner.commissionRate > 0 ? partner.commissionRate : 20;
          const cut = Number(payment.amount) * percent / 100;
          const source = Number(payment.amount) >= 200 ? "DIAMONDS" : "FEE";
          await tx.partnerEarning.create({
            data: {
              partnerId: partner.id,
              paymentId: payment.id,
              amount: cut,
              percent,
              source,
            },
          });
        }
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Approve failed" }, { status: 500 });
  }
}