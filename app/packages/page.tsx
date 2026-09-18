import { Nav } from "@/components/Nav";
import { packages } from "@/lib/demo";

export default function PackagesPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12">
        <h1 className="text-3xl font-semibold">Diamond packages</h1>
        <p className="mt-2 max-w-xl text-white/60">
          Prices in GHS. After MoMo is wired, each payment creates a PENDING row for admin approval,
          then diamonds are credited.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((p) => (
            <article key={p.name} className="flex flex-col rounded-2xl border border-white/10 bg-[#0e1524] p-5">
              <p className="text-xs text-[#f5c518]">{p.name}</p>
              <p className="mt-3 text-3xl font-semibold">GHS {p.price}</p>
              <p className="mt-2 text-sm text-white/60">{p.description}</p>
              <ul className="mt-4 space-y-1 text-sm text-white/70">
                <li>{p.diamonds} diamonds</li>
                <li>{p.analysesCount} analyses</li>
              </ul>
              <button className="mt-6 rounded-lg bg-[#ff2d55] py-2 text-sm font-semibold">
                Pay with MoMo
              </button>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
