"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    const data = await res.json().catch(function () { return {}; });
    setLoading(false);
    if (res.ok) { router.push("/dashboard"); }
    else { setErr(data.error ? data.error : "Login failed"); }
  }

  const field = {
    width: "100%",
    margin: "8px 0",
    padding: 14,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
  };

  return (
    <main style={{ minHeight: "100vh", position: "relative", overflow: "hidden", color: "#eef3ff", display: "grid", placeItems: "center", padding: 24, fontFamily: "sans-serif", background: "#05070f" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% 110%, #1a050c 0%, transparent 60%), radial-gradient(ellipse 70% 40% at 70% 0%, rgba(255,45,85,0.35), transparent 55%), radial-gradient(ellipse 50% 30% at 20% 20%, rgba(245,197,24,0.12), transparent 50%), linear-gradient(#070b16, #12060c)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "44px 44px", maskImage: "linear-gradient(to top, black, transparent 70%)" }} />
      <div style={{ position: "absolute", left: "-10%", right: "-10%", bottom: "18%", height: 180, background: "linear-gradient(90deg, transparent, rgba(255,45,85,0.0) 10%, rgba(255,45,85,0.85) 55%, rgba(245,197,24,0.9) 78%, transparent)", clipPath: "polygon(0 90%, 45% 55%, 72% 22%, 100% 0, 100% 8%, 74% 28%, 48% 62%, 0 100%)", opacity: 0.9 }} />
      <p style={{ position: "absolute", right: "12%", top: "22%", margin: 0, fontSize: 64, fontWeight: 800, color: "rgba(34,211,166,0.18)", letterSpacing: "-0.04em" }}>5.40x</p>

      <form onSubmit={onSubmit} style={{ position: "relative", width: "100%", maxWidth: 420, background: "rgba(8,13,24,0.78)", border: "1px solid rgba(255,45,85,0.25)", borderRadius: 24, padding: 28, backdropFilter: "blur(16px)", boxShadow: "0 30px 80px rgba(255,45,85,0.12)" }}>
        <p style={{ color: "#ff2d55", letterSpacing: "0.22em", fontSize: 12, margin: 0 }}>AVIATOR AI</p>
        <h1 style={{ marginTop: 8, marginBottom: 16, fontSize: 28 }}>Welcome back</h1>
        <input name="email" placeholder="email or username" required style={field} />
        <input name="password" type="password" placeholder="password" required style={field} />
        {err ? <p style={{ color: "#ff2d55" }}>{err}</p> : null}
        <button style={{ width: "100%", marginTop: 12, padding: 14, border: 0, borderRadius: 999, background: "linear-gradient(90deg,#ff2d55,#ff7a45)", color: "#fff", fontWeight: 700 }}>
          {loading ? "Checking..." : "Continue"}
        </button>
        <p style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/register" style={{ color: "#fff" }}>Create account</Link>
        </p>
      </form>
    </main>
  );
}