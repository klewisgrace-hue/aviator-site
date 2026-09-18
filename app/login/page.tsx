"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) { setErr(data.error || "Login failed"); return; }
    router.push("/dashboard");
  }
  return (
    <main className={"mx-auto flex min-h-screen max-w-md items-center px-5"}>
      <form onSubmit={onSubmit} className={"w-full rounded-2xl border border-white/10 bg-[#0e1524] p-6"}>
        <h1 className={"text-xl font-semibold"}>Login</h1>
        <input name={"email"} className={"mt-5 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2"} />
        <input type={"password"} name={"password"} className={"mt-4 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2"} />
        {err && <p className={"mt-3 text-sm text-[#ff2d55]"}>{err}</p>}
        <button className={"mt-5 w-full rounded-lg bg-[#ff2d55] py-2.5"}>{loading ? "..." : "Continue"}</button>
        <p className={"mt-4 text-center"}><Link href={"/register"}>Register</Link></p>
      </form>
    </main>
  );
}