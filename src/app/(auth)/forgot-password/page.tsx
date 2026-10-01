import Link from "next/link";
import { ForgotForm } from "@/components/forms/SimpleEmailForms";

export const metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Reset your password</h1>
      <p className="mb-6 mt-1 text-sm text-slate-600">Enter your email and we will send you a link.</p>
      <ForgotForm />
      <p className="mt-6 text-center text-sm"><Link href="/login" className="text-brand hover:underline">Back to log in</Link></p>
    </>
  );
}
