import Image from "next/image"
import { Target, Code2, Users2, Briefcase, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"

const goals = [
  {
    icon: Code2,
    badge: "Pillar 01",
    title: "Production-First Building",
    description:
      "Replace passive lectures with live sprints. Write clean code, manage CI/CD pipelines, and ship scalable apps to the cloud.",
    highlight: "Live GitHub PRs & cloud deployment",
    accent: "bg-blue-50 text-[#004aad] border-blue-100",
  },
  {
    icon: Users2,
    badge: "Pillar 02",
    title: "1-on-1 Tech Mentorship",
    description:
      "Weekly code audits, architecture reviews, and direct guidance from working engineers at high-growth tech companies.",
    highlight: "Personalized code reviews & feedback",
    accent: "bg-sky-50 text-[#0ea5e9] border-sky-100",
  },
  {
    icon: Briefcase,
    badge: "Pillar 03",
    title: "Verified Internship Pathways",
    description:
      "Direct introductions to vetted hiring partners, bypassing resume black holes so tech leads evaluate your real portfolio.",
    highlight: "Direct partner interviews & referrals",
    accent: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
]

export function OurGoal() {
  return (
    <section
      id="our-goal"
      className="scroll-mt-24 relative w-full bg-white py-14 sm:py-20 border-t border-slate-200/80 overflow-hidden"
      aria-label="Our Goal and Focus"
    >
      {/* Background subtle light radial accents */}
      <div
        className="pointer-events-none absolute -top-40 right-0 size-[450px] rounded-full bg-[#004aad]/5 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-20 size-[450px] rounded-full bg-[#0ea5e9]/5 blur-[120px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Header Section */}
        <div className="text-center sm:text-left mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#004aad]/10 px-3 py-1 text-xs font-semibold text-[#004aad] mb-3">
            <Target className="size-3.5" />
            <span className="tracking-wide uppercase text-[11px] font-bold">OUR MISSION & GOAL</span>
          </div>

          <h2 className="font-montserrat text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            What We Focus On:{" "}
            <span className="text-[#004aad]">Building Industry-Ready Engineers.</span>
          </h2>

          <p className="mt-2.5 max-w-2xl text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
            Bridging college theory and industry demands through immersive build sprints, mentor code reviews, and direct hiring access.
          </p>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-12">
          {/* Left Column: Classroom to Career Path Demonstration Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[440px]">
              {/* Soft ambient blur glows */}
              <div className="absolute -left-6 -top-6 size-64 rounded-full bg-[#004aad]/10 blur-3xl pointer-events-none" />
              <div className="absolute -right-6 -bottom-6 size-64 rounded-full bg-[#0ea5e9]/15 blur-3xl pointer-events-none" />

              <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.06)] group">
                <Image
                  src="/images/rhs.png"
                  alt="Classroom to Career path demonstration"
                  width={600}
                  height={680}
                  className="w-full h-auto object-cover max-h-[400px] sm:max-h-[460px] transition-transform duration-700 group-hover:scale-[1.02]"
                  priority
                />

                {/* Floating highlight badge */}
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 backdrop-blur-md p-3.5 border border-slate-100 shadow-md flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <CheckCircle2 className="size-4" />
                    </span>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-900 leading-none">Classroom to Career</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Practical offline & hybrid cohorts</p>
                    </div>
                  </div>

                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#004aad] hover:underline shrink-0"
                  >
                    <span>View Tracks</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Pillar Goal Cards */}
          <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5">
            {goals.map((g) => {
              const Icon = g.icon

              return (
                <div
                  key={g.badge}
                  className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-2xl border ${g.accent} shadow-xs transition-transform duration-300 group-hover:scale-105`}>
                      <Icon className="size-5 sm:size-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                        <h3 className="font-montserrat text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {g.title}
                        </h3>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          {g.badge}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                        {g.description}
                      </p>

                      <div className="mt-3 flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#004aad]">
                        <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                        <span>{g.highlight}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurGoal
