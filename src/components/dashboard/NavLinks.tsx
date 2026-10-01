"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({ items }: { items: { href: string; label: string }[] }) {
  const path = usePathname();
  return (
    <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto md:flex-col">
      {items.map((i) => (
        <Link key={i.href} href={i.href} aria-current={path === i.href ? "page" : undefined}
          className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${path === i.href ? "bg-brand text-white" : "text-ink hover:bg-white"}`}>
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
