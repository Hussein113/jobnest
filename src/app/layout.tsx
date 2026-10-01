import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Jobnest", template: "%s | Jobnest" },
  description: "Find your next job, or your next hire, on Jobnest.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
