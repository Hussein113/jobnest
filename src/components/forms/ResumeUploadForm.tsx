"use client";
import { useActionState } from "react";
import { uploadResume } from "@/lib/applicant-actions";
import { FormMessage, SubmitButton } from "./Field";

export default function ResumeUploadForm() {
  const [state, action] = useActionState(uploadResume, undefined);
  return (
    <form action={action} className="space-y-3">
      <FormMessage error={state?.error} success={state?.success} />
      <input type="file" name="file" accept=".pdf,.docx" required
        className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-tint file:px-4 file:py-2 file:font-medium file:text-brand" />
      <p className="text-xs text-slate-500">PDF or Word (.docx), up to 5 MB.</p>
      <SubmitButton>Upload resume</SubmitButton>
    </form>
  );
}
