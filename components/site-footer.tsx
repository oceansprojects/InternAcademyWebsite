import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

const groups = [
  {
    title: "Learn",
    links: ["Programs", "Internships", "Certifications", "Webinars"],
  },
  {
    title: "Company",
    links: ["About", "Placements", "Blog", "Contact"],
  },
  {
    title: "For partners",
    links: ["Hire interns", "Post a role", "Partner with us", "Login"],
  },
]

export function SiteFooter() {
  return (

    <footer id="contact" className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex flex-row items-center gap-2 leading-none transition-opacity hover:opacity-90">
              {/* Symbol */}
              <img
                src="/images/logo-des.png"
                alt="Logo Symbol"
                className="h-10 w-auto object-contain rounded-sm"
              />
              {/* Text */}
              <div className="flex flex-col">
                <span className="font-black uppercase tracking-tight" style={{ fontSize: "1.35rem", lineHeight: 1.1 }}>
                  <span className="text-[#00aeef]">INTERN</span>{" "}
                  <span className="text-[#003087]">ACADEMY</span>
                </span>
                <span className="text-[0.52rem] font-bold tracking-[0.18em] uppercase mt-0.5 border-t pt-0.5 text-[#003087]/70 border-[#003087]/30">
                  A Launchpad to Real-World Skills
                </span>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              India&apos;s student-first platform for offline training, real
              internships, and verified certificates.
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={16} className="shrink-0 text-primary" />
                <span>support@internacademy.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={16} className="shrink-0 text-primary" />
                <span>+91 xxxxxxxxxx</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin size={16} className="shrink-0 text-primary mt-0.5" />
                <span>Chhatrapati Sambhajinagar, Maharashtra</span>
              </div>
            </div>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
                {g.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {g.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Intern Academy. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}