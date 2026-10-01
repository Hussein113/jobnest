import { notFound } from "next/navigation";
import JobRow from "@/components/jobs/JobRow";
import { jobListInclude } from "@/lib/jobs";
import { locationLabel } from "@/lib/labels";
import { prisma } from "@/lib/prisma";

export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
    include: { location: true, jobs: { where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, include: jobListInclude } },
  });
  if (!company) notFound();
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
      <p className="mt-1 text-slate-600">{[company.industry, locationLabel(company.location)].filter(Boolean).join(" in ")}</p>
      {company.description && <p className="mt-4 max-w-2xl text-slate-700">{company.description}</p>}
      <h2 className="mt-10 text-xl font-bold">Open roles</h2>
      <div className="mt-3 border-t border-line">
        {company.jobs.length ? company.jobs.map((j) => <JobRow key={j.id} job={j} />) : <p className="py-6 text-slate-600">No open roles right now.</p>}
      </div>
    </main>
  );
}
