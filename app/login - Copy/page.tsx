import Link from "next/link";
import { Nav } from "@/components/Nav";

export default function LoginPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-16">
        <form
          action="/dashboard"
          className="rounded-2xl border border-white/10 bg-[#0e1524] p-6"
        >
          <h1 className="text-xl font-semibold">Login</h1>
          <p className="mt-1 text-sm text-white/50">
            Auth wires to the database next. This screen already routes into the dashboard preview.
          </p>
          <label className="mt-5 block text-xs text-white/50">Email or username</label>
          <input
            name="email"
            defaultValue="demo@aviator.local"
            className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2"
          />
          <label className="mt-4 block text-xs text-white/50">Password</label>
          <input
            type="password"
            name="password"
            defaultValue="Demo123!"
            className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2"
          />
          <button className="mt-5 w-full rounded-lg bg-[#ff2d55] py-2.5 text-sm font-semibold">
            Continue
          </button>
          <p className="mt-4 text-center text-sm text-white/45">
            No account?{" "}
            <Link href="/register" className="text-white">
              Register
            </Link>
          </p>
        </form>
      </main>
    </>
  );
}
