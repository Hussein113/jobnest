import Link from "next/link";
import Logo from "./Logo";

const links = [
  { href: "/jobs", label: "Find jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/register?role=EMPLOYER", label: "For employers" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-ink hover:text-brand">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-brand hover:bg-tint">Log in</Link>
          <Link href="/register" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-dark">Sign up free</Link>
        </div>
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-lg border border-line px-3 py-2 text-sm font-medium">Menu</summary>
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-line bg-white p-2 shadow-lg">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-tint">{l.label}</Link>
            ))}
            <Link href="/login" className="block rounded-lg px-3 py-2 text-sm hover:bg-tint">Log in</Link>
            <Link href="/register" className="mt-1 block rounded-lg bg-accent px-3 py-2 text-center text-sm font-semibold text-white">Sign up free</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
