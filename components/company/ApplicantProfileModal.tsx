"use client";

import { useEffect, useState } from "react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Award,
  FileCheck2,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
  Calendar,
  Sparkles,
  Globe,
} from "lucide-react";

function GithubIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

interface ApplicantProfileModalProps {
  userId: string;
  onClose: () => void;
}

export default function ApplicantProfileModal({
  userId,
  onClose,
}: ApplicantProfileModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "education" | "experience" | "projects" | "certificates"
  >("overview");

  useEffect(() => {
    async function loadFullProfile() {
      setLoading(true);
      try {
        const res = await fetch(`/api/company/applicants/${userId}/profile`);
        if (!res.ok) {
          let msg = "Failed to load candidate profile";
          try {
            const errData = await res.json();
            msg = errData.error || msg;
          } catch {
            // response was HTML or empty
          }
          throw new Error(msg);
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadFullProfile();
  }, [userId]);

  const p = data?.profile;
  const education = data?.education || [];
  const jobs = data?.jobs || [];
  const projects = data?.projects || [];
  const achievements = data?.achievements || [];
  const certificates = data?.certificates || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh] animate-fadeIn">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#004aad] border border-blue-200">
              <Sparkles className="size-3" />
              Candidate Comprehensive Profile
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
                <Loader2 className="size-6 animate-spin text-[#004aad]" />
                <span>Loading complete candidate profile...</span>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center space-y-3">
              <AlertCircle className="size-8 text-rose-600 mx-auto" />
              <p className="text-sm font-bold text-rose-800">{error}</p>
            </div>
          ) : (
            <>
              {/* Profile Top Banner Card */}
              <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-start sm:items-center gap-5">
                  <div className="size-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#004aad] font-black text-2xl overflow-hidden shrink-0 shadow-sm">
                    {p?.profile_photo_url ? (
                      <img
                        src={p.profile_photo_url}
                        alt={p?.full_name || "Student"}
                        className="size-full object-cover"
                      />
                    ) : (
                      (p?.full_name || p?.user_name || "S")[0]?.toUpperCase()
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-montserrat text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                        {p?.full_name || p?.user_name || "Candidate"}
                      </h2>
                      {p?.years_experience && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100/70 text-[#004aad] border border-blue-200">
                          {p.years_experience} yrs exp
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      {p?.email && (
                        <a
                          href={`mailto:${p.email}`}
                          className="flex items-center gap-1 hover:text-[#004aad]"
                        >
                          <Mail className="size-3.5 text-slate-400" />
                          <span>{p.email}</span>
                        </a>
                      )}
                      {(p?.phone_number || p?.mobile_number) && (
                        <a
                          href={`tel:${p.phone_number || p.mobile_number}`}
                          className="flex items-center gap-1 hover:text-[#004aad]"
                        >
                          <Phone className="size-3.5 text-slate-400" />
                          <span>{p.phone_number || p.mobile_number}</span>
                        </a>
                      )}
                      {(p?.address_city || p?.address_state) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3.5 text-slate-400" />
                          <span>
                            {[p.address_city, p.address_state, p.address_nation]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Social & Portfolio Links */}
                    <div className="flex items-center gap-3 pt-1">
                      {p?.github_url && (
                        <a
                          href={p.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-[#004aad] transition-colors"
                        >
                          <GithubIcon className="size-3.5" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {p?.linkedin_url && (
                        <a
                          href={p.linkedin_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-[#004aad] transition-colors"
                        >
                          <LinkedinIcon className="size-3.5" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {p?.portfolio_url && (
                        <a
                          href={p.portfolio_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-[#004aad] transition-colors"
                        >
                          <Globe className="size-3.5" />
                          <span>Portfolio</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Resume Action */}
                <div className="shrink-0 flex sm:flex-col items-start sm:items-end gap-2">
                  {p?.resume_url ? (
                    <a
                      href={
                        p.resume_url.startsWith("http")
                          ? p.resume_url
                          : `https://${p.resume_url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#004aad] text-white text-xs font-bold hover:bg-[#003882] shadow-sm transition-colors"
                    >
                      <FileText className="size-3.5" />
                      <span>Download Resume</span>
                      <ExternalLink className="size-3 ml-0.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No resume URL provided</span>
                  )}
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-0.5">
                {[
                  { key: "overview", label: "Overview & Skills", icon: Sparkles },
                  { key: "education", label: `Education (${education.length})`, icon: GraduationCap },
                  { key: "experience", label: `Work Experience (${jobs.length})`, icon: Briefcase },
                  { key: "projects", label: `Projects (${projects.length})`, icon: FolderGit2 },
                  {
                    key: "certificates",
                    label: `Credentials (${certificates.length + achievements.length})`,
                    icon: Award,
                  },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`pb-2.5 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${activeTab === tab.key
                          ? "border-[#004aad] text-[#004aad]"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                    >
                      <Icon className="size-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab: Overview & Skills */}
              {activeTab === "overview" && (
                <div className="space-y-5">
                  {/* Skills Box */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-sm">
                    <h3 className="font-montserrat text-sm font-extrabold uppercase tracking-wider text-slate-800">
                      Technical Skills & Stack
                    </h3>
                    {p?.tech_stack && p.tech_stack.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {p.tech_stack.map((tech: string) => (
                          <span
                            key={tech}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#004aad] text-xs font-bold border border-blue-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">No specific skills listed.</p>
                    )}
                  </div>

                  {/* Academic Snapshot */}
                  {(p?.college_name || p?.degree) && (
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-sm">
                      <h3 className="font-montserrat text-sm font-extrabold uppercase tracking-wider text-slate-800">
                        Primary College & Academic Profile
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 block font-semibold">Institute / College</span>
                          <span className="text-slate-800 font-bold text-sm">
                            {p.college_name || ""}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold">Degree & Stream</span>
                          <span className="text-slate-800 font-bold text-sm">
                            {[p.degree, p.branch].filter(Boolean).join(" • ") || ""}
                          </span>
                        </div>
                        {p?.current_year && (
                          <div>
                            <span className="text-slate-400 block font-semibold">Current Year</span>
                            <span className="text-slate-800 font-bold">Year {p.current_year}</span>
                          </div>
                        )}
                        {p?.whatsapp_number && (
                          <div>
                            <span className="text-slate-400 block font-semibold">WhatsApp</span>
                            <span className="text-slate-800 font-bold">{p.whatsapp_number}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Education */}
              {activeTab === "education" && (
                <div className="space-y-4">
                  {education.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-500">
                      No additional education records submitted.
                    </div>
                  ) : (
                    education.map((edu: any) => (
                      <div
                        key={edu.id}
                        className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-2 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-montserrat text-base font-bold text-slate-900">
                              {edu.institute_name}
                            </h4>
                            <p className="text-xs text-slate-600 font-semibold mt-0.5">
                              {[edu.stream, edu.branch].filter(Boolean).join(" • ")}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-[#004aad] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 shrink-0">
                            {edu.start_year} – {edu.currently_studying ? "Present" : edu.end_year}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                          {(edu.city || edu.state) && (
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3 text-slate-400" />
                              {[edu.city, edu.state].filter(Boolean).join(", ")}
                            </span>
                          )}
                          {edu.grade_cgpa && (
                            <span className="font-bold text-slate-700">
                              Score / CGPA: {edu.grade_cgpa}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab: Work Experience */}
              {activeTab === "experience" && (
                <div className="space-y-4">
                  {jobs.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-500">
                      No prior work experience or internships recorded.
                    </div>
                  ) : (
                    jobs.map((job: any) => (
                      <div
                        key={job.id}
                        className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-2.5 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-montserrat text-base font-bold text-slate-900">
                                {job.position}
                              </h4>
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                {job.type}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-[#004aad] mt-0.5">
                              {job.company_name}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg shrink-0">
                            {job.start_month}/{job.start_year} –{" "}
                            {job.currently_working ? "Present" : `${job.end_month}/${job.end_year}`}
                          </span>
                        </div>

                        {(job.city || job.state) && (
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="size-3 text-slate-400" />
                            {[job.city, job.state].filter(Boolean).join(", ")}
                          </p>
                        )}

                        {job.description && (
                          <p className="text-xs text-slate-600 leading-relaxed pt-1 whitespace-pre-line border-t border-slate-100">
                            {job.description}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab: Projects */}
              {activeTab === "projects" && (
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-500">
                      No projects submitted yet.
                    </div>
                  ) : (
                    projects.map((proj: any) => (
                      <div
                        key={proj.id}
                        className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-montserrat text-base font-bold text-slate-900">
                            {proj.title}
                          </h4>
                          {proj.project_url && (
                            <a
                              href={proj.project_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#004aad] hover:underline shrink-0"
                            >
                              <span>Live Project</span>
                              <ExternalLink className="size-3" />
                            </a>
                          )}
                        </div>

                        {proj.description && (
                          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                            {proj.description}
                          </p>
                        )}

                        {proj.tech_stack && proj.tech_stack.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {proj.tech_stack.map((t: string) => (
                              <span
                                key={t}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#004aad] border border-blue-100"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab: Certificates & Achievements */}
              {activeTab === "certificates" && (
                <div className="space-y-6">
                  {/* Certificates */}
                  <div className="space-y-3">
                    <h3 className="font-montserrat text-sm font-extrabold uppercase tracking-wider text-slate-800">
                      Certificates & Credentials ({certificates.length})
                    </h3>
                    {certificates.length === 0 ? (
                      <p className="text-xs text-slate-400">No certificates listed.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {certificates.map((cert: any) => (
                          <div
                            key={cert.id}
                            className="rounded-xl border border-slate-200/80 bg-white p-4 space-y-1 shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="font-bold text-xs text-slate-900 line-clamp-1">
                                {cert.title}
                              </h5>
                              {cert.certificate_link && (
                                <a
                                  href={cert.certificate_link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#004aad] hover:opacity-80"
                                >
                                  <ExternalLink className="size-3" />
                                </a>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 font-medium">
                              {cert.issuing_org}
                            </p>
                            {cert.issue_date && (
                              <p className="text-[10px] text-slate-400">
                                Issued: {new Date(cert.issue_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Achievements */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h3 className="font-montserrat text-sm font-extrabold uppercase tracking-wider text-slate-800">
                      Awards & Achievements ({achievements.length})
                    </h3>
                    {achievements.length === 0 ? (
                      <p className="text-xs text-slate-400">No achievements recorded.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {achievements.map((ach: any) => (
                          <div
                            key={ach.id}
                            className="rounded-xl border border-slate-200/80 bg-white p-4 space-y-1 shadow-sm"
                          >
                            <h5 className="font-bold text-xs text-slate-900">{ach.title}</h5>
                            {ach.organization && (
                              <p className="text-[11px] text-[#004aad] font-semibold">
                                {ach.organization}
                              </p>
                            )}
                            {ach.description && (
                              <p className="text-[11px] text-slate-600 leading-relaxed">
                                {ach.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
