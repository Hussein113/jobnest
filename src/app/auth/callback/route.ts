import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { dashboardPathFor, safeNext } from "@/lib/auth-paths";

// Handles the link in confirmation and password-reset emails.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await prisma.user.updateMany({
          where: { id: data.user.id, status: "PENDING_VERIFICATION" },
          data: { emailVerified: true, status: "ACTIVE" },
        });
        const user = await prisma.user.findUnique({ where: { id: data.user.id } });
        const fallback = user ? dashboardPathFor(user.role) : "/";
        return NextResponse.redirect(`${origin}${safeNext(next, fallback)}`);
      }
    }
  }
  return NextResponse.redirect(`${origin}/login?error=link`);
}
