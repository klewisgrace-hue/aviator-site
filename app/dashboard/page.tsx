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
  try { id = String(JSON.parse(raw.value).id || ""); } catch { id = ""; }
  const user = id
    ? await prisma.user.findUnique({ where: { id }, include: { payments: true } })
    : null;
  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#070b14] text-white">
        <Link href="/login" className="text-[#ff2d55]">Login</Link>
      </main>
    );
  }

  const paid = user.payments.some((p) => p.status === "APPROVED");
  const ready = user.status === "ACTIVE" && paid;

  return (
    <div className="min-h-screen bg-[#070b14] text-[#e8eefc]">
      <aside className="fixed inset-y-0 left-0 hidden w-[210px] border-r border-white/10 bg-[#080d18] p-4 md:flex md:flex-col">
        <p className="font-semibold text-[#ff2d55]">✈️ AVIATOR AI</p>
        <nav className="mt-6 space-y-1 text-sm">
          <Link href="/dashboard" className="block rounded-lg bg-[#ff2d55]/15 px-3 py-2 text-[#ff2d55]">Dashboard</Link>
          <Link href="/analyze" className="block rounded-lg px-3 py-2 text-white/55">Predictions</Link>
          <Link href="/packages" className="block rounded-lg px-3 py-2 text-white/55">Wallet</Link>
          <Link href="/admin" className="block rounded-lg px-3 py-2 text-white/55">Admin</Link>
        </nav>
        <div className="mt-auto rounded-xl border border-white/10 p-3 text-xs text-white/50">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />
          Connected
        </div>
      </aside>

      <div className="md:pl-[210px]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div>
            <h1 className="text-xl font-semibold">Good evening, {user.fullName}</h1>
            <p className="text-sm text-white/45">Here is your AI-powered crash prediction overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm">
              <div className="text-[11px] text-emerald-300">Diamonds</div>
              <div className="font-semibold text-emerald-400">{user.diamondBalance}</div>
            </div>
            <Link href="/packages" className="rounded-full bg-[#ff2d55] px-4 py-2 text-sm font-semibold">Buy diamonds</Link>
          </div>
        </header>

        <div className="space-y-4 p-5">
          {!ready ? (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
              <h2 className="text-lg font-semibold">Waiting for admin</h2>
              <p className="mt-2 text-sm text-white/70">Pay the account fee, then wait for Approve.</p>
              <Link href="/pay" className="mt-4 inline-block rounded-full bg-orange-500 px-4 py-2 text-sm text-black">Pay account fee</Link>
            </div>
          ) : (
            <LiveBoard />
          )}
        </div>
      </div>
    </div>
  );
}
