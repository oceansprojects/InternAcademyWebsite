export interface StudentProfile {
  id: string;
  user_id: string;
  mobile_number: string;
  college_name: string;
  degree: string;
  branch: string;
  current_year: number;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  resume_url?: string;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
  // Professional Profile extension fields
  full_name?: string;
  profile_photo_url?: string;
  email?: string;
  phone_number?: string;
  whatsapp_number?: string;
  address_state?: string;
  address_city?: string;
  address_nation?: string;
  tech_stack: string[];
  years_experience?: YearsExperience;
}

export interface StudentProfilePayload {
  mobileNumber: string;
  collegeName: string;
  degree: string;
  branch: string;
  currentYear: number;
}

// ─── Enums ────────────────────────────────────────────────

export const YEARS_EXPERIENCE_OPTIONS = [
  { value: "0-1", label: "0–1 Year (Entry Level / Student)" },
  { value: "1-2", label: "1–2 Years" },
  { value: "2-3", label: "2–3 Years" },
  { value: "3-5", label: "3–5 Years" },
  { value: "5-8", label: "5–8 Years" },
  { value: "8+",  label: "8+ Years" },
] as const;

export type YearsExperience = "0-1" | "1-2" | "2-3" | "3-5" | "5-8" | "8+";

export const JOB_TYPE_OPTIONS = [
  { value: "internship", label: "Internship" },
  { value: "job",        label: "Full-Time Job" },
  { value: "freelance",  label: "Freelance" },
] as const;

export type JobType = "internship" | "job" | "freelance";

export const EDU_STREAM_OPTIONS = [
  { value: "engineering", label: "Engineering" },
  { value: "arts",        label: "Arts" },
  { value: "commerce",    label: "Commerce" },
  { value: "science",     label: "Science" },
  { value: "mba",         label: "MBA" },
  { value: "law",         label: "Law" },
  { value: "medicine",    label: "Medicine" },
  { value: "other",       label: "Other" },
] as const;

export const EDU_BRANCH_OPTIONS = [
  { value: "cs",          label: "Computer Science (CS)" },
  { value: "it",          label: "Information Technology (IT)" },
  { value: "ece",         label: "Electronics & Communication (ECE)" },
  { value: "eee",         label: "Electrical Engineering (EEE)" },
  { value: "mechanical",  label: "Mechanical Engineering" },
  { value: "civil",       label: "Civil Engineering" },
  { value: "chemical",    label: "Chemical Engineering" },
  { value: "other",       label: "Other" },
] as const;

// ─── Professional Profile Payload ─────────────────────────

export interface ProfessionalProfilePayload {
  fullName?: string;
  profilePhotoUrl?: string;
  email?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  addressState?: string;
  addressCity?: string;
  addressNation?: string;
  techStack: string[];
  yearsExperience?: YearsExperience;
  resumeUrl?: string;
}

// ─── Multi-entry Sub-document Types ───────────────────────

export interface EducationEntry {
  id: string;
  institute_name: string;
  start_year: number;
  end_year?: number | null;
  currently_studying: boolean;
  stream?: string | null;
  branch?: string | null;
  city?: string | null;
  state?: string | null;
  grade_cgpa?: string | null;
  created_at: string;
}

export interface EducationPayload {
  instituteName: string;
  startYear: number;
  endYear?: number | null;
  currentlyStudying: boolean;
  stream?: string;
  branch?: string;
  city?: string;
  state?: string;
  gradeCgpa?: string;
}

export interface JobEntry {
  id: string;
  company_name: string;
  position: string;
  type: JobType;
  start_month: number;
  start_year: number;
  end_month?: number | null;
  end_year?: number | null;
  currently_working: boolean;
  city?: string | null;
  state?: string | null;
  description?: string | null;
  created_at: string;
}

export interface JobPayload {
  companyName: string;
  position: string;
  type: JobType;
  startMonth: number;
  startYear: number;
  endMonth?: number | null;
  endYear?: number | null;
  currentlyWorking: boolean;
  city?: string;
  state?: string;
  description?: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  description?: string | null;
  tech_stack: string[];
  project_url?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_ongoing: boolean;
  created_at: string;
}

export interface ProjectPayload {
  title: string;
  description?: string;
  techStack: string[];
  projectUrl?: string;
  startDate?: string;
  endDate?: string;
  isOngoing: boolean;
}

export interface AchievementEntry {
  id: string;
  title: string;
  description?: string | null;
  date?: string | null;
  organization?: string | null;
  created_at: string;
}

export interface AchievementPayload {
  title: string;
  description?: string;
  date?: string;
  organization?: string;
}

export interface CertificateEntry {
  id: string;
  title: string;
  issuing_org: string;
  issue_date?: string | null;
  certificate_link?: string | null;
  created_at: string;
}

export interface CertificatePayload {
  title: string;
  issuingOrg: string;
  issueDate?: string;
  certificateLink?: string;
}