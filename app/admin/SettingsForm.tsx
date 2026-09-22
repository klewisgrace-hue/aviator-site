"use client";
import { useState } from "react";

export function SettingsForm() {
  const [msg, setMsg] = useState("");
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        regularPrice: f.get("regularPrice"),
        regularDiamonds: f.get("regularDiamonds"),
        vipPrice: f.get("vipPrice"),
        vipDiamonds: f.get("vipDiamonds"),
        vvipPrice: f.get("vvipPrice"),
        vvipDiamonds: f.get("vvipDiamonds"),
      }),
    });
    setMsg(res.ok ? "Saved. New buyers get these diamonds." : "Save failed");
  }
  const box = "mt-1 w-full rounded-xl border border-white/10 bg-black px-3 py-3 text-white";
  return (
    <form onSubmit={save} className="space-y-3">
      <label className="block text-sm text-white/50">Regular price GHS<input name="regularPrice" defaultValue="50" className={box} /></label>
      <label className="block text-sm text-white/50">Regular diamonds<input name="regularDiamonds" defaultValue="30" className={box} /></label>
      <label className="block text-sm text-white/50">VIP price GHS<input name="vipPrice" defaultValue="80" className={box} /></label>
      <label className="block text-sm text-white/50">VIP diamonds<input name="vipDiamonds" defaultValue="60" className={box} /></label>
      <label className="block text-sm text-white/50">VVIP price GHS<input name="vvipPrice" defaultValue="180" className={box} /></label>
      <label className="block text-sm text-white/50">VVIP diamonds<input name="vvipDiamonds" defaultValue="150" className={box} /></label>
      <button className="w-full rounded-full bg-orange-500 py-3 font-semibold text-black">Save prices</button>
      {msg ? <p className="text-sm text-emerald-400">{msg}</p> : null}
    </form>
  );
}
