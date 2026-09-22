"use client";

import { useState } from "react";

export function PayButton(props: { name: string; amount: number; diamonds: number }) {
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [phone, setPhone] = useState("");

  async function pay() {
    setBusy(true);
    setErr("");
    setMsg("");
    const res = await fetch("/api/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: props.name,
        amount: props.amount,
        diamonds: props.diamonds,
        phone,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setErr(data.error || "Login first, then pay");
      return;
    }
    setMsg("Sent. Ref " + data.reference + ". Admin must approve before diamonds arrive.");
  }

  return (
    <div className="mt-4 space-y-2">
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="MoMo number"
        className="w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2 text-sm"
      />
      <button
        disabled={busy}
        onClick={pay}
        className="w-full rounded-lg bg-[#ff2d55] py-2 text-sm font-semibold"
      >
        {busy ? "Sending..." : "Pay GHS " + props.amount}
      </button>
      {err ? <p className="text-sm text-[#ff2d55]">{err}</p> : null}
      {msg ? <p className="text-sm text-emerald-400">{msg}</p> : null}
    </div>
  );
}
