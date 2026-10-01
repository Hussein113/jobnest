export type AppRole = "APPLICANT" | "EMPLOYER" | "ADMIN";

export const dashboardPathFor = (role: AppRole) =>
  role === "ADMIN" ? "/admin/dashboard" : role === "EMPLOYER" ? "/employer/dashboard" : "/applicant/dashboard";

// Only allow same-site relative paths after login (blocks open redirects).
export const safeNext = (next: string | null | undefined, fallback: string) =>
  next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
