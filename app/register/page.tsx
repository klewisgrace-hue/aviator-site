"use client";
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
    const data = await res.json().catch(function () { return {}; });
    setLoading(false);
    if (res.ok) {
      setMsg(data.message ? data.message : "Created. Wait for admin.");
    } else {
      setErr(data.error ? data.error : "Could not register");
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#070b14", color: "#fff", padding: 40 }}>
      <form onSubmit={onSubmit} style={{ maxWidth: 420 }}>
        <h1>Create account</h1>
        <p><input name="fullName" placeholder="full name" required /></p>
        <p><input name="username" placeholder="username" required /></p>
        <p><input name="email" placeholder="email" required /></p>
        <p><input name="phone" placeholder="phone" /></p>
        <p><input name="password" type="password" placeholder="password" required /></p>
        {err ? <p style={{ color: "#ff2d55" }}>{err}</p> : null}
        {msg ? <p style={{ color: "#22d3a6" }}>{msg}</p> : null}
        <button disabled={loading}>{loading ? "Saving..." : "Submit"}</button>
      </form>
      <p><a href="/login" style={{ color: "#ff2d55" }}>Login</a></p>
    </main>
  );
}
