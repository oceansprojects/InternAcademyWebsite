import { ArrowUpRight, Building2, MapPin, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"

type Internship = {
  role: string
  company: string
  location: string
  mode: "On-site" | "Remote" | "Hybrid"
  stipend: string
  sector: string
}

const internships: Internship[] = [
  {
    role: "Frontend Developer Intern",
    company: "TechNova",
    location: "Bengaluru",
    mode: "Hybrid",
    stipend: "25,000/mo",
    sector: "Software",
  },
  {
    role: "Data Analyst Intern",
    company: "FinEdge",
    location: "Remote",
    mode: "Remote",
    stipend: "20,000/mo",
    sector: "Fintech",
  },
  {
    role: "Growth Marketing Intern",
    company: "BlueOrbit",
    location: "Pune",
    mode: "On-site",
    stipend: "18,000/mo",
    sector: "SaaS",
  },
  {
    role: "UI/UX Design Intern",
    company: "Skyline Labs",
    location: "Hyderabad",
    mode: "Hybrid",
    stipend: "22,000/mo",
    sector: "Product",
  },
]

const modeStyles: Record<Internship["mode"], string> = {
  "On-site": "bg-primary/10 text-primary",
  Remote: "bg-emerald-100 text-emerald-700",
  Hybrid: "bg-accent/30 text-accent-foreground",
}

export function Internships() {
  return (
    <section id="internships" className="scroll-mt-20 bg-card/60 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col items-center gap-4 text-center">
          <span className="text-lg font-semibold uppercase tracking-wider text-primary">
            Live internships
          </span>
          <h2 className="mt-2 max-w-xl font-heading text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            Apply to roles hiring right now
          </h2>
          <Button variant="ghost" className="rounded-full font-semibold text-primary hover:bg-primary/10">
            Browse all roles
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {internships.map((job) => (
            <article
              key={job.role}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <Building2 className="size-6" aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {job.role}
                  </h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${modeStyles[job.mode]}`}>
                    {job.mode}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {job.company} &middot; {job.sector}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-0.5 font-medium text-foreground">
                    <IndianRupee className="size-3.5" aria-hidden="true" />
                    {job.stipend}
                  </span>
                </div>
              </div>

              <Button variant="outline" className="shrink-0 rounded-full font-semibold">
                Apply
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
