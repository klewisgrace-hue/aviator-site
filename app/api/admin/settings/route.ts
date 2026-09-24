import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const raw = (await cookies()).get("aaa_user");
    if (!raw) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    const parsed = JSON.parse(raw.value);
    const me = await prisma.user.findUnique({ where: { id: String(parsed.id || "") } });
    if (!me) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const body = await req.json();
    const packs = [
      { name: "Regular", price: Number(body.regularPrice || 50), diamonds: Number(body.regularDiamonds || 5) },
      { name: "VIP", price: Number(body.vipPrice || 80), diamonds: Number(body.vipDiamonds || 10) },
      { name: "VVIP", price: Number(body.vvipPrice || 180), diamonds: Number(body.vvipDiamonds || 20) },
    ];

    for (const p of packs) {
      const existing = await prisma.package.findFirst({ where: { name: p.name } });
      if (existing) {
        await prisma.package.update({
          where: { id: existing.id },
          data: { price: p.price, diamonds: p.diamonds, isActive: true },
        });
      } else {
        await prisma.package.create({
          data: {
            name: p.name,
            price: p.price,
            diamonds: p.diamonds,
            currency: "GHS",
            analysesCount: Math.max(1, p.diamonds),
          },
        });
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
