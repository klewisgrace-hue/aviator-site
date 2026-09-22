import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const raw = (await cookies()).get("aaa_user");
  if (!raw) return NextResponse.json({ ok: false }, { status: 401 });
  const id = String(JSON.parse(raw.value).id || "");
  const user = await prisma.user.findUnique({
    where: { id },
    include: { payments: true },
  });
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const paid = user.payments.some((p) => p.status === "APPROVED");
  return NextResponse.json({
    ok: true,
    status: user.status,
    paid,
    diamonds: user.diamondBalance,
    ready: user.status === "ACTIVE" && paid,
  });
}
