"use client";

import { useState } from "react";
import Link from "next/link";

type Step = 1 | 2 | 3 | 4;

export default function PayWizardPage() {
  const [step, setStep] = useState<Step>(1);
  const [country, setCountry] = useState<"GH" | "NG" | "OTHER" | "">("");
  const [txId, setTxId] = useState("");
  const [senderName, setSenderName] = useState("");
  const [fromNumber, setFromNumber] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [proofImage, setProofImage] = useState("");

  const amount = country === "NG" ? 10000 : 50;
  const currency = country === "NG" ? "NGN" : "GHS";
  const diamonds = country === "NG" ? 40 : 30;

  async function submitProof() {
    setBusy(true);
    setErr("");
    setMsg("");
    const res = await fetch("/api/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: country === "NG" ? "Nigeria Starter" : "Ghana Starter",
        amount: country === "NG" ? 10000 : 50,
        diamonds,
        phone: fromNumber,
        senderName,
        txId,
        country,
        proofImage,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setErr(data.error || "Login first, then submit");
      return;
    }
    setMsg("Proof submitted. Ref " + data.reference + ". Wait for admin approval.");
    window.location.href = "/waiting";
  }

  return (
    <main className="min-h-screen bg-[#1a0f0a] text-[#f5e6d3]">
      <div className="mx-auto max-w-md px-4 py-8">
        <div className="mb-6 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-orange-500 text-sm font-bold text-black">AI</span>
          <span className="font-semibold tracking-wide">AVIATOR AI</span>
        </div>

        <p className="text-xs tracking-widest text-orange-400">STEP {step} OF 4</p>

        {step === 1 && (
          <div>
            <h1 className="mt-3 text-3xl font-bold leading-tight">
              SELECT YOUR <span className="text-orange-500">COUNTRY</span>
            </h1>
            <p className="mt-2 text-sm text-white/50">Choose your payment region to continue</p>
            <div className="mt-8 space-y-3">
              <button
                onClick={() => { setCountry("GH"); setStep(2); }}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#2a1810] px-4 py-4 text-left"
              >
                <span>
                  <span className="block font-semibold">Ghana</span>
                  <span className="text-sm text-white/50">GH¢50 — Pay via Mobile Money</span>
                </span>
                <span className="text-orange-400">›</span>
              </button>
              <button
                onClick={() => { setCountry("NG"); setStep(2); }}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#2a1810] px-4 py-4 text-left"
              >
                <span>
                  <span className="block font-semibold">Nigeria</span>
                  <span className="text-sm text-white/50">₦10,000 — Bank Transfer</span>
                </span>
                <span className="text-orange-400">›</span>
              </button>
              <button
                onClick={() => { setCountry("OTHER"); setStep(2); }}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#2a1810] px-4 py-4 text-left"
              >
                <span>
                  <span className="block font-semibold">Other Country</span>
                  <span className="text-sm text-orange-400">Pay via Telegram @virtuals_nyame</span>
                </span>
                <span className="text-orange-400">›</span>
              </button>
            </div>
            <Link href="/dashboard" className="mt-8 block text-center text-sm text-white/40">Cancel</Link>
          </div>
        )}

        {step === 2 && country === "GH" && (
          <div>
            <h1 className="mt-3 text-3xl font-bold">
              PAY VIA <span className="text-orange-500">MOBILE MONEY</span>
            </h1>
            <p className="mt-2 text-sm text-white/50">Send the exact amount, then upload your proof below</p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-[#2a1810] p-4">
              <p className="text-center text-xs tracking-widest text-white/40">↓ SEND TO ↓</p>
              <Row k="NETWORK" v="TELECEL" />
              <Row k="MOBILE MONEY NUMBER" v="0204375237" accent />
              <Row k="ACCOUNT NAME" v="MARY TETTEH" />
              <Row k="AMOUNT" v={"GH¢" + amount} green />
              <ol className="mt-4 space-y-2 text-sm text-white/70">
                <li>1. Dial *170# (MTN) / *110# (Telecel) / *718# (AT)</li>
                <li>2. Select Transfer / Send Money</li>
                <li>3. Enter the number shown above</li>
                <li>4. Enter the exact amount</li>
                <li>5. Confirm and enter PIN</li>
              </ol>
            </div>
            <button onClick={() => setStep(3)} className="mt-6 w-full rounded-full bg-orange-500 py-3 font-semibold text-black">
              I have paid →
            </button>
            <button onClick={() => setStep(1)} className="mt-3 w-full text-sm text-white/40">Back</button>
          </div>
        )}

        {step === 2 && country === "NG" && (
          <div>
            <h1 className="mt-3 text-3xl font-bold">
              PAY VIA <span className="text-orange-500">BANK</span>
            </h1>
            <p className="mt-2 text-sm text-white/50">Transfer ₦10,000 then upload proof</p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-[#2a1810] p-4 text-sm">
              <p>Send ₦10,000 and keep the receipt. Admin will approve after proof.</p>
            </div>
            <button onClick={() => setStep(3)} className="mt-6 w-full rounded-full bg-orange-500 py-3 font-semibold text-black">
              I have paid →
            </button>
            <button onClick={() => setStep(1)} className="mt-3 w-full text-sm text-white/40">Back</button>
          </div>
        )}

        {step === 2 && country === "OTHER" && (
          <div>
            <h1 className="mt-3 text-3xl font-bold">Other country</h1>
            <p className="mt-4 text-sm">Contact Telegram <span className="text-orange-400">@virtuals_nyame</span> to pay, then submit proof.</p>
            <button onClick={() => setStep(3)} className="mt-6 w-full rounded-full bg-orange-500 py-3 font-semibold text-black">
              Continue →
            </button>
            <button onClick={() => setStep(1)} className="mt-3 w-full text-sm text-white/40">Back</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="mt-3 text-2xl font-bold">Payment proof</h1>
            <label className="mt-6 block text-xs text-white/50">TRANSACTION ID (OPTIONAL)</label>
            <input value={txId} onChange={(e) => setTxId(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-[#2a1810] px-3 py-3" placeholder="e.g. 000012345678" />
            <label className="mt-4 block text-xs text-white/50">SENDER NAME (AS ON MOMO / BANK) *</label>
            <input value={senderName} onChange={(e) => setSenderName(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-[#2a1810] px-3 py-3" placeholder="e.g. Abel Afriyie" />
            <label className="mt-4 block text-xs text-white/50">YOUR NUMBER YOU PAID FROM *</label>
            <input value={fromNumber} onChange={(e) => setFromNumber(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-[#2a1810] px-3 py-3" placeholder="e.g. 0241234567" />
            <label className="mt-4 block text-xs text-white/50">UPLOAD PAYMENT SCREENSHOT *</label>
            <input type="file" accept="image/*" className="mt-2 w-full text-sm" onChange={async (e) => {
              const file = e.target.files && e.target.files[0];
              if (!file) return;
              if (file.size > 900000) { setErr("Image too large. Use a smaller screenshot."); return; }
              const reader = new FileReader();
              reader.onload = () => setProofImage(String(reader.result || ""));
              reader.readAsDataURL(file);
            }} />
            {proofImage ? <p className="mt-2 text-xs text-emerald-400">Screenshot attached</p> : null}
            <p className="mt-4 text-xs text-orange-300">
              IMPORTANT: Fake proof = permanent ban. Admin verifies manually.
            </p>
            {err ? <p className="mt-3 text-sm text-red-400">{err}</p> : null}
            <button
              disabled={busy || !senderName || !fromNumber || !proofImage}
              onClick={submitProof}
              className="mt-6 w-full rounded-full bg-orange-500 py-3 font-semibold text-black disabled:opacity-40"
            >
              {busy ? "Sending..." : "SUBMIT PAYMENT PROOF →"}
            </button>
            <button onClick={() => setStep(2)} className="mt-3 w-full text-sm text-white/40">Back</button>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <h1 className="mt-10 text-2xl font-bold text-emerald-400">Submitted</h1>
            <p className="mt-3 text-sm text-white/60">{msg}</p>
            <p className="mt-2 text-sm text-white/50">After admin Approves, you get diamonds and the live board unlocks.</p>
            <Link href="/dashboard" className="mt-8 inline-block rounded-full bg-orange-500 px-6 py-3 font-semibold text-black">
              Go to dashboard
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

function Row(props: { k: string; v: string; accent?: boolean; green?: boolean }) {
  return (
    <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-sm">
      <span className="text-white/40">{props.k}</span>
      <span className={props.accent ? "font-semibold text-orange-400" : props.green ? "font-semibold text-emerald-400" : ""}>
        {props.v}
      </span>
    </div>
  );
}
