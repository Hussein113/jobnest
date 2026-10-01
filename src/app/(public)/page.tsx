import Link from "next/link";
import SearchBar from "@/components/jobs/SearchBar";
import JobRow from "@/components/jobs/JobRow";
import { listJobs } from "@/lib/jobs";
import { prisma } from "@/lib/prisma";

// Reads the database on every request so new jobs appear immediately.
export const dynamic = "force-dynamic";

const steps = [
  { title: "Build your profile once", body: "Add your experience and upload your CV. We keep it ready for every application." },
  { title: "Apply in a few clicks", body: "Answer any questions the employer asks, review, and send." },
  { title: "Follow every application", body: "See when you are reviewed, shortlisted or invited to interview." },
];

export default async function Home() {
  const [latest, categories] = await Promise.all([
    listJobs({}, 6),
    prisma.jobCategory.findMany({ orderBy: { name: "asc" } }),
  ]);
  return (
    <main>
      <section className="bg-brand text-white">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 md:pt-24">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Find work you are glad to show up for.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-blue-100">
            Search thousands of jobs across the United States and apply in minutes.
          </p>
          <div className="mt-10 max-w-4xl"><SearchBar /></div>
          <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-blue-100">
            Popular:
            {["Remote", "Nurse", "Accountant", "Designer"].map((t) => (
              <Link key={t} href={`/jobs?q=${t}`} className="underline underline-offset-4 hover:text-white">{t}</Link>
            ))}
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">Latest jobs</h2>
          <Link href="/jobs" className="text-sm font-semibold text-brand hover:underline">See all jobs</Link>
        </div>
        <div className="mt-4 border-t border-line">
          {latest.length ? latest.map((j) => <JobRow key={j.id} job={j} />) : (
            <p className="py-6 text-slate-600">No jobs posted yet. Check back soon.</p>
          )}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <h2 className="text-2xl font-bold">Browse by category</h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/jobs?category=${encodeURIComponent(c.name)}`} className="block rounded-xl border border-line px-4 py-3 text-sm font-medium hover:border-brand hover:bg-tint">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <h2 className="text-2xl font-bold">How Jobnest works</h2>
        <ol className="mt-8 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-bold text-white">{i + 1}</span>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1 text-slate-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink px-8 py-12 text-white md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Hiring? Post your first job free.</h2>
            <p className="mt-2 max-w-lg text-blue-100">Review applicants, shortlist and invite to interview from one simple dashboard.</p>
          </div>
          <Link href="/register?role=EMPLOYER" className="rounded-xl bg-accent px-7 py-3 font-semibold hover:bg-accent-dark">Post a job</Link>
        </div>
      </section>
    </main>
  );
}
