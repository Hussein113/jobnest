import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireRole } from "@/lib/auth";

const nav = [
  { href: "/employer/dashboard", label: "Overview" },
  { href: "/employer/jobs", label: "Jobs" },
  { href: "/employer/applicants", label: "Applicants" },
  { href: "/employer/company", label: "Company" },
];

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("EMPLOYER");
  return <DashboardShell name={user.fullName} nav={nav}>{children}</DashboardShell>;
}
