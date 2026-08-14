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
    <section className="border-y border-border bg-card/60 py-6" aria-label="Hiring partners">
      <p className="mb-6 text-center text-base md:text-lg font-semibold uppercase tracking-widest text-foreground">
        Students placed a 320+ companies
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-12 pr-12">
          {[...partners, ...partners].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-heading text-xl font-bold tracking-tight text-muted-foreground/70"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
