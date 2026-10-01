"use client";
import { useActionState } from "react";
import { forgotPassword, resetPassword } from "@/lib/auth-actions";
import { Field, SubmitButton, FormMessage } from "./Field";

export function ForgotForm() {
  const [state, action] = useActionState(forgotPassword, undefined);
  return (
    <form action={action} className="space-y-4">
      <FormMessage error={state?.error} success={state?.success} />
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <SubmitButton>Send reset link</SubmitButton>
    </form>
  );
}

export function ResetForm() {
  const [state, action] = useActionState(resetPassword, undefined);
  return (
    <form action={action} className="space-y-4">
      <FormMessage error={state?.error} />
      <Field label="New password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      <SubmitButton>Save new password</SubmitButton>
    </form>
  );
}
