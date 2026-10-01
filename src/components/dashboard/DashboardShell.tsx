import Logo from "@/components/layout/Logo";
import NavLinks from "./NavLinks";
import { logout } from "@/lib/auth-actions";

export default function DashboardShell({
  name, nav, children,
}: { name: string; nav: { href: string; label: string }[]; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-tint">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <form action={logout} className="flex items-center gap-4 text-sm">
            <span className="hidden text-slate-600 sm:inline">{name}</span>
            <button className="rounded-lg border border-line px-3 py-1.5 font-medium hover:bg-tint">Log out</button>
          </form>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[13rem_1fr]">
        <NavLinks items={nav} />
        <div>{children}</div>
      </div>
    </div>
  );
}
