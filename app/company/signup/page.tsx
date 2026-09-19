"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Loader2, Lock, Mail, User, Building2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function CompanySignupPage() {
  return (
    <Suspense fallback={<SignupFallback />}>
      <CompanySignupContent />
    </Suspense>
  );
}

function CompanySignupContent() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!form.name || !form.companyName || !form.email || !form.password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    if (form.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/company/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          companyName: form.companyName,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed.");

      setSuccessMsg("Company registered! Redirecting to sign in...");
      setTimeout(() => router.push("/company/login"), 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 lg:p-8">
      <img
        src="/auth-bg.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-50"
      />
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden grid md:grid-cols-2">

        {/* Left: Brand panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-[#004aad] via-[#003c8c] to-[#00b4d8] p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00d2fd]/20 rounded-full blur-3xl transform -translate-x-20 translate-y-20 pointer-events-none" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
              <span className="font-montserrat text-2xl font-extrabold tracking-tight">InternAcademy</span>
            </Link>
            <p className="text-xs text-white/80 font-medium mt-1">Bengaluru Tech &amp; Design Cohorts</p>
          </div>

          <div className="relative z-10 space-y-6 my-auto py-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#00d2fd] border border-white/10">
              <Building2 className="size-3.5" />
              <span>Free Company Registration</span>
            </div>
            <h2 className="font-montserrat text-3xl font-extrabold leading-tight">
              Hire from Bengaluru&apos;s top student cohorts.
            </h2>
            <ul className="space-y-3 text-xs text-white/90 font-medium">
              {[
                "Post jobs & internships for free",
                "Review student professional profiles",
                "Filter by tech stack & experience",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[#00d2fd] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 pt-4">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="size-3.5" />
              <span>Back to home</span>
            </Link>
          </div>
        </div>

        {/* Right: Form */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#004aad] block mb-1">Get Started</span>
              <h1 className="font-montserrat text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Register your company
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Already registered?{" "}
                <Link href="/company/login" className="font-semibold text-[#004aad] hover:underline">
                  Sign in instead
                </Link>
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl p-3.5 flex items-start gap-2.5">
                <span className="shrink-0 text-base">⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl p-3.5 flex items-center gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Your Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input
                    type="text" required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Priya Sharma"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input
                    type="text" required
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    placeholder="Acme Technologies Pvt. Ltd."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input
                    type="email" required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="hr@yourcompany.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input
                    type="password" required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input
                    type="password" required
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#004aad] hover:bg-[#003c8c] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <><Loader2 className="size-4 animate-spin" /><span>Registering...</span></>
                ) : (
                  <span>Register Company</span>
                )}
              </button>
            </form>

            {/* Google Social Sign Up */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Or continue with</p>
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/company/dashboard" })}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <svg className="size-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign up with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignupFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <Loader2 className="size-8 animate-spin text-[#004aad] mx-auto" />
        <p className="mt-4 text-sm font-semibold text-slate-600">Loading...</p>
      </div>
    </div>
  );
}
