"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Award,
  Search,
  Download,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Edit3,
  Check,
  X,
  Loader2,
  GraduationCap,
  User,
  BookOpen,
  Calendar,
  Link2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { adminUpsertCertificate, adminDeactivateCertificate } from "@/services/certificate.api";
import { toast } from "sonner";

interface CertRecord {
  enrollment_id: string;
  completed_at: string | null;
  enrolled_at: string;
  user_id: string;
  student_name: string;
  student_email: string;
  avatar_url: string | null;
  program_id: string;
  program_title: string;
  program_slug: string;
  program_category: string | null;
  duration_weeks: number;
  cert_id: string | null;
  cert_number: string | null;
  certificate_url: string | null;
  issued_at: string | null;
  cert_is_active: boolean | null;
}

interface Props {
  initialData: CertRecord[];
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function CertStatusBadge({ record }: { record: CertRecord }) {
  if (!record.cert_id) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
        <Clock className="size-3" />
        Pending
      </span>
    );
  }
  if (!record.cert_is_active) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
        <XCircle className="size-3" />
        Revoked
      </span>
    );
  }
  if (!record.certificate_url) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
        <AlertCircle className="size-3" />
        URL Missing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircle2 className="size-3" />
      Issued
    </span>
  );
}

function CertRow({ record, onUpdated }: { record: CertRecord; onUpdated: (updated: Partial<CertRecord>) => void }) {
  const [editing, setEditing] = useState(false);
  const [urlValue, setUrlValue] = useState(record.certificate_url ?? "");
  const [saving, setSaving] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleCancel = () => {
    setUrlValue(record.certificate_url ?? "");
    setEditing(false);
  };

  const handleSave = async () => {
    const trimmed = urlValue.trim();
    if (!trimmed) {
      toast.error("Certificate URL cannot be empty");
      return;
    }
    try {
      new URL(trimmed);
    } catch {
      toast.error("Please enter a valid URL (must start with https://)");
      return;
    }

    try {
      setSaving(true);
      const res = await adminUpsertCertificate(record.enrollment_id, trimmed);
      const cert = res.data;
      onUpdated({
        cert_id: cert.id,
        cert_number: cert.cert_number,
        certificate_url: cert.certificate_url,
        issued_at: cert.issued_at,
        cert_is_active: cert.is_active,
      });
      setEditing(false);
      toast.success("Certificate URL saved successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save certificate URL");
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async () => {
    if (!record.cert_id) return;
    if (!confirm(`Revoke certificate for ${record.student_name}? This will hide the download button for the student.`)) return;

    try {
      setRevoking(true);
      await adminDeactivateCertificate(record.enrollment_id);
      onUpdated({ cert_is_active: false });
      toast.success("Certificate revoked.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to revoke certificate");
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className="size-8 rounded-full bg-gradient-to-br from-[#004aad] to-[#00d2fd] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
            {record.student_name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate leading-tight">{record.student_name}</p>
            <p className="text-[10px] text-slate-500 font-medium truncate">{record.student_email}</p>
          </div>
        </div>
        <CertStatusBadge record={record} />
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-3.5">
        {/* Program info */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-start gap-2">
            <BookOpen className="size-3.5 text-[#004aad] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Program</p>
              <p className="text-xs font-bold text-slate-800 leading-tight">{record.program_title}</p>
              {record.program_category && (
                <p className="text-[10px] text-slate-500">{record.program_category}</p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="size-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Completed</p>
              <p className="text-xs font-semibold text-slate-700">{formatDate(record.completed_at)}</p>
              {record.cert_number && (
                <p className="text-[10px] font-mono text-[#004aad] font-bold">{record.cert_number}</p>
              )}
            </div>
          </div>
        </div>

        {/* Certificate URL editor */}
        <div className="space-y-2">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Link2 className="size-3" />
            Certificate Download URL
          </p>

          {editing ? (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="url"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") handleCancel();
                }}
                placeholder="https://drive.google.com/file/..."
                className="flex-1 text-xs px-3 py-2 border border-[#004aad] rounded-xl outline-none focus:ring-2 focus:ring-[#004aad]/20 font-mono placeholder:text-slate-300 bg-white"
                disabled={saving}
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="size-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors flex-shrink-0 disabled:opacity-60"
                title="Save"
              >
                {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="size-8 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors flex-shrink-0"
                title="Cancel"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {record.certificate_url ? (
                <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 min-w-0">
                  <span className="text-xs font-mono text-slate-600 truncate flex-1">{record.certificate_url}</span>
                  <a
                    href={record.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#004aad] hover:text-[#003080] flex-shrink-0"
                    title="Open URL"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              ) : (
                <div className="flex-1 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  <span className="text-xs text-amber-600 font-medium italic">No download URL set yet</span>
                </div>
              )}
              <button
                onClick={handleEdit}
                className="size-8 rounded-xl bg-[#004aad]/10 hover:bg-[#004aad]/20 text-[#004aad] flex items-center justify-center transition-colors flex-shrink-0"
                title="Edit URL"
              >
                <Edit3 className="size-3.5" />
              </button>
              {record.cert_id && record.cert_is_active && (
                <button
                  onClick={handleRevoke}
                  disabled={revoking}
                  className="size-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors flex-shrink-0 disabled:opacity-60"
                  title="Revoke certificate"
                >
                  {revoking ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Issued at */}
        {record.issued_at && (
          <p className="text-[10px] text-slate-400 font-medium">
            Issued on {formatDate(record.issued_at)}
          </p>
        )}
      </div>
    </div>
  );
}

export default function CertificateTable({ initialData }: Props) {
  const [data, setData] = useState<CertRecord[]>(initialData);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "issued" | "pending" | "missing_url">("all");

  const filtered = useMemo(() => {
    return data.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.student_name.toLowerCase().includes(q) ||
        r.student_email.toLowerCase().includes(q) ||
        r.program_title.toLowerCase().includes(q) ||
        (r.cert_number?.toLowerCase().includes(q) ?? false);

      const matchFilter =
        filter === "all"
          ? true
          : filter === "issued"
          ? !!r.cert_id && !!r.cert_is_active && !!r.certificate_url
          : filter === "pending"
          ? !r.cert_id
          : filter === "missing_url"
          ? !!r.cert_id && !!r.cert_is_active && !r.certificate_url
          : true;

      return matchSearch && matchFilter;
    });
  }, [data, search, filter]);

  const stats = useMemo(() => ({
    total: data.length,
    issued: data.filter((r) => !!r.cert_id && !!r.cert_is_active && !!r.certificate_url).length,
    pending: data.filter((r) => !r.cert_id).length,
    missingUrl: data.filter((r) => !!r.cert_id && !!r.cert_is_active && !r.certificate_url).length,
  }), [data]);

  const handleUpdated = (enrollmentId: string, patch: Partial<CertRecord>) => {
    setData((prev) =>
      prev.map((r) => (r.enrollment_id === enrollmentId ? { ...r, ...patch } : r))
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Completed", value: stats.total, color: "text-slate-700", bg: "bg-slate-50 border-slate-200" },
          { label: "Issued", value: stats.issued, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
          { label: "Pending", value: stats.pending, color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
          { label: "URL Missing", value: stats.missingUrl, color: "text-red-700", bg: "bg-red-50 border-red-200" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.bg}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
            <p className={`text-2xl font-extrabold font-montserrat mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student, email, program, or cert ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "issued", "pending", "missing_url"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                filter === f
                  ? "bg-[#004aad] text-white border-[#004aad]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#004aad]/40"
              }`}
            >
              {f === "all" ? "All" : f === "issued" ? "Issued" : f === "pending" ? "Pending" : "URL Missing"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <Award className="size-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-500">No records found</p>
          <p className="text-xs text-slate-400 mt-1">
            {data.length === 0
              ? "No enrollments have been marked as completed yet."
              : "Try changing your search or filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((record) => (
            <CertRow
              key={record.enrollment_id}
              record={record}
              onUpdated={(patch) => handleUpdated(record.enrollment_id, patch)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
