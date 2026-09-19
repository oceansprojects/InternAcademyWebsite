"use client";

import { useState } from "react";
import { Award, Plus, Pencil, Trash2, Loader2, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { CertificateEntry, CertificatePayload } from "@/types/student";
import {
  addCertificate,
  updateCertificate,
  deleteCertificate,
} from "@/services/student-professional.api";

const emptyForm = (): CertificatePayload => ({
  title: "",
  issuingOrg: "",
  issueDate: "",
  certificateLink: "",
});

interface Props {
  initialEntries: CertificateEntry[];
}

export default function CertificatesSection({ initialEntries }: Props) {
  const [entries, setEntries] = useState<CertificateEntry[]>(initialEntries);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CertificatePayload>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof CertificatePayload>(key: K, val: CertificatePayload[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function openAdd() {
    setForm(emptyForm());
    setEditingId(null);
    setIsAdding(true);
    setError(null);
  }

  function openEdit(entry: CertificateEntry) {
    setForm({
      title: entry.title,
      issuingOrg: entry.issuing_org,
      issueDate: entry.issue_date ? entry.issue_date.slice(0, 10) : "",
      certificateLink: entry.certificate_link ?? "",
    });
    setEditingId(entry.id);
    setIsAdding(true);
    setError(null);
  }

  function cancelForm() {
    setIsAdding(false);
    setEditingId(null);
    setForm(emptyForm());
    setError(null);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.issuingOrg.trim()) {
      setError("Certificate title and issuing organization are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        const updated = await updateCertificate(editingId, form);
        setEntries((prev) => prev.map((e) => (e.id === editingId ? updated : e)));
      } else {
        const created = await addCertificate(form);
        setEntries((prev) => [created, ...prev]);
      }
      cancelForm();
    } catch (err: any) {
      setError(err.message || "Failed to save certificate");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    setDeleting(id);
    try {
      await deleteCertificate(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete certificate");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Award className="size-5 text-[#004aad]" />
          <div>
            <h3 className="font-montserrat text-sm font-bold text-[#004aad] uppercase tracking-wider">
              Certifications & Licenses
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Industry certifications, online course credentials, or licenses.
            </p>
          </div>
        </div>
        {!isAdding && (
          <Button
            type="button"
            onClick={openAdd}
            size="sm"
            className="bg-[#004aad] hover:bg-[#003c8c] text-white font-bold rounded-xl text-xs gap-1.5 shadow-sm"
          >
            <Plus className="size-3.5" />
            Add Certification
          </Button>
        )}
      </div>

      {/* Inline Form */}
      {isAdding && (
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {editingId ? "Edit Certification" : "New Certification"}
          </h4>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl p-3">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Certification Title <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. AWS Certified Solutions Architect"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className="bg-white rounded-xl border-slate-200 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Issuing Organization <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. Amazon Web Services, Coursera, Meta"
                value={form.issuingOrg}
                onChange={(e) => update("issuingOrg", e.target.value)}
                className="bg-white rounded-xl border-slate-200 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Issue Date
              </Label>
              <Input
                type="date"
                value={form.issueDate ?? ""}
                onChange={(e) => update("issueDate", e.target.value)}
                className="bg-white rounded-xl border-slate-200 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Credential URL / Verification Link
              </Label>
              <Input
                placeholder="https://coursera.org/verify/..."
                value={form.certificateLink ?? ""}
                onChange={(e) => update("certificateLink", e.target.value)}
                className="bg-white rounded-xl border-slate-200 text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={cancelForm}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="bg-[#004aad] hover:bg-[#003c8c] text-white rounded-xl text-xs gap-1.5"
            >
              {saving ? <Loader2 className="size-3.5 animate-spin" /> : null}
              {editingId ? "Update Certification" : "Save Certification"}
            </Button>
          </div>
        </div>
      )}

      {/* List Entries */}
      {entries.length === 0 && !isAdding ? (
        <div className="text-center py-8 text-slate-400">
          <Award className="size-8 mx-auto mb-2 opacity-40" />
          <p className="text-xs font-medium">No certifications added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="group border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 transition-all bg-white hover:shadow-xs flex items-start justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {entry.title}
                  </h4>
                  {entry.certificate_link && (
                    <a
                      href={entry.certificate_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#004aad] hover:underline font-semibold"
                    >
                      <span>Verify</span>
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>

                <p className="text-xs text-slate-500 font-medium">
                  {entry.issuing_org}
                  {entry.issue_date && <span> • Issued {entry.issue_date}</span>}
                </p>
              </div>

              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  onClick={() => openEdit(entry)}
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                  disabled={deleting === entry.id}
                  onClick={() => handleDelete(entry.id)}
                >
                  {deleting === entry.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
