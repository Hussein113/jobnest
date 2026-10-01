import { statusLabel } from "@/lib/labels";

const tone: Record<string, string> = {
  SHORTLISTED: "bg-brand text-white", INTERVIEW: "bg-brand text-white", OFFER: "bg-brand text-white", HIRED: "bg-brand-dark text-white",
  REJECTED: "bg-red-50 text-accent-dark", WITHDRAWN: "bg-slate-100 text-slate-600",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${tone[status] ?? "bg-tint text-brand"}`}>
      {statusLabel[status]}
    </span>
  );
}
