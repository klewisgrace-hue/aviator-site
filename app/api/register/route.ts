import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fullName = String(body.fullName || "").trim();
    const username = String(body.username || "").trim().toLowerCase();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const password = String(body.password || "");
    if (!fullName  !username  !email || password.length < 6) {
      return NextResponse.json({ error: "Fill all fields. Password min 6 characters." }, { status: 400 });
    }
    const exists = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (exists) {
      return NextResponse.json({ error: "Email or username already used." }, { status: 409 });
    }
    await prisma.user.create({
      data: {
        fullName,
        username,
        email,
        phone: phone || null,
        passwordHash: await bcrypt.hash(password, 12),
        status: "PENDING",
        role: "USER",
      },
    });
    return NextResponse.json({ ok: true, message: "Account created. Wait for admin approval." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}
