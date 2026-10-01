import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/forms/LoginForm";
import { getCurrentUser } from "@/lib/auth";
import { dashboardPathFor } from "@/lib/auth-paths";

export const metadata = { title: "Log in" };

const notices: Record<string, string> = {
  suspended: "This account has been suspended.",
  link: "That link is invalid or has expired. Please try again.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const user = await getCurrentUser();
  if (user && user.status !== "SUSPENDED") redirect(dashboardPathFor(user.role));
  return (
    <>
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mb-6 mt-1 text-sm text-slate-600">Log in to continue.</p>
      <LoginForm next={next} notice={error ? notices[error] : undefined} />
      <p className="mt-6 text-center text-sm text-slate-600">
        New to Jobnest? <Link href="/register" className="font-medium text-brand hover:underline">Create an account</Link>
      </p>
    </>
  );
}
