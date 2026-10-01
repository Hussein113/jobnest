import Logo from "@/components/layout/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-tint px-4 py-10">
      <Logo />
      <div className="mt-8 w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-sm">{children}</div>
    </div>
  );
}
