import { z } from "zod";

const email = z.string().email("Enter a valid email address.");
const password = z.string().min(8, "Password must be at least 8 characters.");

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name."),
    email,
    phone: z.string().optional(),
    password,
    role: z.enum(["APPLICANT", "EMPLOYER"]),
    companyName: z.string().min(2, "Enter your company name.").optional(),
  })
  .refine((d) => d.role !== "EMPLOYER" || !!d.companyName, {
    message: "Enter your company name.",
    path: ["companyName"],
  });

export const loginSchema = z.object({ email, password: z.string().min(1, "Enter your password.") });
export const forgotSchema = z.object({ email });
export const resetSchema = z.object({ password });
