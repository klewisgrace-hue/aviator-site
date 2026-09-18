import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const raw = (await cookies()).get("aaa_user");
    if (!raw) return NextResponse.json({ error: "Login first" }, { status: 401 });
    const parsed = JSON.parse(raw.value);
    const userId = parsed.id ? String(parsed.id) : "";
    const body = await req.json();
    const name = body.name ? String(body.name) : "Starter";
    const amount = body.amount ? Number(body.amount) : 30;
    const diamonds = body.diamonds ? Number(body.diamonds) : 20;
    const ref = "PAY" + Date.now();
    await prisma.payment.create({
      data: {
        userId: userId,
        amount: amount,
        currency: "GHS",
        reference: ref,
        status: "PENDING",
      },
    });
    return NextResponse.json({ ok: true, reference: ref, package: name, diamonds: diamonds });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Payment not saved" }, { status: 500 });
  }
}
