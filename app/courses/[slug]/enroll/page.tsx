import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import EnrollmentHero from "@/components/enrollment/EnrollmentHero";
import EnrollmentStepper from "@/components/enrollment/EnrollmentStepper";
import ConfirmationStep from "@/components/enrollment/ConfirmationStep";
import StudentProfileForm from "@/components/student/StudentProfileForm";

import { getStudentProfile } from "@/services/student.service";
import { getProgramBySlug } from "@/services/program.service";
import { getEnrollmentByUserAndProgram } from "@/services/enrollment.service";

import SiteHeader from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EnrollPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(
      `/signup?callbackUrl=${encodeURIComponent(`/courses/${slug}/enroll`)}`
    );
  }

  const profile = await getStudentProfile(session.user.id);
  const program = await getProgramBySlug(slug);

  if (!program) {
    redirect("/courses");
  }

  const enrollment = await getEnrollmentByUserAndProgram(
    session.user.id,
    program.id
  );

  // --- Already Enrolled State ---
  if (enrollment) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <SiteHeader />
        <main className="flex-1 py-8 lg:py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-6">
            <EnrollmentHero programTitle={program.title} programCategory={program.category} />
            <EnrollmentStepper currentStep={2} />

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 md:p-10 text-center space-y-6">
              <div className="size-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-10 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h2 className="font-montserrat text-2xl font-extrabold text-slate-900">
                  You're Already Enrolled!
                </h2>
                <p className="text-slate-500 text-sm font-medium max-w-md mx-auto">
                  Your application for <span className="font-bold text-slate-800">{program.title}</span> has already been submitted. Track your status on your dashboard.
                </p>
              </div>

              <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 text-[#004aad] rounded-xl px-5 py-3">
                <span className="text-xs font-bold uppercase tracking-wider">Status:</span>
                <span className="text-xs font-extrabold capitalize">{enrollment.status}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link
                  href="/student/dashboard"
                  className="flex items-center justify-center gap-2 bg-[#004aad] hover:bg-[#003c8c] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md"
                >
                  <span>View Dashboard</span>
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/courses"
                  className="flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl text-sm hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft className="size-4" />
                  <span>Browse More Courses</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const needsProfile = !profile || !profile.profile_completed;

  // --- Profile Step ---
  if (needsProfile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <SiteHeader />
        <main className="flex-1 py-8 lg:py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-6">
            <EnrollmentHero programTitle={program.title} programCategory={program.category} />
            <EnrollmentStepper currentStep={1} />
            <StudentProfileForm />
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // --- Confirmation Step ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-8 lg:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-6">
          <EnrollmentHero programTitle={program.title} programCategory={program.category} />
          <EnrollmentStepper currentStep={2} />
          <ConfirmationStep
            slug={slug}
            profile={profile!}
            program={program}
            user={session.user}
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}