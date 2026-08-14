"use client";

import { useState } from "react";
import {
  User,
  GraduationCap,
  BookOpen,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  Building,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronUp,
  Award,
  Sparkles,
  Loader2,
  Check,
  RotateCcw,
  DollarSign,
  Edit3,
} from "lucide-react";
import { updateEnrollmentStatus, updateEnrollmentPayment } from "@/services/enrollment.api";
import { toast } from "sonner";

interface Props {
  enrollment: any;
  onClose: () => void;
  onStatusUpdated: (newStatus: string) => void;
  onPaymentUpdated?: (newPaymentStatus: string, newAmountPaid?: number) => void;
}

export default function EnrollmentInlineDetails({
  enrollment,
  onClose,
  onStatusUpdated,
  onPaymentUpdated,
}: Props) {
  // Application Status
  const [currentStatus, setCurrentStatus] = useState<string>(
    enrollment?.status || "pending"
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(
    enrollment?.status || "pending"
  );
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [actionTarget, setActionTarget] = useState<string | null>(null);

  // Payment Status & Amount
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState<string>(
    enrollment?.payment_status || "pending"
  );
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>(
    enrollment?.payment_status || "pending"
  );
  const [amountPaid, setAmountPaid] = useState<number>(
    enrollment?.amount_paid !== undefined ? Number(enrollment.amount_paid) : 0
  );
  const [editingAmount, setEditingAmount] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentActionTarget, setPaymentActionTarget] = useState<string | null>(null);

  // Course Price Calculations (Selling price is discounted_price if > 0, else base_price)
  const courseSellingPrice =
    Number(enrollment?.discounted_price) > 0
      ? Number(enrollment.discounted_price)
      : Number(enrollment?.base_price) || 0;
  const halfCoursePrice = Math.round(courseSellingPrice / 2);

  // Status Handlers
  const handleApplyStatus = async (newStatus: string) => {
    if (loadingStatus) return;
    try {
      setLoadingStatus(true);
      setActionTarget(newStatus);
      await updateEnrollmentStatus(
        enrollment.id,
        newStatus as "pending" | "active" | "completed" | "dropped"
      );
      setCurrentStatus(newStatus);
      setSelectedStatus(newStatus);
      onStatusUpdated(newStatus);
      toast.success(
        `Enrollment status updated to "${newStatus.toUpperCase()}" successfully!`
      );
    } catch (err: any) {
      console.error("[Enrollment Update Error]:", err);
      toast.error(err?.message || "Failed to update enrollment status.");
    } finally {
      setLoadingStatus(false);
      setActionTarget(null);
    }
  };

  // Payment Status Handlers with automatic intelligent pricing defaults
  const handleApplyPayment = async (newPaymentStatus: string, customAmount?: number) => {
    if (loadingPayment) return;

    // Calculate final amount based on payment status selection or custom input
    let finalAmount: number;
    if (customAmount !== undefined) {
      finalAmount = Number(customAmount) || 0;
    } else {
      if (newPaymentStatus === "paid") {
        finalAmount = courseSellingPrice > 0 ? courseSellingPrice : amountPaid;
      } else if (newPaymentStatus === "pending") {
        finalAmount = halfCoursePrice > 0 ? halfCoursePrice : Math.round(amountPaid / 2);
      } else if (newPaymentStatus === "failed" || newPaymentStatus === "refunded") {
        finalAmount = 0;
      } else {
        finalAmount = amountPaid;
      }
    }

    try {
      setLoadingPayment(true);
      setPaymentActionTarget(newPaymentStatus);
      await updateEnrollmentPayment(
        enrollment.id,
        newPaymentStatus as "pending" | "paid" | "failed" | "refunded",
        finalAmount
      );
      setCurrentPaymentStatus(newPaymentStatus);
      setSelectedPaymentStatus(newPaymentStatus);
      setAmountPaid(finalAmount);
      setEditingAmount(false);
      if (onPaymentUpdated) {
        onPaymentUpdated(newPaymentStatus, finalAmount);
      }
      toast.success(
        `Payment updated to "${newPaymentStatus.toUpperCase()}" (₹${finalAmount.toLocaleString("en-IN")})!`
      );
    } catch (err: any) {
      console.error("[Payment Update Error]:", err);
      toast.error(err?.message || "Failed to update payment status.");
    } finally {
      setLoadingPayment(false);
      setPaymentActionTarget(null);
    }
  };

  const statusColors: Record<string, { bg: string; text: string; border: string; label: string }> = {
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      label: "Pending Review",
    },
    active: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      label: "Confirmed / Active",
    },
    completed: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      label: "Graduated / Completed",
    },
    dropped: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      label: "Dropped / Cancelled",
    },
  };

  const paymentColors: Record<string, { bg: string; text: string; border: string; label: string }> = {
    paid: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      border: "border-emerald-200",
      label: "PAID",
    },
    pending: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      border: "border-amber-200",
      label: "PENDING",
    },
    failed: {
      bg: "bg-rose-100",
      text: "text-rose-800",
      border: "border-rose-200",
      label: "FAILED",
    },
    refunded: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-200",
      label: "REFUNDED",
    },
  };

  const currentBadge = statusColors[currentStatus] || statusColors.pending;
  const currentPayBadge = paymentColors[currentPaymentStatus] || paymentColors.pending;

  return (
    <div className="bg-gradient-to-b from-slate-50/90 via-white to-slate-50/50 p-6 border-y-2 border-[#004aad]/30 shadow-inner">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-[#004aad] to-[#002f70] text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-blue-900/10 shrink-0">
              {(enrollment.student_name || "S").charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-extrabold text-slate-900 font-montserrat">
                  {enrollment.student_name || "Unknown Student"}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${currentBadge.bg} ${currentBadge.text} ${currentBadge.border}`}
                >
                  <span className="size-1.5 rounded-full bg-current"></span>
                  {currentBadge.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${currentPayBadge.bg} ${currentPayBadge.text} ${currentPayBadge.border}`}
                >
                  Payment: {currentPayBadge.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-3.5 text-slate-400" />
                  {enrollment.student_email}
                </span>
                {enrollment.mobile_number && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="size-3.5 text-slate-400" />
                    {enrollment.mobile_number}
                  </span>
                )}
                <span className="text-slate-400 font-mono text-[11px]">
                  ID: {enrollment.id?.slice(0, 8)}...
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="self-start md:self-center inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <ChevronUp className="size-4" />
            <span>Collapse Details</span>
          </button>
        </div>

        {/* 3-Column Detailed Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Academic & College Profile */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
              <div className="p-1.5 bg-blue-50 text-[#004aad] rounded-lg">
                <GraduationCap className="size-4" />
              </div>
              <h4>Academic Profile</h4>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">College / University</p>
                <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                  <Building className="size-3.5 text-slate-400 shrink-0" />
                  <span>{enrollment.college_name || "Not Specified"}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <p className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Degree</p>
                  <p className="font-bold text-slate-800 mt-0.5">{enrollment.degree || "N/A"}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Branch</p>
                  <p className="font-bold text-slate-800 mt-0.5">{enrollment.branch || "N/A"}</p>
                </div>
              </div>

              <div className="pt-1">
                <p className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Current Academic Year</p>
                <p className="font-bold text-slate-800 mt-0.5">
                  {enrollment.current_year ? `Year ${enrollment.current_year}` : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Program & Cohort Details */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <BookOpen className="size-4" />
              </div>
              <h4>Enrolled Program</h4>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Program Title</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{enrollment.program_title}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <p className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Category</p>
                  <p className="font-bold text-slate-800 mt-0.5">{enrollment.program_category || "General"}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Duration</p>
                  <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    <Clock className="size-3 text-slate-400" />
                    <span>{enrollment.duration_weeks ? `${enrollment.duration_weeks} Weeks` : "Flexible"}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <p className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Batch Mode</p>
                  <span className="inline-block font-bold text-slate-800 capitalize mt-0.5 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {enrollment.batch_mode || "Online"}
                  </span>
                </div>
                <div>
                  <p className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Location</p>
                  <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    <MapPin className="size-3 text-slate-400" />
                    <span>{enrollment.location || "Remote"}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Payment & Application History */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <CreditCard className="size-4" />
                </div>
                <h4>Payment & History</h4>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${currentPayBadge.bg} ${currentPayBadge.text} ${currentPayBadge.border}`}
              >
                {currentPaymentStatus}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Amount Paid</p>
                  {editingAmount ? (
                    <div className="mt-1 space-y-2">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 font-bold">₹</span>
                        <input
                          type="number"
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(Number(e.target.value) || 0)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleApplyPayment(currentPaymentStatus, amountPaid);
                            }
                          }}
                          autoFocus
                          className="w-24 px-2 py-1 bg-slate-50 border border-slate-300 rounded font-bold text-slate-900 text-xs focus:ring-1 focus:ring-[#004aad] outline-none"
                        />
                      </div>

                      {/* Quick preset chips */}
                      <div className="flex flex-wrap gap-1">
                        {courseSellingPrice > 0 && (
                          <button
                            type="button"
                            onClick={() => setAmountPaid(courseSellingPrice)}
                            className="px-1.5 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200 font-medium"
                          >
                            Full: ₹{courseSellingPrice.toLocaleString("en-IN")}
                          </button>
                        )}
                        {halfCoursePrice > 0 && (
                          <button
                            type="button"
                            onClick={() => setAmountPaid(halfCoursePrice)}
                            className="px-1.5 py-0.5 text-[10px] bg-amber-50 text-amber-700 hover:bg-amber-100 rounded border border-amber-200 font-medium"
                          >
                            50%: ₹{halfCoursePrice.toLocaleString("en-IN")}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setAmountPaid(0)}
                          className="px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-600 hover:bg-slate-200 rounded border border-slate-200 font-medium"
                        >
                          ₹0
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleApplyPayment(currentPaymentStatus, amountPaid)}
                          disabled={loadingPayment}
                          className="px-2.5 py-1 bg-[#004aad] text-white rounded text-[11px] font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {loadingPayment ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAmount(false)}
                          disabled={loadingPayment}
                          className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[11px] font-bold hover:bg-slate-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-0.5 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <p className="font-extrabold text-slate-900 text-base">
                          ₹{(amountPaid || 0).toLocaleString("en-IN")}
                        </p>
                        <button
                          onClick={() => setEditingAmount(true)}
                          className="text-slate-400 hover:text-[#004aad] transition-colors p-1 rounded-md hover:bg-slate-100"
                          title="Click to edit custom price"
                        >
                          <Edit3 className="size-3.5" />
                        </button>
                      </div>
                      {courseSellingPrice > 0 && (
                        <p className="text-[10px] text-slate-500 font-medium">
                          Fee: ₹{courseSellingPrice.toLocaleString("en-IN")} (50%: ₹{halfCoursePrice.toLocaleString("en-IN")})
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Application Date</p>
                  <p className="font-bold text-slate-800 text-xs mt-1">
                    {enrollment.enrolled_at
                      ? new Date(enrollment.enrolled_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Quick Payment Status Buttons inside Card 3 */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">
                    Update Payment Status:
                  </p>
                  {!editingAmount && (
                    <button
                      onClick={() => setEditingAmount(true)}
                      className="text-[10px] text-[#004aad] font-semibold hover:underline"
                    >
                      Edit Custom Price
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleApplyPayment("paid")}
                    disabled={loadingPayment}
                    title={courseSellingPrice > 0 ? `Sets amount to course fee (₹${courseSellingPrice.toLocaleString("en-IN")})` : "Mark as paid"}
                    className={`px-2 py-2 rounded-lg font-bold text-[11px] transition-all flex flex-col items-center justify-center gap-0.5 border ${
                      currentPaymentStatus === "paid"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    } cursor-pointer disabled:opacity-50`}
                  >
                    <div className="flex items-center gap-1">
                      {loadingPayment && paymentActionTarget === "paid" ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Check className="size-3" />
                      )}
                      <span>Mark Paid</span>
                    </div>
                    {courseSellingPrice > 0 && (
                      <span className={`text-[9px] font-normal ${currentPaymentStatus === "paid" ? "text-emerald-100" : "text-emerald-600"}`}>
                        ₹{courseSellingPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleApplyPayment("pending")}
                    disabled={loadingPayment}
                    title={halfCoursePrice > 0 ? `Sets amount to 50% price (₹${halfCoursePrice.toLocaleString("en-IN")})` : "Mark as pending"}
                    className={`px-2 py-2 rounded-lg font-bold text-[11px] transition-all flex flex-col items-center justify-center gap-0.5 border ${
                      currentPaymentStatus === "pending"
                        ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                        : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                    } cursor-pointer disabled:opacity-50`}
                  >
                    <div className="flex items-center gap-1">
                      {loadingPayment && paymentActionTarget === "pending" ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Clock className="size-3" />
                      )}
                      <span>Mark Pending</span>
                    </div>
                    {halfCoursePrice > 0 && (
                      <span className={`text-[9px] font-normal ${currentPaymentStatus === "pending" ? "text-amber-100" : "text-amber-700"}`}>
                        50%: ₹{halfCoursePrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleApplyPayment("failed")}
                    disabled={loadingPayment}
                    title="Mark payment as failed"
                    className={`px-2 py-1.5 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1 border ${
                      currentPaymentStatus === "failed"
                        ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                        : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                    } cursor-pointer disabled:opacity-50`}
                  >
                    {loadingPayment && paymentActionTarget === "failed" ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <XCircle className="size-3" />
                    )}
                    <span>Mark Failed</span>
                  </button>

                  <button
                    onClick={() => handleApplyPayment("refunded")}
                    disabled={loadingPayment}
                    title="Mark payment as refunded"
                    className={`px-2 py-1.5 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1 border ${
                      currentPaymentStatus === "refunded"
                        ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                        : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                    } cursor-pointer disabled:opacity-50`}
                  >
                    {loadingPayment && paymentActionTarget === "refunded" ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <RotateCcw className="size-3" />
                    )}
                    <span>Refunded</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Application Decision Console */}
        <div className="bg-gradient-to-r from-slate-900 via-[#002f70] to-[#004aad] text-white p-6 rounded-2xl shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                <Sparkles className="size-5 text-[#00d2fd]" />
              </div>
              <div>
                <h4 className="font-extrabold text-base font-montserrat">
                  Application Decision & Status Center
                </h4>
                <p className="text-xs text-white/70">
                  Select a decision below to update this student's enrollment state immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-xl self-start sm:self-center">
              <span>Application Status:</span>
              <span className="text-[#00d2fd] uppercase font-mono font-bold tracking-wider">
                {currentStatus}
              </span>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            
            {/* 1. Confirm / Approve */}
            <button
              onClick={() => handleApplyStatus("active")}
              disabled={loadingStatus}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs transition-all shadow-sm ${
                currentStatus === "active"
                  ? "bg-emerald-500 text-white ring-2 ring-emerald-300 ring-offset-2 ring-offset-slate-900"
                  : "bg-white/10 hover:bg-emerald-600/90 text-white hover:text-white backdrop-blur-md"
              } cursor-pointer disabled:opacity-50`}
            >
              {loadingStatus && actionTarget === "active" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : currentStatus === "active" ? (
                <Check className="size-4" />
              ) : (
                <CheckCircle2 className="size-4 text-emerald-400" />
              )}
              <span>Approve / Confirm</span>
            </button>

            {/* 2. Pending Review */}
            <button
              onClick={() => handleApplyStatus("pending")}
              disabled={loadingStatus}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs transition-all shadow-sm ${
                currentStatus === "pending"
                  ? "bg-amber-500 text-white ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900"
                  : "bg-white/10 hover:bg-amber-600/90 text-white hover:text-white backdrop-blur-md"
              } cursor-pointer disabled:opacity-50`}
            >
              {loadingStatus && actionTarget === "pending" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : currentStatus === "pending" ? (
                <Check className="size-4" />
              ) : (
                <Clock className="size-4 text-amber-400" />
              )}
              <span>Under Review / Pending</span>
            </button>

            {/* 3. Mark Completed */}
            <button
              onClick={() => handleApplyStatus("completed")}
              disabled={loadingStatus}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs transition-all shadow-sm ${
                currentStatus === "completed"
                  ? "bg-blue-500 text-white ring-2 ring-blue-300 ring-offset-2 ring-offset-slate-900"
                  : "bg-white/10 hover:bg-blue-600/90 text-white hover:text-white backdrop-blur-md"
              } cursor-pointer disabled:opacity-50`}
            >
              {loadingStatus && actionTarget === "completed" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : currentStatus === "completed" ? (
                <Check className="size-4" />
              ) : (
                <Award className="size-4 text-blue-300" />
              )}
              <span>Mark Completed</span>
            </button>

            {/* 4. Reject / Dropped */}
            <button
              onClick={() => handleApplyStatus("dropped")}
              disabled={loadingStatus}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs transition-all shadow-sm ${
                currentStatus === "dropped"
                  ? "bg-rose-500 text-white ring-2 ring-rose-300 ring-offset-2 ring-offset-slate-900"
                  : "bg-white/10 hover:bg-rose-600/90 text-white hover:text-white backdrop-blur-md"
              } cursor-pointer disabled:opacity-50`}
            >
              {loadingStatus && actionTarget === "dropped" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : currentStatus === "dropped" ? (
                <Check className="size-4" />
              ) : (
                <XCircle className="size-4 text-rose-400" />
              )}
              <span>Drop / Cancel</span>
            </button>

          </div>

          {/* Bottom Secondary Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-white/60">
            <p>
              Status and payment updates take effect in real-time across student and admin dashboards.
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                disabled={loadingStatus}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:bg-slate-800"
              >
                <option value="pending" className="bg-slate-800 text-white">Pending Review</option>
                <option value="active" className="bg-slate-800 text-white">Confirmed (Active)</option>
                <option value="completed" className="bg-slate-800 text-white">Completed</option>
                <option value="dropped" className="bg-slate-800 text-white">Dropped</option>
              </select>

              <button
                onClick={() => handleApplyStatus(selectedStatus)}
                disabled={loadingStatus || selectedStatus === currentStatus}
                className="px-3.5 py-1.5 bg-[#00d2fd] text-slate-950 font-bold rounded-lg hover:bg-cyan-300 transition-colors disabled:opacity-40 cursor-pointer"
              >
                {loadingStatus ? "Applying..." : "Save Status"}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
