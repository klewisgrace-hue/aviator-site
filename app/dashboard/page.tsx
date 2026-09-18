import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const jar = await cookies();
  const raw = jar.get("aaa_user");
  if (!raw) {
    return (
      <main style={{ minHeight: "100vh", background: "#070b14", color: "#fff", padding: 40 }}>
        <p>Not signed in.</p>
        <p><Link href="/login" style={{ color: "#ff2d55" }}>Login</Link></p>
      </main>
    );
  }

  let id = "";
  try {
    const parsed = JSON.parse(raw.value);
    id = parsed.id ? String(parsed.id) : "";
  } catch (e) {
    id = "";
  }

  const user = id ? await prisma.user.findUnique({ where: { id: id } }) : null;
  if (!user) {
    return (
      <main style={{ minHeight: "100vh", background: "#070b14", color: "#fff", padding: 40 }}>
        <p>Session expired.</p>
        <p><Link href="/login" style={{ color: "#ff2d55" }}>Login</Link></p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#070b14", color: "#fff", padding: 40 }}>
      <p style={{ color: "#ff2d55" }}>AVIATOR ANALYTICS</p>
      <h1>Dashboard</h1>
      <p>{user.fullName} ? @{user.username} ? {user.status}</p>
      <p style={{ fontSize: 42 }}>{user.diamondBalance} diamonds</p>
      <p>Role: {user.role}</p>
      <p><Link href="/packages" style={{ color: "#ff2d55" }}>Buy diamonds</Link></p>
    </main>
  );
}
