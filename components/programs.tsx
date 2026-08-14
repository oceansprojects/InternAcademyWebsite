import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getFeaturedPrograms } from "@/services/program.service";

function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export async function Programs() {
  const programs = await getFeaturedPrograms();

   // console.log("Fetched programs:", programs);
  return (
    <section
      id="programs"
      className="scroll-mt-20 border-t border-slate-100 bg-slate-50/80 py-20"
    >
      <div className="mx-auto max-w-[1280px] px-10">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
      <div>
            <h2 className="font-montserrat text-3xl font-extrabold tracking-tight text-[#004aad] sm:text-4xl">
              Featured Programs
            </h2>

            <p className="mt-2 text-sm font-medium text-neutral-500">
              Offline cohorts built for real outcomes
            </p>
          </div>

          <Link
            href="/courses"
            className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-bold text-neutral-800 shadow-sm transition-all duration-300 hover:bg-[#004aad] hover:text-white"
          >
            View all programs
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((p: any) => (
            <div
              key={p.id}
              className="group relative flex flex-col"
            >
              {/* Folder Tab */}
              <div className="relative z-10 h-10 w-[140px] rounded-t-xl border-x border-t border-neutral-200/60 bg-white pl-4 pt-2">
                <span className="rounded-full bg-[#004aad] px-3 py-1 text-[11px] font-bold leading-none text-white shadow-sm">
                  {p.duration_weeks} Weeks
                </span>
              </div>

              {/* Card */}
              <Link
                href={`/courses/${p.slug}`}
                className="relative mt-[-1px] flex min-h-[320px] flex-col justify-between overflow-hidden rounded-b-2xl rounded-tr-2xl rounded-tl-none border border-neutral-200/60 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
              >
                {p.is_popular && (
                  <div className="absolute right-[-32px] top-4 z-30 rotate-[35deg] bg-[#f5c518] px-10 py-1 text-[10px] font-black uppercase tracking-wider text-[#004aad] shadow-sm">
                    Popular
                  </div>
                )}

                {/* Top */}
                <div className="relative z-20">
                  <span className="mb-3 inline-block -rotate-6 rounded-md bg-[#e0f2fe] px-2.5 py-1 text-[11px] font-semibold text-[#004aad] shadow-sm">
                    {p.subtitle}
                  </span>

                  <h3 className="font-montserrat text-2xl font-extrabold leading-snug tracking-tight text-[#004aad]">
                    {p.title}
                  </h3>

                  {/* Technologies */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.technologies?.slice(0, 4).map((tech: any) => (
                      <span
                        key={tech.label}
                        className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                      >
                        {tech.label}
                      </span>
                    ))}

                    {(p.technologies?.length ?? 0) > 4 && (
                      <span className="rounded-md border border-[#004aad]/20 bg-[#004aad]/5 px-2.5 py-1 text-[11px] font-semibold text-[#004aad]">
                        +{p.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom */}
                <div className="relative z-20 mt-8 flex items-center justify-between border-t border-neutral-100 pt-5">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="font-montserrat text-2xl font-black text-neutral-900">
                        {inr(p.discounted_price)}
                      </span>

                      {p.base_price > p.discounted_price && (
                        <span className="text-[11px] font-medium text-neutral-400 line-through">
                          {inr(p.base_price)}
                        </span>
                      )}
                    </div>

                    {p.base_price > p.discounted_price && (
                      <span className="mt-1 text-[9px] font-bold uppercase tracking-wide text-emerald-600">
                        Save {inr(p.base_price - p.discounted_price)}
                      </span>
                    )}
                  </div>

                  <div className="group/btn relative overflow-hidden rounded-full border-2 border-neutral-950 bg-transparent px-5 py-2.5 text-[13px] font-bold text-neutral-950 transition-colors duration-300 hover:text-white">
                    <span className="absolute inset-y-0 left-0 w-0 bg-neutral-950 transition-all duration-300 ease-out group-hover/btn:w-full" />

                    <span className="relative z-10 flex items-center gap-1.5">
                      Enroll Now

                      <svg
                        className="size-3.5 transition-transform duration-300 group-hover/btn:rotate-45"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3.2"
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