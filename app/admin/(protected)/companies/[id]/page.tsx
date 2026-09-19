import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Users,
  Calendar,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Clock,
  Send,
} from "lucide-react";
import { getAdminCompanyById } from "@/services/admin-company.service";
import CompanyStatusToggle from "@/components/admin/CompanyStatusToggle";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminCompanyDetailPage({ params }: Props) {
  const { id } = await params;
  const company = await getAdminCompanyById(id);

  if (!company) {
    notFound();
  }

  const opportunities = company.opportunities || [];
  const socialLinks = company.social_links || [];

  return (
    <div className="space-y-8">
      {/* Top Back Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/companies"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#004aad] transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to All Companies</span>
        </Link>

        <div className="flex items-center gap-3">
          <CompanyStatusToggle
            companyId={company.id}
            companyName={company.name}
            isActive={company.is_active}
          />
        </div>
      </div>

      {/* Company Profile Header Banner */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start md:items-center gap-5">
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.name}
              className="size-20 rounded-2xl object-contain border border-slate-200 bg-white p-1.5 shrink-0 shadow-sm"
            />
          ) : (
            <div className="size-20 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center font-extrabold text-2xl shrink-0 shadow-md">
              {company.name ? company.name[0]?.toUpperCase() : "C"}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-montserrat text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {company.name}
              </h1>
              {company.is_active ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Account
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-rose-500" />
                  Account Blocked
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-600">
              {(company.address_city || company.address_state || company.address_nation) && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-slate-400" />
                  <span>
                    {[company.address_city, company.address_state, company.address_nation]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </span>
              )}
              {company.employee_count && (
                <span className="flex items-center gap-1.5">
                  <Users className="size-3.5 text-slate-400" />
                  <span>{company.employee_count} employees</span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-slate-400" />
                <span>
                  Member since{" "}
                  {new Date(company.created_at).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Opportunity Stat */}
        <div className="shrink-0 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center min-w-[130px]">
          <p className="text-2xl font-extrabold font-montserrat text-[#004aad]">
            {opportunities.length}
          </p>
          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Postings Created</p>
        </div>
      </div>

      {/* Grid: Company Details + Associated Account */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Company */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-3">
            <h2 className="font-montserrat text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Building2 className="size-4 text-[#004aad]" />
              About Company
            </h2>
            {company.description ? (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {company.description}
              </p>
            ) : (
              <p className="text-xs text-slate-400 italic">No description provided by the company.</p>
            )}
          </div>

          {/* Contact & Location Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="font-montserrat text-sm font-extrabold uppercase tracking-wider text-slate-800">
              Corporate & Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-semibold">Contact Email</span>
                <span className="text-slate-900 font-bold text-xs flex items-center gap-1.5">
                  <Mail className="size-3.5 text-slate-400" />
                  {company.contact_email || company.user_email || ""}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-semibold">Phone Number</span>
                <span className="text-slate-900 font-bold text-xs flex items-center gap-1.5">
                  <Phone className="size-3.5 text-slate-400" />
                  {company.contact_number || ""}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-semibold">Official Website</span>
                {company.website ? (
                  <a
                    href={
                      company.website.startsWith("http")
                        ? company.website
                        : `https://${company.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#004aad] font-bold text-xs hover:underline flex items-center gap-1.5"
                  >
                    <Globe className="size-3.5" />
                    <span className="truncate">{company.website}</span>
                    <ExternalLink className="size-3 shrink-0" />
                  </a>
                ) : (
                  <span className="text-slate-400 font-semibold"></span>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-semibold">Organization Size</span>
                <span className="text-slate-900 font-bold text-xs flex items-center gap-1.5">
                  <Users className="size-3.5 text-slate-400" />
                  {company.employee_count ? `${company.employee_count} employees` : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Social Links & Associated User Account */}
        <div className="space-y-6">
          {/* Social Profiles */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="font-montserrat text-sm font-extrabold uppercase tracking-wider text-slate-800">
              Social Links & Media
            </h2>
            {socialLinks.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No social media links connected.</p>
            ) : (
              <div className="space-y-2">
                {socialLinks.map((link: any) => (
                  <a
                    key={link.id}
                    href={
                      link.social_acc_link.startsWith("http")
                        ? link.social_acc_link
                        : `https://${link.social_acc_link}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-white hover:border-[#004aad]/30 transition-all text-xs font-bold text-slate-700 hover:text-[#004aad] group"
                  >
                    <span className="capitalize">{link.social_app_name}</span>
                    <ExternalLink className="size-3.5 text-slate-400 group-hover:text-[#004aad]" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Associated User Account */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="font-montserrat text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <UserCheck className="size-4 text-[#004aad]" />
              Linked Login Account
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold text-[11px]">Primary Contact</span>
                <span className="text-slate-900 font-bold">{company.user_name || "Enterprise User"}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[11px]">Login Email</span>
                <span className="text-slate-900 font-bold">{company.user_email || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[11px]">Auth Provider</span>
                <span className="capitalize px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                  {company.oauth_provider || "credentials"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[11px]">Account ID</span>
                <span className="text-[10px] text-slate-500 font-mono select-all">
                  {company.user_id || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company's Opportunities Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-montserrat text-xl font-extrabold text-slate-900">
            Company Job & Internship Postings ({opportunities.length})
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {opportunities.length === 0 ? (
            <div className="py-16 text-center text-slate-400 font-medium italic text-xs">
              This company has not created any job or internship postings yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-4 px-6">Posting Title</th>
                    <th className="py-4 px-6">Type</th>
                    <th className="py-4 px-6">Work Mode</th>
                    <th className="py-4 px-6">Openings</th>
                    <th className="py-4 px-6">Stipend / Salary</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Applicants</th>
                    <th className="py-4 px-6">Posted On</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {opportunities.map((opp: any) => (
                    <tr key={opp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <Link
                          href={`/admin/opportunities/${opp.id}`}
                          className="hover:text-[#004aad] transition-colors"
                        >
                          {opp.title}
                        </Link>
                        {opp.role && (
                          <p className="text-[11px] text-slate-500 font-normal">{opp.role}</p>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#004aad] border border-blue-200">
                          {opp.type?.replace("_", " ")}
                        </span>
                      </td>

                      <td className="py-4 px-6 capitalize text-slate-700 font-medium">
                        {opp.work_mode?.replace("_", " ") || ""}
                      </td>

                      <td className="py-4 px-6 text-slate-700 font-bold">
                        {opp.openings || ""}
                      </td>

                      <td className="py-4 px-6 text-slate-700 font-bold">
                        {opp.stipend_salary || "Negotiable"}
                      </td>

                      <td className="py-4 px-6">
                        {opp.status === "active" && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        )}
                        {opp.status === "expired" && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Expired
                          </span>
                        )}
                        {opp.status === "closed" && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            Closed
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {opp.applicant_count || 0}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-slate-500 font-medium">
                        {opp.created_at
                          ? new Date(opp.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                          : ""}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/admin/opportunities/${opp.id}`}
                          className="px-3 py-1.5 rounded-xl bg-[#004aad] hover:bg-[#003882] text-white font-bold text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                        >
                          <span>Review</span>
                          <ExternalLink className="size-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
