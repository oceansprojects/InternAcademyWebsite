"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Briefcase,
  Award,
  FileText,
  Clock,
  ExternalLink,
  CheckCircle2,
  Download,
  Laptop,
  MapPin,
  Calendar,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface StudentDashboardTabsProps {
  enrollments: any[];
  certificates: any[];
  jobApplications: any[];
  stats: {
    applications: number;
    jobApplicationsCount?: number;
    activePrograms: number;
    certificates: number;
    hoursLearned: number;
  };
}

function inr(n: number) {
  return "₹" + (n || 0).toLocaleString("en-IN");
}

export default function StudentDashboardTabs({
  enrollments,
  certificates,
  jobApplications,
  stats,
}: StudentDashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<"courses" | "job-applications">("courses");

  return (
    <div className="space-y-8">
      {/* ── Two Full-Width Tab Buttons directly below blue banner ── */}
      <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-1.5 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          {/* Courses Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("courses")}
            className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm md:text-base font-bold transition-all relative ${
              activeTab === "courses"
                ? "bg-blue-50/80 text-[#004aad] shadow-sm border-b-2 border-[#004aad]"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <BookOpen className={`size-4 md:size-5 ${activeTab === "courses" ? "text-[#004aad]" : "text-slate-400"}`} />
            <span>Courses</span>
          </button>

          {/* Job Applications Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("job-applications")}
            className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm md:text-base font-bold transition-all relative ${
              activeTab === "job-applications"
                ? "bg-blue-50/80 text-[#004aad] shadow-sm border-b-2 border-[#004aad]"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Briefcase className={`size-4 md:size-5 ${activeTab === "job-applications" ? "text-[#004aad]" : "text-slate-400"}`} />
            <span>Job Applications</span>
            {jobApplications.length > 0 && (
              <span className="ml-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-[#004aad]">
                {jobApplications.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Tab 1 Content: Courses (Active by default) ── */}
      {activeTab === "courses" && (
        <div className="space-y-8 animate-fadeIn">
          {/* 4 Summary Stats Cards matching reference */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="size-12 rounded-xl bg-blue-50 text-[#004aad] flex items-center justify-center shrink-0 font-bold">
                <BookOpen className="size-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Enrolled Cohorts</p>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-montserrat mt-0.5">
                  {stats.activePrograms}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="size-12 rounded-xl bg-cyan-50 text-[#00677e] flex items-center justify-center shrink-0 font-bold">
                <FileText className="size-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Applications</p>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-montserrat mt-0.5">
                  {stats.applications}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="size-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
                <Award className="size-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Certificates</p>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-montserrat mt-0.5">
                  {stats.certificates}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="size-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                <Clock className="size-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Learning Hours</p>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-montserrat mt-0.5">
                  {stats.hoursLearned}h
                </p>
              </div>
            </div>
          </div>

          {/* Main Grid: Enrolled Courses (2/3) + Issued Credentials (1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: My Enrolled Courses */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="font-montserrat text-xl font-extrabold text-slate-900">My Enrolled Courses</h2>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Access your active cohorts, modules, and schedule</p>
                  </div>
                  <span className="bg-blue-50 text-[#004aad] text-xs font-bold px-3 py-1 rounded-full">
                    {enrollments.length} {enrollments.length === 1 ? "Course" : "Courses"}
                  </span>
                </div>

                {enrollments.length === 0 ? (
                  <div className="py-16 text-center space-y-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8">
                    <div className="size-16 rounded-full bg-blue-100 text-[#004aad] flex items-center justify-center mx-auto">
                      <BookOpen className="size-8" />
                    </div>
                    <div className="max-w-md mx-auto space-y-1">
                      <h3 className="font-montserrat text-lg font-bold text-slate-800">No active enrollments yet</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        You haven't enrolled in any educational programs yet. Browse our top-rated offline cohorts in CSN and start learning!
                      </p>
                    </div>
                    <Link
                      href="/courses"
                      className="inline-flex items-center gap-2 bg-[#004aad] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#003c8c] transition-all shadow-md"
                    >
                      <span>Browse Available Cohorts</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrollments.map((item: any) => {
                      const progress = item.status === "completed" ? 100 : item.status === "active" ? 60 : 15;
                      return (
                        <div
                          key={item.id}
                          className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#004aad]/40 hover:shadow-md transition-all space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              {item.card_image_url ? (
                                <img
                                  src={item.card_image_url}
                                  alt={item.title}
                                  className="size-14 rounded-xl object-cover border border-slate-200 shrink-0 hidden sm:block"
                                />
                              ) : (
                                <div className="size-14 rounded-xl bg-blue-50 text-[#004aad] border border-blue-100 flex items-center justify-center shrink-0 hidden sm:flex">
                                  <Laptop className="size-6" />
                                </div>
                              )}

                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-bold text-slate-500">
                                    Batch 1
                                  </span>
                                  <span className="text-slate-300">·</span>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold capitalize ${
                                      item.status === "active" || item.status === "approved"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : item.status === "completed"
                                          ? "bg-blue-50 text-[#004aad] border border-blue-200"
                                          : "bg-amber-50 text-amber-700 border border-amber-200"
                                    }`}
                                  >
                                    {item.status === "active" ? "In Progress" : item.status || "Enrolled"}
                                  </span>
                                </div>

                                <h3 className="font-montserrat text-base font-extrabold text-slate-900 group-hover:text-[#004aad] transition-colors">
                                  {item.title}
                                </h3>

                                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium pt-0.5">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="size-3 text-slate-400" />
                                    {item.batch_mode === "offline" ? "Koramangala, CSN" : item.batch_mode}
                                  </span>
                                  {item.discounted_price && (
                                    <span className="font-bold text-slate-800">
                                      {inr(item.discounted_price)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                              <Link
                                href={`/courses/${item.slug}`}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#004aad] hover:text-[#003c8c] bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors shadow-sm"
                              >
                                <span>Continue Learning</span>
                              </Link>
                            </div>
                          </div>

                          {/* Progress Bar matching reference image */}
                          <div className="space-y-1.5 pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#004aad] rounded-full transition-all duration-500"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-slate-500 shrink-0">
                                {progress}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Issued Credentials matching reference image */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-montserrat text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Award className="size-4 text-amber-500" />
                    <span>Issued Credentials</span>
                  </h3>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
                    {certificates.length} {certificates.length === 1 ? "Cert" : "Certs"}
                  </span>
                </div>

                {certificates.length === 0 ? (
                  <div className="py-6 text-center space-y-2">
                    <p className="text-xs text-slate-400 font-medium italic">
                      Complete your cohort modules to earn a QR-verifiable certificate.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {certificates.map((cert: any) => (
                      <div
                        key={cert.id}
                        className="p-4 bg-amber-50/40 border border-amber-200/70 rounded-2xl space-y-2 relative"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-amber-950 leading-snug">
                              {cert.program_title}
                            </p>
                            <p className="text-[11px] text-amber-700 font-semibold font-mono mt-0.5">
                              ID: {cert.cert_number || "IA-2026-47505"}
                            </p>
                            <p className="text-[10px] text-amber-600/80 mt-0.5">
                              Issued on {cert.issued_at ? new Date(cert.issued_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "15 Jan 2026"}
                            </p>
                          </div>
                          <div className="size-5 rounded-full border border-amber-400 flex items-center justify-center shrink-0 text-amber-600 mt-0.5">
                            <CheckCircle2 className="size-4 text-amber-500" />
                          </div>
                        </div>

                        {cert.certificate_url && cert.is_active && (
                          <div className="pt-2">
                            <a
                              href={cert.certificate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 w-full justify-center px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition-colors shadow-sm"
                            >
                              <Download className="size-3" />
                              Download Certificate
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* View All Certificates CTA */}
                <div className="pt-2 border-t border-slate-100">
                  <a
                    href="#certificates"
                    onClick={(e) => {
                      if (certificates.length === 0) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#004aad] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View All Certificates</span>
                    <ArrowRight className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2 Content: Job Applications (When clicked, show only job applications) ── */}
      {activeTab === "job-applications" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Job Applications Banner / Overview */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="font-montserrat text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                  <Briefcase className="size-5 text-[#004aad]" />
                  <span>Job &amp; Internship Applications</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Track the real-time review status of all roles you&apos;ve applied for
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="bg-blue-50 text-[#004aad] text-xs font-bold px-3 py-1.5 rounded-full border border-blue-200">
                  {jobApplications.length} {jobApplications.length === 1 ? "Application" : "Applications"}
                </span>

                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-1.5 bg-[#004aad] hover:bg-[#003882] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                  <span>Explore Jobs</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* List of Applications */}
            {jobApplications.length === 0 ? (
              <div className="py-16 text-center space-y-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8">
                <div className="size-16 rounded-full bg-blue-100 text-[#004aad] flex items-center justify-center mx-auto">
                  <Briefcase className="size-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="font-montserrat text-lg font-bold text-slate-800">No job applications yet</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    You haven&apos;t applied to any job or internship openings yet. Browse verified opportunities posted by top companies and apply with your completed profile!
                  </p>
                </div>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 bg-[#004aad] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#003882] transition-all shadow-md"
                >
                  <span>Browse Open Opportunities</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobApplications.map((app: any) => {
                  const statusColors: Record<string, string> = {
                    applied: "bg-blue-50 text-[#004aad] border-blue-200",
                    reviewing: "bg-amber-50 text-amber-700 border-amber-200",
                    shortlisted: "bg-purple-50 text-purple-700 border-purple-200",
                    offered: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    hired: "bg-emerald-100 text-emerald-800 border-emerald-300",
                    rejected: "bg-rose-50 text-rose-700 border-rose-200",
                  };

                  const statusLabels: Record<string, string> = {
                    applied: "Applied",
                    reviewing: "Under Review",
                    shortlisted: "Shortlisted",
                    offered: "Offer Extended",
                    hired: "Hired 🎉",
                    rejected: "Not Selected",
                  };

                  const currentStatus = (app.status || "applied").toLowerCase();
                  const badgeClass = statusColors[currentStatus] || "bg-slate-50 text-slate-700 border-slate-200";
                  const badgeLabel = statusLabels[currentStatus] || app.status;

                  return (
                    <div
                      key={app.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#004aad]/40 hover:shadow-md transition-all flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {app.company_logo_url ? (
                              <img
                                src={app.company_logo_url}
                                alt={app.company_name || "Company"}
                                className="size-11 rounded-xl object-contain border border-slate-100 p-1 bg-slate-50"
                              />
                            ) : (
                              <div className="size-11 rounded-xl bg-slate-100 border border-slate-200 text-[#004aad] font-extrabold flex items-center justify-center text-sm">
                                {(app.company_name || "C").charAt(0).toUpperCase()}
                              </div>
                            )}

                            <div>
                              <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                                <Building2 className="size-3 text-slate-400" />
                                <span>{app.company_name}</span>
                              </p>
                              <h3 className="font-montserrat text-sm font-extrabold text-slate-900 leading-snug">
                                {app.opportunity_title}
                              </h3>
                            </div>
                          </div>

                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeClass} shrink-0`}>
                            {badgeLabel}
                          </span>
                        </div>

                        {/* Meta Tags */}
                        <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500 font-medium">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 capitalize font-semibold">
                            {app.opportunity_type || "Opportunity"}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 capitalize">
                            {app.work_mode || "Onsite"}
                          </span>
                          {app.city && (
                            <span className="flex items-center gap-1 text-slate-500">
                              <MapPin className="size-3 text-slate-400" />
                              {app.city}{app.state ? `, ${app.state}` : ""}
                            </span>
                          )}
                        </div>

                        {/* Stipend / Salary */}
                        {app.stipend_salary && (
                          <p className="text-xs font-bold text-emerald-700 bg-emerald-50/70 border border-emerald-100 px-2.5 py-1 rounded-lg inline-block">
                            {app.stipend_salary}
                          </p>
                        )}
                      </div>

                      {/* Footer: Date & Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span>Applied {new Date(app.applied_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          {app.resume_url && (
                            <a
                              href={app.resume_url.startsWith("http") ? app.resume_url : `https://${app.resume_url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#004aad] hover:bg-slate-50 text-[11px] font-bold inline-flex items-center gap-1"
                            >
                              <FileText className="size-3" />
                              <span>Resume</span>
                            </a>
                          )}

                          <Link
                            href={`/jobs/${app.opportunity_id}`}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#004aad] text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                          >
                            <span>View Job</span>
                            <ExternalLink className="size-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
