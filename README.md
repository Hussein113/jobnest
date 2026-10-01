# Jobnest

Job-applicant platform: applicants, employers, admin. Next.js + TypeScript + Tailwind, Prisma, Supabase, Vercel.

## Setup

1. `npm install`
2. Create a Supabase project. Copy `.env.example` to `.env` and fill in the values
   (Prisma and Next.js both read `.env`).
3. In Supabase, go to Authentication > URL Configuration:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`
4. In the Supabase SQL editor, run `supabase/storage.sql` (creates the private `resumes` bucket and its access rules)
5. `npx prisma migrate dev --name init` (creates all tables)
6. `npm run db:seed` (US cities, categories, and sample companies with jobs)
7. `npm run dev` and open http://localhost:3000

## Authentication

- Supabase Auth proves identity. The `User` table in Postgres holds the role (APPLICANT, EMPLOYER, ADMIN).
- Sign-up creates the Supabase user, then the matching `User` row and profile (employers also get a `Company`).
- Email confirmation is on by default. For quick local testing you can switch it off in
  Supabase > Authentication > Providers > Email.
- `src/proxy.ts` sends logged-out visitors away from /applicant, /employer and /admin.
  Each area's `layout.tsx` also checks the role on the server.
- Admins cannot sign up from the site. Register normally, then run:
  `npm run admin:promote -- you@example.com`

## Applicant features

- Profile (details, skills, experience, education), resumes (private storage, signed links), apply with
  screening questions, saved jobs, application tracking with withdraw.
- Every applicant action checks on the server that the record belongs to the logged-in user.
- Resumes already sent with an application cannot be deleted, so employers keep access.

## Structure

- `prisma/schema.prisma` database schema, `prisma/seed.ts` seed data
- `src/app/(public|auth|applicant|employer|admin)` route groups matching the sitemap
- `src/lib` Prisma and Supabase clients, auth helpers and actions, validation, utils
- `src/components` layout, jobs, forms, dashboard
