"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"

export function ScrollToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShow(true)
      } else {
        setShow(false)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!show) return null

  return (
    <button
      onClick={handleScrollToTop}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#004aad] hover:bg-[#003580] text-white shadow-lg rounded-full p-3 flex items-center justify-center border border-[#004aad]/10 transition-all hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-bottom-4 duration-300"
      aria-label="Scroll to top"
    >
      <ArrowUp className="size-5" />
    </button>
  )
}
