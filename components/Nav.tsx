import Link from "next/link";

export function Nav({ signedIn = false }: { signedIn?: boolean }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070b14]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff2d55] text-xs font-black">
            AA
          </span>
          Aviator Analytics
        </Link>
        <nav className="flex items-center gap-3 text-sm text-white/70">
          <Link href="/packages" className="hover:text-white">
            Packages
          </Link>
          {signedIn ? (
            <>
              <Link href="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
              <Link href="/analyze" className="hover:text-white">
                Analyze
              </Link>
              <Link href="/admin" className="hover:text-white">
                Admin
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-white">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#ff2d55] px-3 py-1.5 text-white"
              >
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
