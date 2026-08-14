"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import SiteHeader from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { InternBotWidget } from "@/components/internbot-widget"
import { Search, Star, Laptop, Brain, Palette, Cloud, Sparkles, Megaphone, ArrowUpDown, ChevronRight } from "lucide-react"

// Program shape returned from DB
type Program = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  category: string | null
  duration_weeks: number
  batch_mode: "online" | "offline" | "hybrid"
  schedule: string | null
  location: string | null
  base_price: number
  discounted_price: number
  card_image_url: string | null
}

// Visual config per category (purely cosmetic – not stored in DB)
const CATEGORY_VISUALS: Record<string, {
  gradient: string
  icon: React.ComponentType<any>
  level: "Beginner" | "Intermediate" | "Advanced"
}> = {
  Engineering: {
    gradient: "from-[#004aad] to-[#00b4d8]",
    icon: Laptop,
    level: "Intermediate",
  },
  Data: {
    gradient: "from-[#0f172a] to-[#004aad]",
    icon: Brain,
    level: "Intermediate",
  },
  Design: {
    gradient: "from-[#00b4d8] to-[#f5c518]",
    icon: Palette,
    level: "Beginner",
  },
  Marketing: {
    gradient: "from-[#f5c518] to-[#dc2626]",
    icon: Megaphone,
    level: "Beginner",
  },
  Cloud: {
    gradient: "from-[#4f8ef7] to-[#7c5cfc]",
    icon: Cloud,
    level: "Advanced",
  },
  AI: {
    gradient: "from-[#5856d6] to-[#34c759]",
    icon: Sparkles,
    level: "Advanced",
  },
  // fallback for any other category
  default: {
    gradient: "from-[#374151] to-[#6b7280]",
    icon: Laptop,
    level: "Beginner",
  },
}

function getVisuals(category: string | null) {
  if (!category) return CATEGORY_VISUALS.default
  return CATEGORY_VISUALS[category] ?? CATEGORY_VISUALS.default
}

export default function CoursesPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedLevel, setSelectedLevel] = useState<string>("All")
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "price-asc" | "price-desc">("popular")

  // useEffect(() => {
  //   fetch("/api/programs")
  //     .then((r) => r.json())
  //     .then((res) => {
  //       if (res.success) setPrograms(res.data)
  //     })
  //     .catch(console.error)
  //     .finally(() => setLoading(false))
  // }, [])

  useEffect(() => {
    fetch("/api/programs")
      .then((r) => r.json())
      .then((res) => {
        console.log(res.data); // <-- Add this
        if (res.success) setPrograms(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Derive unique categories from DB data
  const dbCategories = Array.from(
    new Set(programs.map((p) => p.category).filter(Boolean) as string[])
  )
  const categories = ["All", ...dbCategories]
  const levels = ["All", "Beginner", "Intermediate", "Advanced"]

  const filteredPrograms = programs
    .filter((p) => {
      const visuals = getVisuals(p.category)
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subtitle ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category ?? "").toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory
      const matchesLevel = selectedLevel === "All" || visuals.level === selectedLevel

      return matchesSearch && matchesCategory && matchesLevel
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.discounted_price - b.discounted_price
      if (sortBy === "price-desc") return b.discounted_price - a.discounted_price
      // "popular" and "rating" fallback to newest first (DB order)
      return 0
    })

  const inr = (n: number) => "₹" + n.toLocaleString("en-IN")

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-grow pb-24">
        {/* Concise and Modern Header Banner */}
        <section className="bg-white border-b border-slate-200/60 py-12 px-6 md:px-10">
          <div className="mx-auto max-w-[1280px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-block bg-[#004aad]/10 text-[#004aad] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 ml-2">
                  In-Person Cohorts
                </span>
                <h1 className="font-montserrat text-3xl sm:text-4xl ml-2 font-bold tracking-tight text-slate-900 leading-none">
                  Explore Programs
                </h1>
                <p className="mt-3 text-slate-500 max-w-xl text-sm ml-2 leading-relaxed font-medium">
                  Select a training cohort, master job-ready skills offline in Bengaluru, and jumpstart your career with guaranteed internships.
                </p>
              </div>

              {/* Minimalist Stats */}
              <div className="flex items-center gap-6 border border-slate-200/80 rounded-2xl p-4 bg-slate-50">
                <div className="text-left px-2">
                  <div className="text-xl font-bold text-slate-800">{loading ? "…" : `${programs.length}+`}</div>
                  <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">Programs</div>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-left px-2">
                  <div className="text-xl font-bold text-slate-800">2.4k+</div>
                  <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">Students</div>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-left px-2">
                  <div className="text-xl font-bold text-slate-800">100%</div>
                  <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">Offline</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Search Bar Section */}
        <section className="mx-auto max-w-[1280px] px-6 md:px-10 mt-8">
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm space-y-5">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Field */}
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4.5" />
                <input
                  type="text"
                  placeholder="Search programs, skills or mentors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#004aad] focus:ring-1 focus:ring-[#004aad]/20 rounded-full pl-11 pr-5 py-2.5 text-xs font-semibold outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Sorting option */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
                  <ArrowUpDown className="size-3" /> Sort By:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-full px-3.5 py-2 text-[11px] font-semibold text-slate-600 outline-none cursor-pointer transition-colors"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Filter tags groups */}
            <div className="space-y-3">
              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 w-20">
                  Category:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all ${selectedCategory === cat
                        ? "bg-[#004aad] text-white"
                        : "bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 w-20">
                  Level:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {levels.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all ${selectedLevel === lvl
                        ? "bg-[#004aad] text-white"
                        : "bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100"
                        }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Info */}
        <section className="mx-auto max-w-[1280px] px-6 md:px-10 mt-6 flex justify-between items-center text-[11px] font-semibold text-slate-400">
          <div>
            Showing <span className="text-slate-600 font-bold">{filteredPrograms.length}</span> of{" "}
            <span className="text-slate-600 font-bold">{programs.length}</span> courses
          </div>
          {(selectedCategory !== "All" || selectedLevel !== "All" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("All")
                setSelectedLevel("All")
                setSearchQuery("")
              }}
              className="text-[#004aad] hover:underline font-bold"
            >
              Reset Filters
            </button>
          )}
        </section>

        {/* Grid Section */}
        <section className="mx-auto max-w-[1280px] px-6 md:px-10 mt-10">
          {loading ? (
            <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-[24px] p-3.5 border border-slate-200/60 shadow-sm animate-pulse">
                  <div className="h-40 rounded-[18px] bg-slate-200" />
                  <div className="pt-4 px-1 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                    <div className="h-8 bg-slate-100 rounded-full mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200/60 rounded-3xl p-10 shadow-sm">
              <div className="text-3xl">🔍</div>
              <h3 className="font-montserrat text-base font-bold text-slate-700 mt-3">No Courses Found</h3>
              <p className="text-slate-400 text-[11px] mt-1">Try adjusting your filters or keywords.</p>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {filteredPrograms.map((p) => {
                const { gradient, icon: IconComponent, level } = getVisuals(p.category)
                const overlayHeader = p.title.toUpperCase()
                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-[24px] p-3.5 border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                  >
                    {/* Thumbnail Wrapper */}
                    <div className="relative overflow-visible">
                      {/* Clean Mockup Card Thumbnail Area */}
                      <div className={`h-40 rounded-[18px] bg-gradient-to-br ${gradient} p-4.5 relative overflow-hidden flex flex-col justify-between text-white group`}>
                        {/* Background subtle light radial overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />

                        {/* Top capsule badge and Mini Logo */}
                        <div className="flex justify-between items-start z-10 w-full">
                          <span className="bg-[#004aad] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {level}
                          </span>

                          {/* Small Logo Badge */}
                          <div className="bg-white/15 backdrop-blur-md border border-white/20 p-1 rounded-lg text-white select-none">
                            <IconComponent className="size-3.5" />
                          </div>
                        </div>

                        {/* Overlay Course Title */}
                        <div className="flex justify-between items-end mt-auto z-10 w-full pr-16">
                          <h4 className="font-montserrat text-sm sm:text-base font-extrabold uppercase tracking-tight leading-none text-left line-clamp-2">
                            {overlayHeader}
                          </h4>
                        </div>
                      </div>

                      {/* Course Image */}
                      {/*
                      <div className="absolute right-2 bottom-0 z-20 pointer-events-none select-none">
                        <img
                          src={p.card_image_url || "/images/student-3d-graduate.png"}
                          alt={p.title}
                          className="h-40 w-auto object-contain drop-shadow-xl"
                          loading="lazy"
                        />
                      </div>
                      */}
                    </div>

                    {/* Card Content Area */}
                    <div className="pt-4 px-1 flex-grow flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        {/* Course Title */}
                        <h3 className="font-sans text-sm sm:text-base font-medium text-slate-800 leading-snug tracking-tight text-left">
                          {p.title}
                        </h3>

                        {/* Category line */}
                        <p className="text-[11px] font-normal text-slate-400 text-left">
                          {p.subtitle
                            ? <>{p.subtitle} in <span className="text-slate-500 font-medium">{p.category}</span></>
                            : <span className="text-slate-500 font-medium">{p.category ?? "General"}</span>
                          }
                        </p>
                      </div>

                      {/* Bottom Row containing ratings and pricing */}
                      <div className="space-y-3.5 pt-3.5 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                          {/* Static rating display (DB has no rating yet) */}
                          <div className="flex items-center gap-1">
                            <div className="flex gap-0.5 text-amber-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`size-3 ${i < 4 ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                                />
                              ))}
                            </div>
                            <span className="text-[11px] font-bold text-slate-600 ml-1">New</span>
                          </div>

                          {/* Price Display */}
                          <div className="flex flex-col items-end">
                            <div className="flex items-baseline gap-1">
                              <span className="font-sans text-sm font-semibold text-slate-800 leading-none">
                                {inr(p.discounted_price)}
                              </span>
                              {p.base_price > p.discounted_price && (
                                <span className="text-[10px] font-normal text-slate-400 line-through">
                                  {inr(p.base_price)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* CTA Explore Course Button */}
                        <Link
                          href={`/courses/${p.slug}`}
                          className="w-full bg-white hover:bg-slate-50/50 border border-slate-200/80 text-slate-700 py-2 rounded-full text-xs font-semibold transition-all duration-150 text-center flex items-center justify-center gap-1 hover:border-slate-400"
                        >
                          Explore Course
                          <ChevronRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
      <InternBotWidget />
    </div>
  )
}
