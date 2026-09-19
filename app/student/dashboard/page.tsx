import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getStudentDashboard } from "@/services/dashboard.service";
import SiteHeader from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Sparkles } from "lucide-react";
import StudentDashboardTabs from "@/components/student-dashboard/StudentDashboardTabs";

export default async function StudentDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const dashboard = await getStudentDashboard(session.user.id);
  const { profile, enrollments, stats, certificates, jobApplications = [] } = dashboard;

  const initialLetter = (session.user.name || "S").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1 pt-28 sm:pt-32 md:pt-36 pb-12 lg:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">

          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#004aad] via-[#003c8c] to-[#00b4d8] p-8 md:p-10 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00d2fd]/20 rounded-full blur-3xl transform -translate-x-20 translate-y-20 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "Student"}
                    className="size-16 md:size-20 rounded-full object-cover border-2 border-white/30 shadow-md"
                  />
                ) : (
                  <div className="size-16 md:size-20 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center font-extrabold text-2xl text-white shadow-md">
                    {initialLetter}
                  </div>
                )}
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#00d2fd]">
                    <Sparkles className="size-3.5" />
                    <span>Student Dashboard</span>
                  </div>
                  <h1 className="font-montserrat text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                    Welcome back, {session.user.name || "Student"} 👋
                  </h1>
                  {/* Profile info chips */}
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-3 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                      {session.user.email}
                    </span>
                    {profile?.college_name && (
                      <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-3 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
                        {profile.college_name}
                      </span>
                    )}
                    {profile?.degree && (
                      <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-3 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                        {profile.degree}{profile?.branch ? ` · ${profile.branch}` : ""}
                      </span>
                    )}
                    {profile?.mobile_number && (
                      <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-3 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.64 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        {profile.mobile_number}
                      </span>
                    )}
                    {(!profile?.college_name || !profile?.degree || !profile?.mobile_number) && (
                      <a href="/student/profile" className="inline-flex items-center gap-1 text-[#00d2fd] text-[11px] font-semibold hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
                        Complete your profile
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/student/profile"
                  className="bg-[#00d2fd] hover:bg-[#3cd7ff] text-[#001f27] font-bold px-6 py-2.5 rounded-full text-xs md:text-sm transition-all shadow-md flex items-center gap-2"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Tabbed Content: Courses & Job Applications */}
          <StudentDashboardTabs
            enrollments={enrollments}
            certificates={certificates}
            jobApplications={jobApplications}
            stats={stats}
          />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}