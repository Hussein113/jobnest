import Link from "next/link";
import Stat from "@/components/dashboard/Stat";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function ApplicantDashboard() {
  const user = await requireRole("APPLICANT");
  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: user.id },
    include: { _count: { select: { experiences: true, educations: true, skills: true, resumes: true, applications: true, savedJobs: true } } },
  });
  const byStatus = (status: "SHORTLISTED" | "INTERVIEW") =>
    prisma.application.count({ where: { profile: { userId: user.id }, status } });
  const [shortlisted, interviews, recent] = await Promise.all([
    byStatus("SHORTLISTED"),
    byStatus("INTERVIEW"),
    prisma.application.findMany({
      where: { profile: { userId: user.id } },
      orderBy: { appliedAt: "desc" },
      take: 5,
      include: { job: { include: { company: true } } },
    }),
  ]);

  const c = profile?._count;
  const checks = [
    !!profile?.headline, !!profile?.about, !!profile?.locationId,
    (c?.experiences ?? 0) > 0, (c?.educations ?? 0) > 0, (c?.skills ?? 0) > 0, (c?.resumes ?? 0) > 0,
  ];
  const completion = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Welcome back, {user.fullName.split(" ")[0]}</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Applications" value={c?.applications ?? 0} />
        <Stat label="Shortlisted" value={shortlisted} />
        <Stat label="Interviews" value={interviews} />
        <Stat label="Saved jobs" value={c?.savedJobs ?? 0} />
      </div>

      <section className="rounded-2xl border border-line bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Profile {completion}% complete</h2>
          <Link href="/applicant/profile" className="text-sm font-medium text-brand hover:underline">Complete profile</Link>
        </div>
        <div className="mt-3 h-2 rounded-full bg-tint" role="progressbar" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-2 rounded-full bg-accent" style={{ width: `${completion}%` }} />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-semibold">Recent applications</h2>
        {recent.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">
            You have not applied to any jobs yet. <Link href="/jobs" className="font-medium text-brand hover:underline">Find your first job</Link>.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-line">
            {recent.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{a.job.title}</p>
                  <p className="text-slate-600">{a.job.company.name} · {timeAgo(a.appliedAt)}</p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
