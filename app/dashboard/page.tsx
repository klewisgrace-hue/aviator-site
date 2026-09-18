import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const jar = await cookies();
  const raw = jar.get("aaa_user");
  if (!raw) {
    return (
      <main style={{minHeight:"100vh",background:"#070b14",color:"#fff",padding:40,fontFamily:"sans-serif"}}>
        <p>Not signed in.</p>
        <Link href="/login" style={{color:"#ff2d55"}}>Login</Link>
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
      <main style={{minHeight:"100vh",background:"#070b14",color:"#fff",padding:40,fontFamily:"sans-serif"}}>
        <p>Session expired.</p>
        <Link href="/login" style={{color:"#ff2d55"}}>Login</Link>
      </main>
    );
  }
  const card = {background:"#0e1524",border:"1px solid #1e2a44",borderRadius:20,padding:20};
  return (
    <main style={{minHeight:"100vh",background:"#070b14",color:"#eef3ff",padding:24,fontFamily:"sans-serif"}}>
      <div style={{maxWidth:720,margin:"0 auto"}}>
        <p style={{color:"#ff2d55",letterSpacing:"0.2em",fontSize:12}}>AVIATOR ANALYTICS</p>
        <h1 style={{fontSize:32,margin:"8px 0 20px"}}>Dashboard</h1>
        <div style={card}>
          <p style={{opacity:0.6,margin:0}}>Signed in</p>
          <h2 style={{margin:"6px 0"}}>{user.fullName}</h2>
          <p style={{opacity:0.7}}>@{user.username} ? {user.status} ? {user.role}</p>
        </div>
        <div style={{...card, marginTop:16}}>
          <p style={{opacity:0.6,margin:0}}>Diamonds</p>
          <p style={{fontSize:48,margin:"8px 0 0",color:"#ff2d55"}}>{user.diamondBalance}</p>
        </div>
        <p style={{marginTop:24,display:"flex",gap:16}}>
          <Link href="/packages" style={{color:"#ff2d55"}}>Packages</Link>
          <Link href="/analyze" style={{color:"#fff"}}>Analyze</Link>
          <Link href="/login" style={{color:"#fff"}}>Switch account</Link>
        </p>
      </div>
    </main>
  );
}
