import { getAdminDashboardStats } from "@/services/dashboard.service";
import Link from "next/link";
import {
  BookOpen,
  Users,
  GraduationCap,
  TrendingUp,
  Plus,
  ArrowRight,
  FileText,
  HelpCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

function inr(n: number) {
  return "₹" + (n || 0).toLocaleString("en-IN");
}

export default async function AdminDashboardPage() {
  const { stats, recentEnrollments, recentPrograms } = await getAdminDashboardStats();

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#004aad] p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00d2fd]/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#00d2fd]">
              <ShieldCheck className="size-3.5" />
              <span>Admin Control System</span>
            </div>
            <h1 className="font-montserrat text-3xl md:text-4xl font-extrabold tracking-tight">
              Platform Overview
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl font-normal">
              Monitor live courses, instructor assignments, student enrollments, and real platform revenue.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/programs/new"
              className="bg-[#00d2fd] hover:bg-[#3cd7ff] text-[#001f27] font-bold px-5 py-2.5 rounded-xl text-xs md:text-sm transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="size-4" />
              <span>Create Program</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Real Live Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <Link href="/admin/programs" className="group">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm group-hover:border-[#004aad]/40 group-hover:shadow-md transition-all flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Programs</p>
              <p className="text-3xl font-extrabold text-slate-900 font-montserrat">{stats.totalPrograms}</p>
              <p className="text-[11px] text-[#004aad] font-semibold flex items-center gap-1 pt-1">
                <span>Manage programs</span>
                <ArrowRight className="size-3" />
              </p>
            </div>
            <div className="size-12 rounded-xl bg-blue-50 text-[#004aad] flex items-center justify-center shrink-0 font-bold">
              <BookOpen className="size-6" />
            </div>
          </div>
        </Link>

        <Link href="/admin/instructors" className="group">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm group-hover:border-[#004aad]/40 group-hover:shadow-md transition-all flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Instructors</p>
              <p className="text-3xl font-extrabold text-slate-900 font-montserrat">{stats.totalInstructors}</p>
              <p className="text-[11px] text-[#004aad] font-semibold flex items-center gap-1 pt-1">
                <span>Faculty roster</span>
                <ArrowRight className="size-3" />
              </p>
            </div>
            <div className="size-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 font-bold">
              <GraduationCap className="size-6" />
            </div>
          </div>
        </Link>

        <Link href="/admin/enrollments" className="group">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm group-hover:border-[#004aad]/40 group-hover:shadow-md transition-all flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrollments</p>
              <p className="text-3xl font-extrabold text-slate-900 font-montserrat">{stats.totalEnrollments}</p>
              <p className="text-[11px] text-[#004aad] font-semibold flex items-center gap-1 pt-1">
                <span>View applicants</span>
                <ArrowRight className="size-3" />
              </p>
            </div>
            <div className="size-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
              <Users className="size-6" />
            </div>
          </div>
        </Link>

        <Link href="/admin/users" className="group">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm group-hover:border-[#004aad]/40 group-hover:shadow-md transition-all flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Students</p>
              <p className="text-3xl font-extrabold text-slate-900 font-montserrat">{stats.totalStudents}</p>
              <p className="text-[11px] text-[#004aad] font-semibold flex items-center gap-1 pt-1">
                <span>Manage users</span>
                <ArrowRight className="size-3" />
              </p>
            </div>
            <div className="size-12 rounded-xl bg-cyan-50 text-[#00677e] flex items-center justify-center shrink-0 font-bold">
              <Users className="size-6" />
            </div>
          </div>
        </Link>


        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</p>
            <p className="text-3xl font-extrabold text-slate-900 font-montserrat">{inr(stats.totalRevenue)}</p>
            <p className="text-[11px] text-slate-400 font-semibold pt-1">Live Database Calculation</p>
          </div>
          <div className="size-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
            <TrendingUp className="size-6" />
          </div>
        </div>
      </div>

      {/* Quick Actions Shortcuts */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h2 className="font-montserrat text-lg font-extrabold text-slate-900">Quick Administrative Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/programs/new"
            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/50 hover:border-[#004aad]/30 transition-all flex items-center gap-3"
          >
            <div className="size-10 rounded-xl bg-blue-100 text-[#004aad] flex items-center justify-center shrink-0 font-bold">
              <Plus className="size-5" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900">Add New Program</p>
              <p className="text-[11px] text-slate-500 font-medium">Create cohort page</p>
            </div>
          </Link>

          <Link
            href="/admin/instructors"
            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-purple-50/50 hover:border-purple-300 transition-all flex items-center gap-3"
          >
            <div className="size-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900">Manage Instructors</p>
              <p className="text-[11px] text-slate-500 font-medium">Faculty & skills</p>
            </div>
          </Link>

          <Link
            href="/admin/enrollments"
            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-emerald-50/50 hover:border-emerald-300 transition-all flex items-center gap-3"
          >
            <div className="size-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
              <Users className="size-5" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900">Student Enrollments</p>
              <p className="text-[11px] text-slate-500 font-medium">Approve applications</p>
            </div>
          </Link>

          <Link
            href="/admin/faqs"
            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-amber-50/50 hover:border-amber-300 transition-all flex items-center gap-3"
          >
            <div className="size-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold">
              <HelpCircle className="size-5" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900">Global FAQs Pool</p>
              <p className="text-[11px] text-slate-500 font-medium">Edit program Q&As</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Grid: Recent Enrollments (2/3) + Active Programs (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Enrollments Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-montserrat text-lg font-extrabold text-slate-900">Recent Student Enrollments</h2>
              <p className="text-xs text-slate-500 font-medium">Real-time applications submitted by students</p>
            </div>
            <Link href="/admin/enrollments" className="text-xs font-bold text-[#004aad] hover:underline flex items-center gap-1">
              <span>View all</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {recentEnrollments.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium italic">
              No recent student enrollments found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Student</th>
                    <th className="pb-3">Program</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentEnrollments.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 pr-3">
                        <p className="font-bold text-slate-900">{item.user_name || "Student"}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{item.user_email}</p>
                      </td>
                      <td className="py-3.5 pr-3">
                        <p className="font-bold text-slate-800">{item.program_title}</p>
                      </td>
                      <td className="py-3.5 pr-3 font-semibold text-slate-700">
                        {inr(item.discounted_price)}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                            item.status === "active" || item.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Active Programs Summary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-montserrat text-lg font-extrabold text-slate-900">Active Programs</h2>
              <p className="text-xs text-slate-500 font-medium">Published core cohorts</p>
            </div>
            <Link href="/admin/programs" className="text-xs font-bold text-[#004aad] hover:underline">
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {recentPrograms.map((prog: any) => (
              <div key={prog.id} className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-[#004aad] uppercase">
                    {prog.category || "Cohort"}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{inr(prog.discounted_price)}</span>
                </div>
                <h4 className="font-montserrat text-xs font-bold text-slate-900">{prog.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  {prog.duration_weeks} Weeks • {prog.batch_mode}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}