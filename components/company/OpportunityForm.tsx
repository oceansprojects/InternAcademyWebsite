"use client";

import { useState } from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  Banknote,
  Users,
  Calendar,
  X,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  OPPORTUNITY_TYPE_OPTIONS,
  WORK_MODE_OPTIONS,
  type Opportunity,
  type OpportunityPayload,
  type OpportunityType,
  type WorkMode,
} from "@/types/company";
import { YEARS_EXPERIENCE_OPTIONS } from "@/types/student";
import { PREDEFINED_TECH_STACK } from "@/constants/tech-stack";

interface OpportunityFormProps {
  initialData?: Opportunity | null;
  onSuccess: (opportunity: Opportunity) => void;
  onCancel: () => void;
}

export default function OpportunityForm({
  initialData,
  onSuccess,
  onCancel,
}: OpportunityFormProps) {
  const isEdit = Boolean(initialData?.id);

  const [title, setTitle] = useState(initialData?.title || "");
  const [type, setType] = useState<OpportunityType>(initialData?.type || "internship");
  const [role, setRole] = useState(initialData?.role || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [techStack, setTechStack] = useState<string[]>(initialData?.tech_stack || []);
  const [customTech, setCustomTech] = useState("");
  const [yearsExperience, setYearsExperience] = useState(initialData?.years_experience || "0-1");
  const [selectionProcess, setSelectionProcess] = useState(initialData?.selection_process || "");
  const [workMode, setWorkMode] = useState<WorkMode>(initialData?.work_mode || "on_site");
  const [city, setCity] = useState(initialData?.city || "");
  const [state, setState] = useState(initialData?.state || "");
  const [openings, setOpenings] = useState<number | "">(initialData?.openings ?? 1);
  const [stipendSalary, setStipendSalary] = useState(initialData?.stipend_salary || "");
  const [applicationDeadline, setApplicationDeadline] = useState(
    initialData?.application_deadline
      ? new Date(initialData.application_deadline).toISOString().split("T")[0]
      : ""
  );

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function toggleTech(tech: string) {
    if (techStack.includes(tech)) {
      setTechStack(techStack.filter((t) => t !== tech));
    } else {
      setTechStack([...techStack, tech]);
    }
  }

  function addCustomTech() {
    const trimmed = customTech.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack([...techStack, trimmed]);
      setCustomTech("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Title is required.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const payload: OpportunityPayload = {
      title: title.trim(),
      type,
      role: role.trim() || undefined,
      description: description.trim() || undefined,
      techStack,
      yearsExperience: yearsExperience || undefined,
      selectionProcess: selectionProcess.trim() || undefined,
      workMode,
      city: city.trim() || undefined,
      state: state.trim() || undefined,
      openings: typeof openings === "number" ? openings : undefined,
      stipendSalary: stipendSalary.trim() || undefined,
      applicationDeadline: applicationDeadline ? applicationDeadline : undefined,
    };

    try {
      const url = isEdit
        ? `/api/company/opportunities/${initialData!.id}`
        : "/api/company/opportunities";

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save opportunity");
      }

      const savedData = await res.json();
      onSuccess(savedData);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save opportunity. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-montserrat text-lg font-bold text-slate-900">
              {isEdit ? "Edit Opportunity" : "Post New Opportunity"}
            </h3>
            <p className="text-xs text-slate-500">
              Fill in the position details to attract qualified candidates.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="m-6 mb-0 rounded-2xl border border-rose-200 bg-rose-50 p-4 flex items-center gap-3 text-rose-800 text-xs font-semibold">
            <AlertCircle className="size-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Opportunity Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Full-Stack Web Development Intern"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Opportunity Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as OpportunityType)}
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad] cursor-pointer"
              >
                {OPPORTUNITY_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Work Mode *</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad] cursor-pointer"
              >
                {WORK_MODE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Role / Function</label>
              <input
                type="text"
                placeholder="e.g. Frontend Engineer, UI/UX Designer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Experience Required</label>
              <select
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad] cursor-pointer"
              >
                {YEARS_EXPERIENCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">City (Location)</label>
              <input
                type="text"
                placeholder="e.g. Bengaluru, Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">State</label>
              <input
                type="text"
                placeholder="e.g. Karnataka, Maharashtra"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Openings</label>
              <input
                type="number"
                min="1"
                placeholder="1"
                value={openings}
                onChange={(e) => setOpenings(e.target.value ? parseInt(e.target.value, 10) : "")}
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Stipend / Salary Range
              </label>
              <input
                type="text"
                placeholder="e.g. ₹20,000 / month or ₹6–10 LPA"
                value={stipendSalary}
                onChange={(e) => setStipendSalary(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                className="w-full sm:w-1/2 text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Job Description</label>
            <textarea
              rows={4}
              placeholder="Outline role responsibilities, deliverables, requirements, and day-to-day work..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
            />
          </div>

          {/* Tech Stack Chips Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Required Skills & Tech Stack ({techStack.length} selected)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded-xl bg-slate-50 border border-slate-200">
              {PREDEFINED_TECH_STACK.map((tech) => {
                const selected = techStack.includes(tech);
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                      selected
                        ? "bg-[#004aad] text-white border-[#004aad]"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {selected && "✓ "}
                    {tech}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Or add custom skill (e.g. Next.js, Prisma, Figma)"
                value={customTech}
                onChange={(e) => setCustomTech(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomTech();
                  }
                }}
                className="flex-1 text-xs px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
              />
              <button
                type="button"
                onClick={addCustomTech}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Selection Process */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Selection Process / Rounds
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 1. Resume Shortlisting, 2. Technical Coding Round, 3. Culture Fit Interview"
              value={selectionProcess}
              onChange={(e) => setSelectionProcess(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#004aad] text-white text-xs font-bold hover:bg-[#003882] shadow-sm transition-all disabled:opacity-60"
            >
              {saving ? <Loader2 className="size-3.5 animate-spin" /> : null}
              <span>{isEdit ? "Update Opportunity" : "Publish Opportunity"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
