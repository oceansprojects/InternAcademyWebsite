"use client";

import { useState } from "react";
import { GraduationCap, Plus, Pencil, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EducationEntry, EducationPayload } from "@/types/student";
import { EDU_STREAM_OPTIONS, EDU_BRANCH_OPTIONS } from "@/types/student";
import {
  addEducation,
  updateEducation,
  deleteEducation,
} from "@/services/student-professional.api";

const YEARS = Array.from({ length: 20 }, (_, i) => String(new Date().getFullYear() + 1 - i));

const emptyForm = (): EducationPayload => ({
  instituteName: "",
  startYear: new Date().getFullYear(),
  endYear: null,
  currentlyStudying: false,
  stream: "",
  branch: "",
  city: "",
  state: "",
  gradeCgpa: "",
});

interface Props {
  initialEntries: EducationEntry[];
}

export default function EducationSection({ initialEntries }: Props) {
  const [entries, setEntries] = useState<EducationEntry[]>(initialEntries);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EducationPayload>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof EducationPayload>(key: K, val: EducationPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function openAdd() {
    setForm(emptyForm());
    setEditingId(null);
    setIsAdding(true);
    setError(null);
  }

  function openEdit(entry: EducationEntry) {
    setForm({
      instituteName: entry.institute_name,
      startYear: entry.start_year,
      endYear: entry.end_year ?? null,
      currentlyStudying: entry.currently_studying,
      stream: entry.stream ?? "",
      branch: entry.branch ?? "",
      city: entry.city ?? "",
      state: entry.state ?? "",
      gradeCgpa: entry.grade_cgpa ?? "",
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
    if (!form.instituteName.trim() || !form.startYear) {
      setError("Institute name and start year are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        const updated = await updateEducation(editingId, form);
        setEntries((prev) => prev.map((e) => (e.id === editingId ? updated : e)));
      } else {
        const created = await addEducation(form);
        setEntries((prev) => [created, ...prev]);
      }
      cancelForm();
    } catch (err: any) {
      setError(err.message || "Failed to save entry.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await deleteEducation(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch {
      // silently handle
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-5 text-[#004aad]" />
          <div>
            <h3 className="font-montserrat text-sm font-bold text-[#004aad] uppercase tracking-wider">
              Education
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Institutes attended, streams, degrees, and academic performance.
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
            Add Education
          </Button>
        )}
      </div>

      {/* Add / Edit Form */}
      {isAdding && (
        <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 space-y-4 animate-in fade-in">
          {error && (
            <p className="text-xs text-red-600 font-semibold bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {/* Institute */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Institute / University Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g. RV College of Engineering, CSN"
              value={form.instituteName}
              onChange={(e) => update("instituteName", e.target.value)}
              className="rounded-xl bg-white border-slate-200 focus:bg-white text-sm font-medium"
            />
          </div>

          {/* Years row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Start Year <span className="text-red-500">*</span>
              </Label>
              <Select
                value={String(form.startYear)}
                onValueChange={(v) => update("startYear", Number(v))}
              >
                <SelectTrigger className="w-full rounded-xl bg-white border-slate-200 text-sm h-10">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  End Year
                </Label>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.currentlyStudying}
                    onChange={(e) => {
                      update("currentlyStudying", e.target.checked);
                      if (e.target.checked) update("endYear", null);
                    }}
                    className="size-3.5 accent-[#004aad]"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Currently Studying
                  </span>
                </label>
              </div>
              <Select
                value={form.endYear ? String(form.endYear) : ""}
                onValueChange={(v) => update("endYear", v ? Number(v) : null)}
                disabled={form.currentlyStudying}
              >
                <SelectTrigger className="w-full rounded-xl bg-white border-slate-200 text-sm h-10 disabled:opacity-50">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stream + Branch */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">Stream / Course</Label>
              <Select value={form.stream ?? ""} onValueChange={(v) => update("stream", v ?? undefined)}>
                <SelectTrigger className="w-full rounded-xl bg-white border-slate-200 text-sm h-10">
                  <SelectValue placeholder="Select stream" />
                </SelectTrigger>
                <SelectContent>
                  {EDU_STREAM_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">Branch</Label>
              <Select value={form.branch ?? ""} onValueChange={(v) => update("branch", v ?? undefined)}>
                <SelectTrigger className="w-full rounded-xl bg-white border-slate-200 text-sm h-10">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {EDU_BRANCH_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">City</Label>
              <Input
                placeholder="e.g. CSN"
                value={form.city ?? ""}
                onChange={(e) => update("city", e.target.value)}
                className="rounded-xl bg-white border-slate-200 text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">State</Label>
              <Input
                placeholder="e.g. Karnataka"
                value={form.state ?? ""}
                onChange={(e) => update("state", e.target.value)}
                className="rounded-xl bg-white border-slate-200 text-sm font-medium"
              />
            </div>
          </div>

          {/* Grade */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">Grade / CGPA</Label>
            <Input
              placeholder="e.g. 8.5 / 10 or 85%"
              value={form.gradeCgpa ?? ""}
              onChange={(e) => update("gradeCgpa", e.target.value)}
              className="rounded-xl bg-white border-slate-200 text-sm font-medium"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={cancelForm}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-[#004aad] hover:bg-[#003c8c] text-white text-xs font-bold px-5 py-2 rounded-xl shadow-sm flex items-center gap-2"
            >
              {saving ? (
                <><Loader2 className="size-3.5 animate-spin" /> Saving...</>
              ) : (
                <><CheckCircle2 className="size-3.5" /> Save Entry</>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Saved entries */}
      {entries.length > 0 && (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start justify-between gap-4 bg-white rounded-xl border border-slate-200 px-5 py-4 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-0.5 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{entry.institute_name}</p>
                <p className="text-xs text-slate-500 font-medium">
                  {entry.branch?.toUpperCase() ?? ""}{entry.branch && entry.stream ? " · " : ""}{entry.stream}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {entry.start_year} – {entry.currently_studying ? "Present" : (entry.end_year ?? "")}
                  {entry.city ? ` · ${entry.city}` : ""}
                  {entry.grade_cgpa ? ` · ${entry.grade_cgpa}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(entry)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#004aad] hover:bg-blue-50 transition-colors"
                  aria-label="Edit"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(entry.id)}
                  disabled={deleting === entry.id}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  aria-label="Delete"
                >
                  {deleting === entry.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {entries.length === 0 && !isAdding && (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/50">
          <GraduationCap className="size-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-medium">
            No education entries yet. Click <strong>Add Education</strong> to get started.
          </p>
        </div>
      )}
    </div>
  );
}
