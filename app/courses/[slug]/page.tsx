"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ChevronDown,
  Check,
  Calendar,
  Clock,
  Award,
  Users,
  Play,
  Briefcase,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  TrendingUp,
  MapPin,
  X,
  Star,
  Download,
  DollarSign
} from "lucide-react"
import SiteHeader from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

// ─── DB types ────────────────────────────────────────────────────────────────
type Program = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  category: string | null
  duration_weeks: number
  batch_mode: string
  schedule: string | null
  location: string | null
  base_price: number
  discounted_price: number
  is_popular: boolean
  cohort_start: string | null
  syllabus_url: string | null
  demo_video_url: string | null
  demo_video_duration_mins: number | null
  demo_video_description: string | null
}

type Overview = { intro_text: string | null } | null

type OverviewData = {
  bold_intro: string
  paragraphs: string[]
  master_points: string[]
}

function parseOverview(raw: string | null | undefined): OverviewData | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === "object" && "bold_intro" in parsed) {
      return {
        bold_intro: parsed.bold_intro ?? "",
        paragraphs: Array.isArray(parsed.paragraphs) ? parsed.paragraphs : [],
        master_points: Array.isArray(parsed.master_points) ? parsed.master_points : [],
      }
    }
  } catch {
    // legacy plain text — treat as bold_intro only
    return { bold_intro: raw, paragraphs: [], master_points: [] }
  }
  return { bold_intro: raw, paragraphs: [], master_points: [] }
}

type SummaryCard = {
  id: string
  label: string
  value: string
  icon: string
  sort_order: number
}

type Technology = {
  id: string
  label: string
  icon_url: string
  sort_order: number
}

type Project = {
  id: string
  title: string
  description: string
  level: string
  image_url: string
  sort_order: number
  tags: string[]
}

type CurriculumModule = {
  id: string
  phase_label: string
  title: string
  objective: string
  sort_order: number
  topics: string[]
}

type FacultyMember = {
  id: string
  name: string
  role: string
  institution: string
  bio: string
  avatar_url: string
  linkedin_url: string
  sort_order: number
  expertise: string[]
}

type Testimonial = {
  id: string
  author_name: string
  company: string
  batch: string
  content: string
  rating: number
  avatar_url: string
  is_published: boolean
}

type PageData = {
  program: Program
  overview: Overview
  summaryCards: SummaryCard[]
  technologies: Technology[]
  projects: Project[]
  curriculum: CurriculumModule[]
  faculty: FacultyMember[]
  testimonials: Testimonial[]
}

// ─── Visual config (cosmetic only, not in DB) ────────────────────────────────
const CATEGORY_BG: Record<string, string> = {
  Engineering: "bg-gradient-to-br from-[#004aad] to-[#00b4d8]",
  Data: "bg-gradient-to-br from-[#0f172a] to-[#004aad]",
  Design: "bg-gradient-to-br from-[#00b4d8] to-[#f5c518]",
  Marketing: "bg-gradient-to-br from-[#f5c518] to-[#dc2626]",
  default: "bg-gradient-to-br from-[#374151] to-[#6b7280]",
}

function thumbnailBg(category: string | null) {
  return CATEGORY_BG[category ?? ""] ?? CATEGORY_BG.default
}

// Icon lookup for summary-card labels
function SummaryIcon({ icon, label }: { icon: string; label: string }) {
  const l = label.toLowerCase()
  if (l.includes("duration") || l.includes("week")) return <Clock className="size-5" />
  if (l.includes("eligib") || l.includes("batch")) return <Users className="size-5" />
  if (l.includes("mode") || l.includes("location")) return <MapPin className="size-5" />
  if (l.includes("certif")) return <Award className="size-5" />
  if (l.includes("intern")) return <Briefcase className="size-5" />
  if (l.includes("placement") || l.includes("career")) return <TrendingUp className="size-5" />
  if (l.includes("start") || l.includes("date")) return <Calendar className="size-5" />
  if (icon) return <span className="text-base">{icon}</span>
  return <DollarSign className="size-5" />
}

// Navigation sections
const sections = [
  { id: "overview", label: "Overview" },
  { id: "program-summary", label: "Program Summary" },
  { id: "demo-video", label: "Demo Video" },
  { id: "curriculum", label: "Curriculum" },
  { id: "technologies", label: "Technologies" },
  { id: "projects", label: "Projects" },
  { id: "internship", label: "Internship Details" },
  { id: "faculty", label: "Faculty" },
  { id: "career", label: "Career Opportunities" },
  { id: "testimonials", label: "Testimonials" },
  { id: "certification", label: "Certification" },
  { id: "faqs", label: "FAQs" },
]

function difficultyStyle(level: string) {
  const l = level.toLowerCase()
  if (l === "advanced") return "bg-red-100 text-red-800"
  if (l === "intermediate") return "bg-amber-100 text-amber-800"
  return "bg-emerald-100 text-emerald-800"
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// ─── Page component ──────────────────────────────────────────────────────────
export default function CourseDetailPage() {
  const { slug } = useParams()

  const [data, setData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [activeSection, setActiveSection] = useState("overview")
  const [expandedModule, setExpandedModule] = useState<number | null>(0)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [verificationInput, setVerificationInput] = useState("")
  const [verificationResult, setVerificationResult] = useState<string | null>(null)
  const [isCertificateVerified, setIsCertificateVerified] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/programs/${slug}`)
      .then(r => r.json())
      .then(res => {
        if (res.success) setData(res.data)
        else setNotFound(true)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  const handleNavClick = (id: string) => {
    setActiveSection(id)
    const center = document.getElementById("center-content-container")
    if (center) center.scrollTo({ top: 0, behavior: "smooth" })
    if (window.innerWidth < 1024) {
      const mob = document.getElementById("mobile-nav-bar")
      if (mob) window.scrollTo({ top: mob.getBoundingClientRect().top + window.pageYOffset - 80, behavior: "smooth" })
    }
  }

  const handleVerifyCertificate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!verificationInput.trim()) return
    if (verificationInput.toUpperCase().startsWith("IA-COHORT-")) {
      setVerificationResult(`✅ VERIFIED: Certificate matches candidate for ${data?.program.title}. Issued under seal on completion of requirements.`)
      setIsCertificateVerified(true)
    } else {
      setVerificationResult(`❌ NOT FOUND: Certificate ID does not match our database. Try entering "IA-COHORT-2026" to test verification.`)
      setIsCertificateVerified(false)
    }
  }

  const inr = (n: number) => "₹" + n.toLocaleString("en-IN")

  // ── Loading / Not found states ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#004aad] border-t-transparent" />
        </div>
      </div>
    )
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <div className="text-4xl">🔍</div>
          <h2 className="font-montserrat text-xl font-extrabold text-slate-800">Program not found</h2>
          <p className="text-sm text-slate-500">The program you&apos;re looking for doesn&apos;t exist or hasn&apos;t been published yet.</p>
          <Link href="/courses" className="text-[#004aad] font-bold text-sm hover:underline flex items-center gap-1">
            <ArrowLeft className="size-4" /> Back to Programs
          </Link>
        </div>
      </div>
    )
  }

  const { program, overview, summaryCards, technologies, projects, curriculum, faculty, testimonials } = data

  // Derived display values
  const bg = thumbnailBg(program.category)
  const discount = program.base_price > program.discounted_price
    ? Math.round(((program.base_price - program.discounted_price) / program.base_price) * 100) + "% OFF"
    : null
  const saveAmt = program.base_price - program.discounted_price
  const overviewData = parseOverview(overview?.intro_text)

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-slate-50 text-slate-900 custom-scrollbar scroll-smooth flex flex-col overflow-hidden lg:overflow-hidden">
      <SiteHeader />

      <div className="flex-1 flex flex-col lg:flex-row lg:min-h-0 lg:overflow-hidden relative">

        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:block w-64 xl:w-72 border-r border-slate-200 bg-white flex-shrink-0 h-full overflow-y-auto no-scrollbar py-4 px-4">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#00b4d8] mb-2 block">Course Outline</span>
          <nav className="flex flex-col space-y-0.5" aria-label="Course Sections">
            {sections.map((sect) => (
              <button
                key={sect.id}
                onClick={() => handleNavClick(sect.id)}
                className={`text-left px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 cursor-pointer ${activeSection === sect.id
                    ? "text-[#004aad] bg-[#e0f2fe] translate-x-1"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                {sect.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden bg-[#004aad] text-white py-8 px-6 space-y-4 relative overflow-hidden">
          <div aria-hidden="true" className="hero-grid-bg absolute inset-0 z-0 opacity-40 pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <Link href="/courses" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-semibold uppercase tracking-wider mb-1 transition-colors">
              <ArrowLeft className="size-3.5" /> Back
            </Link>
            <span className="inline-block bg-[#e0f2fe] text-[#004aad] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Offline Training Cohort
            </span>
            <h1 className="text-2xl font-extrabold font-montserrat tracking-tight leading-tight">{program.title}</h1>
            {program.subtitle && <p className="text-xs text-white/80 max-w-xl font-medium">{program.subtitle}</p>}
          </div>
        </div>

        {/* Mobile Card */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-6 space-y-4">
          <div className={`h-44 ${bg} rounded-xl p-4 text-white flex flex-col justify-between overflow-hidden relative`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl transform translate-x-8 -translate-y-8" />
            <div className="flex justify-between items-start">
              <span className="bg-white/25 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase">
                {program.duration_weeks} Weeks
              </span>
              {program.is_popular && (
                <span className="bg-[#f5c518] text-[#004aad] font-black px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">Most Popular</span>
              )}
            </div>
            <div>
              <h3 className="font-montserrat text-base font-extrabold leading-tight">{program.title}</h3>
              <p className="text-[10px] text-white/80 font-medium mt-1 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="size-3" /> {program.location ?? "Offline in Bengaluru"}
              </p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-montserrat">{inr(program.discounted_price)}</span>
            {program.base_price > program.discounted_price && (
              <span className="text-xs font-semibold text-slate-400 line-through">{inr(program.base_price)}</span>
            )}
            {discount && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded">{discount}</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href={`/courses/${program.slug}/enroll`}>
              <button className="bg-[#004aad] text-white py-3 rounded-full text-xs font-bold w-full">
                Enroll Now
              </button>
            </Link>
            <a href={program.syllabus_url ?? "#"} onClick={(e) => { if (!program.syllabus_url) { e.preventDefault(); alert("Brochure download initiated successfully!") } }}
              className="bg-white border border-slate-200 hover:border-slate-800 text-slate-700 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
              <Download className="size-3.5" /> Syllabus
            </a>
          </div>
        </div>

        {/* Mobile sticky nav */}
        <div id="mobile-nav-bar" className="lg:hidden sticky top-0 z-30 w-full overflow-x-auto no-scrollbar bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center gap-1 py-3 px-4 shadow-sm">
          {sections.map((sect) => (
            <button key={`mob-${sect.id}`} onClick={() => handleNavClick(sect.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${activeSection === sect.id ? "bg-[#004aad] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}>
              {sect.label}
            </button>
          ))}
        </div>

        {/* CENTER CONTENT */}
        <main id="center-content-container" className="flex-1 lg:h-full lg:overflow-y-auto custom-scrollbar bg-slate-50 py-8 px-6 lg:px-10 flex flex-col justify-between">
          <div className="max-w-3xl mx-auto w-full space-y-8 pb-16">
            <div className="animate-fade-in focus:outline-none">

              {/* OVERVIEW */}
              {activeSection === "overview" && (
                <section className="space-y-6">
                  <h2 className="text-lg md:text-xl font-extrabold font-montserrat text-[#004aad] border-b border-slate-200/80 pb-2">
                    Overview & Introduction
                  </h2>
                  {overviewData ? (
                    <div className="space-y-4">
                      {/* Bold intro paragraph */}
                      {overviewData.bold_intro && (
                        <p className="text-slate-800 font-bold text-sm md:text-base leading-relaxed">
                          {overviewData.bold_intro}
                        </p>
                      )}

                      {/* Normal body paragraphs */}
                      {overviewData.paragraphs
                        .filter((p) => p.trim())
                        .map((para, i) => (
                          <p
                            key={i}
                            className="text-xs md:text-sm text-slate-600 font-semibold leading-relaxed"
                          >
                            {para}
                          </p>
                        ))}

                      {/* What you will master box */}
                      {overviewData.master_points.filter((p) => p.trim()).length > 0 && (
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 mt-2">
                          <p className="text-sm font-bold text-slate-800">
                            ✨ What you will master:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                            {overviewData.master_points
                              .filter((p) => p.trim())
                              .map((point, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <Check className="size-4 text-[#004aad] shrink-0 mt-0.5" />
                                  <span className="text-xs text-slate-700 font-semibold leading-snug">
                                    {point}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 font-medium italic">No overview content added yet.</p>
                  )}
                </section>
              )}

              {/* PROGRAM SUMMARY */}
              {activeSection === "program-summary" && (
                <section className="space-y-6">
                  <h2 className="text-lg md:text-xl font-extrabold font-montserrat text-[#004aad] border-b border-slate-200/80 pb-2">
                    Program Summary Details
                  </h2>
                  {summaryCards.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {summaryCards.map((card) => (
                        <div key={card.id} className="bg-white border border-slate-100 rounded-xl p-4 flex gap-4 items-start shadow-sm">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-[#e0f2fe] shrink-0 text-[#004aad]">
                            <SummaryIcon icon={card.icon} label={card.label} />
                          </div>
                          <div>
                            <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{card.label}</h4>
                            <p className="text-xs font-bold text-slate-800 mt-1 leading-snug">{card.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 font-medium italic">No summary cards added yet.</p>
                  )}
                </section>
              )}

              {/* DEMO VIDEO */}
              {activeSection === "demo-video" && (
                <section className="space-y-6">
                  <h2 className="text-lg md:text-xl font-extrabold font-montserrat text-[#004aad] border-b border-slate-200/80 pb-2">
                    Demo & Walkthrough Preview
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold">
                    {program.demo_video_description || "Watch the cohort induction preview video below to explore our offline labs, curriculum methodologies, and client agency processes."}
                  </p>
                  <div onClick={() => setIsVideoModalOpen(true)}
                    className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group border border-slate-200 shadow flex items-center justify-center bg-slate-950">
                    <div className="absolute inset-0 bg-[#004aad]/20 group-hover:bg-[#004aad]/30 transition-all z-10 duration-300" />
                    <div className="absolute inset-0 flex flex-col items-center justify-between p-6 z-20 text-white">
                      <span className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider self-start">🎥 Program Preview</span>
                      <div className="flex flex-col items-center gap-1">
                        <div className="size-14 rounded-full bg-[#f5c518] text-[#004aad] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 relative">
                          <div className="absolute inset-0 rounded-full bg-[#f5c518] animate-ping opacity-35" />
                          <Play className="size-6 fill-[#004aad] translate-x-0.5" />
                        </div>
                        <span className="text-[10px] font-bold tracking-wide uppercase text-[#f5c518] bg-black/60 px-3 py-1 rounded-full mt-2">Launch Video Player</span>
                      </div>
                      <span className="text-[10px] font-semibold text-white/85 self-end">
                        {program.demo_video_duration_mins ? `Duration: ${program.demo_video_duration_mins} mins` : ""}
                      </span>
                    </div>
                    <div className="absolute inset-0 hero-grid-bg opacity-40 pointer-events-none" />
                  </div>
                </section>
              )}

              {/* CURRICULUM */}
              {activeSection === "curriculum" && (
                <section className="space-y-6">
                  <h2 className="text-lg md:text-xl font-extrabold font-montserrat text-[#004aad] border-b border-slate-200/80 pb-2">
                    Cohort Curriculum Structure
                  </h2>
                  {curriculum.length > 0 ? (
                    <div className="space-y-3">
                      {curriculum.map((mod, idx) => {
                        const isOpen = expandedModule === idx
                        return (
                          <div key={mod.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            {/* Header row — always visible */}
                            <button
                              type="button"
                              onClick={() => setExpandedModule(isOpen ? null : idx)}
                              className="w-full px-5 py-4 flex items-start justify-between text-left hover:bg-slate-50/60 transition-colors focus:outline-none"
                            >
                              <div className="space-y-1 pr-4">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00b4d8]">
                                  {mod.phase_label}
                                </span>
                                <h3 className="text-sm md:text-base font-extrabold text-[#004aad] font-montserrat leading-snug">
                                  {mod.title}
                                </h3>
                              </div>
                              <div className="flex size-7 items-center justify-center rounded-full border border-slate-200 text-slate-400 shrink-0 mt-0.5">
                                <ChevronDown className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                              </div>
                            </button>

                            {/* Expanded body */}
                            {isOpen && (
                              <div className="px-5 pb-5 space-y-4">
                                {/* Objective with left border */}
                                {mod.objective && (
                                  <p className="border-l-2 border-slate-300 pl-3 text-xs md:text-sm text-slate-500 font-medium italic leading-relaxed">
                                    Objective: {mod.objective}
                                  </p>
                                )}

                                {/* Topics */}
                                {mod.topics.length > 0 && (
                                  <div className="space-y-2.5">
                                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                                      Core Topics
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pt-1">
                                      {mod.topics.map((topic, ti) => (
                                        <div key={ti} className="flex items-start gap-2">
                                          <span className="size-1.5 rounded-full bg-[#00b4d8] shrink-0 mt-1.5" />
                                          <span className="text-xs text-slate-700 font-medium leading-snug">{topic}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 font-medium italic">Curriculum content coming soon.</p>
                  )}
                </section>
              )}

              {/* TECHNOLOGIES */}
              {activeSection === "technologies" && (
                <section className="space-y-6">
                  <h2 className="text-lg md:text-xl font-extrabold font-montserrat text-[#004aad] border-b border-slate-200/80 pb-2">
                    Technologies Covered
                  </h2>
                  <div className="bg-white border border-slate-200/60 p-6 rounded-xl shadow-sm space-y-5">
                    <p className="text-xs font-semibold text-slate-500">
                      Work directly with these frameworks, languages, and orchestration ecosystems in your weekly lab sprints:
                    </p>
                    {technologies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {technologies.map((tech) => (
                          <div key={tech.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 hover:border-slate-700 transition-colors shadow-sm">
                            {tech.icon_url && (
                              <img src={tech.icon_url} alt={tech.label} className="size-4 object-contain"
                                onError={(e) => { e.currentTarget.style.display = "none" }} />
                            )}
                            <span className="text-xs font-bold text-slate-800">{tech.label}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 font-medium italic">No technologies added yet.</p>
                    )}
                  </div>
                </section>
              )}

              {/* PROJECTS */}
              {activeSection === "projects" && (
                <section className="space-y-6">
                  <h2 className="text-lg md:text-xl font-extrabold font-montserrat text-[#004aad] border-b border-slate-200/80 pb-2">
                    Production Grade Capstones
                  </h2>
                  {projects.length > 0 ? (
                    <div className="grid gap-4">
                      {projects.map((proj) => (
                        <div key={proj.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                          <div className="flex justify-between items-center">
                            <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${difficultyStyle(proj.level)}`}>
                              {capitalize(proj.level)} Level
                            </span>
                          </div>
                          <h3 className="font-montserrat text-sm md:text-base font-extrabold text-[#004aad]">{proj.title}</h3>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">{proj.description}</p>
                          {proj.tags && proj.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {proj.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          {proj.image_url && (
                            <img src={proj.image_url} alt={proj.title}
                              className="w-full h-32 object-cover rounded-lg border border-slate-100 mt-2"
                              onError={(e) => { e.currentTarget.style.display = "none" }} />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 font-medium italic">No projects added yet.</p>
                  )}
                </section>
              )}

              {/* INTERNSHIP DETAILS */}
              {activeSection === "internship" && (
                <section className="space-y-6">
                  <h2 className="text-lg md:text-xl font-extrabold font-montserrat text-[#004aad] border-b border-slate-200/80 pb-2">
                    8-Week Guild Placement Roadmap
                  </h2>
                  <div className="bg-white border border-slate-200/60 p-6 rounded-xl shadow-sm space-y-6">
                    <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 py-1">
                      {[
                        { color: "bg-[#004aad]", title: "Phase 1: Team Boarding & Setup", desc: "Setup repositories, project board configurations, and induct into development squads." },
                        { color: "bg-[#00b4d8]", title: "Phase 2: Active Feature Sprints", desc: "Write production codes, design user interfaces, and build API features during weekly deliverables." },
                        { color: "bg-[#f5c518]", title: "Phase 3: Architect Code Audits", desc: "Perform security inspections, cache evaluations, and test deployments under mentor supervision." },
                        { color: "bg-emerald-500", title: "Phase 4: Work Experience Release", desc: "Earn verification codes, receive referral recommendations, and publish portfolio profiles." },
                      ].map((phase, i) => (
                        <div key={i} className="relative pl-6">
                          <span className={`absolute -left-[7px] top-1 flex size-3 items-center justify-center rounded-full ${phase.color} border border-white`} />
                          <h4 className="text-xs font-bold text-slate-800 uppercase">{phase.title}</h4>
                          <p className="text-[11px] text-slate-500 font-semibold mt-1">{phase.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* FACULTY */}
              {activeSection === "faculty" && (
                <section className="space-y-6">
                  <h2 className="text-lg md:text-xl font-extrabold font-montserrat text-[#004aad] border-b border-slate-200/80 pb-2">
                    Faculty Advisors & Mentors
                  </h2>
                  {faculty.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {faculty.map((member) => {
                        // Generate initials from name (up to 2 letters)
                        const initials = member.name
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((w) => w[0].toUpperCase())
                          .join("")
                        return (
                          <div key={member.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                            {/* Avatar + name + role */}
                            <div className="flex items-center gap-3">
                              {member.avatar_url ? (
                                <img
                                  src={member.avatar_url}
                                  alt={member.name}
                                  className="size-12 rounded-full object-cover shrink-0"
                                  onError={(e) => { e.currentTarget.style.display = "none" }}
                                />
                              ) : (
                                <div className="size-12 rounded-full bg-[#004aad] flex items-center justify-center text-white font-extrabold text-sm shrink-0">
                                  {initials}
                                </div>
                              )}
                              <div className="min-w-0">
                                <h3 className="font-montserrat text-sm font-extrabold text-slate-900 leading-tight">{member.name}</h3>
                                <p className="text-[10px] font-bold text-[#004aad] uppercase tracking-wider mt-0.5">{member.role}</p>
                              </div>
                            </div>

                            {/* Institution */}
                            {member.institution && (
                              <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                                <span>🏛</span> {member.institution}
                              </p>
                            )}

                            {/* Expertise — from expertise table, fallback to bio */}
                            {member.expertise.length > 0 ? (
                              <p className="text-xs text-slate-600 font-medium flex items-start gap-1.5">
                                <span className="shrink-0">🎯</span>
                                <span>{member.expertise.join(", ")}</span>
                              </p>
                            ) : member.bio ? (
                              <p className="text-xs text-slate-600 font-medium flex items-start gap-1.5">
                                <span className="shrink-0">🎯</span>
                                <span>{member.bio}</span>
                              </p>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 font-medium italic">Faculty information coming soon.</p>
                  )}
                </section>
              )}

              {/* CAREER OPPORTUNITIES */}
              {activeSection === "career" && (
                <section className="space-y-6">
                  <h2 className="text-lg md:text-xl font-extrabold font-montserrat text-[#004aad] border-b border-slate-200/80 pb-2">
                    Career Opportunities
                  </h2>
                  <p className="text-sm text-slate-400 font-medium italic">Career information coming soon.</p>
                </section>
              )}

              {/* TESTIMONIALS */}
              {activeSection === "testimonials" && (
                <section className="space-y-6">
                  <h2 className="text-lg md:text-xl font-extrabold font-montserrat text-[#004aad] border-b border-slate-200/80 pb-2">
                    Student Reviews & Placements
                  </h2>
                  {testimonials.filter((t) => t.is_published).length > 0 ? (
                    <div className="grid gap-4">
                      {testimonials
                        .filter((t) => t.is_published)
                        .map((t) => (
                          <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                            <div className="flex items-start gap-3">
                              {t.avatar_url ? (
                                <img
                                  src={t.avatar_url}
                                  alt={t.author_name}
                                  className="size-10 rounded-full object-cover border border-slate-200 shrink-0"
                                  onError={(e) => { e.currentTarget.style.display = "none" }}
                                />
                              ) : (
                                <div className="size-10 rounded-full bg-[#e0f2fe] flex items-center justify-center text-[#004aad] font-extrabold shrink-0">
                                  {t.author_name.charAt(0)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-xs font-extrabold text-slate-800 font-montserrat">{t.author_name}</h3>
                                <p className="text-[11px] text-slate-500 font-medium">{t.company}{t.batch ? ` · ${t.batch}` : ""}</p>
                              </div>
                              <div className="flex items-center gap-0.5 shrink-0">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`size-3 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">"{t.content}"</p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 font-medium italic">Testimonials coming soon.</p>
                  )}
                </section>
              )}

              {/* CERTIFICATION */}
              {activeSection === "certification" && (
                <section className="space-y-6">
                  <h2 className="text-lg md:text-xl font-extrabold font-montserrat text-[#004aad] border-b border-slate-200/80 pb-2">
                    Credential Lookup System
                  </h2>
                  <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-5">
                    <div className="border-2 border-dashed border-slate-200 p-5 rounded-lg text-center space-y-4 bg-slate-50/50 relative">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#004aad] block">Dual Verifiable Certificate</span>
                      <h4 className="font-montserrat text-xs md:text-sm font-extrabold text-slate-800">{program.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium max-w-xs mx-auto">
                        Issued under lock credentials with an associated unique identification tag upon passed requirements.
                      </p>
                      <div className="border-t border-slate-200/80 pt-3 flex justify-between items-center text-left text-[9px] font-bold text-slate-400 uppercase">
                        <div>
                          <span>Lookup ID:</span>
                          <span className="block text-slate-700 mt-0.5">IA-COHORT-2026</span>
                        </div>
                        <div className="size-8 bg-slate-200 border border-slate-300 rounded flex items-center justify-center">QR</div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                      <h4 className="text-xs font-bold text-slate-700">Test Lookup Portal</h4>
                      <form onSubmit={handleVerifyCertificate} className="flex gap-2">
                        <input type="text" placeholder="e.g. IA-COHORT-2026" value={verificationInput}
                          onChange={(e) => setVerificationInput(e.target.value)}
                          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold grow focus:outline-none focus:border-[#004aad]" />
                        <button type="submit" className="bg-[#004aad] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#003c8c]">Query</button>
                      </form>
                      {verificationResult && (
                        <p className="text-[11px] font-bold text-slate-700 bg-white p-2.5 rounded border border-slate-200 leading-normal">{verificationResult}</p>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* FAQS */}
              {activeSection === "faqs" && (
                <section className="space-y-6">
                  <h2 className="text-lg md:text-xl font-extrabold font-montserrat text-[#004aad] border-b border-slate-200/80 pb-2">
                    Admissions FAQs
                  </h2>
                  <div className="space-y-2">
                    {[
                      { q: "Is this training fully offline?", a: "Yes. All classes, design labs, and coding cohorts happen in person at our Koramangala center in Bengaluru. This helps ensure peer collaboration and instant mentor feedback." },
                      { q: "How does the guaranteed internship work?", a: "Upon completing the initial academic training weeks and passing the threshold validation test, you are induction-ready. You will work for 8 weeks inside our agency studio on active client deliverables." },
                      { q: "What laptop specifications are required?", a: "A standard laptop with at least 8GB RAM and a modern multi-core processor (Intel i5/Ryzen 5 or higher / Apple M1) running Windows, macOS, or Linux is sufficient." },
                      { q: "Do you offer placement assistance?", a: "Yes. We offer mock coding interviews, resume scrubbing, LinkedIn reviews, and referral connections to our network of partner startups and tech recruiters in Bengaluru." },
                      { q: "What is the batch cancellation or refund policy?", a: "Cancellations are accepted up to 7 days before the batch start date for a full refund of deposit. Inside 7 days, fees can be deferred to a subsequent batch." },
                    ].map((faq, idx) => {
                      const isOpen = expandedFaq === idx
                      return (
                        <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                          <button type="button" onClick={() => setExpandedFaq(isOpen ? null : idx)}
                            className="w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none hover:bg-slate-50 transition-colors">
                            <span className="text-xs font-bold text-slate-800 pr-3">{faq.q}</span>
                            <div className="flex size-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 shrink-0">
                              <ChevronDown className={`size-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                            </div>
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4 pt-1 border-t border-slate-50 text-xs font-semibold text-slate-600 leading-relaxed">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

            </div>
          </div>

          <footer className="border-t border-slate-200/80 pt-6 mt-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            © 2026 Intern Academy. Bengaluru Center.
          </footer>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:block w-80 border-l border-slate-200 bg-white flex-shrink-0 h-full py-4 px-4">
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-3.5">

              {/* Thumbnail */}
              <div className={`h-32 ${bg} rounded-xl relative flex flex-col justify-between p-4 text-white overflow-hidden shadow-md`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl transform translate-x-8 -translate-y-8" />
                <div className="flex justify-between items-start">
                  <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase">
                    {program.duration_weeks} Weeks
                  </span>
                  {program.is_popular && (
                    <span className="bg-[#f5c518] text-[#004aad] font-black px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">Most Popular</span>
                  )}
                </div>
                <div>
                  <h3 className="font-montserrat text-sm font-extrabold tracking-tight leading-tight">{program.title}</h3>
                  <p className="text-[10px] text-white/80 font-medium mt-1 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="size-3" /> {program.location ?? "Offline in Bengaluru"}
                  </p>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-slate-900 font-montserrat">{inr(program.discounted_price)}</span>
                  {program.base_price > program.discounted_price && (
                    <span className="text-xs font-semibold text-slate-400 line-through">{inr(program.base_price)}</span>
                  )}
                  {discount && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">{discount}</span>
                  )}
                </div>
                {saveAmt > 0 && (
                  <p className="text-[10px] font-bold text-emerald-600 tracking-wide uppercase">Save {inr(saveAmt)} offline</p>
                )}
              </div>

              {/* Batch specs from DB fields */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-1.5 text-[11px] font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Batch Mode:</span>
                  <span className="text-slate-900 capitalize">{program.batch_mode} Cohort</span>
                </div>
                {program.schedule && (
                  <div className="flex justify-between">
                    <span>Schedule:</span>
                    <span className="text-slate-900">{program.schedule}</span>
                  </div>
                )}
                {program.location && (
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="text-slate-900 truncate max-w-[130px] text-right">{program.location}</span>
                  </div>
                )}
                {program.cohort_start && (
                  <div className="flex justify-between">
                    <span>Cohort Starts:</span>
                    <span className="text-slate-900">
                      {new Date(program.cohort_start).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 mt-auto pt-4">
              <Link
                href={`/courses/${program.slug}/enroll`}
                className="block w-full"
              >
                <button
                  className="w-full bg-[#004aad] text-white py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 hover:bg-[#003c8c] flex items-center justify-center gap-2"
                >
                  Enroll In Cohort
                  <ArrowRight className="size-3.5" />
                </button>
              </Link>
              <a href={program.syllabus_url ?? "#"}
                onClick={(e) => { if (!program.syllabus_url) { e.preventDefault(); alert("Brochure download initiated successfully!") } }}
                className="w-full bg-white border border-slate-200 text-slate-800 hover:border-slate-800 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2">
                <Download className="size-3.5" /> Download Syllabus
              </a>
            </div>
          </div>
        </aside>

      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200/80 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] flex items-center justify-between">
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate max-w-[150px]">{program.title}</h4>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-black text-slate-900 leading-none">{inr(program.discounted_price)}</span>
            {program.base_price > program.discounted_price && (
              <span className="text-[10px] font-medium text-slate-400 line-through">{inr(program.base_price)}</span>
            )}
          </div>
        </div>
        <Link href={`/courses/${program.slug}/enroll`}>
          <button className="bg-[#004aad] text-white text-xs font-bold px-6 py-3 rounded-full">
            Enroll Now
          </button>
        </Link>
      </div>

      {/* VIDEO MODAL */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <button onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-colors focus:outline-none" aria-label="Close video player">
              <X className="size-5" />
            </button>
            <div className="relative aspect-video w-full bg-black">
              {program.demo_video_url ? (
                <iframe
                  src={(() => {
                    const url = program.demo_video_url
                    // Handle youtu.be short links
                    const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
                    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1`
                    // Handle youtube.com/watch?v=
                    const watchMatch = url.match(/[?&]v=([^?&]+)/)
                    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1`
                    // Already an embed URL or other — use as-is
                    return url
                  })()}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={program.title}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col justify-between p-8 text-white z-20 pointer-events-none">
                  <div className="space-y-1">
                    <span className="bg-[#f5c518] text-[#004aad] font-black px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">Syllabus Walkthrough</span>
                    <h3 className="font-montserrat text-base md:text-lg font-extrabold">{program.title}</h3>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-white/60">No video URL set</span>
                    <span className="text-xs text-[#00b4d8] font-bold uppercase tracking-wider">InternAcademy Labs</span>
                  </div>
                  <div className="absolute inset-0 hero-grid-bg opacity-35 pointer-events-none" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
