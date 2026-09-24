"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
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
        ref: form.get("ref") || new URLSearchParams(window.location.search).get("ref"),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setErr(data.error || "Could not register");
      return;
    }
    router.push("/pay");
  }

  const box = { width: "100%", margin: "6px 0 12px", padding: 12, borderRadius: 12, border: "1px solid #1e2a44", background: "#070b14", color: "#fff" };
  return (
    <main className="grid min-h-screen place-items-center bg-[#070b14] px-5 text-white">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0e1524] p-6">
        <p className="text-xs tracking-[0.2em] text-[#ff2d55]">AVIATOR AI</p>
        <h1 className="mt-2 text-2xl font-semibold">Create account</h1>
        <p className="mt-1 text-sm text-white/50">After this you pay the account fee.</p>
        <input name="fullName" placeholder="full name" required style={box} />
        <input name="username" placeholder="username" required style={box} />
        <input name="email" placeholder="email" required style={box} />
        <input name="phone" placeholder="phone" style={box} />
        <input name="password" type="password" placeholder="password" required style={box} />
        <input name="ref" placeholder="partner code (optional)" style={box} />
        {err ? <p className="text-sm text-[#ff2d55]">{err}</p> : null}
        <button disabled={loading} className="mt-2 w-full rounded-full bg-[#ff2d55] py-3 font-semibold">
          {loading ? "Saving..." : "Create and pay fee"}
        </button>
        <p className="mt-4 text-center text-sm text-white/50">
          <Link href="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
