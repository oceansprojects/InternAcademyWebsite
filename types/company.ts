// ─── Enums & Option Arrays ────────────────────────────────

export type EmployeeCount = "0-50" | "50-100" | "100-500" | "500-1000" | "1000+";
export type OpportunityStatus = "active" | "expired" | "closed";
export type WorkMode = "on_site" | "remote" | "hybrid";
export type OpportunityType = "internship" | "full_time" | "part_time" | "contract";

export const EMPLOYEE_COUNT_OPTIONS = [
  { value: "0-50",    label: "0–50 employees" },
  { value: "50-100",  label: "50–100 employees" },
  { value: "100-500", label: "100–500 employees" },
  { value: "500-1000",label: "500–1,000 employees" },
  { value: "1000+",   label: "1,000+ employees" },
] as const;

export const WORK_MODE_OPTIONS = [
  { value: "on_site", label: "On-Site" },
  { value: "remote",  label: "Remote" },
  { value: "hybrid",  label: "Hybrid" },
] as const;

export const OPPORTUNITY_TYPE_OPTIONS = [
  { value: "internship", label: "Internship" },
  { value: "full_time",  label: "Full-Time Job" },
  { value: "part_time",  label: "Part-Time Job" },
  { value: "contract",   label: "Contract" },
] as const;

export const OPPORTUNITY_STATUS_OPTIONS = [
  { value: "active",  label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "closed",  label: "Closed" },
] as const;

// ─── Company Profile ───────────────────────────────────────

export interface SocialLink {
  id: string;
  social_app_name: string;
  social_acc_link: string;
  sort_order: number;
}

export interface SocialLinkPayload {
  socialAppName: string;
  socialAccLink: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  contact_email: string | null;
  contact_number: string | null;
  description: string | null;
  address_city: string | null;
  address_state: string | null;
  address_nation: string | null;
  employee_count: EmployeeCount | null;
  created_at: string;
  updated_at: string;
  social_links: SocialLink[];
}

export interface CompanyProfilePayload {
  name?: string;
  website?: string;
  contactEmail?: string;
  contactNumber?: string;
  description?: string;
  addressCity?: string;
  addressState?: string;
  addressNation?: string;
  employeeCount?: EmployeeCount;
  logoUrl?: string;
}

// ─── Opportunities ─────────────────────────────────────────

export interface Opportunity {
  id: string;
  company_id: string;
  title: string;
  type: OpportunityType;
  description: string | null;
  role: string | null;
  tech_stack: string[];
  years_experience: string | null;
  selection_process: string | null;
  status: OpportunityStatus;
  work_mode: WorkMode;
  city: string | null;
  state: string | null;
  openings: number | null;
  stipend_salary: string | null;
  application_deadline: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined company info (for listing/detail pages)
  company_name?: string;
  company_logo_url?: string | null;
  company_website?: string | null;
}

export interface OpportunityPayload {
  title: string;
  type: OpportunityType;
  description?: string;
  role?: string;
  techStack: string[];
  yearsExperience?: string;
  selectionProcess?: string;
  workMode: WorkMode;
  city?: string;
  state?: string;
  openings?: number;
  stipendSalary?: string;
  applicationDeadline?: string;
}

// ─── Applications ──────────────────────────────────────────

export interface Application {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: "applied" | "shortlisted" | "rejected" | "hired";
  applied_at: string;
  updated_at: string;
}

export interface ApplicantWithProfile extends Application {
  student_name: string | null;
  student_email: string | null;
  full_name: string | null;
  profile_photo_url: string | null;
  phone_number: string | null;
  tech_stack: string[];
  years_experience: string | null;
  resume_url: string | null;
  address_city: string | null;
  address_state: string | null;
  college_name: string | null;
  degree: string | null;
}
