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
    const userId = String(body.userId || "");
    const status = String(body.status || "ACTIVE");
    if (!userId) return NextResponse.json({ error: "Missing user" }, { status: 400 });
    await prisma.user.update({ where: { id: userId }, data: { status: status } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
