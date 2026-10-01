import Link from "next/link";
import { notFound } from "next/navigation";
import SaveJobButton from "@/components/jobs/SaveJobButton";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { getCurrentUser } from "@/lib/auth";
import { getOpenJob } from "@/lib/jobs";
import { locationLabel, modeLabel, typeLabel } from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import { formatSalary, timeAgo } from "@/lib/utils";

function Section({ title, text }: { title: string; text?: string | null }) {
  const items = (text ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
  if (!items.length) return null;
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold">{title}</h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-slate-700">{items.map((i) => <li key={i}>{i}</li>)}</ul>
    </section>
  );
}

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getOpenJob(id);
  if (!job) notFound();

  const user = await getCurrentUser();
  const isApplicant = user?.role === "APPLICANT";
  const [application, saved] = isApplicant
    ? await Promise.all([
        prisma.application.findFirst({ where: { jobId: id, profile: { userId: user.id } } }),
        prisma.savedJob.findFirst({ where: { jobId: id, profile: { userId: user.id } } }),
      ])
    : [null, null];

  const button = "mt-6 block rounded-xl bg-accent py-3 text-center font-semibold text-white hover:bg-accent-dark";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/jobs" className="text-sm text-brand hover:underline">Back to jobs</Link>
      <div className="mt-6 grid gap-10 md:grid-cols-[1fr_20rem]">
        <article>
          <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
          <p className="mt-1 text-slate-600">
            <Link href={`/companies/${job.company.slug}`} className="font-medium text-brand hover:underline">{job.company.name}</Link> in {locationLabel(job.location)}
          </p>
          <section className="mt-8"><h2 className="text-lg font-bold">About the role</h2><p className="mt-3 whitespace-pre-line text-slate-700">{job.description}</p></section>
          <Section title="What you will do" text={job.responsibilities} />
          <Section title="What we are looking for" text={job.requirements} />
          <Section title="Benefits" text={job.benefits} />
        </article>
        <aside className="self-start rounded-2xl border border-line p-6 md:sticky md:top-24">
          <p className="text-xl font-bold">{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Type</dt><dd>{typeLabel[job.employmentType]}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Setting</dt><dd>{modeLabel[job.workMode]}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Category</dt><dd>{job.category.name}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Posted</dt><dd>{timeAgo(job.publishedAt ?? job.createdAt)}</dd></div>
          </dl>

          {!user && (
            <>
              <Link href={`/login?next=/jobs/${job.id}/apply`} className={button}>Log in to apply</Link>
              <p className="mt-3 text-center text-xs text-slate-500">New here? <Link href="/register" className="underline">Create a free account</Link>.</p>
            </>
          )}
          {isApplicant && application && (
            <div className="mt-6 space-y-3 text-center">
              <StatusBadge status={application.status} />
              <Link href="/applicant/applications" className="block text-sm text-brand hover:underline">View your applications</Link>
            </div>
          )}
          {isApplicant && !application && (
            <>
              <Link href={`/jobs/${job.id}/apply`} className={button}>Apply now</Link>
              <div className="mt-3"><SaveJobButton jobId={job.id} saved={!!saved} /></div>
            </>
          )}
          {user && !isApplicant && (
            <p className="mt-6 text-center text-sm text-slate-500">Log in with a job seeker account to apply.</p>
          )}
        </aside>
      </div>
    </main>
  );
}
