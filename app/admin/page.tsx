import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ActivateButton } from "./ActivateButton";

export default async function AdminPage() {
  const raw = (await cookies()).get("aaa_user");
  if (!raw) {
    return <main className="min-h-screen bg-[#070b14] p-10 text-white"><Link href="/login">Login</Link></main>;
  }
  let id = "";
  try { id = String(JSON.parse(raw.value).id || ""); } catch (e) { id = ""; }
  const me = id ? await prisma.user.findUnique({ where: { id } }) : null;
  if (!me) {
    return <main className="min-h-screen bg-[#070b14] p-10 text-white">No session</main>;
  }
  if (me.role !== "ADMIN" && me.role !== "SUPER_ADMIN") {
    return <main className="min-h-screen bg-[#070b14] p-10 text-white">Admin only</main>;
  }
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <main className="min-h-screen bg-[#070b14] p-5 text-white">
      <h1 className="text-2xl">Admin</h1>
      <table className="mt-6 w-full text-left text-sm">
        <thead><tr><th className="p-2">Name</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {users.map(function (u) {
            return (
              <tr key={u.id} className="border-t border-white/10">
                <td className="p-2">{u.fullName}</td>
                <td>{u.status}</td>
                <td><ActivateButton userId={u.id} status={u.status} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-4"><Link href="/dashboard" className="text-[#ff2d55]">Dashboard</Link></p>
    </main>
  );
}
