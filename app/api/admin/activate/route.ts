import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const raw = (await cookies()).get("aaa_user");
    if (!raw) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }
    const parsed = JSON.parse(raw.value);
    const meId = parsed.id ? String(parsed.id) : "";
    const me = await prisma.user.findUnique({ where: { id: meId } });
    if (!me) {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }
    if (me.role !== "ADMIN" && me.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }
    const body = await req.json();
    const userId = body.userId ? String(body.userId) : "";
    const status = body.status ? String(body.status) : "ACTIVE";
    if (userId.length < 1) {
      return NextResponse.json({ error: "Missing user" }, { status: 400 });
    }
    if (status === "PENDING") {
      await prisma.user.update({ where: { id: userId }, data: { status: "PENDING" } });
    } else {
      await prisma.user.update({ where: { id: userId }, data: { status: "ACTIVE" } });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
