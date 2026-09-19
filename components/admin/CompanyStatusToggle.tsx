"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CompanyStatusToggleProps {
  companyId: string;
  companyName: string;
  isActive: boolean;
  size?: "sm" | "md";
}

export default function CompanyStatusToggle({
  companyId,
  companyName,
  isActive,
  size = "md",
}: CompanyStatusToggleProps) {
  const router = useRouter();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const willBlock = isActive;

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/companies/${companyId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update company status");
      }

      toast.success(
        `Company "${companyName}" is now ${!isActive ? "Active" : "Blocked"}`
      );
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to toggle status");
    } finally {
      setLoading(false);
      setOpenConfirm(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenConfirm(true)}
        disabled={loading}
        title={isActive ? "Block this company" : "Unblock this company"}
        className={`inline-flex items-center gap-1.5 font-bold rounded-xl transition-all shadow-sm ${
          size === "sm"
            ? "px-2.5 py-1.5 text-[11px]"
            : "px-3.5 py-2 text-xs"
        } ${
          isActive
            ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
        } disabled:opacity-50`}
      >
        {loading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : isActive ? (
          <ShieldAlert className="size-3.5 text-rose-600" />
        ) : (
          <ShieldCheck className="size-3.5 text-emerald-600" />
        )}
        <span>{isActive ? "Block" : "Unblock"}</span>
      </button>

      {openConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div
                className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${
                  willBlock
                    ? "bg-rose-100 text-rose-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                {willBlock ? (
                  <ShieldAlert className="size-6" />
                ) : (
                  <ShieldCheck className="size-6" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-montserrat text-base font-extrabold text-slate-900">
                  {willBlock ? "Block Company Account" : "Unblock Company Account"}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {willBlock ? (
                    <>
                      Are you sure you want to block{" "}
                      <span className="font-bold text-slate-800">
                        {companyName}
                      </span>
                      ? Users belonging to this company will not be able to log in or manage job postings until unblocked.
                    </>
                  ) : (
                    <>
                      Are you sure you want to reactivate{" "}
                      <span className="font-bold text-slate-800">
                        {companyName}
                      </span>
                      ? Their login access and posting capabilities will be restored immediately.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setOpenConfirm(false)}
                disabled={loading}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleToggle}
                disabled={loading}
                className={`px-4 py-2 rounded-xl text-white text-xs font-bold transition-colors flex items-center gap-2 ${
                  willBlock
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                } disabled:opacity-50`}
              >
                {loading && <Loader2 className="size-3.5 animate-spin" />}
                <span>{willBlock ? "Yes, Block Company" : "Yes, Unblock Company"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
