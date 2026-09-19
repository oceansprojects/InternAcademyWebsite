"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Briefcase,
  Users,
  Plus,
  Clock,
  MapPin,
  Edit2,
  Trash2,
  PowerOff,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import CompanyProfileForm from "@/components/company/CompanyProfileForm";
import OpportunityForm from "@/components/company/OpportunityForm";
import type { CompanyProfile, Opportunity } from "@/types/company";

type DashboardTab = "opportunities" | "profile";

export default function CompanyDashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("profile");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);

  // Action status message
  const [actionMsg, setActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [oppRes, profRes] = await Promise.all([
        fetch("/api/company/opportunities"),
        fetch("/api/company/profile"),
      ]);

      if (oppRes.ok) {
        const data = await oppRes.json();
        setOpportunities(data);
      }

      if (profRes.ok) {
        const profData = await profRes.json();
        setProfile(profData);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleExpire(id: string) {
    if (!confirm("Are you sure you want to mark this opportunity as expired?")) return;

    try {
      const res = await fetch(`/api/company/opportunities/${id}/expire`, {
        method: "PATCH",
      });
      if (res.ok) {
        setActionMsg({ type: "success", text: "Opportunity marked as expired." });
        loadDashboardData();
      }
    } catch (err) {
      setActionMsg({ type: "error", text: "Failed to expire opportunity." });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to permanently delete this opportunity?")) return;

    try {
      const res = await fetch(`/api/company/opportunities/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setActionMsg({ type: "success", text: "Opportunity deleted successfully." });
        setOpportunities((prev) => prev.filter((o) => o.id !== id));
      }
    } catch (err) {
      setActionMsg({ type: "error", text: "Failed to delete opportunity." });
    }
  }

  const activeCount = opportunities.filter((o) => o.status === "active").length;
  const totalApplicants = opportunities.reduce(
    (acc, cur: any) => acc + (parseInt(cur.applicant_count, 10) || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Alert Notice */}
      {actionMsg && (
        <div
          className={`rounded-2xl p-4 flex items-center justify-between text-xs font-semibold animate-fadeIn ${
            actionMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <span>{actionMsg.text}</span>
          <button
            onClick={() => setActionMsg(null)}
            className="text-xs underline hover:opacity-75"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: COMPANY WORKSPACE COMPONENT                                   */}
        {/* ========================================================================= */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-6 lg:sticky lg:top-28">
          {/* Company Workspace Panel */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-5">
            {/* Header Badge */}
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#004aad] text-[11px] font-extrabold uppercase tracking-wider border border-blue-100">
                <Sparkles className="size-3 text-[#004aad]" />
                <span>Company Workspace</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="size-3" />
                <span>Verified</span>
              </span>
            </div>

            {/* Brand Information */}
            <div className="flex items-center gap-3.5 pt-1">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                {profile?.logo_url ? (
                  <img
                    src={profile.logo_url}
                    alt={profile.name || "Company"}
                    className="size-full object-cover"
                  />
                ) : (
                  <Building2 className="size-7 text-slate-500" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-montserrat text-base sm:text-lg font-bold text-slate-900 truncate">
                  {profile?.name || "Company Portal"}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
                  {(profile?.address_city || profile?.address_state) ? (
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="size-3 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {[profile.address_city, profile.address_state].filter(Boolean).join(", ")}
                      </span>
                    </span>
                  ) : (
                    <span className="text-slate-400">Early Access Recruiter</span>
                  )}
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => {
                setEditingOpp(null);
                setIsFormOpen(true);
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#004aad] text-white font-extrabold text-xs shadow-md shadow-blue-600/20 hover:bg-[#003882] active:scale-98 transition-all"
            >
              <Plus className="size-4" />
              <span>Post New Opportunity</span>
            </button>

            {/* Navigation Tabs (Workspace Switcher) */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2 pb-1">
                Workspace Sections
              </span>
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "profile"
                    ? "bg-blue-50 text-[#004aad] shadow-sm font-extrabold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="size-4" />
                  <span>Company Profile</span>
                </div>
                {profile?.website && (
                  <span className="text-[10px] text-slate-400">Configured</span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("opportunities")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "opportunities"
                    ? "bg-blue-50 text-[#004aad] shadow-sm font-extrabold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="size-4" />
                  <span>Opportunities</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    activeTab === "opportunities"
                      ? "bg-[#004aad] text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {opportunities.length}
                </span>
              </button>
            </div>

            {/* Key Workspace Metrics */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2">
                Hiring Telemetry
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-slate-500 font-semibold block">Total</span>
                  <span className="font-montserrat text-lg font-extrabold text-slate-900 block mt-0.5">
                    {opportunities.length}
                  </span>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-150 rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-emerald-700 font-semibold block">Active</span>
                  <span className="font-montserrat text-lg font-extrabold text-emerald-800 block mt-0.5">
                    {activeCount}
                  </span>
                </div>

                <div className="bg-blue-50/70 border border-blue-150 rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-[#004aad] font-semibold block">Applicants</span>
                  <span className="font-montserrat text-lg font-extrabold text-[#004aad] block mt-0.5">
                    {totalApplicants}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: MAIN CONTENT (OPPORTUNITIES / PROFILE FORM)                 */}
        {/* ========================================================================= */}
        <section className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* TAB 1: OPPORTUNITIES VIEW */}
          {activeTab === "opportunities" && (
            <div className="space-y-4">
              {/* Header inside right panel */}
              <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-slate-200/80">
                <div>
                  <h2 className="font-montserrat text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Manage Positions & Internships
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Monitor applicant volume, toggle opportunity statuses, and review submissions.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">
                    {opportunities.length} {opportunities.length === 1 ? "Role" : "Roles"} Posted
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
                    <Loader2 className="size-6 animate-spin text-[#004aad]" />
                    <span>Loading workspace opportunities...</span>
                  </div>
                </div>
              ) : opportunities.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto shadow-sm">
                  <div className="size-16 rounded-2xl bg-blue-50 text-[#004aad] flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="size-8" />
                  </div>
                  <h3 className="font-montserrat text-lg font-bold text-slate-900 mb-2">
                    No Opportunities Posted Yet
                  </h3>
                  <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                    Start recruiting qualified students and interns by publishing your first job opening.
                  </p>
                  <button
                    onClick={() => {
                      setEditingOpp(null);
                      setIsFormOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#004aad] text-white text-xs font-bold hover:bg-[#003882] transition-colors shadow-sm"
                  >
                    <Plus className="size-4" />
                    <span>Post an Opportunity</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {opportunities.map((opp: any) => {
                    const isExpired = opp.status === "expired";
                    return (
                      <div
                        key={opp.id}
                        className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm hover:border-slate-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                isExpired
                                  ? "bg-slate-100 text-slate-500 border-slate-200"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              }`}
                            >
                              {opp.status.toUpperCase()}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#004aad] border border-blue-200">
                              {opp.type.replace("_", " ")}
                            </span>
                            <span className="text-xs text-slate-400">
                              Posted {new Date(opp.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <h3 className="font-montserrat text-lg font-bold text-slate-900">
                            {opp.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3.5 text-slate-400" />
                              {[opp.city, opp.state].filter(Boolean).join(", ") || opp.work_mode}
                            </span>
                            {opp.stipend_salary && (
                              <span className="font-semibold text-slate-700">
                                {opp.stipend_salary}
                              </span>
                            )}
                            {opp.openings && <span>{opp.openings} Openings</span>}
                          </div>

                          {opp.tech_stack && opp.tech_stack.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {opp.tech_stack.map((t: string) => (
                                <span
                                  key={t}
                                  className="text-[10px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200/60"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                          <Link
                            href={`/company/dashboard/opportunities/${opp.id}/applicants`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#004aad] text-xs font-bold transition-colors border border-blue-200"
                          >
                            <Users className="size-4" />
                            <span>Applicants ({opp.applicant_count ?? 0})</span>
                          </Link>

                          <button
                            onClick={() => {
                              setEditingOpp(opp);
                              setIsFormOpen(true);
                            }}
                            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="Edit Opportunity"
                          >
                            <Edit2 className="size-4" />
                          </button>

                          {!isExpired && (
                            <button
                              onClick={() => handleExpire(opp.id)}
                              className="p-2.5 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Expire Opportunity"
                            >
                              <PowerOff className="size-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(opp.id)}
                            className="p-2.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Opportunity"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE FORM VIEW */}
          {activeTab === "profile" && <CompanyProfileForm />}
        </section>
      </div>

      {/* Opportunity Form Modal */}
      {isFormOpen && (
        <OpportunityForm
          initialData={editingOpp}
          onSuccess={(saved) => {
            setIsFormOpen(false);
            setEditingOpp(null);
            setActionMsg({
              type: "success",
              text: `Opportunity "${saved.title}" saved successfully!`,
            });
            loadDashboardData();
          }}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingOpp(null);
          }}
        />
      )}
    </div>
  );
}
