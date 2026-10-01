import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { modeLabel, typeLabel } from "@/lib/labels";
import { btnPrimary, btnSecondary, card, input } from "@/lib/ui";
import {
  saveProfile, saveSkills, addExperience, deleteExperience, addEducation, deleteEducation,
} from "@/lib/applicant-actions";

export const metadata = { title: "Profile" };

const fmt = (d: Date | null) => (d ? d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }) : "");
const label = "block text-sm font-medium";

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const user = await requireRole("APPLICANT");
  const { saved } = await searchParams;
  const profile = await prisma.applicantProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
    include: {
      location: true,
      experiences: { orderBy: { startDate: "desc" } },
      educations: { orderBy: { endDate: "desc" } },
      skills: { include: { skill: true } },
    },
  });
  const loc = profile.location ? [profile.location.city, profile.location.state].filter(Boolean).join(", ") : "";

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Your profile</h1>
      {saved && <p role="status" className="rounded-lg bg-tint px-3 py-2 text-sm text-brand-dark">Saved.</p>}

      <form action={saveProfile} className={`${card} space-y-4`}>
        <h2 className="font-semibold">About you</h2>
        <label className={label}>Professional headline
          <input name="headline" defaultValue={profile.headline ?? ""} maxLength={120} placeholder="Marketing manager with 5 years in consumer brands" className={input} />
        </label>
        <label className={label}>About
          <textarea name="about" defaultValue={profile.about ?? ""} rows={5} maxLength={3000} className={input} />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className={label}>Location (City, State)
            <input name="location" defaultValue={loc} placeholder="Austin, TX" className={input} />
          </label>
          <label className={label}>Available from
            <input type="date" name="availableFrom" defaultValue={profile.availableFrom?.toISOString().slice(0, 10) ?? ""} className={input} />
          </label>
          <label className={label}>LinkedIn URL
            <input name="linkedinUrl" type="url" defaultValue={profile.linkedinUrl ?? ""} className={input} />
          </label>
          <label className={label}>Portfolio URL
            <input name="portfolioUrl" type="url" defaultValue={profile.portfolioUrl ?? ""} className={input} />
          </label>
          <label className={label}>Expected salary, minimum (USD per year)
            <input name="expectedSalaryMin" inputMode="numeric" defaultValue={profile.expectedSalaryMin ?? ""} className={input} />
          </label>
          <label className={label}>Expected salary, maximum (USD per year)
            <input name="expectedSalaryMax" inputMode="numeric" defaultValue={profile.expectedSalaryMax ?? ""} className={input} />
          </label>
          <label className={label}>Preferred job type
            <select name="preferredType" defaultValue={profile.preferredType ?? ""} className={input}>
              <option value="">No preference</option>
              {Object.entries(typeLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label className={label}>Preferred work setting
            <select name="preferredWorkMode" defaultValue={profile.preferredWorkMode ?? ""} className={input}>
              <option value="">No preference</option>
              {Object.entries(modeLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
        </div>
        <button className={btnPrimary}>Save profile</button>
      </form>

      <form action={saveSkills} className={`${card} space-y-3`}>
        <h2 className="font-semibold">Skills</h2>
        <label className={label}>Separate skills with commas
          <input name="skills" defaultValue={profile.skills.map((s) => s.skill.name).join(", ")} placeholder="Sales, CRM, Excel" className={input} />
        </label>
        <button className={btnPrimary}>Save skills</button>
      </form>

      <section className={`${card} space-y-4`}>
        <h2 className="font-semibold">Work experience</h2>
        <ul className="divide-y divide-line">
          {profile.experiences.map((e) => (
            <li key={e.id} className="flex items-start justify-between gap-4 py-3 text-sm">
              <div>
                <p className="font-medium">{e.title} at {e.company}</p>
                <p className="text-slate-600">{fmt(e.startDate)} to {e.isCurrent ? "Present" : fmt(e.endDate) || "Present"}</p>
                {e.description && <p className="mt-1 whitespace-pre-line text-slate-700">{e.description}</p>}
              </div>
              <form action={deleteExperience.bind(null, e.id)}><button className="text-accent hover:underline">Remove</button></form>
            </li>
          ))}
          {profile.experiences.length === 0 && <li className="py-3 text-sm text-slate-600">No experience added yet.</li>}
        </ul>
        <details className="rounded-xl border border-line p-4">
          <summary className="cursor-pointer text-sm font-medium text-brand">Add experience</summary>
          <form action={addExperience} className="mt-4 grid gap-4 md:grid-cols-2">
            <label className={label}>Job title<input name="title" required className={input} /></label>
            <label className={label}>Company<input name="company" required className={input} /></label>
            <label className={label}>Start<input type="month" name="startDate" required className={input} /></label>
            <label className={label}>End<input type="month" name="endDate" className={input} /></label>
            <label className="flex items-center gap-2 text-sm md:col-span-2"><input type="checkbox" name="isCurrent" /> I currently work here</label>
            <label className={`${label} md:col-span-2`}>What you did<textarea name="description" rows={3} className={input} /></label>
            <div className="md:col-span-2"><button className={btnSecondary}>Add experience</button></div>
          </form>
        </details>
      </section>

      <section className={`${card} space-y-4`}>
        <h2 className="font-semibold">Education</h2>
        <ul className="divide-y divide-line">
          {profile.educations.map((e) => (
            <li key={e.id} className="flex items-start justify-between gap-4 py-3 text-sm">
              <div>
                <p className="font-medium">{e.level}{e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ""}</p>
                <p className="text-slate-600">{e.institution}{e.endDate ? `, ${fmt(e.endDate)}` : ""}</p>
              </div>
              <form action={deleteEducation.bind(null, e.id)}><button className="text-accent hover:underline">Remove</button></form>
            </li>
          ))}
          {profile.educations.length === 0 && <li className="py-3 text-sm text-slate-600">No education added yet.</li>}
        </ul>
        <details className="rounded-xl border border-line p-4">
          <summary className="cursor-pointer text-sm font-medium text-brand">Add education</summary>
          <form action={addEducation} className="mt-4 grid gap-4 md:grid-cols-2">
            <label className={label}>School<input name="institution" required className={input} /></label>
            <label className={label}>Level
              <select name="level" required defaultValue="" className={input}>
                <option value="" disabled>Choose one</option>
                {["High school", "Certificate", "Associate degree", "Bachelor's degree", "Master's degree", "Doctorate"].map((l) => <option key={l}>{l}</option>)}
              </select>
            </label>
            <label className={label}>Field of study<input name="fieldOfStudy" className={input} /></label>
            <label className={label}>Graduated<input type="month" name="endDate" className={input} /></label>
            <div className="md:col-span-2"><button className={btnSecondary}>Add education</button></div>
          </form>
        </details>
      </section>
    </div>
  );
}
