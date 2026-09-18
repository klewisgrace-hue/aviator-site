"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
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
    if (res.ok) { setMsg(data.message ? data.message : "Created."); }
    else { setErr(data.error ? data.error : "Could not register"); }
  }
  const box = {width:"100%",margin:"6px 0 12px",padding:12,borderRadius:12,border:"1px solid #1e2a44",background:"#070b14",color:"#fff"};
  return (
    <main style={{minHeight:"100vh",background:"#070b14",color:"#eef3ff",display:"grid",placeItems:"center",padding:24,fontFamily:"sans-serif"}}>
      <form onSubmit={onSubmit} style={{width:"100%",maxWidth:420,background:"#0e1524",border:"1px solid #1e2a44",borderRadius:24,padding:28}}>
        <p style={{color:"#ff2d55",letterSpacing:"0.2em",fontSize:12}}>AVIATOR ANALYTICS</p>
        <h1>Create account</h1>
        <input name="fullName" placeholder="full name" required style={box} />
        <input name="username" placeholder="username" required style={box} />
        <input name="email" placeholder="email" required style={box} />
        <input name="phone" placeholder="phone" style={box} />
        <input name="password" type="password" placeholder="password" required style={box} />
        {err ? <p style={{color:"#ff2d55"}}>{err}</p> : null}
        {msg ? <p style={{color:"#22d3a6"}}>{msg}</p> : null}
        <button style={{width:"100%",padding:14,border:0,borderRadius:999,background:"#ff2d55",color:"#fff"}}>{loading ? "Saving..." : "Submit"}</button>
        <p style={{textAlign:"center",marginTop:16}}><Link href="/login" style={{color:"#fff"}}>Login</Link></p>
      </form>
    </main>
  );
}
