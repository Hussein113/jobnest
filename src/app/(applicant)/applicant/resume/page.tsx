import ResumeUploadForm from "@/components/forms/ResumeUploadForm";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { deleteResume, setDefaultResume } from "@/lib/applicant-actions";
import { btnSecondary, card } from "@/lib/ui";

export const metadata = { title: "Resume" };

export default async function ResumePage() {
  const user = await requireRole("APPLICANT");
  const resumes = await prisma.resume.findMany({
    where: { profile: { userId: user.id } },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    include: { _count: { select: { applications: true } } },
  });

  // Files are private, so each link is a signed URL that expires after an hour.
  const paths = resumes.map((r) => r.fileUrl).filter((p): p is string => !!p);
  const urls = new Map<string, string>();
  if (paths.length) {
    const supabase = await createClient();
    const { data } = await supabase.storage.from("resumes").createSignedUrls(paths, 3600);
    data?.forEach((d) => d.path && d.signedUrl && urls.set(d.path, d.signedUrl));
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Your resumes</h1>
      <section className={card}>
        <h2 className="mb-3 font-semibold">Upload a resume</h2>
        <ResumeUploadForm />
      </section>
      <section className={card}>
        <h2 className="font-semibold">Saved resumes</h2>
        <ul className="mt-2 divide-y divide-line">
          {resumes.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <div>
                <p className="font-medium">{r.label} {r.isDefault && <span className="ml-1 rounded-full bg-tint px-2 py-0.5 text-xs text-brand">Default</span>}</p>
                {r._count.applications > 0 && <p className="text-xs text-slate-500">Sent with {r._count.applications} {r._count.applications === 1 ? "application" : "applications"}</p>}
              </div>
              <div className="flex items-center gap-3">
                {r.fileUrl && urls.get(r.fileUrl) && <a href={urls.get(r.fileUrl)} target="_blank" rel="noreferrer" className="font-medium text-brand hover:underline">View</a>}
                {!r.isDefault && <form action={setDefaultResume.bind(null, r.id)}><button className={btnSecondary}>Make default</button></form>}
                {r._count.applications === 0 && <form action={deleteResume.bind(null, r.id)}><button className="text-accent hover:underline">Delete</button></form>}
              </div>
            </li>
          ))}
          {resumes.length === 0 && <li className="py-3 text-sm text-slate-600">No resumes yet. Upload one above to start applying.</li>}
        </ul>
      </section>
    </div>
  );
}
