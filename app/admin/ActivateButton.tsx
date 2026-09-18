"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function ActivateButton(props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function run(next) {
    setBusy(true);
    await fetch("/api/admin/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: props.userId, status: next }),
    });
    setBusy(false);
    router.refresh();
  }
  if (props.status === "ACTIVE") {
    return <button disabled={busy} onClick={function () { run("PENDING"); }} className="rounded bg-white/10 px-2 py-1 text-xs">Hold</button>;
  }
  return <button disabled={busy} onClick={function () { run("ACTIVE"); }} className="rounded bg-emerald-600 px-2 py-1 text-xs">Activate</button>;
}
