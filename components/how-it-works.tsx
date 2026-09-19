"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, useSpring, useScroll, useTransform } from "framer-motion"

function IALogo({ size = 20 }: { color?: string; size?: number }) {
  return (
    <img
      src="/images/carrer/PNG.jpg"
      alt="Intern Academy Logo"
      width={size}
      height={size}
      className="object-contain rounded-md"
    />
  )
}

// ── Steps ────────────────────────────────────────────────────────────────────
const steps = [
  {
    title: "Enroll & Join a Cohort",
    desc: "Pick an offline batch, pay securely, and receive your physical onboarding kit.",
    tagline: "Your journey starts here",
    color: "#0ea5e9",
  },
  {
    title: "Learn by Building",
    desc: "Project-first training with live mentor reviews. Deploy real apps from day one.",
    tagline: "Zero lectures, 100% build",
    color: "#a855f7",
  },
  {
    title: "Land an Internship",
    desc: "Apply to verified roles and track every application stage in real-time.",
    tagline: "Bridge the gap to industry",
    color: "#16a34a",
  },
  {
    title: "Earn a Verified Certificate",
    desc: "Get a QR-verifiable, blockchain-backed certificate employers trust instantly.",
    tagline: "Credentialed excellence",
    color: "#d97706",
  },
]

// ── Image Scenes ────────────────────────────────────────────────────────────
function EnrollScene() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 bg-white">
      <img
        src="/images/carrer/stage1.png"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80"
        }}
        alt="Enroll & Join a Cohort"
        className="max-w-full max-h-[85%] object-contain rounded-2xl shadow-sm border border-slate-100"
      />
    </div>
  )
}

function LearnScene() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 bg-white">
      <img
        src="/images/carrer/stage2.png"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=800&q=80"
        }}
        alt="Learn by Building"
        className="max-w-full max-h-[85%] object-contain rounded-2xl shadow-sm border border-slate-100"
      />
    </div>
  )
}

function InternshipScene() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 bg-white">
      <img
        src="/images/carrer/stage3.png"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80"
        }}
        alt="Land an Internship"
        className="max-w-full max-h-[85%] object-contain rounded-2xl shadow-sm border border-slate-100"
      />
    </div>
  )
}

function CertificateScene() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 bg-white">
      <img
        src="/images/carrer/stage4.png"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
        }}
        alt="Earn a Verified Certificate"
        className="max-w-full max-h-[85%] object-contain rounded-2xl shadow-sm border border-slate-100"
      />
    </div>
  )
}

const SCENES = [EnrollScene, LearnScene, InternshipScene, CertificateScene]
const SCENE_COUNT = 4

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const leftRef = useRef<HTMLDivElement>(null)
  const interactiveBodyRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    container: leftRef
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 24,
    restDelta: 0.001
  })

  const logoX = useTransform(smoothProgress, [0, 0.33, 0.66, 1.0], ["74%", "62%", "48%", "34%"])
  const logoY = useTransform(smoothProgress, [0, 0.33, 0.66, 1.0], ["46%", "65%", "52%", "58%"])
  const logoBorder = useTransform(smoothProgress, [0, 0.33, 0.66, 1.0], ["rgba(14,165,233,0.28)", "rgba(168,85,247,0.28)", "rgba(22,163,74,0.28)", "rgba(217,119,6,0.28)"])
  const scrollbarColor = useTransform(smoothProgress, [0, 0.33, 0.66, 1.0], ["#0ea5e9", "#a855f7", "#16a34a", "#d97706"])

  const handleWheel = useCallback((e: WheelEvent) => {
    const el = leftRef.current
    if (!el) return
    const atTop = el.scrollTop <= 1
    const atBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 2
    if (e.deltaY < 0 && atTop) return
    if (e.deltaY > 0 && atBottom) return
    e.preventDefault()
    el.scrollTop += e.deltaY
  }, [])

  useEffect(() => {
    const bodyEl = interactiveBodyRef.current
    if (!bodyEl) return
    bodyEl.addEventListener("wheel", handleWheel, { passive: false })
    return () => bodyEl.removeEventListener("wheel", handleWheel)
  }, [handleWheel])

  const handleScroll = useCallback(() => {
    const el = leftRef.current
    if (!el) return
    const ratio = el.scrollTop / (el.scrollHeight - el.clientHeight)
    const step = Math.min(SCENE_COUNT - 1, Math.floor(ratio * SCENE_COUNT))
    setActiveStep(step)
  }, [])

  const scrollToStep = (idx: number) => {
    const el = leftRef.current
    if (!el) return
    const perScene = (el.scrollHeight - el.clientHeight) / SCENE_COUNT
    el.scrollTo({ top: idx * perScene, behavior: "smooth" })
  }

  const step = steps[activeStep]

  return (
    <section
      id="how"
      className="scroll-mt-24 bg-white text-slate-900 border-t border-slate-200/80 overflow-hidden"
    >
      {/* ── Section Header ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-6 sm:pb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e0f2fe] px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#004aad]">
              How It Works
            </span>
            <h2 className="mt-2.5 font-montserrat text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#004aad]">
              From Classroom to Career
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm md:text-base font-medium text-slate-600 max-w-xl">
              A structured 4-step pipeline designed to take you from core concepts to a verified tech internship.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#004aad] bg-slate-50 border border-slate-200 px-4 py-2 rounded-full">
            <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
            4-Stage Pathway
          </div>
        </div>
      </div>

      {/* ── DESKTOP VIEW ── */}
      <div
        ref={interactiveBodyRef}
        className="hidden lg:flex w-full h-screen max-h-screen border-t border-slate-100"
      >
        {/* LEFT  scrollable container */}
        <div
          ref={leftRef}
          onScroll={handleScroll}
          className="relative w-[55%] h-screen overflow-y-scroll"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          <div style={{ height: `${SCENE_COUNT * 100}vh` }}>
            <div className="sticky top-0 h-screen w-full flex items-center justify-center">
              {/* Ambient tint background */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  background:
                    activeStep === 0 ? "radial-gradient(circle at 48% 44%, rgba(14,165,233,0.09) 0%, transparent 62%)"
                      : activeStep === 1 ? "radial-gradient(circle at 52% 50%, rgba(168,85,247,0.09) 0%, transparent 62%)"
                        : activeStep === 2 ? "radial-gradient(circle at 46% 54%, rgba(22,163,74,0.09) 0%, transparent 62%)"
                          : "radial-gradient(circle at 50% 44%, rgba(217,119,6,0.09) 0%, transparent 62%)"
                }}
                transition={{ duration: 0.65 }}
              />

              {/* Dot grid */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{ backgroundImage: "radial-gradient(circle, #334155 1px, transparent 1px)", backgroundSize: "26px 26px" }} />

              {/* Sticky Card Frame */}
              <div className="relative w-[88%] h-[84%] rounded-[2.5rem] border border-slate-200 bg-white/90 backdrop-blur-sm shadow-[0_4px_30px_rgba(0,0,0,0.06)] flex items-center justify-center overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[2.5rem]"
                  animate={{ backgroundColor: step.color }}
                  transition={{ duration: 0.4 }}
                />

                {/* Floating Logo */}
                <motion.div
                  className="absolute z-20 pointer-events-none w-14 h-14 -ml-7 -mt-7"
                  style={{
                    left: logoX,
                    top: logoY,
                  }}
                >
                  <motion.div
                    className="w-full h-full rounded-full flex items-center justify-center shadow-lg border-2"
                    style={{
                      backgroundColor: "#ffffff",
                      borderColor: logoBorder,
                    }}
                  >
                    <IALogo size={36} />
                  </motion.div>
                </motion.div>

                {/* Scenes */}
                <div className="absolute inset-0 flex items-center justify-center p-6 xl:p-8">
                  {SCENES.map((Scene, idx) => {
                    const opacity = useTransform(
                      smoothProgress,
                      idx === 0
                        ? [0, 0.22, 0.28]
                        : idx === 1
                          ? [0.2, 0.28, 0.55, 0.62]
                          : idx === 2
                            ? [0.5, 0.62, 0.88, 0.95]
                            : [0.8, 0.95, 1.0],
                      idx === 0
                        ? [1, 1, 0]
                        : idx === 1
                          ? [0, 1, 1, 0]
                          : idx === 2
                            ? [0, 1, 1, 0]
                            : [0, 1, 1]
                    )

                    const translateY = useTransform(
                      smoothProgress,
                      idx === 0
                        ? [0, 0.22, 0.28]
                        : idx === 1
                          ? [0.2, 0.28, 0.55, 0.62]
                          : idx === 2
                            ? [0.5, 0.62, 0.88, 0.95]
                            : [0.8, 0.95, 1.0],
                      idx === 0
                        ? [0, 0, -40]
                        : idx === 1
                          ? [40, 0, 0, -40]
                          : idx === 2
                            ? [40, 0, 0, -40]
                            : [40, 0, 0]
                    )

                    return (
                      <motion.div
                        key={idx}
                        style={{
                          opacity,
                          y: translateY,
                          pointerEvents: activeStep === idx ? "auto" : "none",
                        }}
                        className="absolute inset-0 flex items-center justify-center bg-white"
                      >
                        <Scene />
                      </motion.div>
                    )
                  })}
                </div>

                {/* Left-edge progress scroll bar */}
                <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="w-full rounded-full origin-top"
                    style={{
                      height: "100%",
                      scaleY: smoothProgress,
                      backgroundColor: scrollbarColor,
                    }}
                  />
                </div>

                {/* Step dots */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {steps.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToStep(i)}
                      className="transition-all duration-300 rounded-full"
                      style={{ width: activeStep === i ? 22 : 7, height: 7, backgroundColor: activeStep === i ? s.color : "#cbd5e1" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT  sticky timeline description panel */}
        <div className="w-[45%] h-screen sticky top-0 flex flex-col justify-center px-8 xl:px-12 border-l border-slate-100 bg-white overflow-hidden">
          <div className="mb-8 relative z-10">
            <motion.span
              className="text-xs font-bold uppercase tracking-widest"
              animate={{ color: step.color }}
              transition={{ duration: 0.4 }}
            >
              Step 0{activeStep + 1} of 04
            </motion.span>
            <h2 className="mt-1.5 font-montserrat text-3xl xl:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {step.title}
              <br />
              <motion.span
                className="bg-clip-text text-transparent"
                animate={{ backgroundImage: `linear-gradient(to right, ${step.color}, #475569)` }}
                transition={{ duration: 0.4 }}
              >
                {step.tagline}
              </motion.span>
            </h2>
          </div>

          <div className="relative z-10" style={{ borderLeft: "2px solid #f1f5f9" }}>
            {steps.map((s, idx) => {
              const isActive = activeStep === idx
              return (
                <div
                  key={s.title}
                  className="relative pl-6 xl:pl-7 cursor-pointer"
                  style={{ paddingBottom: idx < steps.length - 1 ? "1.5rem" : 0 }}
                  onClick={() => scrollToStep(idx)}
                >
                  <div className="absolute -left-[9px] top-[3px]">
                    <motion.div
                      animate={{
                        scale: isActive ? 1.3 : 0.9,
                        backgroundColor: isActive ? s.color : "#e2e8f0",
                        boxShadow: isActive ? `0 0 0 4px ${s.color}20` : "none"
                      }}
                      transition={{ duration: 0.28 }}
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    />
                  </div>

                  <motion.div
                    animate={{ opacity: isActive ? 1 : 0.35 }}
                    transition={{ duration: 0.28 }}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all duration-300"
                        style={{
                          borderColor: isActive ? `${s.color}40` : "#e2e8f0",
                          color: isActive ? s.color : "#94a3b8",
                          backgroundColor: isActive ? `${s.color}0e` : "transparent"
                        }}
                      >
                        Step 0{idx + 1}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">{s.tagline}</span>
                    </div>
                    <h3 className="font-montserrat text-base font-bold text-slate-800 mb-0.5 leading-snug">{s.title}</h3>
                    <p className="text-xs xl:text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── MOBILE / TABLET STATIC FLOW ── */}
      <div className="block lg:hidden pb-14 sm:pb-20 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl space-y-6 sm:space-y-8">
          {steps.map((s, idx) => {
            const Scene = SCENES[idx]
            return (
              <div
                key={s.title}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                      style={{ borderColor: `${s.color}30`, color: s.color, backgroundColor: `${s.color}0a` }}
                    >
                      Step 0{idx + 1}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{s.tagline}</span>
                  </div>
                  <h3 className="font-montserrat text-lg sm:text-xl font-bold text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>

                <div className="h-56 sm:h-72 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden relative">
                  <div
                    className="absolute top-3 right-3 z-10 rounded-xl p-1.5 border shadow-xs"
                    style={{ backgroundColor: `${s.color}12`, borderColor: `${s.color}28` }}
                  >
                    <IALogo color={s.color} size={20} />
                  </div>
                  <Scene />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}