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
  return (
    <main style={{minHeight:"100vh",background:"#070b14",color:"#eef3ff",display:"grid",placeItems:"center",padding:24,fontFamily:"sans-serif"}}>
      <form onSubmit={onSubmit} style={{width:"100%",maxWidth:420,background:"#0e1524",border:"1px solid #1e2a44",borderRadius:24,padding:28}}>
        <p style={{color:"#ff2d55",letterSpacing:"0.2em",fontSize:12}}>AVIATOR ANALYTICS</p>
        <h1>Welcome back</h1>
        <input name="email" placeholder="email or username" required style={{width:"100%",margin:"8px 0",padding:12,borderRadius:12,border:"1px solid #1e2a44",background:"#070b14",color:"#fff"}} />
        <input name="password" type="password" placeholder="password" required style={{width:"100%",margin:"8px 0",padding:12,borderRadius:12,border:"1px solid #1e2a44",background:"#070b14",color:"#fff"}} />
        {err ? <p style={{color:"#ff2d55"}}>{err}</p> : null}
        <button style={{width:"100%",marginTop:12,padding:14,border:0,borderRadius:999,background:"#ff2d55",color:"#fff"}}>{loading ? "Checking..." : "Continue"}</button>
        <p style={{textAlign:"center",marginTop:16}}><Link href="/register" style={{color:"#fff"}}>Create account</Link></p>
      </form>
    </main>
  );
}
