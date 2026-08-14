import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock, ArrowRight, BookOpen, Sparkles, Calendar, User } from "lucide-react";

import { auth } from "@/auth";
import { getProgramBySlug } from "@/services/program.service";
import SiteHeader from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EnrollmentSuccessPage({ params }: Props) {
  const { slug } = await params;

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const program = await getProgramBySlug(slug);

  if (!program) {
    redirect("/courses");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-10 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-6">

          {/* Success Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
            {/* Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#004aad] via-[#003c8c] to-[#00b4d8] p-8 md:p-10 text-white text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00d2fd]/20 rounded-full blur-3xl transform -translate-x-10 translate-y-10 pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="size-20 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="size-10 text-[#00d2fd]" />
                </div>

                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#00d2fd] border border-white/10">
                  <Sparkles className="size-3.5" />
                  <span>Application Received Successfully</span>
                </div>

                <h1 className="font-montserrat text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                  You're In! 🎉
                </h1>
                <p className="text-sm text-white/80 font-normal max-w-sm mx-auto leading-relaxed">
                  Your cohort application has been submitted. Our admissions team will review it shortly.
                </p>
              </div>
            </div>

            {/* Application Details */}
            <div className="p-6 md:p-8 space-y-6">

              <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                <h2 className="font-montserrat text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Application Details
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <BookOpen className="size-3.5 text-slate-400" />Program
                    </span>
                    <span className="font-bold text-slate-900 text-xs text-right max-w-[220px]">{program.title}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <User className="size-3.5 text-slate-400" />Applicant
                    </span>
                    <span className="font-bold text-slate-900 text-xs">{session.user.name}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Application Status</span>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-extrabold uppercase tracking-wider">
                      Pending Review
                    </span>
                  </div>

                  {program.cohort_start && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-slate-400" />Cohort Starts
                      </span>
                      <span className="font-bold text-slate-900 text-xs">
                        {new Date(program.cohort_start).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/60 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-[#004aad] flex items-center justify-center shrink-0">
                    <Clock className="size-4 text-white" />
                  </div>
                  <h3 className="font-montserrat text-sm font-extrabold text-[#004aad]">What Happens Next?</h3>
                </div>

                <ul className="space-y-2.5">
                  {[
                    "Our admissions team will review your academic profile within 24–48 hours.",
                    "You'll receive an email confirmation with your application ID.",
                    "If shortlisted, you'll be called for a brief 10-minute intro call.",
                    "Once approved, you'll receive cohort onboarding details & schedule.",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="size-5 rounded-full bg-[#004aad]/10 text-[#004aad] flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-xs font-medium text-blue-900 leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/student/dashboard"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#004aad] hover:bg-[#003c8c] text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-md hover:shadow-lg"
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  href="/courses"
                  className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-bold px-6 py-3.5 rounded-2xl text-sm hover:bg-slate-50 transition-colors"
                >
                  <BookOpen className="size-4" />
                  <span>Browse More Programs</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}