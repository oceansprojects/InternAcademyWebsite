"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getStudentProfile,
  createStudentProfile,
  updateStudentProfile,
} from "@/services/student.api";
import type {
  StudentProfile,
  StudentProfilePayload,
} from "@/types/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  GraduationCap,
  Building,
  Phone,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default function StudentProfileForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [profile, setProfile] = useState<StudentProfile | null>(null);

  const [form, setForm] = useState<StudentProfilePayload>({
    mobileNumber: "",
    collegeName: "",
    degree: "",
    branch: "",
    currentYear: 1,
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getStudentProfile();

        if (data) {
          setProfile(data);

          setForm({
            mobileNumber: data.mobile_number ?? "",
            collegeName: data.college_name ?? "",
            degree: data.degree ?? "",
            branch: data.branch ?? "",
            currentYear: data.current_year ?? 1,
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function updateField<K extends keyof StudentProfilePayload>(
    key: K,
    value: StudentProfilePayload[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      setSaving(true);

      if (profile) {
        await updateStudentProfile(form);
      } else {
        await createStudentProfile(form);
      }
      
      setSuccessMsg("Student profile updated successfully!");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
          <Loader2 className="size-6 animate-spin text-[#004aad]" />
          <span>Loading student profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#004aad] transition-colors mb-2"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="font-montserrat text-3xl font-extrabold text-slate-900 tracking-tight">
            Account & Student Profile
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage your academic details, contact information, and institutional preferences.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
        {/* Alerts */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl p-4 flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl p-4 flex items-center gap-3 animate-in fade-in">
            <span className="shrink-0 text-base">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-montserrat text-sm font-bold text-[#004aad] uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="size-4" />
              <span>Academic & Contact Information</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">Contact Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <Input
                  required
                  placeholder="+91 98765 43210"
                  value={form.mobileNumber}
                  onChange={(e) => updateField("mobileNumber", e.target.value)}
                  className="pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">College / Institution</Label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <Input
                  required
                  placeholder="e.g. RV College of Engineering, Bengaluru"
                  value={form.collegeName}
                  onChange={(e) => updateField("collegeName", e.target.value)}
                  className="pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">Degree</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <Input
                  required
                  placeholder="e.g. B.Tech / B.E."
                  value={form.degree}
                  onChange={(e) => updateField("degree", e.target.value)}
                  className="pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">Branch / Specialization</Label>
              <div className="relative">
                <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <Input
                  required
                  placeholder="e.g. Computer Science & Engineering"
                  value={form.branch}
                  onChange={(e) => updateField("branch", e.target.value)}
                  className="pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">Current Year of Study (1 - 5)</Label>
              <div className="relative">
                <Input
                  type="number"
                  min={1}
                  max={5}
                  required
                  value={form.currentYear}
                  onChange={(e) => updateField("currentYear", Number(e.target.value))}
                  className="rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/student/dashboard"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#004aad] hover:bg-[#003c8c] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{profile ? "Update Profile" : "Complete Profile"}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}