import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { LiveBoard } from "@/components/LiveBoard";

export default async function PartnerPage() {
  const raw = (await cookies()).get("aaa_user");
  if (!raw) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#070b14] text-white">
        <Link href="/login">Login</Link>
      </main>
    );
  }
  const parsed = JSON.parse(raw.value);
  const meId = parsed.id ? String(parsed.id) : "";
  const me = await prisma.user.findUnique({
    where: { id: meId },
    include: { payments: true },
  });
  if (!me) {
    return (
      <main className="min-h-screen bg-[#070b14] p-8 text-white">
        <p>This desk is for partners only.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-[#ff2d55]">Member dashboard</Link>
      </main>
    );
  }
  if (!me.isPartner) {
    return (
      <main className="min-h-screen bg-[#070b14] p-8 text-white">
        <p>This desk is for partners only.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-[#ff2d55]">Member dashboard</Link>
      </main>
    );
  }

  const team = await prisma.user.findMany({ where: { referredById: me.id }, orderBy: { createdAt: "desc" } });
  const earns = await prisma.partnerEarning.findMany({ where: { partnerId: me.id }, orderBy: { createdAt: "desc" } });
  const total = earns.reduce((s, e) => s + Number(e.amount), 0);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const today = earns.filter((e) => e.createdAt >= start).reduce((s, e) => s + Number(e.amount), 0);
  const yours = me.commissionRate > 0 ? me.commissionRate : 20;
  const house = 100 - yours;
  const code = me.partnerCode ? me.partnerCode : "";
  const link = "https://aviator-site-beryl.vercel.app/register?ref=" + code;
  const ready = me.status === "ACTIVE" && me.payments.some((p) => p.status === "APPROVED");return (
    <div className="min-h-screen bg-[#070b14] text-[#e8eefc]">
      <aside className="fixed inset-y-0 left-0 hidden w-56 flex-col border-r border-white/10 bg-[#080d18] p-5 md:flex">
        <p className="text-sm font-semibold tracking-wide text-[#ff2d55]">AVIATOR AI</p>
        <p className="mt-1 text-xs text-white/40">Partner desk</p>
        <nav className="mt-8 space-y-1 text-sm">
          <Link href="/partner" className="block rounded-lg bg-white/10 px-3 py-2">Earnings</Link>
          <Link href="/analyze" className="block rounded-lg px-3 py-2 text-white/55">Predictions</Link>
          <Link href="/packages" className="block rounded-lg px-3 py-2 text-white/55">Wallet</Link>
          <Link href="/login" className="block rounded-lg px-3 py-2 text-white/55">Log out</Link>
        </nav>
      </aside>

      <div className="md:pl-56">
        <header className="border-b border-white/10 px-5 py-5">
          <p className="text-xs tracking-[0.2em] text-[#ff2d55]">PARTNER</p>
          <h1 className="mt-1 text-2xl font-semibold">{me.fullName}</h1>
          <p className="mt-1 text-sm text-white/45">Code {me.partnerCode}. Your cut is {yours}%. The house keeps {house}%.</p>
        </header>

        <div className="space-y-4 p-5">
          <section className="grid gap-3 sm:grid-cols-3">
            <Stat k="Your cut" v={yours + "%"} />
            <Stat k="Today" v={"GHS " + today.toFixed(2)} />
            <Stat k="All time" v={"GHS " + total.toFixed(2)} />
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#10182a] p-5">
            <p className="text-xs tracking-widest text-white/40">YOUR LINK</p>
            <p className="mt-3 break-all text-lg text-[#ffb020]">{link}</p>
            <p className="mt-2 text-sm text-white/45">Anyone who registers with this link is yours. You are paid when admin approves their fee or diamonds.</p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#10182a] p-5">
            <h2 className="text-sm font-medium">People you brought · {team.length}</h2>
            <div className="mt-3 divide-y divide-white/10">
              {team.length === 0 ? <p className="py-3 text-sm text-white/40">No signups on your link yet.</p> : null}
              {team.map((u) => (
                <div key={u.id} className="flex items-center justify-between py-3 text-sm">
                  <span>{u.fullName}<span className="text-white/40"> @{u.username}</span></span>
                  <span className="text-white/50">{u.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#10182a] p-5">
            <h2 className="text-sm font-medium">Payouts</h2>
            <div className="mt-3 divide-y divide-white/10">
              {earns.length === 0 ? <p className="py-3 text-sm text-white/40">Nothing approved yet.</p> : null}
              {earns.map((e) => (
                <div key={e.id} className="flex items-center justify-between py-3 text-sm">
                  <span>{e.source} · {e.percent}%</span>
                  <span className="text-emerald-400">GHS {Number(e.amount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </section>

          {ready ? (
            <section>
              <h2 className="mb-3 text-sm font-medium text-white/50">Your predictions</h2>
              <LiveBoard />
            </section>
          ) : (
            <Link href="/pay" className="inline-block rounded-full bg-[#ff2d55] px-4 py-2 text-sm font-semibold text-white">Pay account fee</Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat(props: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#10182a] p-4">
      <p className="text-xs text-white/40">{props.k}</p>
      <p className="mt-2 text-2xl font-semibold">{props.v}</p>
    </div>
  );
}