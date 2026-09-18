import Link from "next/link";

export default function Home() {
  return (
    <main style={{minHeight:"100vh",background:"#070b14",color:"#eef3ff",padding:"48px 24px",fontFamily:"sans-serif"}}>
      <p style={{color:"#ff2d55",letterSpacing:"0.2em",fontSize:12}}>AVIATOR ANALYTICS</p>
      <h1 style={{fontSize:48,maxWidth:720,lineHeight:1.15}}>Crash-round stats. Not a magic cashout button.</h1>
      <p style={{maxWidth:540,opacity:0.7,marginTop:16}}>Buy diamonds, run an analysis, wait for admin approval. Ghana pricing in GHS.</p>
      <div style={{marginTop:28,display:"flex",gap:12,flexWrap:"wrap"}}>
        <a href="/register" style={{background:"#ff2d55",color:"#fff",padding:"12px 18px",borderRadius:999,textDecoration:"none"}}>Create account</a>
        <a href="/login" style={{border:"1px solid #333",color:"#fff",padding:"12px 18px",borderRadius:999,textDecoration:"none"}}>Login</a>
        <a href="/dashboard" style={{border:"1px solid #333",color:"#fff",padding:"12px 18px",borderRadius:999,textDecoration:"none"}}>Dashboard</a>
        <a href="/packages" style={{border:"1px solid #333",color:"#fff",padding:"12px 18px",borderRadius:999,textDecoration:"none"}}>Packages</a>
      </div>
    </main>
  );
}
