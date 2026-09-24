import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const raw = (await cookies()).get("aaa_user");
    if (!raw) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    const me = await prisma.user.findUnique({ where: { id: String(JSON.parse(raw.value).id || "") } });
    if (!me || (me.role !== "ADMIN" && me.role !== "SUPER_ADMIN" && me.username !== "siteadmin")) {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }
    const body = await req.json();
    const userId = String(body.userId || "");
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User missing" }, { status: 404 });
    const code = (user.username || "p") + Math.floor(100 + Math.random() * 899);
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        isPartner: true,
        partnerCode: user.partnerCode || code.toLowerCase(),
        commissionRate: Number(body.percent || 20),
      },
    });
    return NextResponse.json({ ok: true, code: updated.partnerCode });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not make partner" }, { status: 500 });
  }
}
