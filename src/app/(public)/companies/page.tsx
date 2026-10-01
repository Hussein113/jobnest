import Link from "next/link";
import { locationLabel } from "@/lib/labels";
import { prisma } from "@/lib/prisma";

// Reads the database on every request so new jobs appear immediately.
export const dynamic = "force-dynamic";

export const metadata = { title: "Companies" };

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    where: { jobs: { some: { status: "PUBLISHED" } } },
    orderBy: { name: "asc" },
    include: { location: true, _count: { select: { jobs: { where: { status: "PUBLISHED" } } } } },
  });
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Companies hiring now</h1>
      {companies.length === 0 && <p className="mt-6 text-slate-600">No companies are hiring yet.</p>}
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {companies.map((c) => (
          <li key={c.id}>
            <Link href={`/companies/${c.slug}`} className="flex gap-4 rounded-2xl border border-line p-5 hover:border-brand hover:bg-tint">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-lg font-bold text-white">{c.name[0]}</div>
              <div>
                <h2 className="font-semibold">{c.name}</h2>
                <p className="text-sm text-slate-600">{[c.industry, locationLabel(c.location)].filter(Boolean).join(" in ")}</p>
                <p className="mt-2 text-sm font-medium text-accent">{c._count.jobs} open {c._count.jobs === 1 ? "role" : "roles"}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
