import Image from "next/image"

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#004aad] pt-[5px]">
      {/* Grid background with radial fade-out mask */}
      <div
        aria-hidden="true"
        className="hero-grid-bg pointer-events-none absolute inset-0 z-0"
      />

      <div className="relative z-10 mx-auto flex max-w-[1280px] min-h-[580px] flex-col items-center justify-between gap-10 px-10 pb-16 md:flex-row md:items-center">

        {/* ─── LEFT COLUMN ─── */}
        <div className="flex w-full flex-col items-start md:w-[55%]">

          {/* Heading */}
          <div className="mb-6 space-y-1">
            <h1 className="m-0 font-montserrat uppercase leading-none">
              {/* Line 1 – Cyan */}
              <span
                className="block text-[clamp(36px,5vw,64px)] font-extrabold leading-[1.05] text-white "
                // style={{ textShadow: "0 0 24px rgba(0,210,253,0.35)" }}
              >
                UNLEASHING THE
              </span>

              {/* Line 2 – White */}
              <span className="block text-[clamp(36px,5vw,64px)] font-extrabold leading-[1.05] text-white">
                POWER OF LEARNING WITH
              </span>

              {/* Line 3 – White + wavy underline */}
              <span className="relative inline-block text-[clamp(36px,5vw,64px)] font-extrabold leading-[1.05] text-[#2bbae9]">
                INTERN  <span className="text-[#15294c]">ACADEMY</span>
                
              </span>
            </h1>
          </div>

          {/* Body paragraph */}
          <p className="mb-10 mt-8 max-w-[90%] font-inter text-[15px] leading-relaxed text-white/75">
            Ignite your passion for learning, explore limitless possibilities,
            and shape your educational destiny with our innovative and
            student-centric online platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="#"
              className="group flex items-center justify-center gap-2 rounded-full border-2 border-[#00b4d8] px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-[#00b4d8]"
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
            </a>
            <a
              href="#"
              className="flex items-center justify-center rounded-full border border-white/40 px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:border-white/80 hover:bg-white/10"
            >
              Try Free Demo
            </a>
          </div>
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div className="relative flex w-full items-center justify-center md:w-[45%] md:h-[600px]">

          {/* Center-aligned larger person image wrapper */}
          <div className="relative w-[95%] max-w-[480px] z-10 flex flex-col items-center">
            
            {/* Short white horizontal line ABOVE the boy image */}
            <div
              aria-hidden="true"
              className="mb-6 h-[2px] w-[90px] rounded-full bg-white opacity-60"
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
          </div>

          {/* Floating badge – "2.3 Million user" (upper-left relative to right column) */}
          <div className="hero-chip animate-hero-float-slow absolute top-[15%] left-[-5%] md:left-[-2%] z-30 flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-lg">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#004aad]">
              {/* People icon */}
              <svg className="size-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-bold leading-tight text-[#004aad]">2.3 Million user</p>
              <p className="text-[11px] leading-tight text-[#004aad]/60">Active Students</p>
            </div>
          </div>

          {/* Floating badge – "300+ Courses" (lower-right relative to right column) */}
          <div className="hero-chip animate-hero-float-fast absolute bottom-[23%] right-[-5%] md:right-[-2%] z-30 flex items-center gap-3 rounded-full bg-[#f5c518] px-5 py-3.5 shadow-[0_10px_30px_rgba(245,197,24,0.35)]">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#004aad]/20">
              {/* Book icon */}
              <svg className="size-4 text-[#004aad]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
              </svg>
            </div>
            <div>
              <p className="text-[22px] font-black leading-none text-[#004aad]">300+</p>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#004aad]/80">Courses</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
