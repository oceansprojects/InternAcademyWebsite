import Image from "next/image"
import { Quote } from "lucide-react"

const stories = [
  {
    name: "Aditya Rao",
    role: "SDE Intern @ TechNova",
    program: "Full-Stack Web Development",
    quote:
      "I walked in knowing basic HTML. Twelve weeks later I was shipping production React. The internship referral sealed it.",
  },
  {
    name: "Sneha Kulkarni",
    role: "Data Analyst @ FinEdge",
    program: "Data Science & Analytics",
    quote:
      "The offline cohort kept me accountable. My mentor reviewed every project — that's why my portfolio stood out.",
  },
  {
    name: "Rahul Verma",
    role: "Growth Intern @ BlueOrbit",
    program: "Digital Marketing Pro",
    quote:
      "I got placed before my certificate was even issued. The hiring partners actually look at Intern Academy grads.",
  },
]

export function SuccessStories() {
  return (
    <section id="stories" className="scroll-mt-24 bg-card/60 py-14 sm:py-20 border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left mb-8 sm:mb-12">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#00aeef]">
            Proven Success
          </span>
          <h2 className="mt-1 font-montserrat text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#004aad]">
            Real Students. Real Offers.
          </h2>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm md:text-base text-slate-600">
            Thousands of learners have turned an Intern Academy program into an industry job. Here&apos;s what their journey looks like.
          </p>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* Left Column: Image demonstration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[420px]">
              {/* Subtle ambient glows */}
              <div className="absolute -left-6 -top-6 size-64 rounded-full bg-[#004aad]/10 blur-3xl pointer-events-none" />
              <div className="absolute -right-6 -bottom-6 size-64 rounded-full bg-[#00d2fd]/15 blur-3xl pointer-events-none" />

              <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 bg-white shadow-lg">
                <Image
                  src="/images/rhs.png"
                  alt="Classroom to Career path demonstration"
                  width={600}
                  height={680}
                  className="w-full h-auto object-cover max-h-[380px] sm:max-h-[420px] transition-transform duration-700 hover:scale-[1.02]"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right Column: Testimonial cards */}
          <div className="lg:col-span-7 grid gap-4 sm:gap-5">
            {stories.map((s) => (
              <figure
                key={s.name}
                className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-full bg-[#004aad] text-xs sm:text-sm font-bold text-white shadow-sm">
                    {s.name.charAt(0)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">{s.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{s.role}</p>
                      </div>
                      <span className="rounded-full bg-[#e0f2fe] px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#004aad]">
                        {s.program}
                      </span>
                    </div>
                    <blockquote className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed italic border-l-2 border-[#00d2fd] pl-3">
                      &ldquo;{s.quote}&rdquo;
                    </blockquote>
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}