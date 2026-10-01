import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireRole } from "@/lib/auth";

const nav = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/employers", label: "Employers" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/reports", label: "Reports" },
];

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("ADMIN");
  return <DashboardShell name={user.fullName} nav={nav}>{children}</DashboardShell>;
}
