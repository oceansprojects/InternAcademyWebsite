import Image from "next/image"
import { ArrowRight, CalendarCheck } from "lucide-react"

export function FinalCta() {
  return (
    <section className="pt-28 pb-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Parent card container: overflow-visible (no overflow-hidden) to let the image stick out */}
        <div className="relative rounded-[2.5rem] border border-neutral-200/70 bg-gradient-to-br from-white to-slate-50/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] px-6 py-12 md:py-16 md:px-16 flex flex-col md:flex-row items-center min-h-[340px]">
          
          {/* Decorative glows */}
          <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#004aad]/5 blur-3xl pointer-events-none" />
          <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#00d2fd]/5 blur-3xl pointer-events-none" />

          {/* Left Column: Image wrapper sticking out of the top of the div */}
          <div className="relative w-full md:w-[38%] flex justify-center md:block h-auto">
            <div className="md:absolute md:-bottom-16 md:-top-32 md:left-0 md:w-full">
              <Image
                src="/images/counselling.png"
                alt="Free counseling session"
                width={480}
                height={560}
                priority
                className="w-auto h-[300px] sm:h-[280px] md:h-[400px] object-contain object-bottom drop-shadow-2xl transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Right Column: Heading & Text shifted to the right */}
          <div className="relative z-10 w-full md:w-[62%] text-center md:text-left flex flex-col items-center md:items-start">
            <h2 className="font-montserrat text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-[42px] leading-tight">
              Your career starts with one decision
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-500 font-medium">
              Book a free counseling call and we&apos;ll map the right program and
              internship path for your goals.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href="#"
                className="flex items-center justify-center gap-2 rounded-full bg-[#004aad] px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-[#003c8f] hover:shadow-lg active:scale-95"
              >
                Get started free
                <ArrowRight className="size-4" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-8 py-3.5 text-sm font-bold text-neutral-800 shadow-sm transition-all duration-300 hover:bg-neutral-50 hover:border-neutral-400"
              >
                <CalendarCheck className="size-4" />
                Book counseling
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
