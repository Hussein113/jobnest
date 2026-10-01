export default function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-3xl font-bold text-brand">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </div>
  );
}
