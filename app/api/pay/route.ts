import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const raw = (await cookies()).get("aaa_user");
    if (!raw) return NextResponse.json({ error: "Login first" }, { status: 401 });
    const parsed = JSON.parse(raw.value);
    const userId = parsed.id ? String(parsed.id) : "";
    if (!userId) return NextResponse.json({ error: "Login first" }, { status: 401 });

    const body = await req.json();
    const name = body.name ? String(body.name) : "Starter";
    const amount = Number(body.amount || 50);
    const diamonds = Number(body.diamonds || 30);
    const phone = body.phone ? String(body.phone) : "";
    const senderName = body.senderName ? String(body.senderName) : "";
    const txId = body.txId ? String(body.txId) : "";
    const proofImage = body.proofImage ? String(body.proofImage) : "";

    const packId = "pack-" + name.toLowerCase().replace(/\s+/g, "-");
    const pack = await prisma.package.upsert({
      where: { id: packId },
      update: { diamonds, price: amount, name },
      create: {
        id: packId,
        name,
        diamonds,
        price: amount,
        currency: amount >= 1000 ? "NGN" : "GHS",
        analysesCount: Math.max(5, Math.round(diamonds / 2)),
      },
    });

    const payment = await prisma.payment.create({
      data: {
        userId,
        packageId: pack.id,
        amount,
        currency: amount >= 1000 ? "NGN" : "GHS",
        reference: "MOMO" + Date.now(),
        phoneUsed: phone || null,
        proofImage: proofImage || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Payment proof saved. Admin must approve before diamonds are added.",
      reference: payment.reference,
      package: name,
      diamonds,
      senderName,
      txId,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not save payment" }, { status: 500 });
  }
}
