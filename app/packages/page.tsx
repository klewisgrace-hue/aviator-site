import { cookies } from "next/headers";
import Link from "next/link";
import { PayButton } from "./PayButton";

const packs = [
  { name: "Starter", amount: 30, diamonds: 20, analyses: 10 },
  { name: "Gold", amount: 80, diamonds: 60, analyses: 35 },
  { name: "Platinum", amount: 180, diamonds: 150, analyses: 90 },
  { name: "Diamond", amount: 420, diamonds: 400, analyses: 250 },
];

export default async function PackagesPage() {
  const raw = (await cookies()).get("aaa_user");
  return (
    <main className="min-h-screen bg-[#070b14] px-5 py-10 text-[#eef3ff]">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs tracking-[0.2em] text-[#ff2d55]">AVIATOR AI</p>
        <h1 className="mt-2 text-3xl font-semibold">Diamond packages</h1>
        <p className="mt-2 max-w-xl text-white/55">
          Pay with MoMo number. Admin approves the pending payment, then diamonds are credited and your account becomes ACTIVE.
        </p>
        {!raw ? (
          <p className="mt-4">
            <Link href="/login" className="text-[#ff2d55]">Login first</Link>
          </p>
        ) : null}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {packs.map((p) => (
            <div key={p.name} className="rounded-2xl border border-white/10 bg-[#0e1524] p-5">
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p className="mt-2 text-2xl text-[#ff2d55]">GHS {p.amount}</p>
              <p className="mt-2 text-sm text-white/50">+ {p.diamonds} diamonds</p>
              <p className="text-sm text-white/50">+ {p.analyses} analyses</p>
              <PayButton name={p.name} amount={p.amount} diamonds={p.diamonds} />
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm">
          <Link href="/dashboard" className="text-white/60">Back to dashboard</Link>
        </p>
      </div>
    </main>
  );
}
