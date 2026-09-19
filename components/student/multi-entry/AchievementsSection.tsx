"use client";

import { useState } from "react";
import { Trophy, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { AchievementEntry, AchievementPayload } from "@/types/student";
import {
  addAchievement,
  updateAchievement,
  deleteAchievement,
} from "@/services/student-professional.api";

const emptyForm = (): AchievementPayload => ({
  title: "",
  organization: "",
  date: "",
  description: "",
});

interface Props {
  initialEntries: AchievementEntry[];
}

export default function AchievementsSection({ initialEntries }: Props) {
  const [entries, setEntries] = useState<AchievementEntry[]>(initialEntries);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AchievementPayload>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof AchievementPayload>(key: K, val: AchievementPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function openAdd() {
    setForm(emptyForm());
    setEditingId(null);
    setIsAdding(true);
    setError(null);
  }

  function openEdit(entry: AchievementEntry) {
    setForm({
      title: entry.title,
      organization: entry.organization ?? "",
      date: entry.date ? entry.date.slice(0, 10) : "",
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
    if (!form.title.trim()) {
      setError("Achievement title is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        const updated = await updateAchievement(editingId, form);
        setEntries((prev) => prev.map((e) => (e.id === editingId ? updated : e)));
      } else {
        const created = await addAchievement(form);
        setEntries((prev) => [created, ...prev]);
      }
      cancelForm();
    } catch (err: any) {
      setError(err.message || "Failed to save achievement");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    setDeleting(id);
    try {
      await deleteAchievement(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete achievement");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Trophy className="size-5 text-[#004aad]" />
          <div>
            <h3 className="font-montserrat text-sm font-bold text-[#004aad] uppercase tracking-wider">
              Achievements & Awards
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Hackathons, competitions, academic honors, or organizational awards.
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
            Add Achievement
          </Button>
        )}
      </div>

      {/* Inline Form */}
      {isAdding && (
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {editingId ? "Edit Achievement" : "New Achievement"}
          </h4>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl p-3">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Title / Honor <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. 1st Place at National Smart India Hackathon"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className="bg-white rounded-xl border-slate-200 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Issuing Organization / Event
              </Label>
              <Input
                placeholder="e.g. Ministry of Education / IEEE"
                value={form.organization ?? ""}
                onChange={(e) => update("organization", e.target.value)}
                className="bg-white rounded-xl border-slate-200 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Date Received
              </Label>
              <Input
                type="date"
                value={form.date ?? ""}
                onChange={(e) => update("date", e.target.value)}
                className="bg-white rounded-xl border-slate-200 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Description
              </Label>
              <Textarea
                placeholder="Briefly describe the competition or why this honor was awarded..."
                rows={2}
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
              {editingId ? "Update Achievement" : "Save Achievement"}
            </Button>
          </div>
        </div>
      )}

      {/* List Entries */}
      {entries.length === 0 && !isAdding ? (
        <div className="text-center py-8 text-slate-400">
          <Trophy className="size-8 mx-auto mb-2 opacity-40" />
          <p className="text-xs font-medium">No achievements added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="group border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 transition-all bg-white hover:shadow-xs flex items-start justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-900 leading-snug">
                  {entry.title}
                </h4>

                <p className="text-xs text-slate-500 font-medium">
                  {entry.organization && <span>{entry.organization}</span>}
                  {entry.organization && entry.date && <span> • </span>}
                  {entry.date && <span>{entry.date}</span>}
                </p>

                {entry.description && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
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
