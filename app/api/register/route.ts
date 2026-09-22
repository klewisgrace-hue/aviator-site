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

    if (!fullName || !username || !email || password.length < 6) {
      return NextResponse.json({ error: "Fill all fields. Password min 6 characters." }, { status: 400 });
    }

    const exists = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (exists) {
      return NextResponse.json({ error: "Email or username already used." }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        fullName,
        username,
        email,
        phone: phone ? phone : null,
        passwordHash: await bcrypt.hash(password, 12),
        status: "PENDING",
        role: "USER",
      },
    });

    const res = NextResponse.json({
      ok: true,
      next: "/pay",
      message: "Account created. Pay the account fee now.",
    });
    res.cookies.set("aaa_user", JSON.stringify({ id: user.id, username: user.username }), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}
