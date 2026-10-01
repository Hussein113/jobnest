export const APP_NAME = "Jobnest";
export const DEFAULT_CURRENCY = "USD";
export const DEFAULT_COUNTRY = "United States";

export const APPLICATION_STAGES = [
  "APPLIED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW",
  "OFFER",
  "HIRED",
] as const;

export const MAX_CV_SIZE_MB = 5;
export const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
