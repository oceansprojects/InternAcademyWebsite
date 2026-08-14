"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock, Mail, ArrowLeft, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/student/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      setLoading(false);

      if (result?.error) {
        setErrorMsg("Invalid email or password. Please check your credentials.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setLoading(false);
      setErrorMsg("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden grid md:grid-cols-2">
        {/* Left Side: Brand Hero */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-[#004aad] via-[#003c8c] to-[#00b4d8] p-10 text-white relative overflow-hidden">
          {/* Subtle glow elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00d2fd]/20 rounded-full blur-3xl transform -translate-x-20 translate-y-20 pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
              <span className="font-montserrat text-2xl font-extrabold tracking-tight">InternAcademy</span>
            </Link>
            <p className="text-xs text-white/80 font-medium mt-1">Bengaluru Tech & Design Cohorts</p>
          </div>

          {/* Middle Content / Quote */}
          <div className="relative z-10 space-y-6 my-auto py-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#00d2fd] border border-white/10">
              <Sparkles className="size-3.5" />
              <span>Job-Ready Guild Cohorts</span>
            </div>

            <h2 className="font-montserrat text-3xl font-extrabold leading-tight">
              Empowering the next generation of engineers & designers.
            </h2>

            <p className="text-sm text-white/80 leading-relaxed font-normal">
              Access your personalized learning dashboard, view project briefs, track cohort milestones, and connect with industry mentors.
            </p>

            <div className="pt-4 border-t border-white/10 flex items-center gap-3">
              <div className="size-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                IA
              </div>
              <div>
                <p className="text-xs font-bold">Bengaluru Learning Center</p>
                <p className="text-[11px] text-white/70">Koramangala 4th Block</p>
              </div>
            </div>
          </div>

          {/* Bottom Back Link */}
          <div className="relative z-10 pt-4">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="size-3.5" />
              <span>Back to home</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#004aad] block mb-1">Welcome Back</span>
              <h1 className="font-montserrat text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Sign in to your account
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Don't have an account?{" "}
                <Link href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-[#004aad] hover:underline">
                  Create one now
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

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@internacademy.in"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#004aad] focus:ring-[#004aad]" />
                  <span>Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#004aad] hover:bg-[#003c8c] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Social Logins */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Or continue with</p>
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
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <Loader2 className="size-8 animate-spin text-[#004aad] mx-auto" />
        <p className="mt-4 text-sm font-semibold text-slate-600">Loading sign in...</p>
      </div>
    </div>
  );
}