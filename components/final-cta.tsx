import Image from "next/image"
import { ArrowRight, CalendarCheck } from "lucide-react"
import Link from "next/link"

export function FinalCta() {
  return (
    <section className="pt-14 sm:pt-20 pb-0 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-t-3xl sm:rounded-t-[2.5rem] rounded-b-2xl md:rounded-b-none border-t border-x md:border-b-0 border-slate-200/90 bg-gradient-to-br from-white via-slate-50/50 to-slate-100/50 shadow-[0_16px_40px_rgba(0,0,0,0.04)] px-6 sm:px-10 lg:px-14 pt-8 sm:pt-10 lg:pt-12 pb-0 flex flex-col-reverse md:flex-row items-center md:items-end justify-between gap-8 md:gap-12">

          {/* Decorative glows */}
          <div className="absolute -left-16 top-0 size-60 rounded-full bg-[#004aad]/5 blur-3xl pointer-events-none" />
          <div className="absolute -right-16 bottom-0 size-60 rounded-full bg-[#00d2fd]/10 blur-3xl pointer-events-none" />

          {/* Left Column: Image anchored directly to the bottom line of the footer */}
          <div className="relative w-full md:w-[42%] flex items-end justify-center shrink-0 self-end -mb-0">
            <Image
              src="/images/counselling.png"
              alt="Free counseling session"
              width={480}
              height={560}
              priority
              className="w-auto h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] object-contain object-bottom drop-shadow-xl transition-transform duration-500 hover:scale-[1.02] block align-bottom"
            />
          </div>

          {/* Right Column: Heading & Buttons */}
          <div className="relative z-10 w-full md:w-[58%] text-center md:text-left flex flex-col items-center md:items-start pb-6 md:pb-12 lg:pb-14">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#00aeef]">
              Get In Touch
            </span>
            <h2 className="mt-1.5 font-montserrat text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Your career starts with one decision
            </h2>
            <p className="mt-3 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-slate-600 font-medium">
              Book a free counseling call and we&apos;ll map the right program and internship path tailored for your career goals.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3.5 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/courses"
                className="flex items-center justify-center gap-2 rounded-full bg-[#004aad] px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-[#003087] hover:shadow-lg active:scale-95"
              >
                <span>Explore Programs</span>
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#contact"
                className="flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3 text-xs sm:text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:bg-slate-50 hover:border-slate-400 active:scale-95"
              >
                <CalendarCheck className="size-4 text-[#004aad]" />
                <span>Contact Counseling</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
