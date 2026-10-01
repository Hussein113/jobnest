import Stat from "@/components/dashboard/Stat";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Admin dashboard" };

export default async function AdminDashboard() {
  await requireRole("ADMIN");
  const [users, seekers, employers, jobs, applications] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "APPLICANT" } }),
    prisma.user.count({ where: { role: "EMPLOYER" } }),
    prisma.job.count({ where: { status: "PUBLISHED" } }),
    prisma.application.count(),
  ]);
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Platform overview</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Stat label="Total users" value={users} />
        <Stat label="Job seekers" value={seekers} />
        <Stat label="Employers" value={employers} />
        <Stat label="Active jobs" value={jobs} />
        <Stat label="Applications" value={applications} />
      </div>
    </div>
  );
}
