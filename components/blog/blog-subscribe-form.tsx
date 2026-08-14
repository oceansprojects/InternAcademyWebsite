"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Mail, Info } from "lucide-react";

export function BlogSubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setStatus("error");
      setErrorMessage("Please enter your email address.");
      return;
    }

    // Basic frontend format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.message || "Failed to subscribe. Please try again later.");
        return;
      }

      if (data.code === "ALREADY_SUBSCRIBED") {
        setStatus("duplicate");
        setSuccessMessage(data.message || "You are already subscribed to our blog updates.");
      } else {
        setStatus("success");
        setSuccessMessage(data.message || "Thank you for subscribing! Check your inbox soon.");
        setEmail("");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Mail className="size-4" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== "idle" && status !== "loading") {
                setStatus("idle");
              }
            }}
            placeholder="Enter your work or personal email"
            disabled={status === "loading"}
            className={`
              w-full bg-white border rounded-full pl-11 pr-4 py-3.5 text-sm text-slate-900 
              placeholder:text-slate-400 outline-none transition-all font-inter shadow-sm
              ${
                status === "error"
                  ? "border-red-500 ring-2 ring-red-500/10 focus:border-red-500"
                  : status === "success" || status === "duplicate"
                  ? "border-emerald-500 ring-2 ring-emerald-500/10"
                  : "border-slate-300 focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20"
              }
              disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            `}
            aria-label="Email address"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className={`
            w-full sm:w-auto shrink-0 bg-[#004aad] hover:bg-[#003882] text-white font-montserrat font-bold 
            text-sm px-7 py-3.5 rounded-full transition-all shadow-md shadow-[#004aad]/20 active:scale-[0.98]
            disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 select-none
          `}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Subscribing...</span>
            </>
          ) : (
            <span>Subscribe</span>
          )}
        </button>
      </form>

      {/* State Banners / Feedback Messages */}
      <div className="mt-3 min-h-[24px]">
        {status === "error" && (
          <div className="flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200/80 px-4 py-2.5 rounded-xl animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-4 py-2.5 rounded-xl animate-in fade-in slide-in-from-top-1 duration-200">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {status === "duplicate" && (
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-4 py-2.5 rounded-xl animate-in fade-in slide-in-from-top-1 duration-200">
            <Info className="size-4 shrink-0 text-blue-600" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
