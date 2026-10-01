import { redirect } from "next/navigation";
import { ResetForm } from "@/components/forms/SimpleEmailForms";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage() {
  if (!(await getCurrentUser())) redirect("/login?error=link");
  return (
    <>
      <h1 className="text-2xl font-bold">Choose a new password</h1>
      <p className="mb-6 mt-1 text-sm text-slate-600">Use at least 8 characters.</p>
      <ResetForm />
    </>
  );
}
