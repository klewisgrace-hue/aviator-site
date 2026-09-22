import { Nav } from "@/components/Nav";

const pendingUsers = [
  { name: "Ama Boateng", username: "ama", email: "ama@email.com" },
  { name: "Yaw Owusu", username: "yaw", email: "yaw@email.com" },
];

const pendingPayments = [
  { user: "ama", pack: "Gold", amount: 80, ref: "MOMO-2041" },
  { user: "yaw", pack: "Starter", amount: 30, ref: "MOMO-2042" },
];

export default function AdminPage() {
  return (
    <>
      <Nav signedIn />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12">
        <h1 className="text-3xl font-semibold">Admin</h1>
        <p className="mt-2 text-sm text-white/55">
          Approve accounts, confirm MoMo payments, adjust diamonds. Matches Role ADMIN / SUPER_ADMIN
          in Prisma.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-[#0e1524] p-5">
            <h2 className="text-sm text-white/60">Pending users</h2>
            <ul className="mt-4 space-y-3">
              {pendingUsers.map((u) => (
                <li key={u.username} className="flex items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div>
                    <p>{u.name}</p>
                    <p className="text-xs text-white/40">
                      @{u.username} · {u.email}
                    </p>
                  </div>
                  <button className="rounded-full bg-[#22d3a6]/20 px-3 py-1 text-xs text-[#22d3a6]">
                    Activate
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#0e1524] p-5">
            <h2 className="text-sm text-white/60">Pending payments</h2>
            <ul className="mt-4 space-y-3">
              {pendingPayments.map((p) => (
                <li key={p.ref} className="flex items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div>
                    <p>
                      @{p.user} · {p.pack}
                    </p>
                    <p className="text-xs text-white/40">
                      GHS {p.amount} · {p.ref}
                    </p>
                  </div>
                  <button className="rounded-full bg-[#f5c518]/20 px-3 py-1 text-xs text-[#f5c518]">
                    Approve
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
