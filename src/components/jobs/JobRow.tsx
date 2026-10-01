import Link from "next/link";
import type { JobListItem } from "@/lib/jobs";
import { locationLabel, modeLabel, typeLabel } from "@/lib/labels";
import { formatSalary, timeAgo } from "@/lib/utils";

export default function JobRow({ job }: { job: JobListItem }) {
  return (
    <Link href={`/jobs/${job.id}`} className="flex items-start gap-4 border-b border-line px-2 py-5 transition hover:bg-tint">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-lg font-bold text-white">
        {job.company.name[0]}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-ink">{job.title}</h3>
        <p className="text-sm text-slate-600">{job.company.name} in {locationLabel(job.location)}</p>
        <p className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-tint px-2.5 py-1 text-brand">{typeLabel[job.employmentType]}</span>
          <span className="rounded-full bg-tint px-2.5 py-1 text-brand">{modeLabel[job.workMode]}</span>
        </p>
      </div>
      <div className="hidden text-right text-sm sm:block">
        <p className="font-semibold">{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</p>
        <p className="text-slate-500">{timeAgo(job.publishedAt ?? job.createdAt)}</p>
      </div>
    </Link>
  );
}
