"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function ActivateButton(props: { userId: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function run(next: string) {
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
    return <button disabled={busy} onClick={function () { run("PENDING"); }}>Hold</button>;
  }
  return <button disabled={busy} onClick={function () { run("ACTIVE"); }}>Activate</button>;
}
