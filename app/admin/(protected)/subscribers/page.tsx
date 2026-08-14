"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Mail,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Users,
  UserCheck,
  UserX,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface BlogSubscriber {
  id: string;
  email: string;
  status: "active" | "disabled";
  created_at: string;
  updated_at: string;
}

export default function SubscribedMailPage() {
  const [subscribers, setSubscribers] = useState<BlogSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Pagination & Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [disabledCount, setDisabledCount] = useState(0);

  // Dialog States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newStatus, setNewStatus] = useState<"active" | "disabled">("active");
  const [submittingAdd, setSubmittingAdd] = useState(false);

  const [editSubscriber, setEditSubscriber] = useState<BlogSubscriber | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editStatus, setEditStatus] = useState<"active" | "disabled">("active");
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const [deleteSubscriber, setDeleteSubscriber] = useState<BlogSubscriber | null>(null);
  const [submittingDelete, setSubmittingDelete] = useState(false);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        page: page.toString(),
        limit: "10",
      });

      const res = await fetch(`/api/admin/subscribers?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch subscribers");
      }

      setSubscribers(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCount(data.pagination?.total || 0);
      setActiveCount(data.pagination?.activeCount || 0);
      setDisabledCount(data.pagination?.disabledCount || 0);
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error("Failed to load subscribers. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  // Handle Search Input Change (Debounced / Resets Page)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Add Subscriber
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubmittingAdd(true);
    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail.trim(), status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to add subscriber.");
        return;
      }

      toast.success("Subscriber added successfully!");
      setAddModalOpen(false);
      setNewEmail("");
      setNewStatus("active");
      fetchSubscribers();
    } catch {
      toast.error("An error occurred while adding subscriber.");
    } finally {
      setSubmittingAdd(false);
    }
  };

  // Edit Subscriber
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSubscriber) return;

    setSubmittingEdit(true);
    try {
      const res = await fetch(`/api/admin/subscribers/${editSubscriber.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: editEmail.trim(),
          status: editStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to update subscriber.");
        return;
      }

      toast.success("Subscriber updated successfully!");
      setEditSubscriber(null);
      fetchSubscribers();
    } catch {
      toast.error("An error occurred while updating subscriber.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Toggle Subscriber Active/Disabled state quickly
  const handleToggleStatus = async (subscriber: BlogSubscriber) => {
    const nextStatus = subscriber.status === "active" ? "disabled" : "active";
    try {
      const res = await fetch(`/api/admin/subscribers/${subscriber.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to change status.");
        return;
      }

      toast.success(
        `Subscriber ${nextStatus === "active" ? "activated" : "disabled"} successfully.`
      );
      fetchSubscribers();
    } catch {
      toast.error("An error occurred while updating status.");
    }
  };

  // Delete Subscriber
  const handleConfirmDelete = async () => {
    if (!deleteSubscriber) return;
    setSubmittingDelete(true);
    try {
      const res = await fetch(`/api/admin/subscribers/${deleteSubscriber.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to delete subscriber.");
        return;
      }

      toast.success("Subscriber deleted successfully!");
      setDeleteSubscriber(null);
      fetchSubscribers();
    } catch {
      toast.error("An error occurred while deleting subscriber.");
    } finally {
      setSubmittingDelete(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-[#004aad]/10 text-[#004aad]">
              <Mail className="size-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-montserrat">
              Subscribed Mail
            </h1>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage blog newsletter subscribers, view subscription dates, and toggle delivery permissions.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#004aad] hover:bg-[#003882] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#004aad]/20 active:scale-95 shrink-0"
        >
          <Plus className="size-4" />
          <span>Add Subscriber</span>
        </button>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-[#004aad]">
            <Users className="size-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Subscribers</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalCount}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <UserCheck className="size-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Subscribers</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{activeCount}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <UserX className="size-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Disabled</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{disabledCount}</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search email address..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#004aad] focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          {(["all", "active", "disabled"] as const).map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`
                flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all select-none
                ${
                  statusFilter === st
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }
              `}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
          <Loader2 className="size-8 text-[#004aad] animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading subscribers...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-red-200 p-12 flex flex-col items-center justify-center text-center">
          <ShieldAlert className="size-10 text-red-500 mb-3" />
          <h3 className="text-base font-bold text-slate-900">Failed to load data</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
            Could not fetch subscribers list from database. Please verify backend service connection.
          </p>
          <button
            onClick={fetchSubscribers}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
          >
            <RefreshCw className="size-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : subscribers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-slate-100 text-slate-400 mb-3">
            <Mail className="size-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No subscribers found</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            {search || statusFilter !== "all"
              ? "No records match your search or filter criteria. Try adjusting filters."
              : "No users have subscribed to the blog newsletter yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Subscribed Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                          {sub.email.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900">{sub.email}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {sub.status === "active" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="size-3.5 text-emerald-600" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
                          <XCircle className="size-3.5 text-slate-400" />
                          Disabled
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {new Date(sub.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      <span className="text-slate-400 text-[11px]">
                        {new Date(sub.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Quick Toggle Status */}
                        <button
                          onClick={() => handleToggleStatus(sub)}
                          title={sub.status === "active" ? "Disable subscriber" : "Enable subscriber"}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            sub.status === "active"
                              ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          {sub.status === "active" ? "Disable" : "Enable"}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => {
                            setEditSubscriber(sub);
                            setEditEmail(sub.email);
                            setEditStatus(sub.status);
                          }}
                          title="Edit Subscriber"
                          className="p-1.5 text-slate-400 hover:text-[#004aad] hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="size-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteSubscriber(sub)}
                          title="Delete Subscriber"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-slate-100">
            {subscribers.map((sub) => (
              <div key={sub.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="size-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                      {sub.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-900 text-xs truncate">{sub.email}</span>
                  </div>

                  {sub.status === "active" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                      Disabled
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-50">
                  <span className="text-slate-400 font-medium">
                    {new Date(sub.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(sub)}
                      className="text-xs font-bold text-slate-600 underline"
                    >
                      {sub.status === "active" ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => {
                        setEditSubscriber(sub);
                        setEditEmail(sub.email);
                        setEditStatus(sub.status);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-900"
                    >
                      <Edit2 className="size-4" />
                    </button>
                    <button
                      onClick={() => setDeleteSubscriber(sub)}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="size-4" />
                Previous
              </button>

              <span className="text-xs font-semibold text-slate-500">
                Page <strong className="text-slate-900">{page}</strong> of {totalPages}
              </span>

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal: Add Subscriber */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-150">
            <h2 className="text-lg font-bold text-slate-900 font-montserrat">Add New Subscriber</h2>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Manually add an email to the blog subscription distribution list.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="subscriber@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#004aad] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Subscription Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as "active" | "disabled")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#004aad] focus:bg-white"
                >
                  <option value="active">Active (Receives emails)</option>
                  <option value="disabled">Disabled (Opted out)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  disabled={submittingAdd}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAdd}
                  className="inline-flex items-center gap-2 bg-[#004aad] hover:bg-[#003882] text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md shadow-[#004aad]/20"
                >
                  {submittingAdd && <Loader2 className="size-3.5 animate-spin" />}
                  <span>Save Subscriber</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Subscriber */}
      {editSubscriber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-150">
            <h2 className="text-lg font-bold text-slate-900 font-montserrat">Edit Subscriber</h2>
            <p className="text-xs text-slate-500 mt-1 mb-5">Update email address or toggle subscription status.</p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#004aad] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Subscription Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as "active" | "disabled")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#004aad] focus:bg-white"
                >
                  <option value="active">Active (Receives emails)</option>
                  <option value="disabled">Disabled (Opted out)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditSubscriber(null)}
                  disabled={submittingEdit}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="inline-flex items-center gap-2 bg-[#004aad] hover:bg-[#003882] text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md shadow-[#004aad]/20"
                >
                  {submittingEdit && <Loader2 className="size-3.5 animate-spin" />}
                  <span>Update Subscriber</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteSubscriber)}
        title="Delete Subscriber"
        description={`Are you sure you want to delete "${deleteSubscriber?.email}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteSubscriber(null)}
        loading={submittingDelete}
      />
    </div>
  );
}
