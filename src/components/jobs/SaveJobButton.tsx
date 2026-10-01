import { toggleSaveJob } from "@/lib/applicant-actions";
import { btnSecondary } from "@/lib/ui";

export default function SaveJobButton({ jobId, saved }: { jobId: string; saved: boolean }) {
  return (
    <form action={toggleSaveJob.bind(null, jobId)}>
      <button className={`${btnSecondary} w-full`}>{saved ? "Saved. Remove" : "Save job"}</button>
    </form>
  );
}
