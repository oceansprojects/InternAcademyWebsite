"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Calendar,
  CreditCard,
  User,
  GraduationCap,
} from "lucide-react";
import EnrollmentInlineDetails from "@/components/admin/enrollments/EnrollmentInlineDetails";

interface Props {
  enrollments: any[];
}

export default function EnrollmentTable({ enrollments: initialEnrollments }: Props) {
  const [enrollments, setEnrollments] = useState<any[]>(initialEnrollments || []);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((item) => {
      const matchesSearch =
        (item.student_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.student_email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.program_title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.college_name || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all"
          ? true
          : (item.status || "").toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [enrollments, searchQuery, statusFilter]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleStatusUpdated = (id: string, newStatus: string) => {
    setEnrollments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const handlePaymentUpdated = (id: string, newPaymentStatus: string, newAmountPaid?: number) => {
    setEnrollments((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              payment_status: newPaymentStatus,
              amount_paid: newAmountPaid !== undefined ? newAmountPaid : item.amount_paid,
            }
          : item
      )
    );
  };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: enrollments.length, pending: 0, active: 0, completed: 0, dropped: 0 };
    enrollments.forEach((e) => {
      const s = (e.status || "pending").toLowerCase();
      if (counts[s] !== undefined) counts[s]++;
    });
    return counts;
  }, [enrollments]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-montserrat text-2xl font-extrabold text-slate-900">
              Student Enrollments & Applications
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Review, approve, and manage all student cohort enrollments inline. Click "View Details" on any row to open its decision center.
            </p>
          </div>
          <div className="bg-blue-50 text-[#004aad] text-xs font-bold px-3.5 py-1.5 rounded-full border border-blue-100">
            Total Enrollments: {filteredEnrollments.length}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input
              type="text"
              placeholder="Search by student, email, college, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            {["all", "pending", "active", "completed", "dropped"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === tab
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === tab ? "bg-blue-50 text-[#004aad]" : "bg-slate-200/80 text-slate-600"
                  }`}
                >
                  {statusCounts[tab] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">Student Information</th>
                <th className="py-4 px-6">Enrolled Program</th>
                <th className="py-4 px-6">Application Status</th>
                <th className="py-4 px-6">Payment Status</th>
                <th className="py-4 px-6">Enrolled Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 font-medium italic">
                    No enrollments found matching your search or filters.
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((item: any) => {
                  const isExpanded = expandedId === item.id;

                  return (
                    <React.Fragment key={item.id}>
                      {/* Main Table Row */}
                      <tr
                        className={`transition-colors cursor-pointer ${
                          isExpanded
                            ? "bg-blue-50/60 font-semibold"
                            : "hover:bg-slate-50/80"
                        }`}
                        onClick={() => toggleExpand(item.id)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`size-9 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 transition-colors ${
                                isExpanded
                                  ? "bg-[#004aad] text-white"
                                  : "bg-blue-100 text-[#004aad]"
                              }`}
                            >
                              {(item.student_name || "S").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-xs">
                                {item.student_name || "Student"}
                              </p>
                              <p className="text-[11px] text-slate-500 font-normal">
                                {item.student_email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-800 text-xs">{item.program_title}</p>
                          <p className="text-[10px] text-slate-400 font-normal">
                            {item.batch_mode || "Online"} &bull; {item.duration_weeks ? `${item.duration_weeks}w` : "Cohort"}
                          </p>
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize ${
                              item.status === "active" || item.status === "approved"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : item.status === "completed"
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : item.status === "dropped"
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {item.status || "Pending"}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              item.payment_status === "paid"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : item.payment_status === "failed"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : item.payment_status === "refunded"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {item.payment_status || "Pending"}
                            {item.amount_paid !== undefined && item.amount_paid !== null && Number(item.amount_paid) > 0 ? ` (₹${Number(item.amount_paid).toLocaleString("en-IN")})` : ""}
                          </span>
                        </td>

                        <td className="py-4 px-6 font-medium text-slate-600">
                          {item.enrolled_at
                            ? new Date(item.enrolled_at).toLocaleDateString("en-IN")
                            : "N/A"}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(item.id);
                            }}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isExpanded
                                ? "bg-[#004aad] text-white shadow-md shadow-blue-900/20"
                                : "bg-blue-50 text-[#004aad] hover:bg-blue-100"
                            }`}
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="size-3.5" />
                                <span>Hide Details</span>
                              </>
                            ) : (
                              <>
                                <Eye className="size-3.5" />
                                <span>View Details</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Inline Expanded Details & Decision Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="p-0">
                            <EnrollmentInlineDetails
                              enrollment={item}
                              onClose={() => setExpandedId(null)}
                              onStatusUpdated={(newStatus) =>
                                handleStatusUpdated(item.id, newStatus)
                              }
                              onPaymentUpdated={(newPaymentStatus, newAmountPaid) =>
                                handlePaymentUpdated(item.id, newPaymentStatus, newAmountPaid)
                              }
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}