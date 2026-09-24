import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
function num(value: unknown, fallback: number) {
  const n = Number(value);
  if (Number.isFinite(n) && String(value).trim() !== "") return n;
  return fallback;
}
const DEFAULT_MOMO = {
  network: "TELECEL",
  number: "0204375237",
  name: "MARY TETTEH",
  network2: "",
  number2: "",
  name2: "",
};

async function readMomo() {
  const row = await prisma.siteSetting.findUnique({ where: { key: "momo" } });
  const saved = row?.value && typeof row.value === "object" ? (row.value as Record<string, string>) : {};
  return { ...DEFAULT_MOMO, ...saved };
}

export async function GET() {
  const momo = await readMomo();
  const packs = await prisma.package.findMany({ orderBy: { price: "asc" } });
  return NextResponse.json({
    momo,
    packs: packs.map((p) => ({
      name: p.name,
      price: String(p.price),
      diamonds: p.diamonds,
    })),
  });
}

export async function POST(req: Request) {
  try {
    const raw = (await cookies()).get("aaa_user");
    if (!raw) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    const parsed = JSON.parse(raw.value);
    const me = await prisma.user.findUnique({ where: { id: String(parsed.id || "") } });
    if (!me || (me.role !== "ADMIN" && me.role !== "SUPER_ADMIN" && me.username !== "siteadmin")) {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    const body = await req.json();
   const packs = [
      { name: "Regular", price: num(body.regularPrice, 50), diamonds: num(body.regularDiamonds, 5) },
      { name: "VIP", price: num(body.vipPrice, 80), diamonds: num(body.vipDiamonds, 10) },
      { name: "VVIP", price: num(body.vvipPrice, 180), diamonds: num(body.vvipDiamonds, 20) },
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

    const momo = {
      network: String(body.network || DEFAULT_MOMO.network).trim(),
      number: String(body.number || "").trim(),
      name: String(body.accountName || "").trim(),
      network2: String(body.network2 || "").trim(),
      number2: String(body.number2 || "").trim(),
      name2: String(body.accountName2 || "").trim(),
    };
    await prisma.siteSetting.upsert({
      where: { key: "momo" },
      create: { key: "momo", value: momo },
      update: { value: momo },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}