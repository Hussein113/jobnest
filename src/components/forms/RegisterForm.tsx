"use client";
import { useActionState, useState } from "react";
import { register } from "@/lib/auth-actions";
import { Field, SubmitButton, FormMessage } from "./Field";

type Role = "APPLICANT" | "EMPLOYER";

export default function RegisterForm({ defaultRole }: { defaultRole: Role }) {
  const [state, action] = useActionState(register, undefined);
  const [role, setRole] = useState<Role>(defaultRole);

  if (state?.success) return <FormMessage success={state.success} />;

  const option = (value: Role, label: string) => (
    <label className={`flex-1 cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-medium ${role === value ? "border-brand bg-tint text-brand" : "border-line"}`}>
      <input type="radio" name="role" value={value} checked={role === value} onChange={() => setRole(value)} className="sr-only" />
      {label}
    </label>
  );

  return (
    <form action={action} className="space-y-4">
      <div className="flex gap-3">{option("APPLICANT", "I am looking for a job")}{option("EMPLOYER", "I am hiring")}</div>
      <FormMessage error={state?.error} />
      <Field label="Full name" name="fullName" autoComplete="name" required />
      {role === "EMPLOYER" && <Field label="Company name" name="companyName" required />}
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" />
      <Field label="Password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      <SubmitButton>Create account</SubmitButton>
    </form>
  );
}
