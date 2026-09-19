"use client";

import { useState } from "react";
import { UserCheck, FileText, ExternalLink, Calendar, Mail, Phone, Eye } from "lucide-react";
import ApplicantProfileModal from "@/components/company/ApplicantProfileModal";

interface Applicant {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: string;
  applied_at: string;
  student_name: string;
  student_email: string;
  student_phone?: string;
  resume_url?: string;
  profile_photo_url?: string;
  college_name?: string;
  degree?: string;
  tech_stack?: string[];
  years_experience?: string;
}

interface AdminApplicantsTableProps {
  applicants: Applicant[];
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    applied: "bg-blue-50 text-[#004aad] border-blue-200",
    reviewing: "bg-purple-50 text-purple-700 border-purple-200",
    shortlisted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    interview_scheduled: "bg-amber-50 text-amber-800 border-amber-200",
    hired: "bg-teal-50 text-teal-800 border-teal-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[status] || "bg-slate-100 text-slate-700 border-slate-200";
}

export default function AdminApplicantsTable({ applicants }: AdminApplicantsTableProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-montserrat text-lg font-extrabold text-slate-900">
              Applicants Received
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#004aad] text-xs font-extrabold border border-blue-200">
              {applicants.length} candidates
            </span>
          </div>
        </div>

        {applicants.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-medium text-xs italic">
            No candidates have applied for this position yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Candidate</th>
                  <th className="py-4 px-6">Academic / Experience</th>
                  <th className="py-4 px-6">Contact Details</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Applied Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applicants.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Candidate */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {a.profile_photo_url ? (
                          <img
                            src={a.profile_photo_url}
                            alt={a.student_name}
                            className="size-9 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="size-9 rounded-full bg-gradient-to-br from-[#004aad] to-[#00d2fd] text-white flex items-center justify-center font-extrabold text-xs shrink-0">
                            {a.student_name ? a.student_name[0].toUpperCase() : "S"}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 text-xs">
                            {a.student_name || "Applicant"}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {a.student_email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Academic / Experience */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-800 text-xs line-clamp-1">
                          {a.college_name || a.degree || "Not specified"}
                        </p>
                        {a.years_experience && (
                          <p className="text-[10px] text-[#004aad] font-bold">
                            {a.years_experience} yrs exp
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <a
                          href={`mailto:${a.student_email}`}
                          className="flex items-center gap-1.5 text-slate-600 hover:text-[#004aad]"
                        >
                          <Mail className="size-3 text-slate-400" />
                          <span>{a.student_email}</span>
                        </a>
                        {a.student_phone && (
                          <a
                            href={`tel:${a.student_phone}`}
                            className="flex items-center gap-1.5 text-slate-600 hover:text-[#004aad]"
                          >
                            <Phone className="size-3 text-slate-400" />
                            <span>{a.student_phone}</span>
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize border ${statusBadge(
                          a.status
                        )}`}
                      >
                        {a.status?.replace("_", " ")}
                      </span>
                    </td>

                    {/* Applied Date */}
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-slate-400" />
                        <span>
                          {a.applied_at
                            ? new Date(a.applied_at).toLocaleDateString("en-IN", {
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
                        {a.resume_url && (
                          <a
                            href={
                              a.resume_url.startsWith("http")
                                ? a.resume_url
                                : `https://${a.resume_url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#004aad] hover:bg-slate-50 transition-colors inline-flex items-center gap-1 text-[11px] font-bold"
                            title="Download / View Resume"
                          >
                            <FileText className="size-3.5 text-slate-500" />
                            <span>Resume</span>
                            <ExternalLink className="size-3" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedUserId(a.user_id)}
                          className="px-3 py-1.5 rounded-xl bg-[#004aad] hover:bg-[#003882] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <Eye className="size-3.5" />
                          <span>View Profile</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedUserId && (
        <ApplicantProfileModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </>
  );
}
