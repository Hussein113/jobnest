import Link from "next/link";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withdrawApplication } from "@/lib/applicant-actions";

export const metadata = { title: "Applications" };

const CLOSED = ["HIRED", "REJECTED", "WITHDRAWN"];

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ applied?: string }> }) {
  const user = await requireRole("APPLICANT");
  const { applied } = await searchParams;
  const applications = await prisma.application.findMany({
    where: { profile: { userId: user.id } },
    orderBy: { appliedAt: "desc" },
    include: { job: { include: { company: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your applications</h1>
      {applied && <p role="status" className="rounded-lg bg-tint px-3 py-2 text-sm text-brand-dark">Application sent. The employer will see it right away.</p>}
      {applications.length === 0 ? (
        <p className="text-slate-600">You have not applied to any jobs yet. <Link href="/jobs" className="font-medium text-brand underline">Find a job</Link>.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-slate-500">
              <tr><th className="px-4 py-3 font-medium">Position</th><th className="px-4 py-3 font-medium">Company</th><th className="px-4 py-3 font-medium">Applied</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3" /></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {applications.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 font-medium"><Link href={`/jobs/${a.jobId}`} className="hover:text-brand">{a.job.title}</Link></td>
                  <td className="px-4 py-3">{a.job.company.name}</td>
                  <td className="whitespace-nowrap px-4 py-3">{a.appliedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3 text-right">
                    {!CLOSED.includes(a.status) && <form action={withdrawApplication.bind(null, a.id)}><button className="text-accent hover:underline">Withdraw</button></form>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
