"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, ArrowRight, User, LogOut, LayoutDashboard } from "lucide-react"
import Link from "next/link"


import { useSession, signOut } from "next-auth/react"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Blog", href: "/blog" },
]


export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const isHome = pathname === "/"

  const handleHashLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault()
      const id = href.replace("/#", "")
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    }
  }


  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isHome
          ? "bg-[#004aad] shadow-[0_4px_20px_rgba(0,0,0,0.15)] text-white"
          : "bg-white border-b border-gray-100 shadow-sm text-gray-900"
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-10 py-4">
        {/* Logo */}
        <Link href="/" className="group flex flex-row items-center gap-2 leading-none transition-opacity hover:opacity-90">
          {/* Symbol */}
          <img
            src="/images/logo-des.png"
            alt="Logo Symbol"
            className=" h-10 w-auto object-contain rounded-sm"
          />
          {/* Text */}
          <div className="flex flex-col">
            <span className="font-black uppercase tracking-tight" style={{ fontSize: "1.35rem", lineHeight: 1.1 }}>
              <span className="text-[#00aeef]">INTERN</span>{" "}
              <span className={isHome ? "text-white" : "text-[#003087]"}>ACADEMY</span>
            </span>
            <span
              className={`text-[0.52rem] font-bold tracking-[0.18em] uppercase mt-0.5 border-t pt-0.5 ${
                isHome ? "text-white/70 border-white/30" : "text-[#003087]/70 border-[#003087]/30"
              }`}
            >
              A Launchpad to Real-World Skills
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;


            return (
              <Link
                key={link.href + link.label}
                href={link.href}
                className={`relative pb-2 text-sm font-medium transition-colors duration-200
                  after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:content-['']
                  after:transition-transform after:duration-300 after:origin-left
                  ${
                  isHome
                    ? isActive
                      ? "text-white after:scale-x-100 after:bg-[#00d2fd]"
                      : "text-white/70 hover:text-white after:scale-x-0 hover:after:scale-x-100 after:bg-[#00d2fd]"
                    : isActive
                    ? "text-[#004aad] after:scale-x-100 after:bg-[#004aad]"
                    : "text-gray-600 hover:text-gray-900 after:scale-x-0 hover:after:scale-x-100 after:bg-[#004aad]"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

       {/* CTA Buttons */}

<div className="hidden items-center gap-4 md:flex">

  {!session ? (
    <>
      <Link
        href="/login"
        className={`flex items-center gap-2 rounded-full border-2 px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
          isHome
            ? "border-white/50 text-white hover:border-[#00d2fd] hover:text-[#00d2fd]"
            : "border-gray-200 text-gray-700 hover:border-[#004aad] hover:text-[#004aad]"
        }`}
      >
        Sign In
        <ArrowRight className="size-4" />
      </Link>

      <Link
        href="/signup"
        className={`flex items-center justify-center rounded-full px-7 py-2.5 text-sm font-semibold transition-all duration-300 ${
          isHome
            ? "bg-white text-[#004aad] hover:bg-[#00d2fd]"
            : "bg-[#004aad] text-white hover:bg-[#003c8c]"
        }`}
      >
        Sign Up
      </Link>
    </>
  ) : (
    <div className="flex items-center gap-3">

      <span
        className={`text-sm font-semibold ${
          isHome ? "text-white" : "text-gray-700"
        }`}
      >
        Hi, {session.user.name}
      </span>

      <Link
        href={
          session.user.role === "admin" ||
          session.user.role === "super_admin"
            ? "/admin"
            : "/student/dashboard"
        }
        className={`rounded-full p-2 ${
          isHome
            ? "hover:bg-white/10"
            : "hover:bg-gray-100"
        }`}
      >
        <LayoutDashboard size={20} />
      </Link>

      <button
        onClick={() =>
          signOut({
            callbackUrl: "/",
          })
        }
        className={`rounded-full p-2 ${
          isHome
            ? "hover:bg-white/10"
            : "hover:bg-gray-100"
        }`}
      >
        <LogOut size={20} />
      </button>

    </div>
  )}

</div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`flex size-10 items-center justify-center rounded-full border md:hidden transition-all ${
            isHome
              ? "border-white/30 text-white"
              : "border-gray-200 text-gray-700 hover:border-gray-300"
          }`}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className={`border-t px-6 py-4 md:hidden ${
            isHome ? "border-white/10 bg-[#004aad]" : "border-gray-100 bg-white"
          }`}
        >
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;


              return (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isHome
                      ? isActive
                        ? "text-[#00d2fd]"
                        : "text-white/70 hover:text-white"
                      : isActive
                      ? "text-[#004aad] bg-gray-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="mt-3 flex flex-col gap-2">

  {!session ? (
    <>
      <Link
        href="/login"
        className={`rounded-full border-2 px-6 py-2.5 text-center text-sm font-semibold ${
          isHome
            ? "border-white/50 text-white"
            : "border-gray-200 text-gray-700"
        }`}
      >
        Sign In →
      </Link>

      <Link
        href="/signup"
        className={`rounded-full px-6 py-2.5 text-center text-sm font-semibold ${
          isHome
            ? "bg-white text-[#004aad]"
            : "bg-[#004aad] text-white"
        }`}
      >
        Sign Up
      </Link>
    </>
  ) : (
    <>
      <Link
        href={
          session.user.role === "admin" ||
          session.user.role === "super_admin"
            ? "/admin"
            : "/student"
        }
        className="rounded-full bg-[#004aad] px-6 py-2.5 text-center text-white"
      >
        Dashboard
      </Link>

      <button
        onClick={() =>
          signOut({
            callbackUrl: "/",
          })
        }
        className="rounded-full border px-6 py-2.5"
      >
        Logout
      </button>
    </>
  )}

</div>
          </nav>
        </div>
      )}
    </header>
  )
}

