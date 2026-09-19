"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { InternBotWidget } from "@/components/internbot-widget";
import {
  Building2,
  MapPin,
  Briefcase,
  Clock,
  Banknote,
  Users,
  Calendar,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";
import type { Opportunity } from "@/types/company";

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();

  const id = params?.id as string;

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Apply flow state
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [incompleteMissing, setIncompleteMissing] = useState<string[] | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadOpportunity() {
      try {
        const res = await fetch(`/api/opportunities/${id}`);
        if (!res.ok) throw new Error("Opportunity not found");
        const data = await res.json();
        setOpportunity(data);
      } catch (err: any) {
        setError(err.message || "Failed to load opportunity");
      } finally {
        setLoading(false);
      }
    }

    loadOpportunity();
  }, [id]);

  useEffect(() => {
    if (!id || authStatus !== "authenticated") return;

    async function checkApplied() {
      try {
        const res = await fetch(`/api/opportunities/${id}/apply`);
        if (res.ok) {
          const data = await res.json();
          if (data.applied) {
            setHasApplied(true);
          }
        }
      } catch (err) {
        console.error("Check applied error:", err);
      }
    }

    checkApplied();
  }, [id, authStatus]);

  async function handleApply() {
    if (authStatus === "unauthenticated") {
      router.push(`/login?callbackUrl=/jobs/${id}`);
      return;
    }

    setApplying(true);
    setApplyError(null);
    setIncompleteMissing(null);

    try {
      const res = await fetch(`/api/opportunities/${id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (res.status === 422 && data.code === "PROFILE_INCOMPLETE") {
        setIncompleteMissing(data.missing || []);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setApplySuccess(true);
      setHasApplied(true);
    } catch (err: any) {
      setApplyError(err.message || "Something went wrong. Please try again.");
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center pt-26 sm:pt-28 pb-24">
          <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
            <Loader2 className="size-6 animate-spin text-[#004aad]" />
            <span>Loading opportunity details...</span>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <SiteHeader />
        <div className="flex-1 max-w-xl mx-auto px-4 pt-26 sm:pt-28 pb-20 text-center">
          <div className="size-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="size-8" />
          </div>
          <h2 className="font-montserrat text-2xl font-bold text-slate-900 mb-2">
            Opportunity Not Found
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            The job or internship opportunity you are looking for might have expired or been removed.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-[#004aad] text-white"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Opportunities</span>
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const isExpired =
    opportunity.status === "expired" ||
    (opportunity.application_deadline &&
      new Date(opportunity.application_deadline) < new Date());

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-26 sm:pt-28 pb-12 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/jobs" className="hover:text-[#004aad] transition-colors flex items-center gap-1">
            <ArrowLeft className="size-3.5" />
            <span>All Opportunities</span>
          </Link>
          <span>/</span>
          <span className="text-slate-800 truncate max-w-xs">{opportunity.title}</span>
        </div>

        {/* Incomplete Profile Alert Modal / Banner */}
        {incompleteMissing && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-5 shadow-sm transition-all animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="size-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-amber-900 mb-1">
                  Complete Your Profile First Before Applying
                </h3>
                <p className="text-xs text-amber-700 mb-3">
                  To ensure quality applications, the company requires candidates to have filled out their core professional profile details. Missing fields:
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {incompleteMissing.map((field) => (
                    <span
                      key={field}
                      className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-800 border border-amber-300"
                    >
                      {field}
                    </span>
                  ))}
                </div>
                <Link
                  href="/student/profile"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold px-4 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition-colors"
                >
                  <span>Complete Profile Now</span>
                  <ChevronRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Application Success Banner */}
        {applySuccess && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 flex items-center gap-3">
            <CheckCircle2 className="size-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-emerald-900">Application Submitted!</h4>
              <p className="text-xs text-emerald-700">
                Your professional profile and details were successfully sent to the company.
              </p>
            </div>
          </div>
        )}

        {/* Header Hero Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="size-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                {opportunity.company_logo_url ? (
                  <img
                    src={opportunity.company_logo_url}
                    alt={opportunity.company_name || "Company"}
                    className="size-full object-cover"
                  />
                ) : (
                  <Building2 className="size-10 text-slate-500" />
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-extrabold text-[#004aad] uppercase tracking-wider">
                    {opportunity.company_name || "Company"}
                  </span>
                  {opportunity.company_website && (
                    <a
                      href={
                        opportunity.company_website.startsWith("http")
                          ? opportunity.company_website
                          : `https://${opportunity.company_website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <ExternalLink className="size-3" />
                      <span>Website</span>
                    </a>
                  )}
                </div>

                <h1 className="font-montserrat text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {opportunity.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 font-medium text-slate-700">
                    <Briefcase className="size-3.5 text-slate-500" />
                    {opportunity.work_mode.replace("_", " ").toUpperCase()}
                  </span>
                  {(opportunity.city || opportunity.state) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 font-medium text-slate-700">
                      <MapPin className="size-3.5 text-slate-500" />
                      {[opportunity.city, opportunity.state].filter(Boolean).join(", ")}
                    </span>
                  )}
                  {opportunity.years_experience && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 font-medium text-slate-700">
                      <Clock className="size-3.5 text-slate-500" />
                      {opportunity.years_experience} years exp
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Apply Action Card */}
            <div className="shrink-0 flex flex-col sm:items-end gap-2 border-t md:border-t-0 pt-4 md:pt-0">
              {hasApplied ? (
                <button
                  disabled
                  className="px-6 py-3 rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center gap-2 cursor-default border border-emerald-300"
                >
                  <CheckCircle2 className="size-4" />
                  <span>Applied</span>
                </button>
              ) : isExpired ? (
                <button
                  disabled
                  className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-400 font-bold text-sm cursor-not-allowed border border-slate-200"
                >
                  Opportunity Expired
                </button>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="px-8 py-3.5 rounded-2xl bg-[#004aad] text-white font-extrabold text-sm hover:bg-[#003882] shadow-lg shadow-blue-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {applying ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Checking Profile...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      <span>Apply Now</span>
                    </>
                  )}
                </button>
              )}

              {applyError && (
                <p className="text-xs text-rose-600 font-semibold max-w-xs text-right">
                  {applyError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="font-montserrat text-lg font-bold text-slate-900">
                Job Overview & Description
              </h2>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {opportunity.description || "No specific description provided."}
              </div>
            </div>

            {/* Role & Requirements */}
            {opportunity.role && (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="font-montserrat text-lg font-bold text-slate-900">
                  Role Responsibilities & Focus
                </h2>
                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {opportunity.role}
                </div>
              </div>
            )}

            {/* Tech Stack Required */}
            {opportunity.tech_stack && opportunity.tech_stack.length > 0 && (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="font-montserrat text-lg font-bold text-slate-900">
                  Required Skills & Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {opportunity.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#004aad] font-bold text-xs border border-blue-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Selection Process */}
            {opportunity.selection_process && (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="font-montserrat text-lg font-bold text-slate-900">
                  Selection Process
                </h2>
                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {opportunity.selection_process}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (1 Col) */}
          <div className="space-y-6">
            {/* Highlights Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
              <h3 className="font-montserrat text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
                Opportunity Highlights
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Banknote className="size-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Stipend / Salary
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {opportunity.stipend_salary || "Disclosed on review"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-blue-50 text-[#004aad] flex items-center justify-center shrink-0">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Openings
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {opportunity.openings ? `${opportunity.openings} Positions` : "Multiple Openings"}
                    </span>
                  </div>
                </div>

                {opportunity.application_deadline && (
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Calendar className="size-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Application Deadline
                      </span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {new Date(opportunity.application_deadline).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Clock className="size-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Posted Date
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {new Date(opportunity.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                {hasApplied ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-xs font-bold text-emerald-800">
                      ✓ You have already applied
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying || isExpired}
                    className="w-full py-3 rounded-xl bg-[#004aad] text-white font-bold text-xs hover:bg-[#003882] transition-colors shadow-sm disabled:opacity-60"
                  >
                    {isExpired ? "Opportunity Closed" : "Apply for this Role"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
      <InternBotWidget />
    </div>
  );
}
