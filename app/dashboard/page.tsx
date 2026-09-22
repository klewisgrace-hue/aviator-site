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
    ? await prisma.user.findUnique({
        where: { id },
        include: { payments: true },
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
  const ready = user.status === "ACTIVE" && paid;

  return (
    <div className="min-h-screen bg-[#070b14] text-[#e8eefc]">
      <aside className="fixed hidden h-screen w-52 border-r border-white/10 p-4 md:block">
        <p className="font-semibold text-[#ff2d55]">AVIATOR AI</p>
        <nav className="mt-6 space-y-2 text-sm">
          <Link href="/dashboard" className="block rounded-lg bg-[#ff2d55]/15 px-3 py-2 text-[#ff2d55]">Dashboard</Link>
          <Link href="/analyze" className="block px-3 py-2 text-white/55">Predictions</Link>
          <Link href="/packages" className="block px-3 py-2 text-white/55">Buy diamonds</Link>
          <Link href="/pay" className="block px-3 py-2 text-white/55">Account fee</Link>
        </nav>
      </aside>
      <div className="md:pl-52">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div>
            <h1 className="text-xl font-semibold">Good evening, {user.fullName}</h1>
            <p className="text-sm text-white/45">@{user.username} · {user.status}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-emerald-300">
              {user.diamondBalance} diamonds
            </div>
            <Link href="/packages" className="rounded-full bg-[#ff2d55] px-4 py-2 text-sm font-semibold">
              Buy diamonds
            </Link>
          </div>
        </header>
        <div className="space-y-4 p-5">
          {!ready ? (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
              <h2 className="text-lg font-semibold">Waiting for admin</h2>
              <p className="mt-2 text-sm text-white/70">
                Pay the account fee, then wait. When admin Approves, this dashboard opens. You stay logged in.
              </p>
              <div className="mt-4 flex gap-3">
                <Link href="/pay" className="rounded-full bg-orange-500 px-4 py-2 text-sm text-black">Pay account fee</Link>
                <Link href="/waiting" className="rounded-full border border-white/15 px-4 py-2 text-sm">Waiting screen</Link>
              </div>
            </div>
          ) : (
            <LiveBoard />
          )}
          <Link href="/packages" className="inline-block rounded-full bg-[#ff2d55] px-5 py-2.5 text-sm font-semibold">
            Buy diamonds
          </Link>
        </div>
      </div>
    </div>
  );
}
