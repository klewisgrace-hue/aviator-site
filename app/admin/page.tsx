import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PayAction } from "./PayAction";
import { ActivateButton } from "./ActivateButton";
import { SettingsForm } from "./SettingsForm";
import { MakePartner } from "./MakePartner";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const raw = (await cookies()).get("aaa_user");
  if (!raw) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        <Link href="/login">Login</Link>
      </main>
    );
  }
  let id = "";
  try { id = String(JSON.parse(raw.value).id || ""); } catch { id = ""; }
  const me = id ? await prisma.user.findUnique({ where: { id } }) : null;
  const isAdmin = me && (me.role === "ADMIN" || me.role === "SUPER_ADMIN" || me.username === "siteadmin");
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        <p>Admin only</p>
        <p className="mt-2 text-sm text-white/50">Logged in as {me ? me.username + " / " + me.role : "nobody"}</p>
        <Link href="/login" className="text-orange-400">Login as siteadmin</Link>
      </main>
    );
  }

  const tab = ((await searchParams).tab || "home").toLowerCase();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, package: true },
    take: 30,
  });
  const pending = payments.filter((p) => p.status === "PENDING");
  const analyses = await prisma.analysis.count();
const earns = await prisma.partnerEarning.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  const partners = users.filter((u) => u.isPartner);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const tabs = [
    ["home", "Home"],
    ["users", "Users"],
    ["pay", "Pay"],
    ["tips", "Tips"],
    ["slips", "Slips"],
    ["site", "Site"],
    ["settings", "Settings"],
  ];

  return (
    <main className="min-h-screen bg-black px-4 py-5 text-[#f3e7d8]">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-orange-500 text-xs font-bold text-black">AA</span>
          <span className="font-semibold">AVIATOR AI</span>
        </div>
        <div className="flex gap-2 text-sm">
          <Link href="/dashboard" className="rounded-full border border-white/15 px-3 py-1">Desk</Link>
          <Link href="/login" className="rounded-full border border-white/15 px-3 py-1">Out</Link>
        </div>
      </header>

      <h1 className="mt-6 text-3xl font-semibold">Admin</h1>
      <p className="text-orange-400">Control room</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map(([key, label]) => (
          <Link
            key={key}
            href={"/admin?tab=" + key}
            className={tab === key
              ? "rounded-full bg-orange-500 px-3 py-1 text-sm font-semibold text-black"
              : "rounded-full border border-white/15 px-3 py-1 text-sm text-white/70"}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-orange-500/20 bg-[#1a120c] p-3 text-sm text-orange-200/80">
        Mark paid after a real MoMo screenshot. Then that user can open Predictions.
      </div>

      {(tab === "home" || tab === "pay") && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Card k="USERS" v={String(users.length)} />
            <Card k="PENDING" v={String(pending.length)} />
            <Card k="SLIPS" v={String(analyses)} />
          </div>
          <section className="mt-4 rounded-2xl border border-white/10 bg-[#16100c] p-4">
            <p className="text-xs tracking-widest text-orange-400">APPROVE PAYMENTS</p>
            <h2 className="mt-1 text-2xl">Waiting</h2>
            <div className="mt-4 space-y-4">
              {pending.length === 0 ? (
                <p className="text-sm text-white/40">No pending payments.</p>
              ) : pending.map((p) => (
                <div key={p.id} className="rounded-xl border border-white/10 p-3">
                  <p className="font-semibold">{p.user.fullName} · {p.package?.name || "REGULAR"}</p>
                  <p className="text-sm text-white/50">{p.user.email}</p>
                  <p className="mt-1 text-sm">GHS {String(p.amount)} · {p.status} · {p.phoneUsed || "no number"}</p>
                  <p className="text-xs text-white/40">{p.reference}</p>
                  {"proofImage" in p && (p as any).proofImage ? (
                    <img src={(p as any).proofImage} alt="proof" className="mt-3 max-h-56 rounded-lg border border-white/10" />
                  ) : null}
                  <div className="mt-3">
                    <PayAction paymentId={p.id} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {tab === "users" && (
        <section className="mt-4 space-y-3">
          {users.map((u) => (
            <div key={u.id} className="rounded-2xl border border-white/10 bg-[#16100c] p-4">
              <p className="font-semibold">{u.fullName}</p>
              <p className="text-sm text-white/50">@{u.username} · {u.email}</p>
              <p className="text-sm">{u.status} · {u.diamondBalance} diamonds</p>
              {u.isPartner ? <p className="text-sm text-orange-300">Partner {u.commissionRate}% · you keep {100 - u.commissionRate}%</p> : null}
              <div className="mt-2 flex flex-wrap gap-2">
                <ActivateButton userId={u.id} status={u.status} />
                <MakePartner userId={u.id} />
              </div>
            </div>
          ))}
        </section>
      )}
{tab === "users" && (
        <section className="mt-4 space-y-3">
          <h2 className="text-xl">Partner money</h2>
          {partners.length === 0 ? <p className="text-sm text-white/40">No partners yet. Tap Make partner on a user.</p> : null}
          {partners.map((u) => {
            const rows = earns.filter((e) => e.partnerId === u.id);
            const todayRows = rows.filter((e) => new Date(e.createdAt) >= start);
            const theirAll = rows.reduce((s, e) => s + Number(e.amount), 0);
            const theirToday = todayRows.reduce((s, e) => s + Number(e.amount), 0);
            const mine = (n: number, pct: number) => (pct > 0 ? (n * (100 - pct)) / pct : 0);
            return (
              <div key={u.id} className="rounded-2xl border border-orange-500/30 bg-[#16100c] p-4 text-sm">
                <p className="font-semibold">{u.fullName} · @{u.username}</p>
                <p className="text-orange-300">Their cut {u.commissionRate}% · Your cut {100 - u.commissionRate}%</p>
                <p className="mt-2">Today they made GHS {theirToday.toFixed(2)}</p>
                <p>Today you keep GHS {mine(theirToday, u.commissionRate).toFixed(2)}</p>
                <p className="mt-2">All time they made GHS {theirAll.toFixed(2)}</p>
                <p>All time you keep GHS {mine(theirAll, u.commissionRate).toFixed(2)}</p>
              </div>
            );
          })}
        </section>
      )}
      {tab === "tips" && (
        <section className="mt-4 rounded-2xl border border-white/10 bg-[#16100c] p-4">
          <p>Tips tab: send the Instant Virtuals Tips screenshot and I will match it next.</p>
        </section>
      )}

      {tab === "slips" && (
        <section className="mt-4 rounded-2xl border border-white/10 bg-[#16100c] p-4">
          <p>Analyses run: {analyses}</p>
        </section>
      )}

      {tab === "site" && (
        <section className="mt-4 rounded-2xl border border-white/10 bg-[#16100c] p-4">
          <p>Live site: aviator-site-beryl.vercel.app</p>
        </section>
      )}

      {tab === "settings" && (
        <section className="mt-4 rounded-2xl border border-white/10 bg-[#16100c] p-4">
          <p className="text-xs tracking-widest text-orange-400">DIAMONDS + PAYOUT</p>
          <h2 className="mt-1 text-2xl">Settings</h2>
          <SettingsForm />
        </section>
      )}
    </main>
  );
}

function Card(props: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#16100c] p-3">
      <p className="text-[11px] tracking-widest text-orange-400">{props.k}</p>
      <p className="mt-1 text-2xl">{props.v}</p>
    </div>
  );
}

function Field(props: { label: string; value: string }) {
  return (
    <label className="mt-4 block text-sm text-white/50">
      {props.label}
      <input defaultValue={props.value} className="mt-1 w-full rounded-xl border border-white/10 bg-black px-3 py-3 text-white" />
    </label>
  );
}
