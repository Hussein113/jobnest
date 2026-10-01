import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireRole } from "@/lib/auth";

const nav = [
  { href: "/applicant/dashboard", label: "Overview" },
  { href: "/applicant/applications", label: "Applications" },
  { href: "/applicant/saved-jobs", label: "Saved jobs" },
  { href: "/applicant/profile", label: "Profile" },
  { href: "/applicant/resume", label: "Resume" },
  { href: "/jobs", label: "Find jobs" },
];

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("APPLICANT");
  return <DashboardShell name={user.fullName} nav={nav}>{children}</DashboardShell>;
}
