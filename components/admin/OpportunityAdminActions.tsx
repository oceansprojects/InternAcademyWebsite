"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Trash2, CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface OpportunityAdminActionsProps {
  opportunityId: string;
  opportunityTitle: string;
  status: "active" | "expired" | "closed";
  size?: "sm" | "md";
}

export default function OpportunityAdminActions({
  opportunityId,
  opportunityTitle,
  status,
  size = "md",
}: OpportunityAdminActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<"expire" | "remove" | "activate" | null>(null);

  async function handleAction(action: "expire" | "remove" | "activate") {
    setLoading(true);
    try {
      const targetStatus =
        action === "expire"
          ? "expired"
          : action === "remove"
          ? "closed"
          : "active";

      const res = await fetch(`/api/admin/opportunities/${opportunityId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update opportunity status");
      }

      toast.success(
        `Opportunity "${opportunityTitle}" marked as ${targetStatus}`
      );
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to moderate opportunity");
    } finally {
      setLoading(false);
      setActionType(null);
    }
  }

  const btnClasses =
    size === "sm"
      ? "px-2.5 py-1 text-[11px] font-bold rounded-lg"
      : "px-3 py-1.5 text-xs font-bold rounded-xl";

  return (
    <>
      <div className="inline-flex items-center gap-1.5 flex-wrap">
        {status === "active" && (
          <button
            type="button"
            onClick={() => setActionType("expire")}
            disabled={loading}
            title="Expire this posting"
            className={`${btnClasses} bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors inline-flex items-center gap-1 disabled:opacity-50`}
          >
            <Clock className="size-3 text-amber-600" />
            <span>Expire</span>
          </button>
        )}

        {status !== "closed" && (
          <button
            type="button"
            onClick={() => setActionType("remove")}
            disabled={loading}
            title="Delist and remove this posting"
            className={`${btnClasses} bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors inline-flex items-center gap-1 disabled:opacity-50`}
          >
            <Trash2 className="size-3 text-rose-600" />
            <span>Remove</span>
          </button>
        )}

        {status !== "active" && (
          <button
            type="button"
            onClick={() => setActionType("activate")}
            disabled={loading}
            title="Reactivate this posting"
            className={`${btnClasses} bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors inline-flex items-center gap-1 disabled:opacity-50`}
          >
            <CheckCircle className="size-3 text-emerald-600" />
            <span>Reactivate</span>
          </button>
        )}
      </div>

      {actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div
                className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${
                  actionType === "remove"
                    ? "bg-rose-100 text-rose-600"
                    : actionType === "expire"
                    ? "bg-amber-100 text-amber-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                <AlertTriangle className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-montserrat text-base font-extrabold text-slate-900 capitalize">
                  {actionType === "expire"
                    ? "Expire Posting"
                    : actionType === "remove"
                    ? "Remove & Delist Posting"
                    : "Reactivate Posting"}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {actionType === "expire" && (
                    <>
                      Are you sure you want to mark{" "}
                      <span className="font-bold text-slate-800">
                        {opportunityTitle}
                      </span>{" "}
                      as expired? Students will no longer be able to submit applications.
                    </>
                  )}
                  {actionType === "remove" && (
                    <>
                      Are you sure you want to delist and remove{" "}
                      <span className="font-bold text-slate-800">
                        {opportunityTitle}
                      </span>
                      ? The posting will be closed immediately from public listings.
                    </>
                  )}
                  {actionType === "activate" && (
                    <>
                      Are you sure you want to reactivate{" "}
                      <span className="font-bold text-slate-800">
                        {opportunityTitle}
                      </span>
                      ? It will become visible and open for student applications again.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActionType(null)}
                disabled={loading}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAction(actionType)}
                disabled={loading}
                className={`px-4 py-2 rounded-xl text-white text-xs font-bold transition-colors flex items-center gap-2 ${
                  actionType === "remove"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : actionType === "expire"
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                } disabled:opacity-50`}
              >
                {loading && <Loader2 className="size-3.5 animate-spin" />}
                <span className="capitalize">
                  Confirm {actionType}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
