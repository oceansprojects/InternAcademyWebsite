// Plain, serializable domain types used across the UI.
// These mirror the database models but avoid Decimal/Date objects so they can be
// passed from Server Components to Client Components safely.

export type CurriculumWeek = {
  week: number
  topic: string
  description: string
}

export type ProgramFaq = {
  question: string
  answer: string
}

export type Program = {
  id: string
  slug: string
  title: string
  description: string
  category: string
  mode: string
  duration_weeks: number
  price_mrp: number
  price_selling: number
  thumbnail_url: string | null
  instructor_name: string | null
  city: string
  skills: string[]
  curriculum: CurriculumWeek[]
  faqs: ProgramFaq[]
  popular?: boolean
  rating?: number
  enrolled?: number
}

export type Internship = {
  id: string
  slug: string
  title: string
  company_name: string
  company_logo?: string | null
  description: string
  sector: string
  location: string
  mode: "On-site" | "Remote" | "Hybrid"
  stipend: number
  duration_months: number
  openings: number
  required_degree: string | null
  required_branch: string | null
  min_cgpa: number | null
  deadline: string
  status: "Active" | "Closed" | "Upcoming"
  skills: string[]
  responsibilities: string[]
}

export type Resource = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  thumbnail_url: string | null
  published_at: string
  read_minutes: number
  is_ai_generated: boolean
}

export type SuccessStory = {
  id: string
  student_name: string
  photo_url: string | null
  program: string
  company: string
  package_lpa: number
  testimonial: string
}

export type PlacementRecord = {
  id: string
  student_name: string
  company_name: string
  role: string
  package_lpa: number
  program: string
}

export type Webinar = {
  id: string
  slug: string
  title: string
  description: string
  thumbnail_url: string | null
  scheduled_at: string
  duration_mins: number
  platform: string
}
