"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface FormattedMessageProps {
  content: string
  role?: "user" | "assistant"
}

export function FormattedMessage({ content, role = "assistant" }: FormattedMessageProps) {
  if (role === "user") {
    return <div className="whitespace-pre-wrap font-sans">{content}</div>
  }

  return (
    <div className="text-sm leading-relaxed font-sans text-slate-800 space-y-1.5 overflow-hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-1.5 last:mb-0 leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
          ul: ({ children }) => <ul className="my-1.5 ml-4 list-disc space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="my-1.5 ml-4 list-decimal space-y-1">{children}</ol>,
          li: ({ children }) => <li className="leading-snug">{children}</li>,
          h1: ({ children }) => <h1 className="my-2 text-base font-bold text-slate-900">{children}</h1>,
          h2: ({ children }) => <h2 className="my-1.5 text-sm font-bold text-slate-900">{children}</h2>,
          h3: ({ children }) => <h3 className="my-1 text-sm font-semibold text-slate-900">{children}</h3>,
          table: ({ children }) => (
            <div className="my-2.5 w-full overflow-x-auto rounded-xl border border-slate-200 shadow-xs max-w-full">
              <table className="w-full text-left text-xs border-collapse min-w-max">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100 text-slate-900 font-semibold border-b border-slate-200">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100 bg-white">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="transition-colors hover:bg-slate-50/80 even:bg-slate-50/40">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 font-semibold text-slate-900 border-r last:border-r-0 border-slate-200 whitespace-nowrap bg-slate-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-slate-700 border-r last:border-r-0 border-slate-100 whitespace-nowrap">
              {children}
            </td>
          ),
          code: ({ children }) => (
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-slate-800">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
