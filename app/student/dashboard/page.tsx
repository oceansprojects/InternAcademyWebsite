import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getStudentDashboard } from "@/services/dashboard.service";
import SiteHeader from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  BookOpen,
  Award,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  User,
  GraduationCap,
  Calendar,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Phone,
  Building,
  Download,
} from "lucide-react";

function inr(n: number) {
  return "₹" + (n || 0).toLocaleString("en-IN");
}

export default async function StudentDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const dashboard = await getStudentDashboard(session.user.id);
  const { profile, enrollments, stats, certificates } = dashboard;

  const initialLetter = (session.user.name || "S").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-8 lg:py-12">
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
                  <p className="text-xs md:text-sm text-white/80 max-w-xl font-normal">
                    Track your cohort enrollments, learning progress, certificates, and profile information in one place.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/courses"
                  className="bg-[#00d2fd] hover:bg-[#3cd7ff] text-[#001f27] font-bold px-5 py-2.5 rounded-xl text-xs md:text-sm transition-all shadow-md flex items-center gap-2"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/student/profile"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs md:text-sm transition-all"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Summary Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="size-12 rounded-xl bg-blue-50 text-[#004aad] flex items-center justify-center shrink-0 font-bold">
                <BookOpen className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Cohorts</p>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-montserrat mt-0.5">{stats.activePrograms}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="size-12 rounded-xl bg-cyan-50 text-[#00677e] flex items-center justify-center shrink-0 font-bold">
                <FileText className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Applications</p>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-montserrat mt-0.5">{stats.applications}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="size-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
                <Award className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Certificates</p>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-montserrat mt-0.5">{stats.certificates}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="size-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                <Clock className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Learning Hours</p>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-montserrat mt-0.5">{stats.hoursLearned}h</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid: Courses (2/3) + Sidebar Widgets (1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Enrolled Courses */}
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
                        You haven't enrolled in any educational programs yet. Browse our top-rated offline cohorts in Bengaluru and start learning!
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
                    {enrollments.map((item: any) => (
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
                              <div className="size-14 rounded-xl bg-gradient-to-br from-[#004aad] to-[#00b4d8] text-white flex items-center justify-center font-extrabold text-lg shrink-0 hidden sm:flex">
                                {item.title.charAt(0)}
                              </div>
                            )}

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                {item.category && (
                                  <span className="bg-blue-50 text-[#004aad] text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                                    {item.category}
                                  </span>
                                )}
                                <span className="text-[11px] font-semibold text-slate-500">
                                  {item.duration_weeks} Weeks Cohort
                                </span>
                              </div>

                              <h3 className="font-montserrat text-base font-extrabold text-slate-900 group-hover:text-[#004aad] transition-colors">
                                {item.title}
                              </h3>

                              <div className="flex items-center gap-4 text-xs text-slate-500 font-medium pt-0.5">
                                <span className="flex items-center gap-1">
                                  <MapPin className="size-3 text-slate-400" />
                                  {item.batch_mode === "offline" ? "Koramangala, Bengaluru" : item.batch_mode}
                                </span>
                                {item.discounted_price && (
                                  <span className="font-bold text-slate-800">
                                    {inr(item.discounted_price)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                item.status === "active" || item.status === "approved"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : item.status === "completed"
                                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                                  : "bg-amber-100 text-amber-800 border border-amber-200"
                              }`}
                            >
                              {item.status || "Enrolled"}
                            </span>

                            <Link
                              href={`/courses/${item.slug}`}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#004aad] hover:text-[#003c8c] bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors"
                            >
                              <span>Course Page</span>
                              <ExternalLink className="size-3.5" />
                            </Link>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                            <span>Cohort Progress</span>
                            <span className="text-[#004aad] font-bold">
                              {item.status === "completed" ? "100%" : item.status === "active" ? "45%" : "15%"}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#004aad] to-[#00d2fd] rounded-full transition-all duration-500"
                              style={{
                                width: item.status === "completed" ? "100%" : item.status === "active" ? "45%" : "15%",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Widgets */}
            <div className="space-y-6">
              
              {/* Profile Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-montserrat text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <User className="size-4 text-[#004aad]" />
                    <span>Student Profile</span>
                  </h3>
                  <Link href="/student/profile" className="text-xs font-bold text-[#004aad] hover:underline">
                    Edit
                  </Link>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <p className="text-slate-400 font-semibold uppercase text-[10px]">Name</p>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">{session.user.name}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-semibold uppercase text-[10px]">Email</p>
                    <p className="font-semibold text-slate-700 mt-0.5">{session.user.email}</p>
                  </div>

                  {profile?.college_name && (
                    <div>
                      <p className="text-slate-400 font-semibold uppercase text-[10px]">College / Institution</p>
                      <p className="font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                        <Building className="size-3 text-slate-400" />
                        <span>{profile.college_name}</span>
                      </p>
                    </div>
                  )}

                  {profile?.degree && (
                    <div>
                      <p className="text-slate-400 font-semibold uppercase text-[10px]">Degree & Branch</p>
                      <p className="font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                        <GraduationCap className="size-3 text-slate-400" />
                        <span>{profile.degree} - {profile.branch}</span>
                      </p>
                    </div>
                  )}

                  {profile?.mobile_number && (
                    <div>
                      <p className="text-slate-400 font-semibold uppercase text-[10px]">Contact Mobile</p>
                      <p className="font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                        <Phone className="size-3 text-slate-400" />
                        <span>{profile.mobile_number}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming Labs Info */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-md space-y-4">
                <div className="flex items-center gap-2 text-[#00d2fd] text-xs font-extrabold uppercase tracking-wider">
                  <Calendar className="size-4" />
                  <span>Koramangala Learning Hub</span>
                </div>
                <h4 className="font-montserrat text-base font-bold">
                  In-Person Design & Code Labs
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  All active cohorts meet in person at our Bengaluru center for daily mentor code reviews and agency client briefs.
                </p>
                <div className="border-t border-slate-700/80 pt-3 flex justify-between items-center text-xs font-semibold text-slate-300">
                  <span>Schedule: Mon–Fri</span>
                  <span className="text-[#00d2fd] font-bold">9 AM – 6 PM</span>
                </div>
              </div>

              {/* Certificates Widget */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-montserrat text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Award className="size-4 text-amber-500" />
                    <span>Issued Credentials</span>
                  </h3>
                  {certificates.length > 0 && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                      {certificates.length} Cert{certificates.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {certificates.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium italic">
                    Complete your cohort modules to earn a QR-verifiable certificate.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {certificates.map((cert: any) => (
                      <div key={cert.id} className="p-3.5 bg-amber-50/60 border border-amber-200/60 rounded-xl space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-amber-900 leading-tight">{cert.program_title}</p>
                            <p className="text-[10px] text-amber-700 font-semibold font-mono mt-0.5">ID: {cert.cert_number}</p>
                          </div>
                          <CheckCircle2 className="size-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        </div>
                        {cert.certificate_url && cert.is_active ? (
                          <a
                            href={cert.certificate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 w-full justify-center px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition-colors shadow-sm"
                          >
                            <Download className="size-3.5" />
                            Download Certificate
                          </a>
                        ) : (
                          <p className="text-[10px] text-amber-600 italic font-medium text-center">
                            Certificate link will be available soon
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}