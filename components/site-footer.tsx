import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

const groups = [
  {
    title: "Learn",
    links: [
      { name: "Programs", href: "/courses" },
      // { name: "Internships", href: "/courses" },
      { name: "Certifications", href: "/courses" },
      { name: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      // { name: "About Us", href: "#" },
      { name: "How It Works", href: "/#how" },
      { name: "Success Stories", href: "/#stories" },
      { name: "Contact", href: "#contact" },
    ],
  },
  {
    title: "For Partners",
    links: [
      // { name: "Hire Interns", href: "#" },
      { name: "Post a Role", href: "#" },
      { name: "Partner With Us", href: "#" },
      { name: "Sign In", href: "/login" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand Info (2 cols on lg) */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2 sm:gap-2.5 leading-none transition-opacity hover:opacity-90">
              <img
                src="/images/logo-des.png"
                alt="InternAcademy Logo"
                className="h-8 sm:h-9 w-auto object-contain rounded-sm"
              />
              <div className="flex flex-col">
                <span className="font-black uppercase tracking-tight text-lg" style={{ lineHeight: 1.1 }}>
                  <span className="text-[#00aeef]">INTERN</span>{" "}
                  <span className="text-[#003087]">ACADEMY</span>
                </span>
                <span className="text-[0.5rem] font-bold tracking-[0.16em] uppercase mt-0.5 border-t border-[#003087]/20 pt-0.5 text-[#003087]/70">
                  A Launchpad to Real-World Skills
                </span>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-xs sm:text-sm leading-relaxed text-slate-600">
              India&apos;s premier student-first platform for offline cohorts, practical project building, real internships, and QR-verifiable certificates.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600">
                <Mail size={15} className="shrink-0 text-[#004aad]" />
                <a href="mailto:support@internacademy.co.in" className="hover:text-[#004aad] transition-colors">
                  support@internacademy.co.in
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600">
                <Phone size={15} className="shrink-0 text-[#004aad]" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                <MapPin size={15} className="shrink-0 text-[#004aad] mt-0.5" />
                <span>Chhatrapati Sambhajinagar, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Link Groups */}
          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="font-montserrat text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                {g.title}
              </h3>
              <ul className="mt-3.5 space-y-2.5">
                {g.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-slate-600 transition-colors hover:text-[#004aad]"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} InternAcademy. All rights reserved.</p>
          <div className="flex gap-6 font-medium">
            <Link href="#" className="hover:text-[#004aad] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#004aad] transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-[#004aad] transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}