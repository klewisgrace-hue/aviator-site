import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
export default async function DashboardPage() {
  const raw = (await cookies()).get("aaa_user");
  if (!raw) return <main className="min-h-screen bg-[#070b14] p-10 text-white"><Link href="/login">Login</Link></main>;
  let id = "";
  try { id = String(JSON.parse(raw.value).id || ""); } catch (e) { id = ""; }
  const user = id ? await prisma.user.findUnique({ where: { id } }) : null;
  if (!user) return <main className="min-h-screen bg-[#070b14] p-10 text-white"><Link href="/login">Login</Link></main>;
  return (
    <div className="min-h-screen bg-[#070b14] text-white md:pl-52">
      <aside className="fixed hidden h-screen w-52 border-r border-white/10 p-4 md:block">
        <p className="text-[#ff2d55]">AVIATOR AI</p>
        <Link href="/dashboard" className="mt-4 block text-[#ff2d55]">Dashboard</Link>
        <Link href="/packages" className="mt-2 block text-white/50">Wallet</Link>
        <Link href="/admin" className="mt-2 block text-white/50">Admin</Link>
      </aside>
      <header className="flex justify-between border-b border-white/10 p-4">
        <h1>Good evening, {user.fullName}</h1>
        <span className="text-emerald-400">{user.diamondBalance} diamonds</span>
      </header>
      <section className="m-4 rounded-2xl bg-[#0e1524] p-6">
        <p className="text-white/40 text-xs">LAYOUT SAMPLE</p>
        <p className="text-5xl text-emerald-400">2.14x</p>
      </section>
      <p className="px-4"><Link href="/packages" className="text-[#ff2d55]">Deposit</Link></p>
    </div>
  );
}
