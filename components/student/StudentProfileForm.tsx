"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getStudentProfile,
  createStudentProfile,
  updateStudentProfile,
} from "@/services/student.api";
import {
  updateProfessionalProfile,
  getEducation,
  getJobs,
  getProjects,
  getAchievements,
  getCertificates,
} from "@/services/student-professional.api";
import type {
  StudentProfile,
  StudentProfilePayload,
  ProfessionalProfilePayload,
  YearsExperience,
  EducationEntry,
  JobEntry,
  ProjectEntry,
  AchievementEntry,
  CertificateEntry,
} from "@/types/student";
import { YEARS_EXPERIENCE_OPTIONS } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  GraduationCap,
  Building,
  Phone,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  BookOpen,
  Mail,
  MapPin,
  Globe,
  FileText,
  Briefcase,
  Camera,
  Sparkles,
} from "lucide-react";
import TechStackPicker from "@/components/student/TechStackPicker";
import EducationSection from "@/components/student/multi-entry/EducationSection";
import JobsSection from "@/components/student/multi-entry/JobsSection";
import ProjectsSection from "@/components/student/multi-entry/ProjectsSection";
import AchievementsSection from "@/components/student/multi-entry/AchievementsSection";
import CertificatesSection from "@/components/student/multi-entry/CertificatesSection";

export default function StudentProfileForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [profile, setProfile] = useState<StudentProfile | null>(null);

  // Multi-entry initial states
  const [educationList, setEducationList] = useState<EducationEntry[]>([]);
  const [jobsList, setJobsList] = useState<JobEntry[]>([]);
  const [projectsList, setProjectsList] = useState<ProjectEntry[]>([]);
  const [achievementsList, setAchievementsList] = useState<AchievementEntry[]>([]);
  const [certificatesList, setCertificatesList] = useState<CertificateEntry[]>([]);

  // Academic form
  const [academicForm, setAcademicForm] = useState<StudentProfilePayload>({
    mobileNumber: "",
    collegeName: "",
    degree: "",
    branch: "",
    currentYear: 1,
  });

  // Professional form
  const [proForm, setProForm] = useState<ProfessionalProfilePayload>({
    fullName: "",
    profilePhotoUrl: "",
    email: "",
    phoneNumber: "",
    whatsappNumber: "",
    addressNation: "India",
    addressState: "",
    addressCity: "",
    yearsExperience: "0-1",
    techStack: [],
    resumeUrl: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const [profileData, edu, jobs, projs, ach, certs] = await Promise.all([
          getStudentProfile().catch(() => null),
          getEducation().catch(() => []),
          getJobs().catch(() => []),
          getProjects().catch(() => []),
          getAchievements().catch(() => []),
          getCertificates().catch(() => []),
        ]);

        if (profileData) {
          setProfile(profileData);

          setAcademicForm({
            mobileNumber: profileData.mobile_number ?? "",
            collegeName: profileData.college_name ?? "",
            degree: profileData.degree ?? "",
            branch: profileData.branch ?? "",
            currentYear: profileData.current_year ?? 1,
          });

          setProForm({
            fullName: profileData.full_name ?? "",
            profilePhotoUrl: profileData.profile_photo_url ?? "",
            email: profileData.email ?? "",
            phoneNumber: profileData.phone_number ?? profileData.mobile_number ?? "",
            whatsappNumber: profileData.whatsapp_number ?? "",
            addressNation: profileData.address_nation ?? "India",
            addressState: profileData.address_state ?? "",
            addressCity: profileData.address_city ?? "",
            yearsExperience: (profileData.years_experience as YearsExperience) ?? "0-1",
            techStack: Array.isArray(profileData.tech_stack) ? profileData.tech_stack : [],
            resumeUrl: profileData.resume_url ?? "",
          });
        }

        setEducationList(edu ?? []);
        setJobsList(jobs ?? []);
        setProjectsList(projs ?? []);
        setAchievementsList(ach ?? []);
        setCertificatesList(certs ?? []);
      } catch (err) {
        console.error("Failed to load full profile:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function updateAcademic<K extends keyof StudentProfilePayload>(
    key: K,
    value: StudentProfilePayload[K]
  ) {
    setAcademicForm((prev) => ({ ...prev, [key]: value }));
  }

  function updatePro<K extends keyof ProfessionalProfilePayload>(
    key: K,
    value: ProfessionalProfilePayload[K]
  ) {
    setProForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      setSaving(true);

      // 1. Save or create basic academic profile
      if (profile) {
        await updateStudentProfile(academicForm);
      } else {
        const created = await createStudentProfile(academicForm);
        setProfile(created);
      }

      // 2. Save professional profile extension
      await updateProfessionalProfile(proForm);

      setSuccessMsg("Professional profile updated successfully!");
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
          <span>Loading professional profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 pb-16">
      {/* Header */}
      <div>
        <Link
          href="/student/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#004aad] transition-colors mb-2"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-montserrat text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span>Student Professional Profile</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#004aad] border border-blue-200 uppercase tracking-wider">
                Comprehensive
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Manage your personal, academic, and professional credentials for internships & job placements.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Profile Form Card */}
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Identity & Personal Details */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="size-4 text-[#004aad]" />
              <h3 className="font-montserrat text-sm font-bold text-[#004aad] uppercase tracking-wider">
                Personal & Contact Details
              </h3>
            </div>

            {/* Avatar Preview + Photo URL */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="relative size-18 rounded-2xl bg-slate-200 border-2 border-white shadow-sm overflow-hidden shrink-0 flex items-center justify-center text-slate-400">
                {proForm.profilePhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={proForm.profilePhotoUrl}
                    alt="Profile preview"
                    className="size-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <Camera className="size-7 opacity-50" />
                )}
              </div>
              <div className="flex-1 space-y-1.5 w-full">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Profile Photo URL
                </Label>
                <Input
                  type="url"
                  placeholder="https://example.com/your-photo.jpg (or Cloudinary / GitHub avatar URL)"
                  value={proForm.profilePhotoUrl ?? ""}
                  onChange={(e) => updatePro("profilePhotoUrl", e.target.value)}
                  className="rounded-xl bg-white border-slate-200 text-sm font-medium"
                />
                <p className="text-[11px] text-slate-400">
                  Provide a direct image URL (PNG, JPG, WebP) for your professional avatar.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <Input
                    placeholder="e.g. Rahul Sharma"
                    value={proForm.fullName ?? ""}
                    onChange={(e) => updatePro("fullName", e.target.value)}
                    className="pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <Input
                    type="email"
                    placeholder="rahul.sharma@example.com"
                    value={proForm.email ?? ""}
                    onChange={(e) => updatePro("email", e.target.value)}
                    className="pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <Input
                    required
                    placeholder="+91 98765 43210"
                    value={academicForm.mobileNumber}
                    onChange={(e) => {
                      updateAcademic("mobileNumber", e.target.value);
                      updatePro("phoneNumber", e.target.value);
                    }}
                    className="pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  WhatsApp Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500 size-4" />
                  <Input
                    placeholder="+91 98765 43210"
                    value={proForm.whatsappNumber ?? ""}
                    onChange={(e) => updatePro("whatsappNumber", e.target.value)}
                    className="pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Location (Nation, State, City) */}
            <div className="grid md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Country / Nation
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <Input
                    placeholder="India"
                    value={proForm.addressNation ?? "India"}
                    onChange={(e) => updatePro("addressNation", e.target.value)}
                    className="pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  State / Region
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <Input
                    placeholder="e.g. Karnataka"
                    value={proForm.addressState ?? ""}
                    onChange={(e) => updatePro("addressState", e.target.value)}
                    className="pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  City
                </Label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <Input
                    placeholder="e.g. CSN"
                    value={proForm.addressCity ?? ""}
                    onChange={(e) => updatePro("addressCity", e.target.value)}
                    className="pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Academic Information */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <GraduationCap className="size-4 text-[#004aad]" />
              <h3 className="font-montserrat text-sm font-bold text-[#004aad] uppercase tracking-wider">
                Current College & Degree
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  College / Institution <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <Input
                    required
                    placeholder="e.g. RV College of Engineering, CSN"
                    value={academicForm.collegeName}
                    onChange={(e) => updateAcademic("collegeName", e.target.value)}
                    className="pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Degree <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <Input
                    required
                    placeholder="e.g. B.Tech / B.E. / BCA"
                    value={academicForm.degree}
                    onChange={(e) => updateAcademic("degree", e.target.value)}
                    className="pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Branch / Specialization <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <Input
                    required
                    placeholder="e.g. Computer Science & Engineering"
                    value={academicForm.branch}
                    onChange={(e) => updateAcademic("branch", e.target.value)}
                    className="pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Current Year of Study (1 - 5) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  required
                  value={academicForm.currentYear}
                  onChange={(e) => updateAcademic("currentYear", Number(e.target.value))}
                  className="rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* 3. Professional Experience Level & Tech Stack */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <Briefcase className="size-4 text-[#004aad]" />
              <h3 className="font-montserrat text-sm font-bold text-[#004aad] uppercase tracking-wider">
                Experience & Skills
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Total Years of Experience
                </Label>
                <Select
                  value={proForm.yearsExperience ?? "0-1"}
                  onValueChange={(val) => updatePro("yearsExperience", val as YearsExperience)}
                >
                  <SelectTrigger className="rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium">
                    <SelectValue placeholder="Select experience range" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS_EXPERIENCE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Resume / CV Link
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <Input
                    type="url"
                    placeholder="https://drive.google.com/... or Notion / Dropbox URL"
                    value={proForm.resumeUrl ?? ""}
                    onChange={(e) => updatePro("resumeUrl", e.target.value)}
                    className="pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Primary Tech Stack & Skills
                  </Label>
                  <span className="text-[11px] text-slate-400">
                    Click predefined chips or type custom technologies
                  </span>
                </div>
                <TechStackPicker
                  value={proForm.techStack}
                  onChange={(tags) => updatePro("techStack", tags)}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
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
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  <span>Save Profile Details</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Multi-entry Sections */}
      <div className="space-y-8">
        <div>
          <h2 className="font-montserrat text-xl font-extrabold text-slate-900 tracking-tight">
            Detailed Qualifications & History
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Add multiple education entries, work history, projects, awards, and certificates.
          </p>
        </div>

        {/* 1. Education */}
        <EducationSection initialEntries={educationList} />

        {/* 2. Work Experience / Internships */}
        <JobsSection initialEntries={jobsList} />

        {/* 3. Projects */}
        <ProjectsSection initialEntries={projectsList} />

        {/* 4. Achievements */}
        <AchievementsSection initialEntries={achievementsList} />

        {/* 5. Certifications */}
        <CertificatesSection initialEntries={certificatesList} />
      </div>
    </div>
  );
}