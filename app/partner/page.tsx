import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PartnerPage() {
  const raw = (await cookies()).get("aaa_user");
  if (!raw) return <main className="p-8 text-white bg-black min-h-screen"><Link href="/login">Login</Link></main>;
  const me = await prisma.user.findUnique({ where: { id: String(JSON.parse(raw.value).id || "") } });
  if (!me || !me.isPartner) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        <p>Partner only. Ask admin to turn on your partner code.</p>
        <Link href="/dashboard" className="text-orange-400">Dashboard</Link>
      </main>
    );
  }

  const team = await prisma.user.findMany({ where: { referredById: me.id }, orderBy: { createdAt: "desc" } });
  const earns = await prisma.partnerEarning.findMany({ where: { partnerId: me.id }, orderBy: { createdAt: "desc" } });
  const total = earns.reduce((s, e) => s + Number(e.amount), 0);
  const link = "https://aviator-site-beryl.vercel.app/register?ref=" + (me.partnerCode || "");

  return (
    <main className="min-h-screen bg-[#070b14] px-5 py-8 text-[#e8eefc]">
      <p className="text-xs text-[#ff2d55]">PARTNER</p>
      <h1 className="mt-2 text-3xl font-semibold">{me.fullName}</h1>
      <p className="mt-1 text-sm text-white/50">You earn {me.commissionRate}% after admin Approves a fee or diamond buy.</p>
      <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
        <p className="text-xs text-emerald-300">Your earnings</p>
        <p className="text-4xl font-semibold text-emerald-400">GHS {total.toFixed(2)}</p>
      </div>
      <div className="mt-4 rounded-2xl border border-white/10 bg-[#0e1524] p-4 text-sm">
        <p className="text-white/50">Share this link</p>
        <p className="mt-2 break-all text-orange-300">{link}</p>
        <p className="mt-2 text-white/40">Code: {me.partnerCode}</p>
      </div>
      <h2 className="mt-8 font-medium">People you brought ({team.length})</h2>
      <div className="mt-3 space-y-2">
        {team.map((u) => (
          <div key={u.id} className="rounded-xl border border-white/10 p-3 text-sm">
            {u.fullName} · @{u.username} · {u.status}
          </div>
        ))}
      </div>
      <h2 className="mt-8 font-medium">Payouts</h2>
      <div className="mt-3 space-y-2">
        {earns.map((e) => (
          <div key={e.id} className="flex justify-between rounded-xl border border-white/10 p-3 text-sm">
            <span>{e.source} · {e.percent}%</span>
            <span className="text-emerald-400">GHS {Number(e.amount).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
