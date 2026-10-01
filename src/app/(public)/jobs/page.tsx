import Link from "next/link";
import JobRow from "@/components/jobs/JobRow";
import SearchBar from "@/components/jobs/SearchBar";
import { listJobs } from "@/lib/jobs";
import { modeLabel, typeLabel } from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import { input } from "@/lib/ui";

export const metadata = { title: "Find jobs" };

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function JobsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const [q, location, type, mode, category] = [sp.q, sp.location, sp.type, sp.mode, sp.category].map((v) => one(v).trim());
  const [results, categories] = await Promise.all([
    listJobs({ q, location, type, mode, category }),
    prisma.jobCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main>
      <section className="bg-brand py-8">
        <div className="mx-auto max-w-6xl px-4"><SearchBar q={q} location={location} /></div>
      </section>
      <div className="mx-auto mt-8 grid max-w-6xl gap-8 px-4 md:grid-cols-[16rem_1fr]">
        <form action="/jobs" className="space-y-4 self-start rounded-2xl border border-line p-4">
          <input type="hidden" name="q" value={q} />
          <input type="hidden" name="location" value={location} />
          <h2 className="font-semibold">Filters</h2>
          <label className="block text-sm font-medium">Category
            <select name="category" defaultValue={category} className={input}>
              <option value="">All categories</option>
              {categories.map((c) => <option key={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">Job type
            <select name="type" defaultValue={type} className={input}>
              <option value="">Any</option>
              {Object.entries(typeLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">Work setting
            <select name="mode" defaultValue={mode} className={input}>
              <option value="">Any</option>
              {Object.entries(modeLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <button className="w-full rounded-lg bg-brand py-2 text-sm font-semibold text-white hover:bg-brand-dark">Apply filters</button>
          <Link href="/jobs" className="block text-center text-sm text-brand hover:underline">Clear all</Link>
        </form>

        <section>
          <h1 className="text-xl font-bold">{results.length} {results.length === 1 ? "job" : "jobs"} found</h1>
          <div className="mt-3 border-t border-line">
            {results.map((j) => <JobRow key={j.id} job={j} />)}
          </div>
          {results.length === 0 && (
            <p className="mt-6 text-slate-600">No jobs match those filters. Try removing one, or <Link href="/jobs" className="text-brand underline">see all jobs</Link>.</p>
          )}
        </section>
      </div>
    </main>
  );
}
