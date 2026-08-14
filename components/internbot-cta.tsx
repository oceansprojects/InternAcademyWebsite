"use client"

import Image from "next/image"
import { Bot, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function InternBotCta() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-[#004aad] via-[#0b2f6b] to-[#0f172a] text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
          <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white ring-1 ring-white/10">
                <Sparkles className="size-4" aria-hidden="true" />
                Meet InternBot
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                Your AI guide to the right program & internship
              </h2>
              <p className="mt-4 max-w-md text-slate-200 leading-relaxed">
                Get instant recommendations, course guidance, and answers about admissions,
                fees, and outcomes — all from the InternAcademy website knowledge base.
              </p>
              <a href="#internbot-chat" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100">
                <Bot className="size-4" aria-hidden="true" />
                Chat with InternBot
              </a>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-foreground shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-2.5 border-b border-white/10 pb-3 text-white">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-white/10">
                    <Bot className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">InternBot</p>
                    <p className="flex items-center gap-1.5 text-xs text-slate-300">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      Online
                    </p>
                  </div>
                </div>

                <div className="space-y-3 py-4">
                  <p className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-sm bg-white px-3.5 py-2 text-sm text-slate-900">
                    I want a beginner-friendly tech program. What should I choose?
                  </p>
                  <p className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-white/8 px-3.5 py-2 text-sm text-white">
                    The Full-Stack program is a strong starting point. I can also recommend based on your goals, budget, and timeline.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <input
                    type="text"
                    placeholder="Ask about programs or internships..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-300"
                    aria-label="Message InternBot"
                  />
                  <span className="flex size-8 items-center justify-center rounded-full bg-white text-slate-900">
                    <Send className="size-4" aria-hidden="true" />
                  </span>
                </div>
              </div>
              <Image
                src="/images/bot.png"
                alt=""
                aria-hidden="true"
                width={180}
                height={180}
                className="absolute -bottom-4 -right-4 hidden w-20 animate-float-fast drop-shadow-xl sm:block lg:-right-2 lg:w-26"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
