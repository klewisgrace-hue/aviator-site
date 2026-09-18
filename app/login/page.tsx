"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.get("fullName"),
        username: form.get("username"),
        email: form.get("email"),
        phone: form.get("phone"),
        password: form.get("password"),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setErr(data.error || "Could not register");
      return;
    }
    setMsg(data.message || "Created.");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-5">
      <form onSubmit={onSubmit} className="w-full rounded-2xl border border-white/10 bg-[#0e1524] p-6">
        <h1 className="text-xl font-semibold">Create account</h1>
        {["fullName","username","email","phone","password"].map((name) => (
          <div key={name} className="mt-4">
            <label className="block text-xs text-white/50">{name}</label>
            <input name={name} type={name === "password" ? "password" : "text"} required={name !== "phone"} className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2" />
          </div>
        ))}
        {err && <p class
@'
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
    if (!res.ok) {
      setErr(data.error || "Login failed");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-5">
      <form onSubmit={onSubmit} className="w-full rounded-2xl border border-white/10 bg-[#0e1524] p-6">
        <h1 className="text-xl font-semibold">Login</h1>
        <label className="mt-5 block text-xs text-white/50">Email or username</label>
        <input name="email" className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2" />
        <label className="mt-4 block text-xs text-white/50">Password</label>
        <input type="password" name="password" className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2" />
        {err && <p className="mt-3 text-sm text-[#ff2d55]">{err}</p>}
        <button disabled={loading} className="mt-5 w-full rounded-lg bg-[#ff2d55] py-2.5 text-sm font-semibold">{loading ? "Checking..." : "Continue"}</button>
        <p className="mt-4 text-center text-sm text-white/45"><Link href="/register">Create account</Link></p>
      </form>
    </main>
  );
}
