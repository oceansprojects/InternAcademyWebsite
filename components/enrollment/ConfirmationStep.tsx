"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEnrollment } from "@/services/enrollment.api";
import {
  Loader2,
  CheckCircle2,
  BookOpen,
  Clock,
  MapPin,
  Calendar,
  User,
  GraduationCap,
  Building,
  Phone,
  BadgeIndianRupee,
  AlertCircle,
} from "lucide-react";

interface Props {
  slug: string;
  program: any;
  profile: any;
  user: {
    name?: string | null;
    email?: string | null;
  };
}

function inr(n: number) {
  return "₹" + (n || 0).toLocaleString("en-IN");
}

export default function ConfirmationStep({ slug, program, profile, user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function submit() {
    if (!confirmed) {
      toast.warning("Please check the confirmation box before submitting.");
      return;
    }

    try {
      setLoading(true);
      await createEnrollment(slug);
      router.push(`/courses/${slug}/enroll/success`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-1">
        <h2 className="font-montserrat text-xl sm:text-2xl font-extrabold text-slate-900">
          Application Summary
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Please verify all information carefully before submitting your cohort application.
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Program Details Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="size-9 rounded-xl bg-blue-50 text-[#004aad] flex items-center justify-center shrink-0">
              <BookOpen className="size-4.5" />
            </div>
            <div>
              <h3 className="font-montserrat text-sm font-extrabold text-slate-900">Program Details</h3>
              <p className="text-[11px] text-slate-500 font-medium">Your selected cohort</p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Program</span>
              <span className="font-bold text-slate-900 text-xs text-right">{program.title}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="size-3.5 text-slate-400" />Duration
              </span>
              <span className="font-bold text-slate-800 text-xs">{program.duration_weeks} Weeks</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="size-3.5 text-slate-400" />Mode
              </span>
              <span className="font-bold text-slate-800 text-xs capitalize">{program.batch_mode}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <BadgeIndianRupee className="size-3.5 text-slate-400" />Program Fee
              </span>
              <span className="font-extrabold text-emerald-700 text-sm">
                {inr(program.discounted_price)}
              </span>
            </div>

            {program.cohort_start && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-slate-400" />Starts On
                </span>
                <span className="font-bold text-slate-800 text-xs">
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

        {/* Student Details Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="size-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <User className="size-4.5" />
            </div>
            <div>
              <h3 className="font-montserrat text-sm font-extrabold text-slate-900">Student Details</h3>
              <p className="text-[11px] text-slate-500 font-medium">Your academic information</p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="size-3.5 text-slate-400" />Name
              </span>
              <span className="font-bold text-slate-900 text-xs">{user.name}</span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Email</span>
              <span className="font-semibold text-slate-700 text-xs text-right break-all">{user.email}</span>
            </div>

            {profile?.college_name && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="size-3.5 text-slate-400" />College
                </span>
                <span className="font-bold text-slate-800 text-xs text-right max-w-[160px] truncate">{profile.college_name}</span>
              </div>
            )}

            {profile?.degree && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="size-3.5 text-slate-400" />Degree
                </span>
                <span className="font-bold text-slate-800 text-xs">{profile.degree}</span>
              </div>
            )}

            {profile?.branch && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Branch</span>
                <span className="font-bold text-slate-800 text-xs">{profile.branch}</span>
              </div>
            )}

            {profile?.current_year && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Year</span>
                <span className="font-bold text-slate-800 text-xs">Year {profile.current_year}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation + Submit */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5">
        {/* Confirmation Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="peer size-4.5 border-2 border-slate-300 rounded appearance-none checked:bg-[#004aad] checked:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all cursor-pointer"
            />
            <CheckCircle2 className="absolute inset-0 size-4.5 text-white hidden peer-checked:block pointer-events-none" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 group-hover:text-[#004aad] transition-colors">
              I confirm that all the above information is accurate and correct.
            </p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              By submitting, you agree to be contacted by our admissions team within 24–48 hours.
            </p>
          </div>
        </label>

        {!confirmed && (
          <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <AlertCircle className="size-4 shrink-0" />
            <p className="text-xs font-semibold">Please review and confirm your information above before submitting.</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={submit}
          disabled={loading || !confirmed}
          className="w-full bg-[#004aad] hover:bg-[#003c8c] text-white font-bold py-4 rounded-2xl text-sm transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              <span>Submitting Application...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="size-5" />
              <span>Submit Application</span>
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-slate-400 font-medium">
          Your enrollment application will be reviewed by our admissions team.
        </p>
      </div>
    </div>
  );
}