"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signup } from "@/services/auth.api";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2, Lock, Mail, User, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupPageFallback />}>
      <SignupPageContent />
    </Suspense>
  );
}

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/student/dashboard";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!form.name || !form.email || !form.password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match. Please check again.");
      return;
    }

    try {
      setLoading(true);

      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setSuccessMsg("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }, 1500);
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden grid md:grid-cols-2">
        {/* Left Side: Brand Hero */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-[#004aad] via-[#003c8c] to-[#00b4d8] p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00d2fd]/20 rounded-full blur-3xl transform -translate-x-20 translate-y-20 pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
              <span className="font-montserrat text-2xl font-extrabold tracking-tight">InternAcademy</span>
            </Link>
            <p className="text-xs text-white/80 font-medium mt-1">Bengaluru Tech & Design Cohorts</p>
          </div>

          {/* Middle Content */}
          <div className="relative z-10 space-y-6 my-auto py-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#00d2fd] border border-white/10">
              <Sparkles className="size-3.5" />
              <span>Join 2,400+ Active Cohort Students</span>
            </div>

            <h2 className="font-montserrat text-3xl font-extrabold leading-tight">
              Start your outcome-driven tech journey today.
            </h2>

            <ul className="space-y-3 text-xs text-white/90 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#00d2fd]" />
                <span>Hands-on offline cohort labs in Koramangala</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#00d2fd]" />
                <span>Guaranteed 8-week Guild Internship Placement</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#00d2fd]" />
                <span>QR-Verifiable Industry Credentials</span>
              </li>
            </ul>
          </div>

          {/* Bottom Back Link */}
          <div className="relative z-10 pt-4">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="size-3.5" />
              <span>Back to home</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#004aad] block mb-1">Get Started</span>
              <h1 className="font-montserrat text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Create your student account
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Already have an account?{" "}
                <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-[#004aad] hover:underline">
                  Sign in instead
                </Link>
              </p>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl p-3.5 flex items-start gap-2.5 animate-in fade-in">
                <span className="shrink-0 text-base">⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Alert */}
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl p-3.5 flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Alex Morgan"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="alex@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#004aad] hover:bg-[#003c8c] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create Free Account</span>
                )}
              </button>
            </form>

            {/* Social Logins */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Or sign up with</p>
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl })}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <svg className="size-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignupPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <Loader2 className="size-8 animate-spin text-[#004aad] mx-auto" />
        <p className="mt-4 text-sm font-semibold text-slate-600">Loading sign up...</p>
      </div>
    </div>
  );
}