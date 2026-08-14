"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { X, Send, Loader2 } from "lucide-react"
import { FormattedMessage } from "@/components/formatted-message"

type ChatMessage = {
  id: number
  role: "user" | "assistant"
  text: string
}

const starterMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    text: "Hi! I'm InternBot. I can guide you through InternAcademy courses, internships, fees, and admissions.",
  },
]

export function InternBotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, open, loading])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const userMessage: ChatMessage = { id: Date.now(), role: "user", text: trimmed }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      })

      const data = await response.json()
      const replyText = data?.answer || "I’m not able to help with that beyond InternAcademy website topics."

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: replyText,
        },
      ])
    } catch (error) {
      console.error("InternBot message error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "assistant",
          text: "I’m currently unavailable. Please try again in a moment.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[92vw] max-w-sm overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] ring-1 ring-slate-100">
          <div className="flex items-center gap-2.5 bg-linear-to-r from-[#004aad] to-[#0f172a] px-4 py-3 text-white">
            <span className="flex size-8 items-center justify-center">
              <Image
                src="/images/bot.png"
                alt=""
                aria-hidden="true"
                width={32}
                height={32}
                className="size-8 object-contain"
              />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">InternBot</p>
              <p className="text-[11px] text-white/75">AI guide for programs & internships</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex size-7 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10"
            >
              <X className="size-4" />
            </button>
          </div>

          <div ref={scrollRef} className="max-h-85 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                    message.role === "user"
                      ? "rounded-br-sm bg-[#004aad] text-white font-sans"
                      : "rounded-tl-sm border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {message.role === "user" ? (
                    message.text
                  ) : (
                    <FormattedMessage content={message.text} role="assistant" />
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 shadow-sm">
                  <Loader2 className="size-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-3">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage()
              }}
              placeholder="Ask about internships, programs, fees..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#004aad] focus:bg-white"
              aria-label="Message InternBot"
              disabled={loading}
            />
            <button
              type="button"
              onClick={sendMessage}
              aria-label="Send message"
              disabled={loading || !input.trim()}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#004aad] text-white transition hover:bg-[#003d96] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close InternBot" : "Open InternBot"}
        className="relative transition-transform hover:scale-105 active:scale-95 focus:outline-none"
      >
        {open ? (
          <div className="flex size-12 items-center justify-center rounded-full bg-[#004aad] text-white shadow-xl ring-4 ring-white/80">
            <X className="size-6" />
          </div>
        ) : (
          <div className="relative flex size-16 items-center justify-center">
            <Image
              src="/images/bot.png"
              alt="InternBot"
              width={64}
              height={64}
              className="size-16 object-contain"
            />
          </div>
        )}
      </button>
    </div>
  )
}
