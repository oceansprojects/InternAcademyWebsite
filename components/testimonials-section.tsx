"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Star, CheckCircle2, Award, Sparkles } from "lucide-react"

export interface Testimonial {
  id: string
  name: string
  role: string
  institution: string
  location: string
  track: string
  image: string
  quote: string
  rating: number
  date?: string
}

const testimonials: Testimonial[] = [
  {
    id: "aarav-sharma",
    name: "Aarav Sharma",
    role: "SDE Intern @ TechNova Labs",
    institution: "PICT",
    location: "Pune",
    track: "Full-Stack Web Dev",
    image: "/images/students/student-aarav.jpg",
    quote:
      "In college, we wrote code that only lived on localhost. During the 12-week cohort, our mentor pushed us through actual GitHub pull request cycles, microservices setup, and CI/CD pipelines. That shift in mindset is 100% why I cleared my technical round.",
    rating: 5,
    date: "Aug 2026",
  },
  {
    id: "ananya-deshmukh",
    name: "Ananya Deshmukh",
    role: "Associate Data Analyst @ FinEdge Global",
    institution: "COEP Tech University",
    location: "Pune",
    track: "Data Science & Analytics",
    image: "/images/students/student-ananya.jpg",
    quote:
      "My mentor didn't just review our Python codehe grilled our edge-case assumptions on actual transaction datasets. Having two production-grade dashboards live on AWS completely changed how interviewers engaged with my portfolio.",
    rating: 5,
    date: "Sep 2026",
  },
  {
    id: "rohan-nair",
    name: "Rohan Nair",
    role: "Backend Engineer Intern @ CloudScale",
    institution: "RV College of Engineering",
    location: "Bengaluru",
    track: "Cloud Architecture & Go",
    image: "/images/students/student-rohan.jpg",
    quote:
      "The 48-hour build sprint simulated an actual engineering team under deadline. We debugged Redis cache invalidation at 2 AM with our mentor on voice call. That pressure taught me more than an entire semester of textbooks.",
    rating: 5,
    date: "Jul 2026",
  },
  {
    id: "tanvi-malhotra",
    name: "Tanvi Malhotra",
    role: "Product Design Intern @ Craftworks Studio",
    institution: "Delhi Technological University (DTU)",
    location: "New Delhi",
    track: "UI/UX & Design Systems",
    image: "/images/students/student-tanvi.jpg",
    quote:
      "Most courses stop at basic Figma auto-layouts. Here, we actually collaborated with frontend students in the same batch to turn our component tokens into a living Tailwind system. That cross-functional experience was pure gold.",
    rating: 5,
    date: "Aug 2026",
  },
  {
    id: "vikram-goud",
    name: "Vikram Goud",
    role: "DevOps Trainee @ InfraLogic",
    institution: "Osmania University",
    location: "Hyderabad",
    track: "DevOps & Kubernetes",
    image: "/images/students/student-vikram.jpg",
    quote:
      "Coming from an electronics branch, I used to feel intimidated by container orchestration. The step-by-step physical lab sessions and hands-on cluster debugging gave me the confidence to handle production rollouts with zero hesitation.",
    rating: 5,
    date: "Jul 2026",
  },
  {
    id: "meera-kulkarni",
    name: "Meera Kulkarni",
    role: "Machine Learning Intern @ NeuralPulse",
    institution: "Mumbai University",
    location: "Mumbai",
    track: "Applied AI & LLM Systems",
    image: "/images/students/student-meera.jpg",
    quote:
      "We didn't just import pretrained models; we built evaluation harnesses, measured token latency, and deployed real vector search endpoints. Employers immediately noticed that I understood practical ML deployment.",
    rating: 5,
    date: "Sep 2026",
  },
  {
    id: "karthik-sundaram",
    name: "Karthik Sundaram",
    role: "Cyber Security Analyst @ SecureNet India",
    institution: "College of Engineering Guindy (CEG)",
    location: "Chennai",
    track: "Cybersecurity & Pentesting",
    image: "/images/students/student-karthik.jpg",
    quote:
      "The direct hiring partner introductions are genuine. Within three weeks of completing our capstone review, I had interview calls lined up through the Intern Academy partner portal without having to cold-DM recruiters.",
    rating: 5,
    date: "Aug 2026",
  },
  {
    id: "sneha-ganguly",
    name: "Sneha Ganguly",
    role: "Full-Stack Developer @ FinSphere",
    institution: "Heritage Institute of Tech",
    location: "Kolkata / Bengaluru",
    track: "Modern Full-Stack (Next.js)",
    image: "/images/students/student-sneha.jpg",
    quote:
      "Self-studying online always ended in procrastination. Being part of a cohort with daily standups, live peer reviews, and an active mentor channel created an energy where nobody wanted to fall behind. We built together.",
    rating: 5,
    date: "Sep 2026",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardStep, setCardStep] = useState(400)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const carouselViewportRef = useRef<HTMLDivElement>(null)

  const totalCount = testimonials.length

  // Measure card width + gap dynamically
  const updateCardStep = useCallback(() => {
    if (trackRef.current && trackRef.current.firstElementChild) {
      const firstCard = trackRef.current.firstElementChild as HTMLElement
      // Card width + 24px gap
      const step = firstCard.offsetWidth + 24
      setCardStep(step)
    }
  }, [])

  useEffect(() => {
    updateCardStep()
    window.addEventListener("resize", updateCardStep)
    return () => window.removeEventListener("resize", updateCardStep)
  }, [updateCardStep])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalCount - 1))
  }, [totalCount])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < totalCount - 1 ? prev + 1 : 0))
  }, [totalCount])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return
      const isFocused = containerRef.current.contains(document.activeElement)
      if (isFocused) {
        if (e.key === "ArrowLeft") {
          e.preventDefault()
          handlePrev()
        } else if (e.key === "ArrowRight") {
          e.preventDefault()
          handleNext()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handlePrev, handleNext])

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return
    const distance = touchStartX - touchEndX
    const isLeftSwipe = distance > 45
    const isRightSwipe = distance < -45

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrev()
    }
    setTouchStartX(null)
    setTouchEndX(null)
  }

  return (
    <section
      id="stories"
      className="scroll-mt-24 relative w-full overflow-hidden bg-[#f8fafc] py-16 sm:py-24 lg:py-32 border-t border-slate-200/80"
      aria-label="Student Testimonials and Success Stories"
    >
      {/* Background subtle light gradients */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 size-[500px] rounded-full bg-[#004aad]/5 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-0 size-[500px] rounded-full bg-[#0ea5e9]/5 blur-[120px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Section Heading & Trust/Credibility Indicator */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 sm:pb-16 border-b border-slate-200/70">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#004aad]/10 px-3.5 py-1 text-xs font-semibold text-[#004aad] mb-3.5">
              <Award className="size-3.5 text-[#004aad]" />
              <span className="tracking-wide uppercase text-[11px] font-bold">Verified Student Journeys</span>
            </div>
            <h2 className="font-montserrat text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold tracking-tight text-slate-900 leading-[1.18]">
              Real Students. Real Growth. <br className="hidden sm:inline" />
              <span className="text-[#004aad]">Measurable Outcomes.</span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-xl">
              From college campuses across India to high-impact internships at leading tech companies. Here is how our cohort members experience the journey.
            </p>
          </div>

          {/* Trust / Credibility Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-white rounded-2xl p-4 sm:px-6 sm:py-4 border border-slate-200/90 shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-montserrat text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
                    4.9
                  </span>
                  <span className="text-xs font-semibold text-slate-400">/5</span>
                </div>
                <div className="flex items-center gap-0.5 text-amber-500 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-slate-200" />

            <div className="text-xs space-y-0.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>3,500+ Cohort Learners</span>
                <CheckCircle2 className="size-3.5 text-emerald-600" />
              </div>
              <p className="text-slate-500 font-medium">94% report career & project clarity</p>
            </div>
          </div>
        </div>

        {/* Main Testimonial Area: Left Editorial Anchor + Horizontal Carousel */}
        <div
          ref={containerRef}
          tabIndex={0}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="mt-12 sm:mt-16 outline-none focus-visible:ring-2 focus-visible:ring-[#004aad]/20 rounded-3xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Editorial Panel (Anchor) */}
            <div className="lg:col-span-4 flex flex-col justify-between rounded-3xl bg-white p-7 sm:p-9 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
              <div>
                {/* Large decorative subtle quotation mark */}
                <div
                  aria-hidden="true"
                  className="font-serif select-none text-[84px] sm:text-[100px] font-black leading-none text-[#004aad]/15 -ml-2 -mt-4 mb-1 tracking-tighter"
                >
                  &ldquo;
                </div>

                <h3 className="font-montserrat text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight text-slate-900 leading-snug">
                  What our students <br />
                  are saying
                </h3>

                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Every testimonial reflects hours of hands-on debugging, direct mentor feedback, and genuine portfolio breakthroughs across real cohorts.
                </p>

                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2.5 text-xs font-semibold text-slate-500">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Verified 2026 Batch Graduates</span>
                </div>
              </div>

              {/* Editorial Carousel Controls */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                {/* Minimal Arrow Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                    className="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all hover:bg-slate-50 hover:border-[#004aad] hover:text-[#004aad] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#004aad]/30 shadow-sm"
                  >
                    <ArrowLeft className="size-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next testimonial"
                    className="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all hover:bg-slate-50 hover:border-[#004aad] hover:text-[#004aad] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#004aad]/30 shadow-sm"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </div>

                {/* Progress bar + Counter */}
                <div className="flex items-center gap-3">
                  <div className="h-[2px] w-14 sm:w-20 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#004aad] transition-all duration-300 rounded-full"
                      style={{
                        width: `${((currentIndex + 1) / totalCount) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-400">
                    <span className="text-slate-800">
                      {String(currentIndex + 1).padStart(2, "0")}
                    </span>{" "}
                    / {String(totalCount).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Horizontal Carousel */}
            <div
              ref={carouselViewportRef}
              className="lg:col-span-8 overflow-hidden relative"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Carousel Track */}
              <div
                ref={trackRef}
                className="flex transition-transform duration-500 ease-out will-change-transform gap-6"
                style={{
                  transform: `translateX(-${currentIndex * cardStep}px)`,
                }}
              >
                {testimonials.map((item, index) => {
                  const isCurrent = index === currentIndex

                  return (
                    <article
                      key={item.id}
                      className={`shrink-0 w-[84vw] sm:w-[340px] md:w-[360px] rounded-3xl bg-white p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between select-none ${isCurrent
                          ? "border-slate-300 shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
                          : "border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-md hover:border-slate-300"
                        }`}
                      style={{ minHeight: "380px" }}
                    >
                      {/* Card Top: Track Tag & Rating */}
                      <div>
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
                          <span className="inline-block rounded-full bg-slate-100/90 px-3 py-1 text-[11px] font-bold text-[#004aad] border border-slate-200/60">
                            {item.track}
                          </span>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[...Array(item.rating)].map((_, i) => (
                              <Star key={i} className="size-3.5 fill-amber-400" />
                            ))}
                          </div>
                        </div>

                        {/* Testimonial Quote */}
                        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
                          &ldquo;{item.quote}&rdquo;
                        </p>
                      </div>

                      {/* Card Bottom: Student Avatar, Name, College, and Role */}
                      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3.5">
                        <div className="relative size-12 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-montserrat text-sm font-bold text-slate-900 truncate">
                              {item.name}
                            </h4>
                            <CheckCircle2
                              className="size-3.5 text-[#004aad] shrink-0"
                              title="Verified Student"
                            />
                          </div>

                          <p className="text-xs font-semibold text-[#004aad] truncate">
                            {item.role}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {item.institution} • {item.location}
                          </p>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>

              {/* Edge Gradient Mask for continuous peek effect */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 right-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-[#f8fafc] to-transparent hidden md:block"
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Controls below the carousel */}
        <div className="mt-8 flex items-center justify-between lg:hidden pt-4 border-t border-slate-200/60">
          <span className="font-mono text-xs font-semibold text-slate-500">
            {String(currentIndex + 1).padStart(2, "0")} /{" "}
            {String(totalCount).padStart(2, "0")}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 active:scale-95 shadow-sm"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 active:scale-95 shadow-sm"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
