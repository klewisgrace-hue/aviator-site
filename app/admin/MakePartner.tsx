"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function MakePartner({ userId }: { userId: string }) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  async function run() {
    const res = await fetch("/api/admin/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, percent: 20 }),
    });
    const data = await res.json().catch(() => ({}));
    setMsg(res.ok ? "Partner code " + data.code : data.error || "Failed");
    router.refresh();
  }
  return (
    <button onClick={run} className="rounded-full border border-orange-400/40 px-3 py-1 text-xs text-orange-300">
      {msg || "Make partner"}
    </button>
  );
}
