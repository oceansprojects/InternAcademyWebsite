import { getAdminUsers } from "@/services/dashboard.service";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import {
  Users,
  Shield,
  GraduationCap,
  Search,
  UserCheck,
  UserX,
  BookOpen,
  Calendar,
} from "lucide-react";
import DeleteUserButton from "@/components/admin/DeleteUserButton";

interface Props {
  searchParams: Promise<{
    search?: string;
    role?: string;
    page?: string;
  }>;
}

function roleBadge(role: string) {
  const map: Record<string, string> = {
    admin: "bg-red-100 text-red-800 border border-red-200",
    faculty: "bg-purple-100 text-purple-800 border border-purple-200",
    student: "bg-blue-100 text-[#004aad] border border-blue-200",
  };
  return map[role] ?? "bg-slate-100 text-slate-700 border border-slate-200";
}

function providerBadge(provider: string) {
  if (provider === "google") return "bg-amber-50 text-amber-700 border border-amber-200";
  return "bg-slate-50 text-slate-600 border border-slate-200";
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const { search = "", role = "all", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10));

  const { users, total, limit } = await getAdminUsers({
    search,
    role,
    page: currentPage,
  });

  const currentUser = await getCurrentUser();
  const protectedAdminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

  const totalPages = Math.ceil(total / limit);

  function buildUrl(params: Record<string, string>) {
    const base = new URLSearchParams({ search, role, page: String(currentPage) });
    Object.entries(params).forEach(([k, v]) => base.set(k, v));
    return `/admin/users?${base.toString()}`;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#004aad] p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00d2fd]/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#00d2fd]">
              <Users className="size-3.5" />
              <span>User Management</span>
            </div>
            <h1 className="font-montserrat text-3xl md:text-4xl font-extrabold tracking-tight">
              Registered Users
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-normal max-w-xl">
              View and manage all platform users — students, instructors, and admins.
            </p>
          </div>
          <div className="shrink-0 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-center">
            <p className="text-3xl font-extrabold font-montserrat">{total}</p>
            <p className="text-xs text-slate-300 font-semibold mt-1">Total Users</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Students", role: "student", icon: BookOpen, color: "bg-blue-50 text-[#004aad]" },
          { label: "Instructors", role: "faculty", icon: GraduationCap, color: "bg-purple-50 text-purple-600" },
          { label: "Admins", role: "admin", icon: Shield, color: "bg-red-50 text-red-600" },
        ].map(({ label, role: r, icon: Icon, color }) => {
          const count = users.filter((u: any) => u.role === r).length;
          return (
            <Link key={r} href={buildUrl({ role: r, page: "1" })} className="group">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm group-hover:border-[#004aad]/30 group-hover:shadow-md transition-all flex items-center gap-4">
                <div className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                  <p className="text-2xl font-extrabold text-slate-900 font-montserrat">{count}</p>
                  <p className="text-[10px] text-slate-400 font-medium">shown on this page</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Filters + Table */}
      <div className="space-y-4">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <form method="GET" action="/admin/users" className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all"
              />
            </div>

            {/* Role filter */}
            <select
              name="role"
              defaultValue={role}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="faculty">Instructors</option>
              <option value="admin">Admins</option>
            </select>

            <input type="hidden" name="page" value="1" />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#004aad] hover:bg-[#003c8c] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Search
            </button>

            {(search || role !== "all") && (
              <Link
                href="/admin/users"
                className="px-4 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Clear
              </Link>
            )}
          </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Auth Provider</th>
                  <th className="py-4 px-6">Enrollments</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Joined</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400 font-medium italic text-sm">
                      No users found matching your filters.
                    </td>
                  </tr>
                ) : (
                  users.map((user: any) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* User Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.name}
                              className="size-9 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="size-9 rounded-full bg-gradient-to-br from-[#004aad] to-[#00b4d8] text-white flex items-center justify-center font-extrabold text-xs shrink-0">
                              {initials(user.name || "?")}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{user.name}</p>
                            <p className="text-[11px] text-slate-500 font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${roleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Auth Provider */}
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${providerBadge(user.oauth_provider)}`}>
                          {user.oauth_provider}
                        </span>
                      </td>

                      {/* Enrollments */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="size-3.5 text-slate-400" />
                          <span className="font-bold text-slate-700">{user.enrollment_count ?? 0}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {user.is_active ? (
                          <div className="flex items-center gap-1.5 text-emerald-700">
                            <UserCheck className="size-3.5" />
                            <span className="text-[11px] font-bold">Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-red-500">
                            <UserX className="size-3.5" />
                            <span className="text-[11px] font-bold">Inactive</span>
                          </div>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="py-4 px-6 text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-slate-400" />
                          <span>
                            {user.created_at
                              ? new Date(user.created_at).toLocaleDateString("en-IN", {
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
                        {user.email.toLowerCase() !== protectedAdminEmail && (
                          <DeleteUserButton
                            userId={user.id}
                            userName={user.name}
                            disabled={currentUser?.id === user.id}
                          />
                        )}
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
                Showing {Math.min((currentPage - 1) * limit + 1, total)}–{Math.min(currentPage * limit, total)} of {total} users
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
