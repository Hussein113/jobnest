"use client";
import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "@/lib/auth-actions";
import { input } from "@/lib/ui";
import { FormMessage, SubmitButton } from "./Field";

type Q = { id: string; prompt: string; type: "TEXT" | "YES_NO" | "SINGLE_CHOICE" | "NUMBER"; options: unknown; required: boolean };

export default function ApplyForm({
  action, resumes, questions,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  resumes: { id: string; label: string; isDefault: boolean }[];
  questions: Q[];
}) {
  const [state, formAction] = useActionState(action, undefined);
  return (
    <form action={formAction} className="space-y-8">
      <FormMessage error={state?.error} />

      <fieldset>
        <legend className="text-lg font-bold">Resume</legend>
        {resumes.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">
            You have no resume yet. <Link href="/applicant/resume" className="font-medium text-brand underline">Upload one</Link>, then come back to apply.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {resumes.map((r) => (
              <label key={r.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm has-[:checked]:border-brand has-[:checked]:bg-tint">
                <input type="radio" name="resumeId" value={r.id} defaultChecked={r.isDefault} required />
                {r.label}{r.isDefault && <span className="text-xs text-slate-500">(default)</span>}
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <label className="block">
        <span className="text-lg font-bold">Cover letter <span className="text-sm font-normal text-slate-500">(optional)</span></span>
        <textarea name="coverLetter" rows={6} maxLength={5000} className={input} placeholder="Tell the employer why you are a good fit." />
      </label>

      {questions.length > 0 && (
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold">Questions from the employer</legend>
          {questions.map((q) => {
            const opts = Array.isArray(q.options) ? (q.options as string[]) : [];
            return (
              <label key={q.id} className="block text-sm font-medium">
                {q.prompt}{q.required && <span className="text-accent"> *</span>}
                {q.type === "YES_NO" ? (
                  <select name={`q_${q.id}`} required={q.required} defaultValue="" className={input}>
                    <option value="" disabled>Choose one</option><option>Yes</option><option>No</option>
                  </select>
                ) : q.type === "SINGLE_CHOICE" ? (
                  <select name={`q_${q.id}`} required={q.required} defaultValue="" className={input}>
                    <option value="" disabled>Choose one</option>{opts.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input name={`q_${q.id}`} type={q.type === "NUMBER" ? "number" : "text"} required={q.required} className={input} />
                )}
              </label>
            );
          })}
        </fieldset>
      )}

      <SubmitButton>Submit application</SubmitButton>
    </form>
  );
}
