"use client";
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
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await res.json().catch(function () { return {}; });
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setErr(data.error ? data.error : "Login failed");
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#070b14", color: "#fff", padding: 40 }}>
      <form onSubmit={onSubmit} style={{ maxWidth: 420 }}>
        <h1>Login</h1>
        <p><input name="email" placeholder="email or username" required /></p>
        <p><input name="password" type="password" placeholder="password" required /></p>
        {err ? <p style={{ color: "#ff2d55" }}>{err}</p> : null}
        <button disabled={loading}>{loading ? "Checking..." : "Continue"}</button>
      </form>
    </main>
  );
}
