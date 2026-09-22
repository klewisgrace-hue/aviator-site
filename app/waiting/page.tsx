"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function WaitingPage() {
  const router = useRouter();
  const [status, setStatus] = useState("PENDING");

  useEffect(() => {
    let stop = false;
    async function tick() {
      const res = await fetch("/api/me", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (stop) return;
      if (data.ready) {
        router.replace("/dashboard");
        return;
      }
      setStatus(data.status || "PENDING");
    }
    tick();
    const id = setInterval(tick, 4000);
    return () => { stop = true; clearInterval(id); };
  }, [router]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#1a0f0a] px-6 text-center text-[#f5e6d3]">
      <div className="max-w-sm">
        <p className="text-orange-400">AVIATOR AI</p>
        <h1 className="mt-3 text-3xl font-bold">Wait for admin approval</h1>
        <p className="mt-3 text-white/60">
          Your account fee proof was sent. Status: {status}. Keep this page open. When admin Approves, you enter the dashboard automatically. You stay logged in.
        </p>
        <Link href="/pay" className="mt-8 inline-block text-sm text-orange-400">Back to payment</Link>
      </div>
    </main>
  );
}
