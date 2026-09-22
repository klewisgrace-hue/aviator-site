import Link from "next/link";

export default function PackagesPage() {
  return (
    <main className="min-h-screen bg-[#070b14] px-5 py-16 text-[#eef3ff]">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-xs tracking-[0.2em] text-[#ff2d55]">AVIATOR AI</p>
        <h1 className="mt-3 text-3xl font-semibold">Buy diamonds</h1>
        <p className="mt-3 text-white/55">
          After you create an account, pay with MoMo / bank using the same style as Instant Virtuals. Admin approves, then diamonds unlock analysis (2 diamonds each).
        </p>
        <Link href="/pay" className="mt-8 inline-block rounded-full bg-orange-500 px-8 py-3 font-semibold text-black">
          Open payment wizard
        </Link>
        <p className="mt-6 text-sm">
          <Link href="/dashboard" className="text-white/50">Dashboard</Link>
        </p>
      </div>
    </main>
  );
}
