import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ident = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: ident }, { username: ident }] },
    });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid login." }, { status: 401 });
    }
    if (user.status === "BANNED" || user.status === "SUSPENDED") {
      return NextResponse.json({ error: "Account is blocked." }, { status: 403 });
    }
    const res = NextResponse.json({
      ok: true,
      status: user.status,
      role: user.role,
      username: user.username,
    });
    res.cookies.set(
      "aaa_user",
      JSON.stringify({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
      }),
      { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 }
    );
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
