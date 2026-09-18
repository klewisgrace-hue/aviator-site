import Link from "next/link";
import { Nav } from "@/components/Nav";

export default function RegisterPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-16">
        <form action="/dashboard" className="rounded-2xl border border-white/10 bg-[#0e1524] p-6">
          <h1 className="text-xl font-semibold">Create account</h1>
          <p className="mt-1 text-sm text-white/50">
            New accounts are PENDING until an admin activates them. Matches your Prisma schema.
          </p>
          {[
            ["fullName", "Full name", "Kwame Mensah"],
            ["username", "Username", "kwame"],
            ["email", "Email", "kwame@email.com"],
            ["phone", "Phone (MoMo)", "0240000000"],
          ].map(([name, label, hint]) => (
            <div key={name} className="mt-4">
              <label className="block text-xs text-white/50">{label}</label>
              <input
                name={name}
                placeholder={hint}
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2"
              />
            </div>
          ))}
          <div className="mt-4">
            <label className="block text-xs text-white/50">Password</label>
            <input
              type="password"
              name="password"
              className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2"
            />
          </div>
          <button className="mt-5 w-full rounded-lg bg-[#ff2d55] py-2.5 text-sm font-semibold">
            Submit for approval
          </button>
          <p className="mt-4 text-center text-sm text-white/45">
            Already registered?{" "}
            <Link href="/login" className="text-white">
              Login
            </Link>
          </p>
        </form>
      </main>
    </>
  );
}
