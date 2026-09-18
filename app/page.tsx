import Link from "next/link";

export default function Home() {
  return (
    <main style={{minHeight:"100vh",background:"#070b14",color:"#eef3ff",padding:"48px 24px",fontFamily:"sans-serif"}}>
      <p style={{color:"#ff2d55",letterSpacing:"0.2em",fontSize:12}}>AVIATOR ANALYTICS</p>
      <h1 style={{fontSize:48,maxWidth:720,lineHeight:1.1}}>Crash-round stats. Not a magic cashout button.</h1>
      <p style={{maxWidth:520,opacity:0.7,marginTop:16}}>Diamonds, packages in GHS, and analysis screens are next. This homepage is live.</p>
      <p style={{marginTop:28}}>
        <a href="/dashboard" style={{background:"#ff2d55",color:"#fff",padding:"12px 18px",borderRadius:999,textDecoration:"none"}}>Open dashboard</a>
      </p>
    </main>
  );
}
