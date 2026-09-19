import Link from "next/link";
import {
  Building2,
  Search,
  ExternalLink,
  Calendar,
  Briefcase,
  Users,
  ShieldAlert,
  ShieldCheck,
  Globe,
  Mail,
  Phone,
} from "lucide-react";
import { getAdminCompanies, getAdminCompanyStats } from "@/services/admin-company.service";
import CompanyStatusToggle from "@/components/admin/CompanyStatusToggle";

interface Props {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminCompaniesPage({ searchParams }: Props) {
  const { search = "", status = "all", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10));

  const [{ companies, total, limit }, stats] = await Promise.all([
    getAdminCompanies({
      search,
      status,
      page: currentPage,
      limit: 15,
    }),
    getAdminCompanyStats(),
  ]);

  const totalPages = Math.ceil(total / limit);

  function buildUrl(params: Record<string, string>) {
    const base = new URLSearchParams({ search, status, page: String(currentPage) });
    Object.entries(params).forEach(([k, v]) => base.set(k, v));
    return `/admin/companies?${base.toString()}`;
  }

  return (
    <div className="space-y-8">
      {/* Page Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#004aad] p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00d2fd]/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#00d2fd]">
              <Building2 className="size-3.5" />
              <span>Company Directory & Moderation</span>
            </div>
            <h1 className="font-montserrat text-3xl md:text-4xl font-extrabold tracking-tight">
              Registered Companies
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-normal max-w-xl">
              Inspect company profiles, oversee job postings, and moderate access for enterprise partners.
            </p>
          </div>
          <div className="shrink-0 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-center">
            <p className="text-3xl font-extrabold font-montserrat">{stats.total}</p>
            <p className="text-xs text-slate-300 font-semibold mt-1">Total Companies</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Active Companies",
            count: stats.active,
            filter: "active",
            icon: ShieldCheck,
            color: "bg-emerald-50 text-emerald-600 border-emerald-100",
          },
          {
            label: "Blocked Companies",
            count: stats.blocked,
            filter: "blocked",
            icon: ShieldAlert,
            color: "bg-rose-50 text-rose-600 border-rose-100",
          },
          {
            label: "Total Registered",
            count: stats.total,
            filter: "all",
            icon: Building2,
            color: "bg-blue-50 text-[#004aad] border-blue-100",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={buildUrl({ status: item.filter, page: "1" })}
              className="group"
            >
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm group-hover:border-[#004aad]/30 group-hover:shadow-md transition-all flex items-center gap-4">
                <div
                  className={`size-12 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}
                >
                  <Icon className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-2xl font-extrabold text-slate-900 font-montserrat">
                    {item.count}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">Click to filter</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Filters + Table Section */}
      <div className="space-y-4">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <form method="GET" action="/admin/companies" className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search by company name, contact email, or user..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all"
              />
            </div>

            <select
              name="status"
              defaultValue={status}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all w-full sm:w-auto"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="blocked">Blocked Only</option>
            </select>

            <input type="hidden" name="page" value="1" />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#004aad] hover:bg-[#003c8c] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              Search
            </button>

            {(search || status !== "all") && (
              <Link
                href="/admin/companies"
                className="w-full sm:w-auto text-center px-4 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Clear
              </Link>
            )}
          </form>
        </div>

        {/* Companies Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Contact Details</th>
                  <th className="py-4 px-6">Size</th>
                  <th className="py-4 px-6">Website</th>
                  <th className="py-4 px-6">Opportunities</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Signed Up</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companies.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-400 font-medium italic text-sm">
                      No companies found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  companies.map((company: any) => (
                    <tr key={company.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Company Name & Logo */}
                      <td className="py-4 px-6">
                        <Link
                          href={`/admin/companies/${company.id}`}
                          className="flex items-center gap-3 group"
                        >
                          {company.logo_url ? (
                            <img
                              src={company.logo_url}
                              alt={company.name}
                              className="size-9 rounded-xl object-contain border border-slate-200 bg-white p-0.5 shrink-0"
                            />
                          ) : (
                            <div className="size-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-sm">
                              {company.name ? company.name[0]?.toUpperCase() : "C"}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 text-xs group-hover:text-[#004aad] transition-colors">
                              {company.name}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {[company.address_city, company.address_state]
                                .filter(Boolean)
                                .join(", ") || "Location not set"}
                            </p>
                          </div>
                        </Link>
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          {company.contact_email ? (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Mail className="size-3 text-slate-400" />
                              <span className="font-medium text-[11px]">{company.contact_email}</span>
                            </div>
                          ) : company.user_email ? (
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Mail className="size-3 text-slate-400" />
                              <span className="font-medium text-[11px]">{company.user_email}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">No email</span>
                          )}
                          {company.contact_number && (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Phone className="size-3 text-slate-400" />
                              <span className="text-[11px]">{company.contact_number}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Size */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Users className="size-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-700">
                            {company.employee_count || ""}
                          </span>
                        </div>
                      </td>

                      {/* Website */}
                      <td className="py-4 px-6">
                        {company.website ? (
                          <a
                            href={
                              company.website.startsWith("http")
                                ? company.website
                                : `https://${company.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#004aad] hover:underline font-semibold text-[11px]"
                          >
                            <Globe className="size-3" />
                            <span className="max-w-[120px] truncate">
                              {company.website.replace(/^https?:\/\//, "")}
                            </span>
                            <ExternalLink className="size-2.5" />
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </td>

                      {/* Opportunities */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="size-3.5 text-slate-400" />
                          <span className="font-bold text-slate-800">
                            {company.opportunity_count || 0}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {company.is_active ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-rose-500" />
                            Blocked
                          </span>
                        )}
                      </td>

                      {/* Signup Date */}
                      <td className="py-4 px-6 text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-slate-400" />
                          <span>
                            {company.created_at
                              ? new Date(company.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                              : "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/admin/companies/${company.id}`}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:text-[#004aad] hover:border-[#004aad]/30 hover:bg-slate-50 transition-colors font-bold text-xs"
                          >
                            View Profile
                          </Link>
                          <CompanyStatusToggle
                            companyId={company.id}
                            companyName={company.name}
                            isActive={company.is_active}
                            size="sm"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between">
              <p className="text-xs text-slate-500 font-medium">
                Showing {Math.min((currentPage - 1) * limit + 1, total)}–{Math.min(currentPage * limit, total)} of {total} companies
              </p>
              <div className="flex items-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={buildUrl({ page: String(currentPage - 1) })}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    ← Prev
                  </Link>
                )}
                <span className="px-3.5 py-1.5 bg-[#004aad] text-white rounded-lg text-xs font-bold">
                  {currentPage}
                </span>
                {currentPage < totalPages && (
                  <Link
                    href={buildUrl({ page: String(currentPage + 1) })}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Next →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
