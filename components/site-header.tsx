"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, ArrowRight, LogOut, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Blog", href: "/blog" },
]

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const isHome = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isHome
          ? scrolled
            ? "bg-[#004aad]/95 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.25)] text-white"
            : "bg-[#004aad] shadow-[0_4px_20px_rgba(0,0,0,0.15)] text-white"
          : scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md text-gray-900"
          : "bg-white border-b border-gray-100 shadow-sm text-gray-900"
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 md:px-10 py-3.5 sm:py-4">
        {/* Logo */}
        <Link
          href="/"
          className="group flex flex-row items-center gap-2 leading-none transition-opacity hover:opacity-90 shrink-0"
        >
          {/* Symbol */}
          <img
            src="/images/logo-des.png"
            alt="Logo Symbol"
            className="h-9 sm:h-10 w-auto object-contain rounded-sm"
          />
          {/* Text */}
          <div className="flex flex-col">
            <span
              className="font-black uppercase tracking-tight text-[1.2rem] sm:text-[1.35rem]"
              style={{ lineHeight: 1.1 }}
            >
              <span className="text-[#00aeef]">INTERN</span>{" "}
              <span className={isHome ? "text-white" : "text-[#003087]"}>ACADEMY</span>
            </span>
            <span
              className={`text-[0.48rem] sm:text-[0.52rem] font-bold tracking-[0.18em] uppercase mt-0.5 border-t pt-0.5 ${
                isHome ? "text-white/70 border-white/30" : "text-[#003087]/70 border-[#003087]/30"
              }`}
            >
              A Launchpad to Real-World Skills
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const isActive = pathname === link.href

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
                className={`flex items-center gap-2 rounded-full border-2 px-6 py-2 text-sm font-semibold transition-all duration-300 ${
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
                className={`flex items-center justify-center rounded-full px-7 py-2 text-sm font-semibold transition-all duration-300 shadow-sm hover:scale-[1.02] active:scale-95 ${
                  isHome
                    ? "bg-white text-[#004aad] hover:bg-[#00d2fd] hover:text-slate-900"
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
                Hi, {session.user?.name}
              </span>

              <Link
                href={
                  session.user.role === "admin" || session.user.role === "super_admin"
                    ? "/admin"
                    : "/student/dashboard"
                }
                className={`rounded-full p-2 ${
                  isHome ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Dashboard"
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
                  isHome ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Sign Out"
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
              ? "border-white/30 text-white hover:bg-white/10"
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
          className={`border-t px-6 py-4 md:hidden animate-in fade-in slide-in-from-top-1 duration-200 ${
            isHome
              ? "border-white/15 bg-[#004aad] text-white shadow-xl"
              : "border-gray-100 bg-white text-gray-900 shadow-lg"
          }`}
        >
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {navLinks.map((link) => {
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isHome
                      ? isActive
                        ? "text-[#00d2fd] bg-white/10 font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                      : isActive
                      ? "text-[#004aad] bg-gray-50 font-bold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            <div className="mt-3 flex flex-col gap-2 border-t pt-3" style={{ borderColor: isHome ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)" }}>
              {!session ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className={`rounded-full border-2 px-6 py-2.5 text-center text-sm font-semibold transition-colors ${
                      isHome
                        ? "border-white/50 text-white hover:bg-white/10"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Sign In →
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className={`rounded-full px-6 py-2.5 text-center text-sm font-semibold transition-colors ${
                      isHome
                        ? "bg-white text-[#004aad] hover:bg-[#00d2fd]"
                        : "bg-[#004aad] text-white hover:bg-[#003c8c]"
                    }`}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-2 py-1 text-xs opacity-75">
                    Signed in as <span className="font-semibold">{session.user?.name}</span>
                  </div>

                  <Link
                    href={
                      session.user.role === "admin" || session.user.role === "super_admin"
                        ? "/admin"
                        : "/student/dashboard"
                    }
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-full bg-[#00aeef] px-6 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      setOpen(false)
                      signOut({
                        callbackUrl: "/",
                      })
                    }}
                    className={`flex items-center justify-center gap-2 rounded-full border px-6 py-2 text-center text-xs font-semibold ${
                      isHome
                        ? "border-white/30 text-white hover:bg-white/10"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <LogOut size={16} />
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
