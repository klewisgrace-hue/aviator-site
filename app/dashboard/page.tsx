import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { LiveBoard } from "@/components/LiveBoard";

export default async function DashboardPage() {
  const raw = (await cookies()).get("aaa_user");
  if (!raw) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#070b14] text-white">
        <Link href="/login" className="text-[#ff2d55]">Login</Link>
      </main>
    );
  }
  let id = "";
  try {
    id = String(JSON.parse(raw.value).id || "");
  } catch {
    id = "";
  }
  const user = id
    ? await prisma.user.findUnique({
        where: { id },
        include: { payments: { orderBy: { createdAt: "desc" }, take: 5 } },
      })
    : null;
  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#070b14] text-white">
        <Link href="/login" className="text-[#ff2d55]">Login</Link>
      </main>
    );
  }

  const paid = user.payments.some((p) => p.status === "APPROVED");
  const locked = user.status !== "ACTIVE" || !paid;

  return (
    <div className="min-h-screen bg-[#070b14] text-[#e8eefc]">
      <aside className="fixed inset-y-0 left-0 hidden w-[210px] border-r border-white/10 bg-[#080d18] p-4 md:flex md:flex-col">
        <p className="font-semibold text-[#ff2d55]">AVIATOR AI</p>
        <nav className="mt-6 space-y-1 text-sm">
          <Link href="/dashboard" className="block rounded-lg bg-[#ff2d55]/15 px-3 py-2 text-[#ff2d55]">Dashboard</Link>
          <Link href="/analyze" className="block rounded-lg px-3 py-2 text-white/55">Predictions</Link>
          <Link href="/packages" className="block rounded-lg px-3 py-2 text-white/55">Wallet</Link>
          <Link href="/admin" className="block rounded-lg px-3 py-2 text-white/55">Admin</Link>
        </nav>
        <div className="mt-auto rounded-xl border border-white/10 p-3 text-xs text-white/50">
          {user.status} · @{user.username}
        </div>
      </aside>

      <div className="md:pl-[210px]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div>
            <h1 className="text-xl font-semibold">Good evening, {user.fullName}</h1>
            <p className="text-sm text-white/45">Pay a package, wait for admin, then the live board unlocks.</p>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            {user.diamondBalance} diamonds
          </div>
        </header>

        <div className="space-y-4 p-5">
          {locked ? (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
              <h2 className="text-lg font-semibold">Payment required</h2>
              <p className="mt-2 text-sm text-white/70">
                Account status: {user.status}. After you pay, an admin must Approve. Then this board goes live and diamonds are added.
              </p>
              <Link href="/packages" className="mt-4 inline-block rounded-full bg-[#ff2d55] px-5 py-2 text-sm">
                Pay a package
              </Link>
            </div>
          ) : (
            <LiveBoard />
          )}
        </div>
      </div>
    </div>
  );
}
