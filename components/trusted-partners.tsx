"use client"

import React from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export interface Partner {
  id: string
  name: string
  href: string
  category: string
  renderLogo: (props: { className?: string }) => React.ReactNode
}

/**
 * Official vector brand marks for each ecosystem organization,
 * optically balanced to preserve official proportions and identities.
 */
const partnersData: Partner[] = [
  {
    id: "citrux",
    name: "Citrux",
    href: "https://www.citrux.in/",
    category: "AI & Digital Engineering",
    renderLogo: ({ className = "h-9 w-auto" }) => (
      <svg
        viewBox="0 0 210 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Citrux official logo"
      >
        <defs>
          <linearGradient id="citrux-grad" x1="4" y1="6" x2="44" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="citrux-core" x1="12" y1="14" x2="36" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>
        {/* Citrux Hexagonal Tech Monogram */}
        <g transform="translate(4, 3)">
          {/* Outer faceted shield */}
          <path
            d="M23 2L41 12.5V33.5L23 44L5 33.5V12.5L23 2Z"
            fill="url(#citrux-grad)"
          />
          {/* Inner negative space C curve */}
          <path
            d="M23 8C14.7 8 8 14.7 8 23C8 31.3 14.7 38 23 38C29.2 38 34.5 34.2 36.6 28.8H29.8C28.4 31.2 25.9 32.8 23 32.8C17.6 32.8 13.2 28.4 13.2 23C13.2 17.6 17.6 13.2 23 13.2C25.9 13.2 28.4 14.8 29.8 17.2H36.6C34.5 11.8 29.2 8 23 8Z"
            fill="#FFFFFF"
          />
          {/* Center energy node */}
          <circle cx="23" cy="23" r="3.2" fill="url(#citrux-core)" />
        </g>
        {/* Wordmark: Citrux */}
        <text
          x="58"
          y="32"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="24"
          fontWeight="700"
          letterSpacing="-0.6px"
          fill="#0F172A"
        >
          citr<tspan fill="#2563EB">ux</tspan>
        </text>
        {/* Subtitle */}
        <text
          x="58.5"
          y="43"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8.5"
          fontWeight="600"
          letterSpacing="1.8px"
          fill="#64748B"
        >
          TECHNOLOGIES
        </text>
      </svg>
    ),
  },
  {
    id: "recrui8",
    name: "Recrui8",
    href: "https://recrui8.com/",
    category: "Talent & Gig Platform",
    renderLogo: ({ className = "h-8 w-auto" }) => (
      <svg
        viewBox="0 0 718.26 202.09"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Recrui8 official logo"
      >
        <defs>
          <linearGradient id="recrui8-grad-1" x1="559.93" y1="109.33" x2="-176.68" y2="116.29" gradientUnits="userSpaceOnUse">
            <stop offset="0.15" stopColor="#004763" />
            <stop offset="1" stopColor="#00b2fc" />
          </linearGradient>
          <linearGradient id="recrui8-grad-2" x1="459" y1="10.2" x2="439.21" y2="86.09" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#004763" />
            <stop offset="0.14" stopColor="#004a68" />
            <stop offset="0.49" stopColor="#00668f" />
            <stop offset="1" stopColor="#00b2fc" />
          </linearGradient>
          <linearGradient id="recrui8-grad-3" x1="449.57" y1="53.56" x2="455.53" y2="124.21" xlinkHref="#recrui8-grad-2" />
          <linearGradient id="recrui8-grad-4" x1="488.75" y1="172.58" x2="488.75" y2="37.98" gradientUnits="userSpaceOnUse">
            <stop offset="0.24" stopColor="#004763" />
            <stop offset="0.61" stopColor="#00668f" />
            <stop offset="1" stopColor="#00b2fc" />
          </linearGradient>
        </defs>
        <g id="recrui8-body">
          {/* 'e' */}
          <path
            fill="#0F172A"
            d="m205.25,137.22c-11.36,10.74-24.69,16.1-39.98,16.1s-27.93-4.71-37.92-14.14c-9.99-9.42-14.98-22.06-14.98-37.92s5.08-28.46,15.26-37.82c10.17-9.36,22.19-14.04,36.04-14.04s25.62,4.18,35.29,12.55c9.67,8.36,14.51,19.85,14.51,34.45v14.98h-73.4c.87,5.49,3.74,9.99,8.61,13.48,4.87,3.5,10.36,5.24,16.48,5.24,9.86,0,17.98-3.31,24.34-9.92l15.73,17.04Zm-26.96-59.73c-3.87-3.24-8.58-4.87-14.14-4.87s-10.64,1.69-15.26,5.06c-4.62,3.37-7.3,7.93-8.05,13.67h44.19c-.63-5.99-2.87-10.61-6.74-13.86Z"
          />
          {/* 'c' */}
          <path
            fill="#0F172A"
            d="m282.02,128.41c9.36,0,17.79-4.68,25.28-14.04l16.66,18.72c-12.98,13.48-27.03,20.22-42.13,20.22s-27.87-4.77-38.29-14.32c-10.42-9.55-15.63-22.03-15.63-37.45s5.27-27.96,15.82-37.64c10.55-9.67,23.06-14.51,37.54-14.51,7.24,0,14.57,1.5,22,4.49,7.42,3,13.95,7.43,19.57,13.29l-14.6,19.1c-3.25-3.87-7.21-6.86-11.89-8.99-4.68-2.12-9.33-3.18-13.95-3.18-7.37,0-13.7,2.4-19,7.21-5.31,4.81-7.96,11.49-7.96,20.03s2.65,15.2,7.96,19.94c5.3,4.75,11.52,7.12,18.63,7.12Z"
          />
          {/* 'r' */}
          <path
            fill="#0F172A"
            d="m395.67,75.8c-8.36,0-14.6,2.97-18.72,8.89-4.12,5.93-6.18,13.76-6.18,23.5v43.63h-28.09V51.09h28.09v13.29c3.62-4.12,8.14-7.61,13.57-10.49,5.43-2.87,10.95-4.37,16.57-4.49l.19,26.4h-5.43Z"
          />
          {/* 'i' */}
          <path
            fill="#0F172A"
            d="m568.94,46.79c-2.87-2.87-4.3-6.38-4.3-10.55s1.43-7.68,4.3-10.55c2.87-2.87,6.38-4.3,10.55-4.3s7.68,1.43,10.55,4.3c2.87,2.87,4.3,6.39,4.3,10.55s-1.43,7.68-4.3,10.55c-2.87,2.87-6.39,4.3-10.55,4.3s-7.68-1.43-10.55-4.3Zm23.2,102.34h-25.31V58.35h25.31v90.78Z"
          />
          {/* '8' text */}
          <text
            x="601.58"
            y="150.27"
            fontFamily="Montserrat, system-ui, sans-serif"
            fontSize="176.79"
            fontWeight="700"
            fill="#009CDC"
          >
            8
          </text>
          {/* Dynamic swoosh & 'r' initial */}
          <path
            fill="url(#recrui8-grad-1)"
            d="m464.96,155.95c-1.77.98-10.29,4-13.47,4.89C185.37,235.87,72.12,118.36,65.94,112.06c13.38-1.48,15.32-3.65,15.32-3.65,15.81-6.52,25.05-24.22,24.9-40.63-.11-11.82-3.24-25.71-13.01-33.14-12.07-9.18-28.46-9.76-43.53-10.3H0v130.88h29.21v-41.75s10.69-.23,11.45,0,71.18,112.08,334.81,84.13c47.18-5.55,114.67-17.77,148.54-53.04-10.21,8.35-30.66,12.93-45.69,12.93-5.72,0-8.33-.32-13.36-1.54ZM29.21,88.19v-38.76h21.91c9.36,0,15.92,1.31,19.66,3.93,3.74,2.62,5.62,7.46,5.62,14.51s-1.81,12.2-5.43,15.45c-3.62,3.25-10.42,4.87-20.41,4.87h-21.35Z"
          />
          {/* 'u' letter paths with gradient */}
          <g>
            <path
              fill="url(#recrui8-grad-2)"
              d="m471.28,100.93c-1.82-2.19-2.91-5-2.91-8.07v-53.1c0-13.46-8.91-24.36-22.36-24.36h-24.31v27.98c4.44,13.23,16.72,46.95,49.58,57.55Z"
            />
            <path
              fill="url(#recrui8-grad-3)"
              d="m485.49,105.27c-.8.16-1.62.24-2.46.24-3.92,0-9.42-1.78-11.75-4.58-32.85-10.6-45.14-44.32-49.58-57.55v50.54c0,1.7.05,3.35.13,4.99,15.59,7.78,39.48,15.36,63.65,6.37Z"
            />
          </g>
          {/* Final crown / arrow flourish */}
          <path
            fill="url(#recrui8-grad-4)"
            d="m554.97,64.21l-29.79-45.81c-2.11-3.87-7.67-3.87-9.79,0l-29.79,45.81c-2.03,3.72.66,8.25,4.89,8.25h7.19v12.95s-.01,7.45-.01,7.45c0,6.15-6.39,11.27-12.2,12.41-24.18,8.99-48.06,1.41-63.65-6.37.87,18.2,6.58,32.45,17.17,42.72,11.53,11.19,26.24,16.79,44.12,16.79s32.56-5.56,44.02-16.69c11.47-11.12,17.2-27.06,17.2-47.81l-.06-8.5v-12.95h5.78c4.24,0,6.92-4.54,4.89-8.25Z"
          />
        </g>
      </svg>
    ),
  },
  {
    id: "proventure",
    name: "ProVenture",
    href: "https://www.proventure.in/",
    category: "Digital Growth & Agency",
    renderLogo: ({ className = "h-9 w-auto" }) => (
      <svg
        viewBox="0 0 240 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="ProVenture official logo"
      >
        <defs>
          <linearGradient id="pv-brand" x1="0" y1="4" x2="42" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4338CA" />
            <stop offset="60%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
        </defs>
        {/* Dynamic faceted monogram emblem */}
        <g transform="translate(6, 6)">
          <rect width="40" height="40" rx="10" fill="url(#pv-brand)" />
          {/* Modern P & V stylized intersection */}
          <path
            d="M13 11H23C27.4 11 30 13.6 30 17.5C30 21.4 27.4 24 23 24H18V31H13V11ZM18 19.5H22.5C24.5 19.5 25.5 18.7 25.5 17.5C25.5 16.3 24.5 15.5 22.5 15.5H18V19.5Z"
            fill="#FFFFFF"
          />
          <path
            d="M21 21L28.5 32H23.5L18.5 24.5L21 21Z"
            fill="#A5B4FC"
          />
        </g>
        {/* Official PROVENTURE Wordmark */}
        <text
          x="58"
          y="31"
          fontFamily="system-ui, -apple-system, Montserrat, sans-serif"
          fontSize="19"
          fontWeight="800"
          letterSpacing="1.2px"
          fill="#0F172A"
        >
          PROVENTURE
        </text>
        {/* Official Submark */}
        <text
          x="59"
          y="42"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="7.5"
          fontWeight="600"
          letterSpacing="2.8px"
          fill="#6366F1"
        >
          DIGITAL AGENCY
        </text>
      </svg>
    ),
  },
  {
    id: "iit-bombay",
    name: "IIT Bombay",
    href: "https://www.iitb.ac.in/",
    category: "Institute of National Importance",
    renderLogo: ({ className = "h-11 w-auto" }) => (
      <svg
        viewBox="0 0 240 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="IIT Bombay official emblem and logo"
      >
        {/* Official IIT Bombay Navy Emblem Seal */}
        <g transform="translate(6, 2)">
          {/* Outer circle seal boundary */}
          <circle cx="26" cy="26" r="24.5" fill="#002147" />
          <circle cx="26" cy="26" r="22.5" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="26" cy="26" r="18" fill="none" stroke="#FFFFFF" strokeWidth="0.8" strokeDasharray="2 1.5" />
          
          {/* Central Sacred Flame (Knowledge Deepam) */}
          <path
            d="M26 10C24 14 21 16.5 21 20C21 23 23.2 25 26 25C28.8 25 31 23 31 20C31 16.5 28 14 26 10Z"
            fill="#FBBF24"
          />
          {/* Lotus base petals */}
          <path
            d="M17 26C20 27.5 23 27 26 25C29 27 32 27.5 35 26C36 29 33 32 26 33C19 32 16 29 17 26Z"
            fill="#FFFFFF"
          />
          {/* Bottom Open Book / Base */}
          <path
            d="M19 34L26 31.5L33 34V36.5L26 34L19 36.5V34Z"
            fill="#93C5FD"
          />
          {/* Cogwheel teeth accents on crest */}
          <circle cx="26" cy="26" r="13" fill="none" stroke="#FFFFFF" strokeWidth="1.2" />
        </g>
        {/* Institutional Typography */}
        <text
          x="66"
          y="28"
          fontFamily="system-ui, -apple-system, serif"
          fontSize="18"
          fontWeight="800"
          letterSpacing="0.4px"
          fill="#002147"
        >
          IIT Bombay
        </text>
        <text
          x="66.5"
          y="40.5"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8.5"
          fontWeight="600"
          letterSpacing="1px"
          fill="#475569"
        >
          INDIAN INSTITUTE OF TECHNOLOGY
        </text>
      </svg>
    ),
  },
  {
    id: "aicte",
    name: "AICTE",
    href: "https://www.aicte-india.org/",
    category: "Apex Statutory Body",
    renderLogo: ({ className = "h-11 w-auto" }) => (
      <svg
        viewBox="0 0 220 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="AICTE official emblem and logo"
      >
        {/* Official Apex AICTE Emblem */}
        <g transform="translate(6, 2)">
          {/* Outer Sunburst & Seal Ring */}
          <circle cx="26" cy="26" r="24.5" fill="#1E3A8A" />
          <circle cx="26" cy="26" r="22.5" fill="none" stroke="#F59E0B" strokeWidth="1.2" />
          {/* Traditional Cogwheel of Technical Education */}
          <circle cx="26" cy="26" r="17" fill="#FFFFFF" />
          <circle cx="26" cy="26" r="14" fill="none" stroke="#1E3A8A" strokeWidth="1.5" strokeDasharray="3 2" />
          
          {/* Flame of Technical Excellence */}
          <path
            d="M26 12C24.5 15.5 22.5 17.5 22.5 20.5C22.5 22.7 24.1 24.2 26 24.2C27.9 24.2 29.5 22.7 29.5 20.5C29.5 17.5 27.5 15.5 26 12Z"
            fill="#EA580C"
          />
          <path
            d="M26 15C25.2 17 24 18.2 24 20C24 21.2 24.9 22 26 22C27.1 22 28 21.2 28 20C28 18.2 26.8 17 26 15Z"
            fill="#FBBF24"
          />
          {/* Symbolic Open Script / Knowledge Pedestal */}
          <path
            d="M19 28C21 26.8 23.5 26.8 26 28C28.5 26.8 31 26.8 33 28L31.5 32C29.5 31 27.8 31 26 31.8C24.2 31 22.5 31 20.5 32L19 28Z"
            fill="#1E3A8A"
          />
        </g>
        {/* AICTE Title Typography */}
        <text
          x="66"
          y="28"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="20"
          fontWeight="800"
          letterSpacing="1px"
          fill="#1E3A8A"
        >
          AICTE
        </text>
        <text
          x="66.5"
          y="40"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8"
          fontWeight="600"
          letterSpacing="0.8px"
          fill="#64748B"
        >
          GOVT. OF INDIA STATUTORY APEX BODY
        </text>
      </svg>
    ),
  },
]

export function TrustedPartners() {
  return (
    <section
      id="trusted-partners"
      className="scroll-mt-24 relative w-full bg-white py-12 sm:py-16 border-t border-slate-200/80 overflow-hidden"
      aria-labelledby="trusted-partners-heading"
    >
      {/* Background very soft light accents */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[220px] bg-[#004aad]/[0.03] blur-[100px] rounded-full"
        aria-hidden="true"
      />

      {/* Main Container - 90-94% viewport, max 1440px, rounded-3xl with subtle border */}
      <div className="mx-auto w-[92%] max-w-[1380px]">
        <div className="relative rounded-2xl sm:rounded-[24px] lg:rounded-[28px] border border-slate-200/90 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.03)] p-6 sm:p-9 lg:px-12 lg:py-9 transition-all duration-300">
          {/* Header row: top-left heading + institutional indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-7 sm:mb-9">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/90 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                <span className="size-1.5 rounded-full bg-[#004aad]" />
                <span>ECOSYSTEM NETWORK</span>
              </div>
              <h2
                id="trusted-partners-heading"
                className="font-montserrat text-xl sm:text-2xl lg:text-[28px] font-bold tracking-tight text-slate-900 leading-tight"
              >
                Trusted by leading organizations & institutions
              </h2>
            </div>
            <p className="text-[12px] sm:text-xs text-slate-500 font-medium">
              Academic & Industry Network
            </p>
          </div>

          {/* Desktop & Tablet: Horizontal Row with subtle vertical separators */}
          <div className="hidden md:grid md:grid-cols-5 items-center divide-x divide-slate-200/80">
            {partnersData.map((partner) => (
              <div
                key={partner.id}
                className="px-3 sm:px-4 lg:px-6 flex flex-col items-center justify-center text-center group"
              >
                <Link
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${partner.name} - official website (opens in new tab)`}
                  className="flex flex-col items-center justify-center w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004aad] rounded-xl p-2 transition-all duration-300"
                >
                  {/* Normalized Logo Area */}
                  <div className="h-[52px] sm:h-[58px] w-full flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-[1.02] opacity-90 group-hover:opacity-100">
                    {partner.renderLogo({ className: "max-h-[46px] max-w-[90%] w-auto object-contain" })}
                  </div>

                  {/* Partner Label */}
                  <div className="mt-2.5 flex items-center gap-1">
                    <span className="text-xs sm:text-[13px] font-semibold text-slate-700 tracking-tight transition-colors duration-200 group-hover:text-[#004aad]">
                      {partner.name}
                    </span>
                    <ExternalLink className="size-3 text-slate-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Mobile (<768px): Responsive 2-column balanced grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:hidden">
            {partnersData.map((partner, index) => {
              const isLastAndOdd = index === partnersData.length - 1 && partnersData.length % 2 !== 0

              return (
                <div
                  key={partner.id}
                  className={`rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 flex flex-col items-center justify-center text-center transition-all duration-200 hover:border-slate-200 hover:bg-white ${
                    isLastAndOdd ? "col-span-2 max-w-[240px] mx-auto w-full" : ""
                  }`}
                >
                  <Link
                    href={partner.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${partner.name} - official website`}
                    className="flex flex-col items-center justify-center w-full"
                  >
                    <div className="h-[46px] w-full flex items-center justify-center">
                      {partner.renderLogo({ className: "max-h-[38px] max-w-[90%] w-auto object-contain" })}
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-xs font-semibold text-slate-700">
                        {partner.name}
                      </span>
                      <ExternalLink className="size-2.5 text-slate-400" />
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustedPartners
