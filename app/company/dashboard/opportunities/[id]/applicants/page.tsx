"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
  Calendar,
  Sparkles,
  User,
} from "lucide-react";
import type { ApplicantWithProfile, Opportunity } from "@/types/company";
import ApplicantProfileModal from "@/components/company/ApplicantProfileModal";

export default function OpportunityApplicantsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [applicants, setApplicants] = useState<ApplicantWithProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        const [oppRes, appRes] = await Promise.all([
          fetch(`/api/opportunities/${id}`),
          fetch(`/api/company/opportunities/${id}/applicants`),
        ]);

        if (oppRes.ok) {
          try {
            const oppData = await oppRes.json();
            setOpportunity(oppData);
          } catch {}
        }

        if (!appRes.ok) {
          let msg = "Failed to load applicants";
          try {
            const errData = await appRes.json();
            msg = errData.error || msg;
          } catch {}
          throw new Error(msg);
        }

        const applicantsData = await appRes.json();
        setApplicants(applicantsData);
      } catch (err: any) {
        setError(err.message || "Failed to load applicants.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
          <Loader2 className="size-6 animate-spin text-[#004aad]" />
          <span>Loading applicants...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link
            href="/company/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#004aad] transition-colors mb-2"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="font-montserrat text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Candidates & Applicants</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#004aad] border border-blue-200">
              {applicants.length} Total
            </span>
          </h1>
          {opportunity && (
            <p className="text-xs text-slate-500 mt-0.5">
              Reviewing applications for <strong className="text-slate-800">{opportunity.title}</strong>
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex items-center gap-3 text-rose-800 text-xs font-semibold">
          <AlertCircle className="size-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Applicants List */}
      {applicants.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto">
          <div className="size-16 rounded-2xl bg-blue-50 text-[#004aad] flex items-center justify-center mx-auto mb-4">
            <Users className="size-8" />
          </div>
          <h3 className="font-montserrat text-lg font-bold text-slate-900 mb-2">
            No Applications Yet
          </h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Candidates who apply to this opportunity will appear here with their verified professional profile, skills, and resume.
          </p>
          <Link
            href="/company/dashboard"
            className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {applicants.map((app) => (
            <div
              key={app.id}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm hover:border-slate-300 transition-colors space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Student Info */}
                <div className="flex items-start gap-4">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 text-[#004aad] flex items-center justify-center font-bold text-lg overflow-hidden shrink-0">
                    {app.profile_photo_url ? (
                      <img
                        src={app.profile_photo_url}
                        alt={app.student_name || "Student"}
                        className="size-full object-cover"
                      />
                    ) : (
                      (app.student_name || "S")[0].toUpperCase()
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-montserrat text-lg font-bold text-slate-900">
                        {app.full_name || app.student_name || "Applicant"}
                      </h3>
                      {app.years_experience && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {app.years_experience} yrs exp
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      {(app.student_email) && (
                        <a
                          href={`mailto:${app.student_email}`}
                          className="flex items-center gap-1 hover:text-[#004aad]"
                        >
                          <Mail className="size-3.5 text-slate-400" />
                          <span>{app.student_email}</span>
                        </a>
                      )}
                      {app.phone_number && (
                        <a
                          href={`tel:${app.phone_number}`}
                          className="flex items-center gap-1 hover:text-[#004aad]"
                        >
                          <Phone className="size-3.5 text-slate-400" />
                          <span>{app.phone_number}</span>
                        </a>
                      )}
                      {(app.address_city || app.address_state) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3.5 text-slate-400" />
                          <span>
                            {[app.address_city, app.address_state].filter(Boolean).join(", ")}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Resume & Applied Date */}
                <div className="flex flex-col sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setSelectedUserId(app.user_id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-blue-50 text-[#004aad] hover:bg-blue-100 border border-blue-200 shadow-sm transition-colors"
                    >
                      <User className="size-3.5" />
                      <span>View Profile</span>
                    </button>

                    {app.resume_url ? (
                      <a
                        href={
                          app.resume_url.startsWith("http")
                            ? app.resume_url
                            : `https://${app.resume_url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-[#004aad] text-white hover:bg-[#003882] shadow-sm transition-colors"
                      >
                        <FileText className="size-3.5" />
                        <span>View Resume</span>
                        <ExternalLink className="size-3 ml-0.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No resume attached</span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="size-3" />
                    <span>Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>

              {/* Education & Academic Details */}
              {(app.college_name || app.degree) && (
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-150">
                  <GraduationCap className="size-4 text-slate-500 shrink-0" />
                  <span>
                    {[app.degree, app.college_name].filter(Boolean).join(" • ")}
                  </span>
                </div>
              )}

              {/* Skills / Tech Stack */}
              {app.tech_stack && app.tech_stack.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Skills & Tech Stack
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {app.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#004aad] border border-blue-100"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Comprehensive Profile Modal */}
      {selectedUserId && (
        <ApplicantProfileModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}
