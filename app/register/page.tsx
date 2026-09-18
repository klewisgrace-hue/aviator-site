"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
export default function RegisterPage() {
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(""); setMsg(""); setLoading(true);
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
    if (!res.ok) { setErr(data.error || "Could not register"); return; }
    setMsg(data.message || "Created. Wait for admin.");
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
        {err && <p className="mt-3 text-sm text-[#ff2d55]">{err}</p>}
        {msg && <p className="mt-3 text-sm text-[#22d3a6]">{msg}</p>}
        <button disabled={loading} className="mt-5 w-full rounded-lg bg-[#ff2d55] py-2.5 text-sm font-semibold">{loading ? "Saving..." : "Submit"}</button>
        <p className="mt-4 text-center text-sm"><Link href="/login">Login</Link></p>
      </form>
    </main>
  );
}
