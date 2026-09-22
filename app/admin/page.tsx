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
  try {
    id = String(JSON.parse(raw.value).id || "");
  } catch {
    id = "";
  }
  const me = id ? await prisma.user.findUnique({ where: { id } }) : null;
  if (!me || (me.role !== "ADMIN" && me.role !== "SUPER_ADMIN")) {
    return (
      <main className="min-h-screen bg-[#070b14] p-10 text-white">
        <p>Admin only. Set your role to ADMIN in Neon once.</p>
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
  const active = users.filter((u) => u.status === "ACTIVE");

  return (
    <div className="min-h-screen bg-[#070b14] text-[#eef3ff]">
      <aside className="fixed hidden h-screen w-52 border-r border-white/10 p-4 md:block">
        <p className="text-[#ff2d55]">AVIATOR AI</p>
        <p className="text-xs text-white/40">Admin console</p>
        <nav className="mt-6 space-y-2 text-sm">
          <span className="block rounded-lg bg-[#ff2d55]/20 px-3 py-2 text-[#ff2d55]">Overview</span>
          <Link href="/dashboard" className="block px-3 py-2 text-white/60">Member view</Link>
        </nav>
      </aside>
      <main className="p-5 md:pl-56">
        <h1 className="text-2xl font-semibold">Admin Overview</h1>
        <p className="text-white/50">{me.fullName} · {me.role}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#0e1524] p-4"><p className="text-xs text-white/50">Total users</p><p className="text-3xl">{users.length}</p></div>
          <div className="rounded-2xl border border-white/10 bg-[#0e1524] p-4"><p className="text-xs text-white/50">Active</p><p className="text-3xl">{active.length}</p></div>
          <div className="rounded-2xl border border-white/10 bg-[#0e1524] p-4"><p className="text-xs text-white/50">Pending deposits</p><p className="text-3xl">{pendingPay.length}</p></div>
          <div className="rounded-2xl border border-white/10 bg-[#0e1524] p-4"><p className="text-xs text-white/50">Payments</p><p className="text-3xl">{payments.length}</p></div>
        </div>
        <h2 className="mt-8 text-lg">Needs action</h2>
        <div className="mt-3 space-y-2">
          {pendingPay.length === 0 ? (
            <p className="text-sm text-white/45">No pending payments.</p>
          ) : (
            pendingPay.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0e1524] p-3">
                <div>
                  <p>{p.user.fullName} · {p.reference}</p>
                  <p className="text-sm text-white/50">GHS {String(p.amount)} · {p.package?.name || "Package"}</p>
                </div>
                <PayAction paymentId={p.id} />
              </div>
            ))
          )}
        </div>
        <h2 className="mt-8 text-lg">Users</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0e1524] text-white/50">
              <tr><th className="p-3">Name</th><th>Username</th><th>Status</th><th>Diamonds</th><th></th></tr>
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
      </main>
    </div>
  );
}
