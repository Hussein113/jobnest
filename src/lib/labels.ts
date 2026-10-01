export const typeLabel: Record<string, string> = {
  FULL_TIME: "Full-time", PART_TIME: "Part-time", CONTRACT: "Contract", INTERNSHIP: "Internship", TEMPORARY: "Temporary",
};
export const modeLabel: Record<string, string> = { ON_SITE: "On-site", HYBRID: "Hybrid", REMOTE: "Remote" };
export const statusLabel: Record<string, string> = {
  DRAFT: "Draft", APPLIED: "Applied", UNDER_REVIEW: "Under review", SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview", OFFER: "Offer", HIRED: "Hired", REJECTED: "Not selected", WITHDRAWN: "Withdrawn",
};
export const locationLabel = (l?: { city: string; state: string | null } | null) =>
  l ? [l.city, l.state].filter(Boolean).join(", ") : "Location not listed";
