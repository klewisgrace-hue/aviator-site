"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PayAction(props: { paymentId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function run(action: string) {
    setBusy(true);
    await fetch("/api/admin/approve-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId: props.paymentId, action }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <span className="flex gap-2">
      <button disabled={busy} onClick={() => run("APPROVE")} className="rounded bg-emerald-600 px-2 py-1 text-xs">
        Approve
      </button>
      <button disabled={busy} onClick={() => run("REJECT")} className="rounded bg-[#ff2d55] px-2 py-1 text-xs">
        Reject
      </button>
    </span>
  );
}
