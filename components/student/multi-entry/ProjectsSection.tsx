"use client";

import { useState } from "react";
import { FolderGit2, Plus, Pencil, Trash2, Loader2, ExternalLink, Code2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import TechStackPicker from "@/components/student/TechStackPicker";
import type { ProjectEntry, ProjectPayload } from "@/types/student";
import {
  addProject,
  updateProject,
  deleteProject,
} from "@/services/student-professional.api";

const emptyForm = (): ProjectPayload => ({
  title: "",
  description: "",
  techStack: [],
  projectUrl: "",
  startDate: "",
  endDate: "",
  isOngoing: false,
});

interface Props {
  initialEntries: ProjectEntry[];
}

export default function ProjectsSection({ initialEntries }: Props) {
  const [entries, setEntries] = useState<ProjectEntry[]>(initialEntries);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectPayload>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ProjectPayload>(key: K, val: ProjectPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function openAdd() {
    setForm(emptyForm());
    setEditingId(null);
    setIsAdding(true);
    setError(null);
  }

  function openEdit(entry: ProjectEntry) {
    setForm({
      title: entry.title,
      description: entry.description ?? "",
      techStack: Array.isArray(entry.tech_stack) ? entry.tech_stack : [],
      projectUrl: entry.project_url ?? "",
      startDate: entry.start_date ? entry.start_date.slice(0, 7) : "",
      endDate: entry.end_date ? entry.end_date.slice(0, 7) : "",
      isOngoing: entry.is_ongoing,
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
    if (!form.title.trim()) {
      setError("Project title is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        const updated = await updateProject(editingId, form);
        setEntries((prev) => prev.map((e) => (e.id === editingId ? updated : e)));
      } else {
        const created = await addProject(form);
        setEntries((prev) => [created, ...prev]);
      }
      cancelForm();
    } catch (err: any) {
      setError(err.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setDeleting(id);
    try {
      await deleteProject(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete project");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <FolderGit2 className="size-5 text-[#004aad]" />
          <div>
            <h3 className="font-montserrat text-sm font-bold text-[#004aad] uppercase tracking-wider">
              Projects
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Showcase personal, academic, or open-source software projects.
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
            Add Project
          </Button>
        )}
      </div>

      {/* Inline Form */}
      {isAdding && (
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {editingId ? "Edit Project" : "New Project"}
          </h4>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl p-3">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Project Title <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. AI-Powered Resume Parser or E-Commerce Platform"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className="bg-white rounded-xl border-slate-200 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Project / GitHub Link
              </Label>
              <Input
                placeholder="https://github.com/username/project or live demo URL"
                value={form.projectUrl ?? ""}
                onChange={(e) => update("projectUrl", e.target.value)}
                className="bg-white rounded-xl border-slate-200 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Start Month
              </Label>
              <Input
                type="month"
                value={form.startDate ?? ""}
                onChange={(e) => update("startDate", e.target.value)}
                className="bg-white rounded-xl border-slate-200 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                End Month
              </Label>
              <Input
                type="month"
                disabled={form.isOngoing}
                value={form.isOngoing ? "" : (form.endDate ?? "")}
                onChange={(e) => update("endDate", e.target.value)}
                className="bg-white rounded-xl border-slate-200 text-sm font-medium disabled:opacity-50"
              />
            </div>

            <div className="flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                id="isOngoing"
                checked={form.isOngoing}
                onChange={(e) => update("isOngoing", e.target.checked)}
                className="size-4 accent-[#004aad] rounded border-slate-300 cursor-pointer"
              />
              <label htmlFor="isOngoing" className="text-xs font-semibold text-slate-700 cursor-pointer">
                This project is currently ongoing
              </label>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Tech Stack Used
              </Label>
              <TechStackPicker
                value={form.techStack}
                onChange={(tags) => update("techStack", tags)}
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Description
              </Label>
              <Textarea
                placeholder="What does this project do? What challenges did you solve?"
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
              {editingId ? "Update Project" : "Save Project"}
            </Button>
          </div>
        </div>
      )}

      {/* List Entries */}
      {entries.length === 0 && !isAdding ? (
        <div className="text-center py-8 text-slate-400">
          <FolderGit2 className="size-8 mx-auto mb-2 opacity-40" />
          <p className="text-xs font-medium">No projects added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="group border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 transition-all bg-white hover:shadow-xs flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {entry.title}
                  </h4>
                  {entry.is_ongoing && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Ongoing
                    </span>
                  )}
                  {entry.project_url && (
                    <a
                      href={entry.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#004aad] hover:underline font-semibold"
                    >
                      <span>Link</span>
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>

                {(entry.start_date || entry.end_date || entry.is_ongoing) && (
                  <p className="text-xs text-slate-500 font-medium">
                    {entry.start_date ?? "Started"} –{" "}
                    {entry.is_ongoing ? "Present" : entry.end_date ?? ""}
                  </p>
                )}

                {entry.description && (
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {entry.description}
                  </p>
                )}

                {Array.isArray(entry.tech_stack) && entry.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {entry.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
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
