"use client";
import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/lib/auth-actions";
import { Field, SubmitButton, FormMessage } from "./Field";

export default function LoginForm({ next, notice }: { next?: string; notice?: string }) {
  const [state, action] = useActionState(login, undefined);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ""} />
      <FormMessage error={state?.error ?? notice} />
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required />
      <div className="text-right text-sm"><Link href="/forgot-password" className="text-brand hover:underline">Forgot password?</Link></div>
      <SubmitButton>Log in</SubmitButton>
    </form>
  );
}
