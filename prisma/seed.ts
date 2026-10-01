import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { companies, jobs } from "./seed-data";

const prisma = new PrismaClient();

const locations: [string, string][] = [
  ["New York", "NY"], ["Los Angeles", "CA"], ["Chicago", "IL"], ["Houston", "TX"],
  ["Phoenix", "AZ"], ["Philadelphia", "PA"], ["San Antonio", "TX"], ["San Diego", "CA"],
  ["Dallas", "TX"], ["San Jose", "CA"], ["Austin", "TX"], ["Jacksonville", "FL"],
  ["San Francisco", "CA"], ["Seattle", "WA"], ["Denver", "CO"], ["Boston", "MA"],
  ["Atlanta", "GA"], ["Miami", "FL"], ["Washington", "DC"], ["Minneapolis", "MN"],
];

const categories = [
  "Technology", "Marketing", "Sales", "Finance & Accounting", "Healthcare",
  "Education", "Customer Service", "Design & Creative", "Operations",
  "Human Resources", "Engineering", "Legal",
];

const typeMap = { "Full-time": "FULL_TIME", "Part-time": "PART_TIME", Contract: "CONTRACT", Internship: "INTERNSHIP" } as const;
const modeMap = { "On-site": "ON_SITE", Hybrid: "HYBRID", Remote: "REMOTE" } as const;

const slug = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function findOrCreateLocation(label: string) {
  const [city, state] = label.split(",").map((s) => s.trim());
  const found = await prisma.location.findFirst({ where: { city, state, country: "United States" } });
  return found ?? prisma.location.create({ data: { city, state } });
}

async function main() {
  for (const [city, state] of locations) {
    await findOrCreateLocation(`${city}, ${state}`);
  }
  for (const name of categories) {
    await prisma.jobCategory.upsert({ where: { slug: slug(name) }, update: {}, create: { name, slug: slug(name) } });
  }

  // Sample employers (these users cannot log in; they only own the sample jobs).
  for (const c of companies) {
    const location = await findOrCreateLocation(c.location);
    const company = await prisma.company.upsert({
      where: { slug: c.id },
      update: {},
      create: { name: c.name, slug: c.id, industry: c.industry, description: c.about, locationId: location.id, verified: true },
    });
    const user = await prisma.user.upsert({
      where: { email: `seed-${c.id}@jobnest.local` },
      update: {},
      create: { id: randomUUID(), email: `seed-${c.id}@jobnest.local`, fullName: `${c.name} Recruiting`, role: "EMPLOYER", status: "ACTIVE", emailVerified: true },
    });
    const employer = await prisma.employerProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, companyId: company.id },
    });

    for (const j of jobs.filter((x) => x.companyId === c.id)) {
      if (await prisma.job.findFirst({ where: { companyId: company.id, title: j.title } })) continue;
      const category = await prisma.jobCategory.findUniqueOrThrow({ where: { slug: slug(j.category) } });
      const jobLocation = await findOrCreateLocation(j.location);
      await prisma.job.create({
        data: {
          companyId: company.id,
          postedById: employer.id,
          categoryId: category.id,
          locationId: jobLocation.id,
          title: j.title,
          employmentType: typeMap[j.type],
          workMode: modeMap[j.mode],
          salaryMin: j.salaryMin,
          salaryMax: j.salaryMax,
          description: j.summary,
          responsibilities: j.responsibilities.join("\n"),
          requirements: j.requirements.join("\n"),
          benefits: j.benefits.join("\n"),
          status: "PUBLISHED",
          publishedAt: new Date(Date.now() - j.postedDaysAgo * 86_400_000),
          questions: {
            create: [{ prompt: "Are you legally authorized to work in the United States?", type: "YES_NO", required: true, position: 0 }],
          },
        },
      });
    }
  }
  console.log("Seeded locations, categories, sample companies and jobs");
}

main().finally(() => prisma.$disconnect());
