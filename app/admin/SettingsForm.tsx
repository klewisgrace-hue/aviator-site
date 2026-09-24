"use client";
import { useEffect, useState } from "react";

export function SettingsForm() {
  const [msg, setMsg] = useState("");
  const [ready, setReady] = useState(false);
  const [values, setValues] = useState({
    network: "TELECEL",
    number: "0204375237",
    accountName: "MARY TETTEH",
    network2: "",
    number2: "",
    accountName2: "",
    regularPrice: "50",
    regularDiamonds: "30",
    vipPrice: "80",
    vipDiamonds: "60",
    vvipPrice: "180",
    vvipDiamonds: "150",
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        const momo = data.momo || {};
        const byName: Record<string, { price: string; diamonds: number }> = {};
        for (const p of data.packs || []) byName[String(p.name).toLowerCase()] = p;
        setValues((old) => ({
          ...old,
          network: momo.network || old.network,
          number: momo.number || old.number,
          accountName: momo.name || old.accountName,
          network2: momo.network2 || "",
          number2: momo.number2 || "",
          accountName2: momo.name2 || "",
          regularPrice: byName.regular ? String(byName.regular.price) : old.regularPrice,
          regularDiamonds: byName.regular ? String(byName.regular.diamonds) : old.regularDiamonds,
          vipPrice: byName.vip ? String(byName.vip.price) : old.vipPrice,
          vipDiamonds: byName.vip ? String(byName.vip.diamonds) : old.vipDiamonds,
          vvipPrice: byName.vvip ? String(byName.vvip.price) : old.vvipPrice,
          vvipDiamonds: byName.vvip ? String(byName.vvip.diamonds) : old.vvipDiamonds,
        }));
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);
function set(key: string, value: string) {
    setValues((old) => ({ ...old, [key]: value }));
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("Saving...");
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setMsg(res.ok ? "Saved. The pay page now shows this name and number." : "Save failed");
  }

  const box = "mt-1 w-full rounded-xl border border-white/10 bg-black px-3 py-3 text-white";
  if (!ready) return <p className="text-sm text-white/50">Loading settings...</p>;

  return (
    <form onSubmit={save} className="space-y-3">
      <p className="text-xs tracking-widest text-orange-400">MOBILE MONEY</p>
      <label className="block text-sm text-white/50">Network
        <input value={values.network} onChange={(e) => set("network", e.target.value)} className={box} />
      </label>
      <label className="block text-sm text-white/50">Mobile money number
        <input value={values.number} onChange={(e) => set("number", e.target.value)} className={box} />
      </label>
      <label className="block text-sm text-white/50">Account name
        <input value={values.accountName} onChange={(e) => set("accountName", e.target.value)} className={box} />
      </label>
      <p className="pt-2 text-xs tracking-widest text-orange-400">SECOND NUMBER (OPTIONAL)</p>
      <label className="block text-sm text-white/50">Network 2
        <input value={values.network2} onChange={(e) => set("network2", e.target.value)} className={box} placeholder="MTN" />
      </label>
      <label className="block text-sm text-white/50">Number 2
        <input value={values.number2} onChange={(e) => set("number2", e.target.value)} className={box} />
      </label>
      <label className="block text-sm text-white/50">Name 2
        <input value={values.accountName2} onChange={(e) => set("accountName2", e.target.value)} className={box} />
      </label>
      <p className="pt-2 text-xs tracking-widest text-orange-400">DIAMOND PACKS</p>
      <label className="block text-sm text-white/50">Regular price GHS<input value={values.regularPrice} onChange={(e) => set("regularPrice", e.target.value)} className={box} /></label>
      <label className="block text-sm text-white/50">Regular diamonds<input value={values.regularDiamonds} onChange={(e) => set("regularDiamonds", e.target.value)} className={box} /></label>
      <label className="block text-sm text-white/50">VIP price GHS<input value={values.vipPrice} onChange={(e) => set("vipPrice", e.target.value)} className={box} /></label>
      <label className="block text-sm text-white/50">VIP diamonds<input value={values.vipDiamonds} onChange={(e) => set("vipDiamonds", e.target.value)} className={box} /></label>
      <label className="block text-sm text-white/50">VVIP price GHS<input value={values.vvipPrice} onChange={(e) => set("vvipPrice", e.target.value)} className={box} /></label>
      <label className="block text-sm text-white/50">VVIP diamonds<input value={values.vvipDiamonds} onChange={(e) => set("vvipDiamonds", e.target.value)} className={box} /></label>
      <button className="w-full rounded-full bg-orange-500 py-3 font-semibold text-black">Save</button>
      {msg ? <p className="text-sm text-emerald-400">{msg}</p> : null}
    </form>
  );
}