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
    const amount = Number(body.amount || 30);
    const diamonds = Number(body.diamonds || 20);
    const phone = body.phone ? String(body.phone) : "";

    const pack = await prisma.package.upsert({
      where: { id: "pack-" + name.toLowerCase() },
      update: { diamonds, price: amount, name },
      create: {
        id: "pack-" + name.toLowerCase(),
        name,
        diamonds,
        price: amount,
        currency: "GHS",
        analysesCount: Math.max(5, Math.round(diamonds / 2)),
      },
    });

    const payment = await prisma.payment.create({
      data: {
        userId,
        packageId: pack.id,
        amount,
        currency: "GHS",
        reference: "MOMO" + Date.now(),
        phoneUsed: phone || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Payment submitted. Wait for admin approval. Diamonds come after approval.",
      reference: payment.reference,
      package: name,
      diamonds,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not save payment" }, { status: 500 });
  }
}
