import type {
  ProfessionalProfilePayload,
  EducationPayload,
  EducationEntry,
  JobPayload,
  JobEntry,
  ProjectPayload,
  ProjectEntry,
  AchievementPayload,
  AchievementEntry,
  CertificatePayload,
  CertificateEntry,
} from "@/types/student";

// ─── Professional Profile ─────────────────────────────────

export async function getProfessionalProfile() {
  const res = await fetch("/api/student/professional", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch professional profile");
  return res.json();
}

export async function updateProfessionalProfile(payload: ProfessionalProfilePayload) {
  const res = await fetch("/api/student/professional", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update professional profile");
  return res.json();
}

// ─── Education ────────────────────────────────────────────

export async function getEducation(): Promise<EducationEntry[]> {
  const res = await fetch("/api/student/education", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch education");
  return res.json();
}

export async function addEducation(payload: EducationPayload): Promise<EducationEntry> {
  const res = await fetch("/api/student/education", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to add education entry");
  return res.json();
}

export async function updateEducation(id: string, payload: EducationPayload): Promise<EducationEntry> {
  const res = await fetch(`/api/student/education/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update education entry");
  return res.json();
}

export async function deleteEducation(id: string): Promise<void> {
  const res = await fetch(`/api/student/education/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete education entry");
}

// ─── Jobs / Internships ───────────────────────────────────

export async function getJobs(): Promise<JobEntry[]> {
  const res = await fetch("/api/student/jobs", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

export async function addJob(payload: JobPayload): Promise<JobEntry> {
  const res = await fetch("/api/student/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to add job entry");
  return res.json();
}

export async function updateJob(id: string, payload: JobPayload): Promise<JobEntry> {
  const res = await fetch(`/api/student/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update job entry");
  return res.json();
}

export async function deleteJob(id: string): Promise<void> {
  const res = await fetch(`/api/student/jobs/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete job entry");
}

// ─── Projects ─────────────────────────────────────────────

export async function getProjects(): Promise<ProjectEntry[]> {
  const res = await fetch("/api/student/projects", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function addProject(payload: ProjectPayload): Promise<ProjectEntry> {
  const res = await fetch("/api/student/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to add project entry");
  return res.json();
}

export async function updateProject(id: string, payload: ProjectPayload): Promise<ProjectEntry> {
  const res = await fetch(`/api/student/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update project entry");
  return res.json();
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`/api/student/projects/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete project entry");
}

// ─── Achievements ─────────────────────────────────────────

export async function getAchievements(): Promise<AchievementEntry[]> {
  const res = await fetch("/api/student/achievements", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch achievements");
  return res.json();
}

export async function addAchievement(payload: AchievementPayload): Promise<AchievementEntry> {
  const res = await fetch("/api/student/achievements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to add achievement entry");
  return res.json();
}

export async function updateAchievement(id: string, payload: AchievementPayload): Promise<AchievementEntry> {
  const res = await fetch(`/api/student/achievements/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update achievement entry");
  return res.json();
}

export async function deleteAchievement(id: string): Promise<void> {
  const res = await fetch(`/api/student/achievements/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete achievement entry");
}

// ─── Certificates ─────────────────────────────────────────

export async function getCertificates(): Promise<CertificateEntry[]> {
  const res = await fetch("/api/student/certificates", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch certificates");
  return res.json();
}

export async function addCertificate(payload: CertificatePayload): Promise<CertificateEntry> {
  const res = await fetch("/api/student/certificates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to add certificate entry");
  return res.json();
}

export async function updateCertificate(id: string, payload: CertificatePayload): Promise<CertificateEntry> {
  const res = await fetch(`/api/student/certificates/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update certificate entry");
  return res.json();
}

export async function deleteCertificate(id: string): Promise<void> {
  const res = await fetch(`/api/student/certificates/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete certificate entry");
}
