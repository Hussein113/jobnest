import Stat from "@/components/dashboard/Stat";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Employer dashboard" };

export default async function EmployerDashboard() {
  const user = await requireRole("EMPLOYER");
  const employer = await prisma.employerProfile.findUnique({ where: { userId: user.id }, include: { company: true } });
  const companyId = employer?.companyId;
  const [activeJobs, applications, shortlisted, interviews] = companyId
    ? await Promise.all([
        prisma.job.count({ where: { companyId, status: "PUBLISHED" } }),
        prisma.application.count({ where: { job: { companyId } } }),
        prisma.application.count({ where: { job: { companyId }, status: "SHORTLISTED" } }),
        prisma.application.count({ where: { job: { companyId }, status: "INTERVIEW" } }),
      ])
    : [0, 0, 0, 0];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Welcome, {employer?.company.name ?? user.fullName}</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Active jobs" value={activeJobs} />
        <Stat label="Applications" value={applications} />
        <Stat label="Shortlisted" value={shortlisted} />
        <Stat label="Interviews" value={interviews} />
      </div>
    </div>
  );
}
