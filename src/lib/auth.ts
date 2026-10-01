import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { dashboardPathFor, type AppRole } from "@/lib/auth-paths";

// The Supabase session proves who the person is; the Prisma User row decides their role.
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return prisma.user.findUnique({ where: { id: data.user.id } });
});

export async function requireRole(role: AppRole) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.status === "SUSPENDED") redirect("/login?error=suspended");
  if (user.role !== role) redirect(dashboardPathFor(user.role));
  return user;
}
