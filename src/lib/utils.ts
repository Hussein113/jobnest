export function formatSalary(min?: number | null, max?: number | null, currency = "USD") {
  if (!min && !max) return "Salary not listed";
  const fmt = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  if (min && max) return `${fmt.format(min)} – ${fmt.format(max)}`;
  return fmt.format((min ?? max)!);
}

export function timeAgo(date: Date) {
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
