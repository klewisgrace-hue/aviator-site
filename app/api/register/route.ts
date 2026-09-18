import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fullName = String(body.fullName ? body.fullName : "").trim();
    const username = String(body.username ? body.username : "").trim().toLowerCase();
    const email = String(body.email ? body.email : "").trim().toLowerCase();
    const phone = String(body.phone ? body.phone : "").trim();
    const password = String(body.password ? body.password : "");
    if (fullName.length < 1) {
      return NextResponse.json({ error: "Missing name" }, { status: 400 });
    }
    if (username.length < 1) {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }
    if (email.length < 1) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password too short" }, { status: 400 });
    }
    const exists = await prisma.user.findFirst({
      where: { OR: [{ email: email }, { username: username }] },
    });
    if (exists) {
      return NextResponse.json({ error: "Email or username already used." }, { status: 409 });
    }
    await prisma.user.create({
      data: {
        fullName: fullName,
        username: username,
        email: email,
        phone: phone.length > 0 ? phone : null,
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
