"use client";
import { useFormStatus } from "react-dom";

export const inputClass =
  "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base outline-none focus:border-brand";

export function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input {...props} className={inputClass} />
    </label>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="w-full rounded-xl bg-accent py-3 font-semibold text-white hover:bg-accent-dark disabled:opacity-60">
      {pending ? "One moment..." : children}
    </button>
  );
}

export function FormMessage({ error, success }: { error?: string; success?: string }) {
  if (!error && !success) return null;
  return (
    <p role={error ? "alert" : "status"} className={`rounded-lg px-3 py-2 text-sm ${error ? "bg-red-50 text-accent-dark" : "bg-tint text-brand-dark"}`}>
      {error ?? success}
    </p>
  );
}
