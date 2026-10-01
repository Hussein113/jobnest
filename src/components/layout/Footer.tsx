import Link from "next/link";
import Logo from "./Logo";

const cols = [
  { title: "Job seekers", links: [["Find jobs", "/jobs"], ["Companies", "/companies"], ["Create an account", "/register"]] },
  { title: "Employers", links: [["Post a job", "/register?role=EMPLOYER"], ["Employer log in", "/login"]] },
  { title: "Jobnest", links: [["About", "#"], ["Privacy", "#"], ["Terms", "#"]] },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <Logo light />
          <p className="mt-3 max-w-xs text-sm text-blue-100">Apply in minutes. Hire without the hassle.</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="text-sm font-semibold">{c.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-blue-100">
              {c.links.map(([label, href]) => (
                <li key={label}><Link href={href} className="hover:text-white">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-blue-200">
        © {new Date().getFullYear()} Jobnest. All rights reserved.
      </div>
    </footer>
  );
}
