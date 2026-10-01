"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { ALLOWED_CV_TYPES, MAX_CV_SIZE_MB } from "@/lib/constants";
import type { FormState } from "@/lib/auth-actions";
import type { EmploymentType, WorkMode } from "@prisma/client";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const intOrNull = (v: string) => (/^\d+$/.test(v) ? parseInt(v, 10) : null);
const monthToDate = (v: string) => (/^\d{4}-\d{2}$/.test(v) ? new Date(`${v}-01T00:00:00Z`) : null);

async function me() {
  const user = await requireRole("APPLICANT");
  const profile = await prisma.applicantProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });
  return { user, profile };
}

// ---------- profile ----------

export async function saveProfile(fd: FormData) {
  const { profile } = await me();

  let locationId: string | null = null;
  const [city, state] = str(fd, "location").split(",").map((s) => s.trim());
  if (city) {
    const where = { city, state: state || null, country: "United States" };
    const found = await prisma.location.findFirst({ where });
    locationId = (found ?? (await prisma.location.create({ data: where }))).id;
  }

  const types = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "TEMPORARY"];
  const modes = ["ON_SITE", "HYBRID", "REMOTE"];
  const type = str(fd, "preferredType");
  const mode = str(fd, "preferredWorkMode");
  const available = str(fd, "availableFrom");

  await prisma.applicantProfile.update({
    where: { id: profile.id },
    data: {
      headline: str(fd, "headline").slice(0, 120) || null,
      about: str(fd, "about").slice(0, 3000) || null,
      locationId,
      linkedinUrl: str(fd, "linkedinUrl").slice(0, 300) || null,
      portfolioUrl: str(fd, "portfolioUrl").slice(0, 300) || null,
      expectedSalaryMin: intOrNull(str(fd, "expectedSalaryMin")),
      expectedSalaryMax: intOrNull(str(fd, "expectedSalaryMax")),
      preferredType: types.includes(type) ? (type as EmploymentType) : null,
      preferredWorkMode: modes.includes(mode) ? (mode as WorkMode) : null,
      availableFrom: /^\d{4}-\d{2}-\d{2}$/.test(available) ? new Date(available) : null,
    },
  });
  revalidatePath("/applicant/profile");
  redirect("/applicant/profile?saved=1");
}

export async function saveSkills(fd: FormData) {
  const { profile } = await me();
  const names = [...new Set(str(fd, "skills").split(",").map((s) => s.trim()).filter((s) => s && s.length <= 40))].slice(0, 30);
  const skills = await Promise.all(
    names.map((name) => prisma.skill.upsert({ where: { name }, update: {}, create: { name } }))
  );
  await prisma.$transaction([
    prisma.applicantSkill.deleteMany({ where: { profileId: profile.id } }),
    prisma.applicantSkill.createMany({ data: skills.map((s) => ({ profileId: profile.id, skillId: s.id })), skipDuplicates: true }),
  ]);
  revalidatePath("/applicant/profile");
  redirect("/applicant/profile?saved=1");
}

export async function addExperience(fd: FormData) {
  const { profile } = await me();
  const startDate = monthToDate(str(fd, "startDate"));
  const title = str(fd, "title");
  const company = str(fd, "company");
  if (!title || !company || !startDate) return;
  const isCurrent = fd.get("isCurrent") === "on";
  await prisma.experience.create({
    data: {
      profileId: profile.id, title: title.slice(0, 120), company: company.slice(0, 120), startDate,
      endDate: isCurrent ? null : monthToDate(str(fd, "endDate")), isCurrent,
      description: str(fd, "description").slice(0, 2000) || null,
    },
  });
  revalidatePath("/applicant/profile");
}

export async function deleteExperience(id: string) {
  const { profile } = await me();
  await prisma.experience.deleteMany({ where: { id, profileId: profile.id } });
  revalidatePath("/applicant/profile");
}

export async function addEducation(fd: FormData) {
  const { profile } = await me();
  const institution = str(fd, "institution");
  const level = str(fd, "level");
  if (!institution || !level) return;
  await prisma.education.create({
    data: {
      profileId: profile.id, institution: institution.slice(0, 160), level: level.slice(0, 80),
      fieldOfStudy: str(fd, "fieldOfStudy").slice(0, 120) || null, endDate: monthToDate(str(fd, "endDate")),
    },
  });
  revalidatePath("/applicant/profile");
}

export async function deleteEducation(id: string) {
  const { profile } = await me();
  await prisma.education.deleteMany({ where: { id, profileId: profile.id } });
  revalidatePath("/applicant/profile");
}

// ---------- resumes ----------

async function looksLikeAllowedFile(file: File) {
  const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const text = String.fromCharCode(...head);
  return file.type === "application/pdf" ? text === "%PDF" : text.startsWith("PK"); // .docx is a zip
}

export async function uploadResume(_: FormState, fd: FormData): Promise<FormState> {
  const { user, profile } = await me();
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a file to upload." };
  if (!ALLOWED_CV_TYPES.includes(file.type)) return { error: "Upload a PDF or Word (.docx) file." };
  if (file.size > MAX_CV_SIZE_MB * 1024 * 1024) return { error: `The file must be under ${MAX_CV_SIZE_MB} MB.` };
  if (!(await looksLikeAllowedFile(file))) return { error: "That file looks damaged or is not a real PDF or Word file." };

  const existing = await prisma.resume.count({ where: { profileId: profile.id } });
  if (existing >= 5) return { error: "You can keep up to 5 resumes. Delete one to add another." };

  const ext = file.type === "application/pdf" ? "pdf" : "docx";
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const supabase = await createClient();
  const { error } = await supabase.storage.from("resumes").upload(path, file, { contentType: file.type });
  if (error) return { error: "The upload failed. Please try again." };

  await prisma.resume.create({
    data: {
      profileId: profile.id,
      label: (file.name.split(/[\\/]/).pop() ?? "Resume").slice(0, 80),
      fileUrl: path,
      isDefault: existing === 0,
    },
  });
  revalidatePath("/applicant/resume");
  return { success: "Resume uploaded." };
}

export async function setDefaultResume(id: string) {
  const { profile } = await me();
  const resume = await prisma.resume.findFirst({ where: { id, profileId: profile.id } });
  if (!resume) return;
  await prisma.$transaction([
    prisma.resume.updateMany({ where: { profileId: profile.id }, data: { isDefault: false } }),
    prisma.resume.update({ where: { id }, data: { isDefault: true } }),
  ]);
  revalidatePath("/applicant/resume");
}

export async function deleteResume(id: string) {
  const { profile } = await me();
  const resume = await prisma.resume.findFirst({
    where: { id, profileId: profile.id },
    include: { _count: { select: { applications: true } } },
  });
  // Employers need the CV for applications already sent, so those resumes stay.
  if (!resume || resume._count.applications > 0) return;
  if (resume.fileUrl) {
    const supabase = await createClient();
    await supabase.storage.from("resumes").remove([resume.fileUrl]);
  }
  await prisma.resume.delete({ where: { id } });
  if (resume.isDefault) {
    const next = await prisma.resume.findFirst({ where: { profileId: profile.id }, orderBy: { createdAt: "desc" } });
    if (next) await prisma.resume.update({ where: { id: next.id }, data: { isDefault: true } });
  }
  revalidatePath("/applicant/resume");
}

// ---------- saved jobs ----------

export async function toggleSaveJob(jobId: string) {
  const { profile } = await me();
  const key = { profileId_jobId: { profileId: profile.id, jobId } };
  if (await prisma.savedJob.findUnique({ where: key })) {
    await prisma.savedJob.delete({ where: key });
  } else if (await prisma.job.findFirst({ where: { id: jobId, status: "PUBLISHED" } })) {
    await prisma.savedJob.create({ data: { profileId: profile.id, jobId } });
  }
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/applicant/saved-jobs");
}

// ---------- applications ----------

export async function applyToJob(jobId: string, _: FormState, fd: FormData): Promise<FormState> {
  const { profile } = await me();

  const job = await prisma.job.findFirst({
    where: { id: jobId, status: "PUBLISHED", OR: [{ deadline: null }, { deadline: { gte: new Date() } }] },
    include: { questions: true },
  });
  if (!job) return { error: "This job is no longer accepting applications." };

  const resume = await prisma.resume.findFirst({ where: { id: str(fd, "resumeId"), profileId: profile.id } });
  if (!resume) return { error: "Choose a resume to send with your application." };

  const coverLetter = str(fd, "coverLetter").slice(0, 5000);
  const answers: { questionId: string; answer: string }[] = [];
  for (const q of job.questions) {
    const answer = str(fd, `q_${q.id}`).slice(0, 2000);
    if (!answer && q.required) return { error: `Please answer: ${q.prompt}` };
    if (answer) answers.push({ questionId: q.id, answer });
  }

  try {
    await prisma.application.create({
      data: {
        jobId, profileId: profile.id, resumeId: resume.id, coverLetter: coverLetter || null, status: "APPLIED",
        answers: { create: answers },
        history: { create: { fromStatus: null, toStatus: "APPLIED" } },
      },
    });
  } catch {
    return { error: "You have already applied to this job." };
  }
  revalidatePath("/applicant/applications");
  redirect("/applicant/applications?applied=1");
}

export async function withdrawApplication(id: string) {
  const { profile } = await me();
  const app = await prisma.application.findFirst({ where: { id, profileId: profile.id } });
  if (!app || ["HIRED", "REJECTED", "WITHDRAWN"].includes(app.status)) return;
  await prisma.$transaction([
    prisma.application.update({ where: { id }, data: { status: "WITHDRAWN" } }),
    prisma.applicationStatusHistory.create({ data: { applicationId: id, fromStatus: app.status, toStatus: "WITHDRAWN" } }),
  ]);
  revalidatePath("/applicant/applications");
}
