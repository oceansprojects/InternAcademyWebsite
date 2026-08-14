"use client";

import { useActionState, useState } from "react";
import { adminSignIn } from "@/app/actions/auth";
import { Loader2, ShieldCheck, Lock, Mail, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [error, formAction, isPending] = useActionState(adminSignIn, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#004aad]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#00d2fd]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-gradient-to-tr from-[#004aad] to-[#00b4d8] text-white shadow-lg mb-2">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="font-montserrat text-3xl font-extrabold tracking-tight text-white">
            InternAcademy
          </h1>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Administrator Control Center
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/80 p-8 space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-white font-montserrat">Admin Authorization</h2>
            <p className="text-slate-400 text-xs mt-1">
              Enter your elevated credentials to access administrative tools.
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@internacademy.in"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-[#00d2fd] focus:ring-2 focus:ring-[#00d2fd]/20 transition-all text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-[#00d2fd] focus:ring-2 focus:ring-[#00d2fd]/20 transition-all text-white placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold rounded-xl p-3 flex items-center gap-2">
                <span className="text-base">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-[#004aad] to-[#00b4d8] hover:from-[#003c8c] hover:to-[#0096c7] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2 mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Access Admin Control</span>
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
