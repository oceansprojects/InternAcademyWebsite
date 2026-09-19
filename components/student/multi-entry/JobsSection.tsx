"use client";

import { useState } from "react";
import { Briefcase, Plus, Pencil, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JobEntry, JobPayload, JobType } from "@/types/student";
import { JOB_TYPE_OPTIONS } from "@/types/student";
import {
  addJob,
  updateJob,
  deleteJob,
} from "@/services/student-professional.api";

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 25 }, (_, i) => currentYear - i);

const emptyForm = (): JobPayload => ({
  companyName: "",
  position: "",
  type: "internship",
  startMonth: new Date().getMonth() + 1,
  startYear: currentYear,
  endMonth: null,
  endYear: null,
  currentlyWorking: false,
  city: "",
  state: "",
  description: "",
});

interface Props {
  initialEntries: JobEntry[];
}

export default function JobsSection({ initialEntries }: Props) {
  const [entries, setEntries] = useState<JobEntry[]>(initialEntries);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<JobPayload>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof JobPayload>(key: K, val: JobPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function openAdd() {
    setForm(emptyForm());
    setEditingId(null);
    setIsAdding(true);
    setError(null);
  }

  function openEdit(entry: JobEntry) {
    setForm({
      companyName: entry.company_name,
      position: entry.position,
      type: entry.type,
      startMonth: entry.start_month,
      startYear: entry.start_year,
      endMonth: entry.end_month ?? null,
      endYear: entry.end_year ?? null,
      currentlyWorking: entry.currently_working,
      city: entry.city ?? "",
      state: entry.state ?? "",
      description: entry.description ?? "",
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
    if (!form.companyName.trim() || !form.position.trim()) {
      setError("Company name and position are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        const updated = await updateJob(editingId, form);
        setEntries((prev) => prev.map((e) => (e.id === editingId ? updated : e)));
      } else {
        const created = await addJob(form);
        setEntries((prev) => [created, ...prev]);
      }
      cancelForm();
    } catch (err: any) {
      setError(err.message || "Failed to save work experience");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this experience record?")) return;
    setDeleting(id);
    try {
      await deleteJob(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete record");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="size-5 text-[#004aad]" />
          <div>
            <h3 className="font-montserrat text-sm font-bold text-[#004aad] uppercase tracking-wider">
              Work Experience & Internships
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Add internships, freelance projects, or full-time roles.
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
            Add Experience
          </Button>
        )}
      </div>

      {/* Inline Form */}
      {isAdding && (
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {editingId ? "Edit Work Experience" : "New Work Experience"}
          </h4>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl p-3">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Company / Organization <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. Google, Infosys, Startup"
                value={form.companyName}
                onChange={(e) => update("companyName", e.target.value)}
                className="bg-white rounded-xl border-slate-200 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Role / Position <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. Software Engineer Intern"
                value={form.position}
                onChange={(e) => update("position", e.target.value)}
                className="bg-white rounded-xl border-slate-200 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.type}
                onValueChange={(val) => update("type", val as JobType)}
              >
                <SelectTrigger className="bg-white rounded-xl border-slate-200 text-sm font-medium">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="currentlyWorking"
                checked={form.currentlyWorking}
                onChange={(e) => update("currentlyWorking", e.target.checked)}
                className="size-4 accent-[#004aad] rounded border-slate-300 cursor-pointer"
              />
              <label htmlFor="currentlyWorking" className="text-xs font-semibold text-slate-700 cursor-pointer">
                I am currently working in this role
              </label>
            </div>

            {/* Start date */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Start Month <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={String(form.startMonth)}
                  onValueChange={(val) => update("startMonth", Number(val))}
                >
                  <SelectTrigger className="bg-white rounded-xl border-slate-200 text-sm font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m.value} value={String(m.value)}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Start Year <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={String(form.startYear)}
                  onValueChange={(val) => update("startYear", Number(val))}
                >
                  <SelectTrigger className="bg-white rounded-xl border-slate-200 text-sm font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* End date */}
            {!form.currentlyWorking && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    End Month
                  </Label>
                  <Select
                    value={form.endMonth ? String(form.endMonth) : ""}
                    onValueChange={(val) => update("endMonth", Number(val))}
                  >
                    <SelectTrigger className="bg-white rounded-xl border-slate-200 text-sm font-medium">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((m) => (
                        <SelectItem key={m.value} value={String(m.value)}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    End Year
                  </Label>
                  <Select
                    value={form.endYear ? String(form.endYear) : ""}
                    onValueChange={(val) => update("endYear", Number(val))}
                  >
                    <SelectTrigger className="bg-white rounded-xl border-slate-200 text-sm font-medium">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={String(y)}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                City
              </Label>
              <Input
                placeholder="e.g. CSN"
                value={form.city ?? ""}
                onChange={(e) => update("city", e.target.value)}
                className="bg-white rounded-xl border-slate-200 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                State
              </Label>
              <Input
                placeholder="e.g. Karnataka"
                value={form.state ?? ""}
                onChange={(e) => update("state", e.target.value)}
                className="bg-white rounded-xl border-slate-200 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Description / Key Responsibilities
              </Label>
              <Textarea
                placeholder="Describe your role, key projects, tech used, or accomplishments..."
                rows={3}
                value={form.description ?? ""}
                onChange={(e) => update("description", e.target.value)}
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
              {editingId ? "Update Experience" : "Save Experience"}
            </Button>
          </div>
        </div>
      )}

      {/* List Entries */}
      {entries.length === 0 && !isAdding ? (
        <div className="text-center py-8 text-slate-400">
          <Briefcase className="size-8 mx-auto mb-2 opacity-40" />
          <p className="text-xs font-medium">No work experience or internships added yet.</p>
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
                    {entry.position}
                  </h4>
                  <span className="text-xs font-semibold text-slate-500">at</span>
                  <span className="font-semibold text-sm text-[#004aad]">
                    {entry.company_name}
                  </span>
                  <span className="capitalize text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {entry.type}
                  </span>
                  {entry.currently_working && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Current
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 font-medium">
                  {MONTHS.find((m) => m.value === entry.start_month)?.label ?? entry.start_month}{" "}
                  {entry.start_year} –{" "}
                  {entry.currently_working
                    ? "Present"
                    : `${entry.end_month ? (MONTHS.find((m) => m.value === entry.end_month)?.label ?? entry.end_month) + " " : ""}${entry.end_year ?? ""}`}
                  {entry.city && entry.state
                    ? ` • ${entry.city}, ${entry.state}`
                    : entry.city
                      ? ` • ${entry.city}`
                      : ""}
                </p>

                {entry.description && (
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed whitespace-pre-line">
                    {entry.description}
                  </p>
                )}
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
