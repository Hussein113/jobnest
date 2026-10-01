import Link from "next/link";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/forms/RegisterForm";
import { getCurrentUser } from "@/lib/auth";
import { dashboardPathFor } from "@/lib/auth-paths";

export const metadata = { title: "Create your account" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(dashboardPathFor(user.role));
  return (
    <>
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mb-6 mt-1 text-sm text-slate-600">It is free and takes about a minute.</p>
      <RegisterForm defaultRole={role === "EMPLOYER" ? "EMPLOYER" : "APPLICANT"} />
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account? <Link href="/login" className="font-medium text-brand hover:underline">Log in</Link>
      </p>
    </>
  );
}
