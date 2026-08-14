"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, useSpring, useScroll, useTransform } from "framer-motion"
import { Sparkles } from "lucide-react"

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

// ── Image Scenes using Local Images (with fallback) ──────────────────────────
// Note: We use local routes for generated assets. Copying the generated assets
// to public/images/ will show the custom images. Unsplash is used as fallback.
function EnrollScene() {
  return (
    <div className="w-full h-full flex items-center justify-center p-6 bg-white">
      <img
        src="/images/carrer/stage1.png"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80"
        }}
        alt="Enroll & Join a Cohort"
        className="max-w-full max-h-[85%] object-contain rounded-2xl shadow-md border border-slate-100"
      />
    </div>
  )
}

function LearnScene() {
  return (
    <div className="w-full h-full flex items-center justify-center p-6 bg-white">
      <img
        src="/images/carrer/stage2.png"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=800&q=80"
        }}
        alt="Learn by Building"
        className="max-w-full max-h-[85%] object-contain rounded-2xl shadow-md border border-slate-100"
      />
    </div>
  )
}

function InternshipScene() {
  return (
    <div className="w-full h-full flex items-center justify-center p-6 bg-white">
      <img
        src="/images/carrer/stage3.png"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80"
        }}
        alt="Land an Internship"
        className="max-w-full max-h-[85%] object-contain rounded-2xl shadow-md border border-slate-100"
      />
    </div>
  )
}

function CertificateScene() {
  return (
    <div className="w-full h-full flex items-center justify-center p-6 bg-white">
      <img
        src="/images/carrer/stage4.png"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
        }}
        alt="Earn a Verified Certificate"
        className="max-w-full max-h-[85%] object-contain rounded-2xl shadow-md border border-slate-100"
      />
    </div>
  )
}

const SCENES = [EnrollScene, LearnScene, InternshipScene, CertificateScene]
const SCENE_COUNT = 4

// ── MAIN ──────────────────────────────────────────────────────────────────────
export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const leftRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // useScroll binds directly to the scroll container's raw scroll position
  const { scrollYProgress } = useScroll({
    container: leftRef
  })

  // useSpring smooths the raw scroll value for organic, inertia-rich animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 24,
    restDelta: 0.001
  })

  // Float target positions for logo: mapped to land directly on key parts of the images
  const logoX = useTransform(smoothProgress, [0, 0.33, 0.66, 1.0], ["74%", "62%", "48%", "34%"])
  const logoY = useTransform(smoothProgress, [0, 0.33, 0.66, 1.0], ["46%", "65%", "52%", "58%"])

  // Smooth floating logo visual colors and themes
  const logoColor = useTransform(smoothProgress, [0, 0.33, 0.66, 1.0], ["#0ea5e9", "#a855f7", "#16a34a", "#d97706"])
  const logoBg = useTransform(smoothProgress, [0, 0.33, 0.66, 1.0], ["rgba(14,165,233,0.06)", "rgba(168,85,247,0.06)", "rgba(22,163,74,0.06)", "rgba(217,119,6,0.06)"])
  const logoBorder = useTransform(smoothProgress, [0, 0.33, 0.66, 1.0], ["rgba(14,165,233,0.28)", "rgba(168,85,247,0.28)", "rgba(22,163,74,0.28)", "rgba(217,119,6,0.28)"])
  const scrollbarColor = useTransform(smoothProgress, [0, 0.33, 0.66, 1.0], ["#0ea5e9", "#a855f7", "#16a34a", "#d97706"])

  // Wheel hijack: redirect page scroll into the left column
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
    const sec = sectionRef.current
    if (!sec) return
    sec.addEventListener("wheel", handleWheel, { passive: false })
    return () => sec.removeEventListener("wheel", handleWheel)
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
      ref={sectionRef}
      className="scroll-mt-20 bg-white text-slate-900 border-t border-slate-100 overflow-hidden"
    >
      {/* ── DESKTOP ───────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-full h-screen max-h-screen">

        {/* LEFT — scrollable container, hidden scrollbar */}
        <div
          ref={leftRef}
          onScroll={handleScroll}
          className="relative w-[55%] h-screen overflow-y-scroll"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {/* Hide webkit scrollbar */}
          <style>{`
            #hiw-left::-webkit-scrollbar { display: none; }
          `}</style>

          {/* Tall scroll spacer — 4 steps = 400vh */}
          <div style={{ height: `${SCENE_COUNT * 100}vh` }}>
            {/* Sticky scene frame */}
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
              <div className="relative w-[88%] h-[84%] rounded-[2.5rem] border border-slate-200 bg-white/90 backdrop-blur-sm shadow-[0_2px_28px_rgba(0,0,0,0.07)] flex items-center justify-center overflow-hidden">
                {/* Top accent bar */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[2.5rem]"
                  animate={{ backgroundColor: step.color }}
                  transition={{ duration: 0.4 }}
                />

                {/* ── Continuous Floating Logo — AirPods-style ── */}
                <motion.div
                  className="absolute z-20 pointer-events-none w-16 h-16 -ml-8 -mt-8"
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
                    <IALogo size={44} />
                  </motion.div>
                </motion.div>

                {/* ── Apple-style Stacking Scenes ── */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  {SCENES.map((Scene, idx) => {
                    // Mapped transforms: smooth transition based on continuous spring progress
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

                    const scale = useTransform(
                      smoothProgress,
                      idx === 0
                        ? [0, 0.22, 0.28]
                        : idx === 1
                        ? [0.2, 0.28, 0.55, 0.62]
                        : idx === 2
                        ? [0.5, 0.62, 0.88, 0.95]
                        : [0.8, 0.95, 1.0],
                      idx === 0
                        ? [1, 1, 0.95]
                        : idx === 1
                        ? [0.95, 1, 1, 0.95]
                        : idx === 2
                        ? [0.95, 1, 1, 0.95]
                        : [0.95, 1, 1]
                    )

                    return (
                      <motion.div
                        key={idx}
                        style={{
                          opacity,
                          y: translateY,
                          scale,
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

        {/* RIGHT — sticky timeline description panel */}
        <div className="w-[45%] h-screen sticky top-0 flex flex-col justify-center px-10 xl:px-12 border-l border-slate-100 bg-white overflow-hidden">

          {/* Right ambient glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background:
                activeStep === 0 ? "radial-gradient(circle at 72% 30%, rgba(14,165,233,0.055) 0%, transparent 58%)"
                : activeStep === 1 ? "radial-gradient(circle at 68% 46%, rgba(168,85,247,0.055) 0%, transparent 58%)"
                : activeStep === 2 ? "radial-gradient(circle at 72% 56%, rgba(22,163,74,0.055) 0%, transparent 58%)"
                : "radial-gradient(circle at 70% 36%, rgba(217,119,6,0.055) 0%, transparent 58%)"
            }}
            transition={{ duration: 0.65 }}
          />

          {/* Heading */}
          <div className="mb-8 relative z-10">
            <motion.span
              className="text-[11px] font-bold uppercase tracking-widest"
              animate={{ color: step.color }}
              transition={{ duration: 0.4 }}
            >
              About how it works
            </motion.span>
            <h2 className="mt-1.5 font-montserrat text-[2rem] font-extrabold tracking-tight text-slate-900 leading-tight">
              From classroom to career
              <br />
              <motion.span
                className="bg-clip-text text-transparent"
                animate={{ backgroundImage: `linear-gradient(to right, ${step.color}, #475569)` }}
                transition={{ duration: 0.4 }}
              >
                in four steps
              </motion.span>
            </h2>
          </div>

          {/* Timeline list */}
          <div className="relative z-10" style={{ borderLeft: "2px solid #f1f5f9" }}>
            {steps.map((s, idx) => {
              const isActive = activeStep === idx
              return (
                <div
                  key={s.title}
                  className="relative pl-7 cursor-pointer"
                  style={{ paddingBottom: idx < steps.length - 1 ? "1.6rem" : 0 }}
                  onClick={() => scrollToStep(idx)}
                >
                  {/* Timeline bullet dot */}
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

                  {/* Vertical active trace connector */}
                  {isActive && idx < steps.length - 1 && (
                    <motion.div
                      className="absolute rounded-full"
                      style={{ left: -2, top: 14, width: 2, backgroundColor: s.color, opacity: 0.22 }}
                      initial={{ height: 0 }}
                      animate={{ height: "calc(100%)" }}
                      transition={{ duration: 0.38, delay: 0.08 }}
                    />
                  )}

                  <motion.div
                    animate={{ opacity: isActive ? 1 : 0.32 }}
                    transition={{ duration: 0.28 }}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border transition-all duration-300"
                        style={{
                          borderColor: isActive ? `${s.color}40` : "#e2e8f0",
                          color: isActive ? s.color : "#94a3b8",
                          backgroundColor: isActive ? `${s.color}0e` : "transparent"
                        }}
                      >
                        Step 0{idx + 1}
                      </span>
                      <span className="text-[10px] text-slate-400">{s.tagline}</span>
                    </div>
                    <h3 className="font-montserrat text-[15px] font-bold text-slate-800 mb-0.5 leading-snug">{s.title}</h3>
                    <p className="text-[12px] text-slate-500 leading-relaxed">{s.desc}</p>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── MOBILE STATIC FLOW ──────────────────────────────────────────────── */}
      <div className="block lg:hidden py-14 px-5 bg-slate-50">
        <div className="mb-8 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-sky-500">How it works</span>
          <h2 className="mt-1.5 font-montserrat text-2xl font-extrabold text-slate-900 leading-tight">From classroom to career</h2>
          <p className="text-xs text-slate-500 mt-1.5">4-step pipeline to land a tech internship.</p>
        </div>
        <div className="space-y-8">
          {steps.map((s, idx) => {
            const Scene = SCENES[idx]
            return (
              <div key={s.title} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border"
                      style={{ borderColor: `${s.color}30`, color: s.color, backgroundColor: `${s.color}0a` }}>
                      Step 0{idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-400">{s.tagline}</span>
                  </div>
                  <h3 className="font-montserrat text-base font-bold text-slate-800 mb-1">{s.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
                <div className="h-60 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute top-2.5 right-2.5 z-10 rounded-xl p-1.5 border" style={{ backgroundColor: `${s.color}12`, borderColor: `${s.color}28` }}>
                    <IALogo color={s.color} size={18} />
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