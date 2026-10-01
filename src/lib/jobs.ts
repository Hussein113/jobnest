import { Prisma, type EmploymentType, type WorkMode } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const jobListInclude = {
  company: { select: { name: true, slug: true } },
  location: true,
  category: true,
} satisfies Prisma.JobInclude;

export type JobListItem = Prisma.JobGetPayload<{ include: typeof jobListInclude }>;

export type JobFilters = { q?: string; location?: string; type?: string; mode?: string; category?: string };

const TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "TEMPORARY"];
const MODES = ["ON_SITE", "HYBRID", "REMOTE"];

const openJob: Prisma.JobWhereInput[] = [
  { status: "PUBLISHED" },
  { OR: [{ deadline: null }, { deadline: { gte: new Date() } }] },
];

export function listJobs(f: JobFilters, take = 50): Promise<JobListItem[]> {
  const and: Prisma.JobWhereInput[] = [...openJob];
  const contains = (value: string) => ({ contains: value, mode: "insensitive" as const });
  if (f.q) {
    and.push({ OR: [{ title: contains(f.q) }, { company: { name: contains(f.q) } }, { category: { name: contains(f.q) } }] });
  }
  if (f.location) and.push({ location: { OR: [{ city: contains(f.location) }, { state: contains(f.location) }] } });
  if (f.type && TYPES.includes(f.type)) and.push({ employmentType: f.type as EmploymentType });
  if (f.mode && MODES.includes(f.mode)) and.push({ workMode: f.mode as WorkMode });
  if (f.category) and.push({ category: { name: f.category } });

  return prisma.job.findMany({
    where: { AND: and },
    orderBy: { publishedAt: "desc" },
    take,
    include: jobListInclude,
  });
}

export function getOpenJob(id: string) {
  return prisma.job.findFirst({
    where: { AND: [{ id }, ...openJob] },
    include: { ...jobListInclude, questions: { orderBy: { position: "asc" } } },
  });
}
