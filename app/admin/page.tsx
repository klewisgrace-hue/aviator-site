import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ActivateButton } from "./ActivateButton";
import { PayAction } from "./PayAction";

export default async function AdminPage() {
  const raw = (await cookies()).get("aaa_user");
  if (!raw) {
    return (
      <main className="min-h-screen bg-[#070b14] p-10 text-white">
        <Link href="/login">Login</Link>
      </main>
    );
  }
  let id = "";
  try { id = String(JSON.parse(raw.value).id || ""); } catch { id = ""; }
  const me = id ? await prisma.user.findUnique({ where: { id } }) : null;
  if (!me || (me.role !== "ADMIN" && me.role !== "SUPER_ADMIN")) {
    return (
      <main className="min-h-screen bg-[#070b14] p-10 text-white">
        <p>Admin only. Set role to ADMIN in Neon.</p>
        <Link href="/dashboard" className="text-[#ff2d55]">Dashboard</Link>
      </main>
    );
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, package: true },
    take: 20,
  });
  const pendingPay = payments.filter((p) => p.status === "PENDING");
  const approved = payments.filter((p) => p.status === "APPROVED");
  const active = users.filter((u) => u.status === "ACTIVE");
  const pendingUsers = users.filter((u) => u.status === "PENDING");
  const revenue = approved.reduce((sum, p) => sum + Number(p.amount), 0);

  const nav = [
    ["Overview", "/admin", true],
    ["Users", "/admin", false],
    ["Payments", "/admin", false],
    ["Withdrawals", "/admin", false],
    ["Packages", "/packages", false],
    ["Referrals", "/admin", false],
    ["Signals", "/analyze", false],
    ["Logs", "/admin", false],
    ["Settings", "/admin", false],
  ] as const;

  return (
    <div className="min-h-screen bg-[#070b14] text-[#e8eefc]">
      <aside className="fixed inset-y-0 left-0 hidden w-[220px] border-r border-white/10 bg-[#080d18] p-4 md:flex md:flex-col">
        <div className="flex items-center gap-2 text-[#ff2d55]">
          <span>✈️</span>
          <div>
            <p className="font-semibold leading-none">AVIATOR AI</p>
            <p className="mt-1 text-[10px] tracking-widest text-white/40">ADMIN CONSOLE</p>
          </div>
        </div>
        <nav className="mt-8 space-y-1 text-sm">
          {nav.map(([label, href, on]) => (
            <Link
              key={label}
              href={href}
              className={on
                ? "block rounded-lg bg-[#ff2d55]/15 px-3 py-2 text-[#ff2d55]"
                : "block rounded-lg px-3 py-2 text-white/55 hover:bg-white/5"}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-white/10 p-3 text-xs">
          <p className="font-medium">{me.fullName}</p>
          <p className="text-emerald-400">{me.role} · Online</p>
        </div>
      </aside>

      <div className="md:pl-[220px]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <h1 className="text-2xl font-semibold">Admin Overview</h1>
          <input
            placeholder="Search users..."
            className="w-56 rounded-lg border border-white/10 bg-[#0e1524] px-3 py-2 text-sm"
          />
        </header>

        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-6">
          <Stat label="Total Users" value={String(users.length)} sub={pendingUsers.length + " pending"} />
          <Stat label="Active Subs" value={String(active.length)} />
          <Stat label="Pending Deposits" value={String(pendingPay.length)} sub="Awaiting confirming" />
          <Stat label="Pending Withdrawals" value="0" sub="Require approval" />
          <Stat label="Today Revenue" value={"¢" + revenue.toFixed(0)} />
          <Stat label="Month Revenue" value={"¢" + revenue.toFixed(0)} />
        </div>

        <div className="grid gap-4 px-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#0e1524] p-4 lg:col-span-1">
            <p className="text-sm text-white/60">Revenue (Last 14 Days) — GHS</p>
            <svg viewBox="0 0 280 120" className="mt-3 h-28 w-full">
              <path d="M0 80 C40 70 60 30 90 40 C120 50 140 85 170 55 C200 30 230 45 280 35" fill="none" stroke="#22c55e" strokeWidth="3" />
            </svg>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0e1524] p-4">
            <p className="text-sm text-white/60">New Users vs Churn</p>
            <div className="mt-4 flex h-24 items-end gap-1">
              {users.slice(0, 12).map((u) => (
                <div key={u.id} className="flex-1 bg-emerald-500/70" style={{ height: u.status === "ACTIVE" ? "80%" : "40%" }} />
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0e1524] p-4">
            <p className="font-medium">Needs action</p>
            <p className="mt-1 text-xs text-white/40">{pendingPay.length} deposits to approve</p>
            <div className="mt-3 space-y-3">
              {pendingPay.length === 0 ? (
                <p className="text-sm text-white/40">No pending deposits.</p>
              ) : pendingPay.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2 text-sm">
                  <div>
                    <p>{p.user.fullName}</p>
                    <p className="text-xs text-white/40">GHS {String(p.amount)} · {p.reference}</p>
                  </div>
                  <PayAction paymentId={p.id} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <div className="flex items-center justify-between bg-[#0e1524] px-4 py-3">
              <h2 className="font-medium">Latest transactions</h2>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="text-white/40">
                <tr>
                  <th className="px-4 py-2">Time</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-white/10">
                    <td className="px-4 py-2 text-white/50">{p.createdAt.toISOString().slice(11, 16)}</td>
                    <td>{p.user.fullName}</td>
                    <td><span className="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-300">Deposit</span></td>
                    <td>GHS {String(p.amount)}</td>
                    <td>MoMo GH</td>
                    <td className={p.status === "APPROVED" ? "text-emerald-400" : "text-amber-400"}>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-8 font-medium">Users</h2>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0e1524] text-white/40">
                <tr>
                  <th className="p-3">Name</th>
                  <th>Username</th>
                  <th>Status</th>
                  <th>Diamonds</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-white/10">
                    <td className="p-3">{u.fullName}</td>
                    <td>{u.username}</td>
                    <td>{u.status}</td>
                    <td>{u.diamondBalance}</td>
                    <td><ActivateButton userId={u.id} status={u.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat(props: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0e1524] p-4">
      <p className="text-xs text-white/45">{props.label}</p>
      <p className="mt-1 text-2xl font-semibold">{props.value}</p>
      {props.sub ? <p className="text-xs text-white/35">{props.sub}</p> : null}
    </div>
  );
}
