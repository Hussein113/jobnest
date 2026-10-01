export type Job = {
  id: string; title: string; companyId: string; location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  mode: "On-site" | "Hybrid" | "Remote";
  salaryMin: number; salaryMax: number; category: string; postedDaysAgo: number;
  summary: string; responsibilities: string[]; requirements: string[]; benefits: string[];
};
export type Company = { id: string; name: string; location: string; industry: string; about: string };

export const companies: Company[] = [
  { id: "northwind-health", name: "Northwind Health", location: "Boston, MA", industry: "Healthcare", about: "A regional care network focused on making primary care easier to reach." },
  { id: "brightpath", name: "Brightpath Education", location: "Austin, TX", industry: "Education", about: "Learning programs and tools for K-12 schools across Texas." },
  { id: "lumen-software", name: "Lumen Software", location: "Seattle, WA", industry: "Technology", about: "Builds scheduling and workflow software for small businesses." },
  { id: "harbor-financial", name: "Harbor Financial", location: "New York, NY", industry: "Finance & Accounting", about: "Accounting and advisory services for growing companies." },
  { id: "cedar-pine", name: "Cedar & Pine", location: "Denver, CO", industry: "Operations", about: "An outdoor goods retailer with 14 stores and a growing online shop." },
  { id: "pulse-media", name: "Pulse Media", location: "Los Angeles, CA", industry: "Marketing", about: "A creative studio producing campaigns for consumer brands." },
];

const shared = {
  benefits: ["Health, dental and vision coverage", "401(k) with company match", "Paid time off and holidays"],
};

export const jobs: Job[] = [
  { id: "marketing-manager-pulse", title: "Marketing Manager", companyId: "pulse-media", location: "Los Angeles, CA", type: "Full-time", mode: "Hybrid", salaryMin: 85000, salaryMax: 115000, category: "Marketing", postedDaysAgo: 2,
    summary: "Lead campaign planning and a small team of designers and writers for consumer brand clients.",
    responsibilities: ["Plan and run multi-channel campaigns", "Manage budgets and timelines", "Report results to clients each month"],
    requirements: ["4+ years in marketing", "Experience leading a team", "Strong written communication"], ...shared },
  { id: "software-engineer-lumen", title: "Full-Stack Engineer", companyId: "lumen-software", location: "Seattle, WA", type: "Full-time", mode: "Remote", salaryMin: 130000, salaryMax: 170000, category: "Technology", postedDaysAgo: 1,
    summary: "Build features across our TypeScript and PostgreSQL stack used by thousands of small businesses.",
    responsibilities: ["Ship features end to end", "Review code and mentor teammates", "Improve performance and reliability"],
    requirements: ["3+ years with TypeScript and React", "Comfortable with SQL", "Clear communicator"], ...shared },
  { id: "registered-nurse-northwind", title: "Registered Nurse", companyId: "northwind-health", location: "Boston, MA", type: "Full-time", mode: "On-site", salaryMin: 78000, salaryMax: 98000, category: "Healthcare", postedDaysAgo: 3,
    summary: "Provide patient care in our primary care clinics, working closely with physicians and care coordinators.",
    responsibilities: ["Assess and monitor patients", "Administer treatments and medications", "Document care accurately"],
    requirements: ["Active RN license", "1+ year clinical experience", "BLS certification"], ...shared },
  { id: "accountant-harbor", title: "Staff Accountant", companyId: "harbor-financial", location: "New York, NY", type: "Full-time", mode: "Hybrid", salaryMin: 70000, salaryMax: 90000, category: "Finance & Accounting", postedDaysAgo: 5,
    summary: "Prepare financial statements and support month-end close for a portfolio of client companies.",
    responsibilities: ["Reconcile accounts", "Prepare monthly reports", "Support audits and tax filings"],
    requirements: ["Accounting degree", "1-3 years experience", "Proficiency in Excel"], ...shared },
  { id: "teacher-brightpath", title: "Curriculum Specialist", companyId: "brightpath", location: "Austin, TX", type: "Full-time", mode: "Hybrid", salaryMin: 62000, salaryMax: 80000, category: "Education", postedDaysAgo: 4,
    summary: "Design lesson materials and train teachers who use our learning programs.",
    responsibilities: ["Write and revise lessons", "Lead teacher workshops", "Gather classroom feedback"],
    requirements: ["Teaching or curriculum experience", "Strong presentation skills", "Master's degree preferred"], ...shared },
  { id: "store-manager-cedar", title: "Store Operations Manager", companyId: "cedar-pine", location: "Denver, CO", type: "Full-time", mode: "On-site", salaryMin: 60000, salaryMax: 76000, category: "Operations", postedDaysAgo: 6,
    summary: "Run daily operations for our flagship Denver store, from staffing to inventory.",
    responsibilities: ["Schedule and coach a team of 20", "Manage inventory and ordering", "Hit sales and service goals"],
    requirements: ["3+ years in retail management", "Strong organizational skills", "Weekend availability"], ...shared },
  { id: "designer-pulse", title: "Brand Designer", companyId: "pulse-media", location: "Los Angeles, CA", type: "Contract", mode: "Remote", salaryMin: 60000, salaryMax: 85000, category: "Design & Creative", postedDaysAgo: 7,
    summary: "Create identities, campaign visuals and social assets for a mix of consumer brands.",
    responsibilities: ["Develop brand systems", "Design campaign assets", "Present concepts to clients"],
    requirements: ["Portfolio of brand work", "Figma and Adobe fluency", "3+ years experience"], ...shared },
  { id: "support-lead-lumen", title: "Customer Support Lead", companyId: "lumen-software", location: "Seattle, WA", type: "Full-time", mode: "Remote", salaryMin: 65000, salaryMax: 82000, category: "Customer Service", postedDaysAgo: 8,
    summary: "Lead a friendly support team and turn customer feedback into product improvements.",
    responsibilities: ["Coach support agents", "Improve help-center content", "Track response and satisfaction metrics"],
    requirements: ["2+ years in support", "Experience with help-desk tools", "Calm and clear under pressure"], ...shared },
];

export const categories = [
  "Technology", "Marketing", "Sales", "Finance & Accounting", "Healthcare", "Education",
  "Customer Service", "Design & Creative", "Operations", "Human Resources", "Engineering", "Legal",
];

export const getCompany = (id: string) => companies.find((c) => c.id === id)!;
export const getJob = (id: string) => jobs.find((j) => j.id === id);
