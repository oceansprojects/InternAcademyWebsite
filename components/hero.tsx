import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#004aad] pt-28 sm:pt-24 md:pt-18 pb-12 sm:pb-16 lg:pb-20">
      {/* Grid background with radial fade-out mask */}
      <div
        aria-hidden="true"
        className="hero-grid-bg pointer-events-none absolute inset-0 z-0 opacity-80"
      />

      <div className="relative z-10 mx-auto flex max-w-7xl min-h-[520px] flex-col md:flex-row items-center justify-between gap-8 sm:gap-10 px-4 sm:px-6 lg:px-10">

        {/* ─── TEXT COLUMN (Order 2 on Mobile, Order 1 on Desktop) ─── */}
        <div className="order-2 md:order-1 flex w-full flex-col items-center md:items-start text-center md:text-left md:w-[55%]">

          {/* Heading */}
          <div className="mb-4 sm:mb-6 space-y-1 w-full">
            <h1 className="m-0 font-montserrat uppercase tracking-tight leading-none">
              {/* Line 1 */}
              <span className="block text-2xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-extrabold leading-[1.08] text-white">
                UNLEASHING THE
              </span>

              {/* Line 2 */}
              <span className="block text-2xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-extrabold leading-[1.08] text-white">
                POWER OF LEARNING WITH
              </span>

              {/* Line 3 */}
              <span className="relative inline-block text-2xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-extrabold leading-[1.08] text-[#2bbae9]">
                INTERN <span className="text-[#15294c]">ACADEMY</span>
              </span>
            </h1>
          </div>

          {/* Body paragraph */}
          <p className="mb-6 sm:mb-8 mt-1 max-w-xl font-inter text-xs sm:text-sm md:text-base leading-relaxed text-white/80">
            Ignite your passion for learning, explore limitless possibilities,
            and shape your educational destiny with our innovative and
            student-centric online platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              href="/courses"
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-[#00b4d8] bg-[#00b4d8] sm:bg-transparent px-7 py-3 text-xs sm:text-sm md:text-base font-bold text-white transition-all duration-300 hover:bg-[#00b4d8] hover:shadow-[0_0_20px_rgba(0,180,216,0.5)] active:scale-95"
            >
              Get Started
              <svg
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </Link>
            <a
              href="#how"
              className="flex w-full sm:w-auto items-center justify-center rounded-full border border-white/40 px-7 py-3 text-xs sm:text-sm md:text-base font-bold text-white transition-all duration-300 hover:border-white/80 hover:bg-white/10 active:scale-95"
            >
              How It Works
            </a>
          </div>
        </div>

        {/* ─── PERSON IMAGE COLUMN (Order 1 on Mobile, Order 2 on Desktop) ─── */}
        <div className="order-1 md:order-2 relative flex w-full items-center justify-center md:w-[45%]">

          {/* Center-aligned person image wrapper */}
          <div className="relative w-full max-w-[280px] sm:max-w-[360px] md:max-w-[480px] z-10 flex flex-col items-center">
            
            {/* Short white horizontal line ABOVE the student image */}
            <div
              aria-hidden="true"
              className="mb-3 sm:mb-5 h-[2px] w-[60px] sm:w-[80px] md:w-[90px] rounded-full bg-white opacity-60"
            />

            <div className="relative w-full">
              <Image
                src="/images/hero-boy.png"
                alt="Student giving thumbs up holding books"
                width={650}
                height={780}
                priority
                className="relative z-10 w-full h-auto object-contain drop-shadow-2xl"
                style={{ filter: "grayscale(100%)" }}
              />

              {/* Bottom-edge gold accent line directly under the image */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 w-full h-[3px] rounded-full bg-[#f5c518] z-20"
                style={{ boxShadow: "0 -4px 16px rgba(245,197,24,0.35)" }}
              />
            </div>

            {/* Floating badge – "2.3 Million user" */}
            <div className="hero-chip animate-hero-float-slow absolute top-0 sm:top-[10%] left-[-4px] sm:left-[-10px] md:left-[-20px] z-30 flex items-center gap-2 sm:gap-3 rounded-full bg-white/95 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2.5 md:py-3 shadow-xl backdrop-blur-md border border-white/40">
              <div className="flex size-6 sm:size-7 md:size-8 items-center justify-center rounded-full bg-[#004aad] shrink-0">
                <svg className="size-3 sm:size-3.5 md:size-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] sm:text-xs md:text-[13px] font-extrabold leading-tight text-[#004aad]">2.3M+ Students</p>
                <p className="text-[9px] sm:text-[10px] md:text-[11px] leading-tight text-[#004aad]/70 font-medium">Active Learners</p>
              </div>
            </div>

            {/* Floating badge – "300+ Courses" */}
            <div className="hero-chip animate-hero-float-fast absolute bottom-1 sm:bottom-[15%] right-[-4px] sm:right-[-10px] md:right-[-20px] z-30 flex items-center gap-2 sm:gap-3 rounded-full bg-[#f5c518] px-3 sm:px-4 md:px-5 py-1.5 sm:py-2.5 md:py-3 shadow-[0_10px_30px_rgba(245,197,24,0.4)] border border-[#f5c518]/60">
              <div className="flex size-6 sm:size-7 md:size-8 items-center justify-center rounded-full bg-[#004aad]/20 shrink-0">
                <svg className="size-3 sm:size-3.5 md:size-4 text-[#004aad]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm sm:text-base md:text-[22px] font-black leading-none text-[#004aad]">300+</p>
                <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-[#004aad]/80">Courses</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
