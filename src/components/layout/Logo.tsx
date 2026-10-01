import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold tracking-tight">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect width="28" height="28" rx="8" fill="#1d4ed8" />
        <path d="M6 16c2 5 14 5 16 0" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <circle cx="14" cy="10.5" r="3.2" fill="#d62839" />
      </svg>
      <span className={light ? "text-white" : "text-ink"}>
        Job<span className={light ? "text-white" : "text-brand"}>nest</span>
      </span>
    </Link>
  );
}
