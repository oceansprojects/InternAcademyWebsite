const partners = [
  "TechNova",
  "FinEdge",
  "BlueOrbit",
  "Skyline Labs",
  "Quanta",
  "Brightwork",
  "NorthPeak",
  "Helix AI",
]

export function MarqueeBar() {
  return (
    <section className="border-y border-slate-200 bg-white/80 py-5 sm:py-6 backdrop-blur-sm" aria-label="Hiring partners">
      <p className="mb-4 sm:mb-5 text-center text-xs sm:text-sm md:text-base font-bold uppercase tracking-widest text-[#004aad]/80 px-4">
        Students placed at 320+ leading companies
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-8 sm:gap-12 md:gap-16 pr-8 sm:pr-12 md:pr-16">
          {[...partners, ...partners, ...partners].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-heading text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-400 hover:text-[#004aad] transition-colors cursor-default"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
