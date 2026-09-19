import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Globe,
  MapPin,
  Users,
  CheckCircle,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { getAdminOpportunityById } from "@/services/admin-company.service";
import OpportunityAdminActions from "@/components/admin/OpportunityAdminActions";
import AdminApplicantsTable from "@/components/admin/AdminApplicantsTable";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOpportunityDetailPage({ params }: Props) {
  const { id } = await params;
  const opp = await getAdminOpportunityById(id);

  if (!opp) {
    notFound();
  }

  const applicants = opp.applicants || [];

  return (
    <div className="space-y-8">
      {/* Top Back Navigation & Moderation Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/opportunities"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#004aad] transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to All Postings</span>
        </Link>

        <div className="flex items-center gap-2">
          <OpportunityAdminActions
            opportunityId={opp.id}
            opportunityTitle={opp.title}
            status={opp.status}
          />
        </div>
      </div>

      {/* Main Posting Header Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#004aad] border border-blue-200">
                {opp.type?.replace("_", " ")}
              </span>
              {opp.status === "active" && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Listing
                </span>
              )}
              {opp.status === "expired" && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  Expired
                </span>
              )}
              {opp.status === "closed" && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-slate-400" />
                  Closed / Delisted
                </span>
              )}
            </div>

            <h1 className="font-montserrat text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {opp.title}
            </h1>

            {/* Company Info Link */}
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/companies/${opp.company_id}`}
                className="inline-flex items-center gap-2 group text-slate-700 hover:text-[#004aad] transition-colors"
              >
                {opp.company_logo_url ? (
                  <img
                    src={opp.company_logo_url}
                    alt={opp.company_name}
                    className="size-7 rounded-lg object-contain border border-slate-200 bg-white p-0.5 shrink-0"
                  />
                ) : (
                  <div className="size-7 rounded-lg bg-slate-800 text-white flex items-center justify-center font-extrabold text-[10px] shrink-0">
                    {opp.company_name ? opp.company_name[0]?.toUpperCase() : "C"}
                  </div>
                )}
                <span className="font-bold text-sm">{opp.company_name}</span>
                <ExternalLink className="size-3.5 text-slate-400 group-hover:text-[#004aad]" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl px-5 py-4 text-center">
              <p className="text-2xl font-extrabold font-montserrat text-[#004aad]">
                {applicants.length}
              </p>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                Total Applicants
              </p>
            </div>
          </div>
        </div>

        {/* Highlights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 block font-semibold text-[11px]">Work Mode & Location</span>
            <span className="text-slate-800 font-bold capitalize flex items-center gap-1.5">
              <MapPin className="size-3.5 text-slate-400" />
              {[opp.work_mode?.replace("_", " "), opp.city, opp.state]
                .filter(Boolean)
                .join(" • ") || "Remote"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 block font-semibold text-[11px]">Stipend / Salary</span>
            <span className="text-slate-800 font-bold flex items-center gap-1.5">
              <DollarSign className="size-3.5 text-slate-400" />
              {opp.stipend_salary || "Negotiable"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 block font-semibold text-[11px]">Openings</span>
            <span className="text-slate-800 font-bold flex items-center gap-1.5">
              <Users className="size-3.5 text-slate-400" />
              {opp.openings ? `${opp.openings} positions` : "Not specified"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 block font-semibold text-[11px]">Deadline</span>
            <span className="text-slate-800 font-bold flex items-center gap-1.5">
              <Calendar className="size-3.5 text-slate-400" />
              {opp.application_deadline
                ? new Date(opp.application_deadline).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Rolling applications"}
            </span>
          </div>
        </div>
      </div>

      {/* Posting Details & Tech Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Job Description & Selection Process */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-3">
            <h2 className="font-montserrat text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Briefcase className="size-4 text-[#004aad]" />
              Role Description & Expectations
            </h2>
            {opp.description ? (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {opp.description}
              </p>
            ) : (
              <p className="text-xs text-slate-400 italic">No job description provided.</p>
            )}
          </div>

          {/* Selection Process */}
          {opp.selection_process && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-3">
              <h2 className="font-montserrat text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <CheckCircle className="size-4 text-[#004aad]" />
                Selection & Interview Workflow
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {opp.selection_process}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Required Skills & Experience */}
        <div className="space-y-6">
          {/* Tech Stack Chips */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
            <h2 className="font-montserrat text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Layers className="size-4 text-[#004aad]" />
              Required Technologies
            </h2>
            {opp.tech_stack && opp.tech_stack.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {opp.tech_stack.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#004aad] text-xs font-bold border border-blue-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No specific technologies required.</p>
            )}

            {opp.years_experience && (
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-600">
                <span className="text-slate-400 block font-semibold text-[11px]">Experience Requirement</span>
                <span className="font-bold text-slate-800 text-sm">
                  {opp.years_experience} years
                </span>
              </div>
            )}
          </div>

          {/* Company Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
            <h2 className="font-montserrat text-sm font-extrabold uppercase tracking-wider text-slate-800">
              Company Overview
            </h2>
            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-900 text-sm">{opp.company_name}</p>
              {opp.company_contact_email && (
                <p className="text-slate-500 flex items-center gap-1.5">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-medium text-slate-700">{opp.company_contact_email}</span>
                </p>
              )}
              {opp.company_website && (
                <a
                  href={
                    opp.company_website.startsWith("http")
                      ? opp.company_website
                      : `https://${opp.company_website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#004aad] hover:underline font-bold inline-flex items-center gap-1"
                >
                  <Globe className="size-3" />
                  <span>Visit Website</span>
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>

            <div className="pt-2">
              <Link
                href={`/admin/companies/${opp.company_id}`}
                className="w-full text-center block px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:text-[#004aad] hover:border-[#004aad]/40 hover:bg-slate-50 transition-colors text-xs font-bold"
              >
                View Full Company Profile →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Applicants Section */}
      <AdminApplicantsTable applicants={applicants} />
    </div>
  );
}
