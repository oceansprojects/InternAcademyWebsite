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
    <section id="stories" className="scroll-mt-20 bg-card/60 py-14 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <span className="block text-center text-lg font-semibold uppercase tracking-wider text-primary">
          Success stories
        </span>

        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1fr_minmax(320px,380px)]">
          {/* Left: 3D graduate + headline */}
          <div className="relative">
            <div className="relative w-full flex justify-center lg:justify-start lg:pl-6">
              {/* Subtle glow backdrops */}
              <div className="absolute -left-10 -top-10 size-80 rounded-full bg-[#004aad]/5 blur-3xl" />
              <div className="absolute -right-6 -bottom-6 size-80 rounded-full bg-[#00d2fd]/5 blur-3xl" />

              {/* Main Image Frame */}
              <div className="relative rounded-[2.5rem] w-full max-w-[440px]">
                <Image
                  src="/images/rhs.png"
                  alt="Classroom to Career path demonstration"
                  width={600}
                  height={680}
                  className="rounded-[2rem] w-full h-auto object-cover max-h-[420px] transition-transform duration-700 hover:scale-[1.02]"
                  priority
                />
              </div>
            </div>
            <h2 className="mt-2 ml-6 font-heading text-base font-bold tracking-tight text-foreground text-balance sm:text-3xl">
              Real students. Real offers.
            </h2>
            <p className="mt-3 ml-6 max-w-md text-sm text-muted-foreground leading-relaxed">
              Thousands of learners have turned an Intern Academy program into a
              first job. Here&apos;s what the journey looks like.
            </p>
          </div>

          {/* Right: testimonial cards */}
          <div className="grid gap-2.5 sm:grid-cols-1">
            {stories.map((s) => (
              <figure
                key={s.name}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <Quote className="size-4 text-primary/30" aria-hidden="true" />
                <blockquote className="mt-2 text-sm text-foreground leading-snug text-pretty">
                  &ldquo;{s.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-2.5 flex items-center gap-2.5 border-t border-border pt-2.5">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {s.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.role}</p>
                  </div>
                  <span className="ml-auto hidden rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground sm:inline">
                    {s.program}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}