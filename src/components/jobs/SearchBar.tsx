export default function SearchBar({ q = "", location = "" }: { q?: string; location?: string }) {
  return (
    <form action="/jobs" className="flex w-full flex-col gap-2 rounded-2xl bg-white p-2 shadow-xl md:flex-row md:items-center">
      <label className="flex-1 px-3 py-1">
        <span className="block text-xs font-medium text-brand">What</span>
        <input name="q" defaultValue={q} placeholder="Job title or company" className="w-full bg-transparent py-1 text-base text-ink outline-none placeholder:text-slate-400" />
      </label>
      <div className="hidden h-10 w-px bg-line md:block" />
      <label className="flex-1 px-3 py-1">
        <span className="block text-xs font-medium text-brand">Where</span>
        <input name="location" defaultValue={location} placeholder="City or state" className="w-full bg-transparent py-1 text-base text-ink outline-none placeholder:text-slate-400" />
      </label>
      <button className="rounded-xl bg-accent px-8 py-3 font-semibold text-white hover:bg-accent-dark">Search jobs</button>
    </form>
  );
}
