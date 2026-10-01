"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { registerSchema, loginSchema, forgotSchema, resetSchema } from "@/lib/validations";
import { dashboardPathFor, safeNext } from "@/lib/auth-paths";
import { slugify } from "@/lib/utils";

export type FormState = { error?: string; success?: string } | undefined;

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

export async function register(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    fullName: str(fd, "fullName"),
    email: str(fd, "email").toLowerCase(),
    phone: str(fd, "phone") || undefined,
    password: String(fd.get("password") ?? ""),
    role: str(fd, "role"),
    companyName: str(fd, "companyName") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: d.email,
    password: d.password,
    options: {
      emailRedirectTo: `${siteUrl()}/auth/callback`,
      data: { full_name: d.fullName, role: d.role },
    },
  });
  if (error) return { error: error.message };
  const authUser = data.user;
  // Supabase returns a user with no identities when the email is already registered.
  if (!authUser || authUser.identities?.length === 0) {
    return { error: "An account with this email already exists. Try logging in." };
  }

  const verified = !!data.session; // true only if email confirmation is switched off in Supabase
  const profile =
    d.role === "APPLICANT"
      ? { applicantProfile: { create: {} } }
      : {
          employerProfile: {
            create: {
              company: {
                create: {
                  name: d.companyName!,
                  slug: `${slugify(d.companyName!)}-${Math.random().toString(36).slice(2, 6)}`,
                },
              },
            },
          },
        };

  try {
    await prisma.user.create({
      data: {
        id: authUser.id,
        email: d.email,
        fullName: d.fullName,
        phone: d.phone,
        role: d.role,
        status: verified ? "ACTIVE" : "PENDING_VERIFICATION",
        emailVerified: verified,
        ...profile,
      },
    });
  } catch {
    return { error: "We could not finish creating your account. Please try again." };
  }

  if (verified) redirect(dashboardPathFor(d.role));
  return { success: "Almost done. Check your email for a link to confirm your account." };
}

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: str(fd, "email").toLowerCase(),
    password: String(fd.get("password") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return {
      error:
        error.code === "email_not_confirmed"
          ? "Please confirm your email first. Check your inbox for the link."
          : "Incorrect email or password.",
    };
  }

  const user = await prisma.user.findUnique({ where: { id: data.user.id } });
  if (!user || user.status === "SUSPENDED") {
    await supabase.auth.signOut();
    return { error: user ? "This account has been suspended." : "We could not find this account." };
  }
  redirect(safeNext(str(fd, "next"), dashboardPathFor(user.role)));
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function forgotPassword(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = forgotSchema.safeParse({ email: str(fd, "email").toLowerCase() });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl()}/auth/callback?next=/reset-password`,
  });
  // Same message whether or not the email exists, so accounts can't be probed.
  return { success: "If an account exists for that email, a reset link is on its way." };
}

export async function resetPassword(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = resetSchema.safeParse({ password: String(fd.get("password") ?? "") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: "That reset link has expired. Request a new one." };
  const user = await getUserRole(supabase);
  redirect(user ? dashboardPathFor(user) : "/login");
}

async function getUserRole(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const u = await prisma.user.findUnique({ where: { id: data.user.id }, select: { role: true } });
  return u?.role ?? null;
}
