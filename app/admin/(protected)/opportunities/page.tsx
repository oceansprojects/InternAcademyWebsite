import Link from "next/link";
import {
  Briefcase,
  Search,
  Building2,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Trash2,
  ExternalLink,
  MapPin,
} from "lucide-react";
import {
  getAdminOpportunities,
  getAdminOpportunityStats,
} from "@/services/admin-company.service";
import OpportunityAdminActions from "@/components/admin/OpportunityAdminActions";

interface Props {
  searchParams: Promise<{
    search?: string;
    type?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminOpportunitiesPage({ searchParams }: Props) {
  const { search = "", type = "all", status = "all", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10));

  const [{ opportunities, total, limit }, stats] = await Promise.all([
    getAdminOpportunities({
      search,
      type,
      status,
      page: currentPage,
      limit: 15,
    }),
    getAdminOpportunityStats(),
  ]);

  const totalPages = Math.ceil(total / limit);

  function buildUrl(params: Record<string, string>) {
    const base = new URLSearchParams({ search, type, status, page: String(currentPage) });
    Object.entries(params).forEach(([k, v]) => base.set(k, v));
    return `/admin/opportunities?${base.toString()}`;
  }

  return (
    <div className="space-y-8">
      {/* Page Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#004aad] p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00d2fd]/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#00d2fd]">
              <Briefcase className="size-3.5" />
              <span>Opportunities Moderation</span>
            </div>
            <h1 className="font-montserrat text-3xl md:text-4xl font-extrabold tracking-tight">
              Job & Internship Postings
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-normal max-w-xl">
              Inspect corporate postings, audit student applicants, and manage expiration or removal of listings.
            </p>
          </div>
          <div className="shrink-0 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-center">
            <p className="text-3xl font-extrabold font-montserrat">{stats.total}</p>
            <p className="text-xs text-slate-300 font-semibold mt-1">Total Postings</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Active Postings",
            count: stats.active,
            filterKey: "status",
            filterVal: "active",
            icon: CheckCircle,
            color: "bg-emerald-50 text-emerald-600 border-emerald-100",
          },
          {
            label: "Expired Postings",
            count: stats.expired,
            filterKey: "status",
            filterVal: "expired",
            icon: Clock,
            color: "bg-amber-50 text-amber-600 border-amber-100",
          },
          {
            label: "Internships",
            count: stats.internships,
            filterKey: "type",
            filterVal: "internship",
            icon: Briefcase,
            color: "bg-blue-50 text-[#004aad] border-blue-100",
          },
          {
            label: "Jobs",
            count: stats.jobs,
            filterKey: "type",
            filterVal: "job",
            icon: Building2,
            color: "bg-purple-50 text-purple-600 border-purple-100",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={buildUrl({ [item.filterKey]: item.filterVal, page: "1" })}
              className="group"
            >
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm group-hover:border-[#004aad]/30 group-hover:shadow-md transition-all flex items-center gap-4">
                <div
                  className={`size-11 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}
                >
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-2xl font-extrabold text-slate-900 font-montserrat">
                    {item.count}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Filters & Table Section */}
      <div className="space-y-4">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <form method="GET" action="/admin/opportunities" className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search by posting title, role, or company name..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all"
              />
            </div>

            {/* Type Filter */}
            <select
              name="type"
              defaultValue={type}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all w-full sm:w-auto"
            >
              <option value="all">All Types</option>
              <option value="internship">Internship</option>
              <option value="job">All Jobs</option>
              <option value="full_time">Full-Time Job</option>
              <option value="part_time">Part-Time Job</option>
              <option value="contract">Contract</option>
            </select>

            {/* Status Filter */}
            <select
              name="status"
              defaultValue={status}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all w-full sm:w-auto"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="closed">Closed / Delisted</option>
            </select>

            <input type="hidden" name="page" value="1" />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#004aad] hover:bg-[#003c8c] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              Filter
            </button>

            {(search || type !== "all" || status !== "all") && (
              <Link
                href="/admin/opportunities"
                className="w-full sm:w-auto text-center px-4 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Clear
              </Link>
            )}
          </form>
        </div>

        {/* Opportunities Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Posting Title</th>
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Mode</th>
                  <th className="py-4 px-6">Applicants</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Posted On</th>
                  <th className="py-4 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {opportunities.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-400 font-medium italic text-sm">
                      No postings found matching your filters.
                    </td>
                  </tr>
                ) : (
                  opportunities.map((opp: any) => (
                    <tr key={opp.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Title & Role */}
                      <td className="py-4 px-6">
                        <Link
                          href={`/admin/opportunities/${opp.id}`}
                          className="font-bold text-slate-900 text-xs hover:text-[#004aad] transition-colors block"
                        >
                          {opp.title}
                        </Link>
                        {opp.role && (
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">{opp.role}</p>
                        )}
                      </td>

                      {/* Company Name & Logo */}
                      <td className="py-4 px-6">
                        <Link
                          href={`/admin/companies/${opp.company_id}`}
                          className="inline-flex items-center gap-2 group"
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
                          <span className="font-semibold text-slate-700 group-hover:text-[#004aad] transition-colors">
                            {opp.company_name}
                          </span>
                        </Link>
                      </td>

                      {/* Type Badge */}
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#004aad] border border-blue-200">
                          {opp.type?.replace("_", " ")}
                        </span>
                      </td>

                      {/* Work Mode */}
                      <td className="py-4 px-6 capitalize text-slate-700 font-medium">
                        {opp.work_mode?.replace("_", " ")}
                      </td>

                      {/* Applicant Count */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          <Users className="size-3.5 text-slate-400" />
                          <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-xs">
                            {opp.applicant_count || 0}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {opp.status === "active" && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        )}
                        {opp.status === "expired" && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-amber-500" />
                            Expired
                          </span>
                        )}
                        {opp.status === "closed" && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 inline-flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-slate-400" />
                            Closed
                          </span>
                        )}
                      </td>

                      {/* Posted On */}
                      <td className="py-4 px-6 text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-slate-400" />
                          <span>
                            {opp.created_at
                              ? new Date(opp.created_at).toLocaleDateString("en-IN", {
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
                        <div className="inline-flex items-center gap-2 justify-end">
                          <Link
                            href={`/admin/opportunities/${opp.id}`}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:text-[#004aad] hover:border-[#004aad]/30 hover:bg-slate-50 transition-colors font-bold text-xs"
                          >
                            Details
                          </Link>
                          <OpportunityAdminActions
                            opportunityId={opp.id}
                            opportunityTitle={opp.title}
                            status={opp.status}
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
                Showing {Math.min((currentPage - 1) * limit + 1, total)}–{Math.min(currentPage * limit, total)} of {total} postings
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
