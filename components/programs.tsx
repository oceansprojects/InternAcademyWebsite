import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getFeaturedPrograms } from "@/services/program.service";

function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export async function Programs() {
  const programs = await getFeaturedPrograms();

  return (
    <section
      id="programs"
      className="scroll-mt-24 border-t border-slate-200/80 bg-slate-50/70 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 sm:mb-14 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#00aeef]">
              Curated Cohorts
            </span>
            <h2 className="mt-1 font-montserrat text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#004aad]">
              Featured Programs
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-600">
              Offline cohorts built for real career outcomes
            </p>
          </div>

          <Link
            href="/courses"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:bg-[#004aad] hover:text-white hover:border-[#004aad] active:scale-95"
          >
            <span>View all programs</span>
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {programs.map((p: any) => (
            <div
              key={p.id}
              className="group relative flex flex-col"
            >
              {/* Folder Tab */}
              <div className="relative z-10 h-9 sm:h-10 w-[130px] sm:w-[140px] rounded-t-xl border-x border-t border-slate-200/80 bg-white pl-4 pt-2">
                <span className="rounded-full bg-[#004aad] px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-bold leading-none text-white shadow-sm">
                  {p.duration_weeks} Weeks
                </span>
              </div>

              {/* Card */}
              <Link
                href={`/courses/${p.slug}`}
                className="relative mt-[-1px] flex min-h-[310px] flex-col justify-between overflow-hidden rounded-b-2xl rounded-tr-2xl rounded-tl-none border border-slate-200/80 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,74,173,0.08)] hover:border-[#004aad]/30"
              >
                {p.is_popular && (
                  <div className="absolute right-[-32px] top-4 z-30 rotate-[35deg] bg-[#f5c518] px-10 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#004aad] shadow-sm">
                    Popular
                  </div>
                )}

                {/* Top content */}
                <div className="relative z-20">
                  <span className="mb-2.5 inline-block rounded-md bg-[#e0f2fe] px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-[#004aad] shadow-xs">
                    {p.subtitle}
                  </span>

                  <h3 className="font-montserrat text-xl sm:text-2xl font-extrabold leading-snug tracking-tight text-[#004aad] group-hover:text-[#003087] transition-colors">
                    {p.title}
                  </h3>

                  {/* Technologies */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5 sm:gap-2">
                    {p.technologies?.slice(0, 4).map((tech: any) => (
                      <span
                        key={tech.label}
                        className="rounded-md border border-slate-200 bg-slate-50 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-slate-700"
                      >
                        {tech.label}
                      </span>
                    ))}

                    {(p.technologies?.length ?? 0) > 4 && (
                      <span className="rounded-md border border-[#004aad]/20 bg-[#004aad]/5 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-[#004aad]">
                        +{p.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom content */}
                <div className="relative z-20 mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 sm:pt-5">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                      <span className="font-montserrat text-xl sm:text-2xl font-black text-slate-900">
                        {inr(p.discounted_price)}
                      </span>

                      {p.base_price > p.discounted_price && (
                        <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 line-through">
                          {inr(p.base_price)}
                        </span>
                      )}
                    </div>

                    {p.base_price > p.discounted_price && (
                      <span className="mt-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                        Save {inr(p.base_price - p.discounted_price)}
                      </span>
                    )}
                  </div>

                  <div className="group/btn relative overflow-hidden rounded-full border-2 border-slate-900 bg-transparent px-4 sm:px-5 py-2 text-xs sm:text-[13px] font-bold text-slate-900 transition-colors duration-300 hover:text-white">
                    <span className="absolute inset-y-0 left-0 w-0 bg-slate-900 transition-all duration-300 ease-out group-hover/btn:w-full" />

                    <span className="relative z-10 flex items-center gap-1">
                      Enroll Now
                      <svg
                        className="size-3 sm:size-3.5 transition-transform duration-300 group-hover/btn:rotate-45"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}