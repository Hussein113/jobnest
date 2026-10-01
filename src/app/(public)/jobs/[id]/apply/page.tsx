import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ApplyForm from "@/components/forms/ApplyForm";
import { applyToJob } from "@/lib/applicant-actions";
import { getCurrentUser } from "@/lib/auth";
import { dashboardPathFor } from "@/lib/auth-paths";
import { getOpenJob } from "@/lib/jobs";
import { locationLabel } from "@/lib/labels";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Apply" };

export default async function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/jobs/${id}/apply`);
  if (user.role !== "APPLICANT") redirect(dashboardPathFor(user.role));

  const job = await getOpenJob(id);
  if (!job) notFound();

  const existing = await prisma.application.findFirst({ where: { jobId: id, profile: { userId: user.id } } });
  if (existing) redirect("/applicant/applications");

  const resumes = await prisma.resume.findMany({
    where: { profile: { userId: user.id } },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    select: { id: true, label: true, isDefault: true },
  });

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link href={`/jobs/${job.id}`} className="text-sm text-brand hover:underline">Back to job</Link>
      <h1 className="mt-4 text-2xl font-bold">Apply for {job.title}</h1>
      <p className="mb-8 mt-1 text-slate-600">{job.company.name} in {locationLabel(job.location)}</p>
      <ApplyForm action={applyToJob.bind(null, job.id)} resumes={resumes} questions={job.questions} />
    </main>
  );
}
