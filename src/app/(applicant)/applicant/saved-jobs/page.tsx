import Link from "next/link";
import JobRow from "@/components/jobs/JobRow";
import { requireRole } from "@/lib/auth";
import { jobListInclude } from "@/lib/jobs";
import { prisma } from "@/lib/prisma";
import { toggleSaveJob } from "@/lib/applicant-actions";

export const metadata = { title: "Saved jobs" };

export default async function SavedJobsPage() {
  const user = await requireRole("APPLICANT");
  const saved = await prisma.savedJob.findMany({
    where: { profile: { userId: user.id }, job: { status: "PUBLISHED" } },
    orderBy: { savedAt: "desc" },
    include: { job: { include: jobListInclude } },
  });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Saved jobs</h1>
      {saved.length === 0 ? (
        <p className="text-slate-600">Nothing saved yet. Use Save job on any listing to keep it here. <Link href="/jobs" className="font-medium text-brand underline">Browse jobs</Link>.</p>
      ) : (
        <div className="rounded-2xl border border-line bg-white px-3">
          {saved.map((s) => (
            <div key={s.jobId} className="flex items-center gap-2">
              <div className="flex-1"><JobRow job={s.job} /></div>
              <form action={toggleSaveJob.bind(null, s.jobId)}><button className="text-sm text-accent hover:underline">Remove</button></form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
