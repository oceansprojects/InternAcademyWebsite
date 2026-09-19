import { sql } from "@/lib/db";
import type {
  ProfessionalProfilePayload,
  EducationPayload,
  JobPayload,
  ProjectPayload,
  AchievementPayload,
  CertificatePayload,
} from "@/types/student";

// ─── Professional Profile (flat on student_profiles) ─────

export async function updateProfessionalProfile(
  userId: string,
  data: ProfessionalProfilePayload
) {
  const rows = await sql`
    UPDATE student_profiles
    SET
      full_name         = ${data.fullName ?? null},
      profile_photo_url = ${data.profilePhotoUrl ?? null},
      email             = ${data.email ?? null},
      phone_number      = ${data.phoneNumber ?? null},
      whatsapp_number   = ${data.whatsappNumber ?? null},
      address_state     = ${data.addressState ?? null},
      address_city      = ${data.addressCity ?? null},
      address_nation    = ${data.addressNation ?? null},
      tech_stack        = ${data.techStack || []}::text[],
      years_experience  = ${data.yearsExperience || null}::experience_years,
      resume_url        = ${data.resumeUrl ?? null},
      updated_at        = NOW()
    WHERE user_id = ${userId}
    RETURNING *
  `;
  return rows[0] ?? null;
}

export async function getProfessionalProfile(userId: string) {
  const rows = await sql`
    SELECT
      full_name, profile_photo_url, email,
      phone_number, whatsapp_number,
      address_state, address_city, address_nation,
      tech_stack, years_experience, resume_url
    FROM student_profiles
    WHERE user_id = ${userId}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

// ─── Education ────────────────────────────────────────────

export async function getEducationByUserId(userId: string) {
  return sql`
    SELECT se.*
    FROM student_education se
    JOIN student_profiles sp ON sp.id = se.student_id
    WHERE sp.user_id = ${userId}
    ORDER BY se.start_year DESC, se.created_at DESC
  `;
}

export async function addEducation(userId: string, data: EducationPayload) {
  const rows = await sql`
    INSERT INTO student_education
      (student_id, institute_name, start_year, end_year,
       currently_studying, stream, branch, city, state, grade_cgpa)
    SELECT
      sp.id,
      ${data.instituteName},
      ${data.startYear},
      ${data.currentlyStudying ? null : (data.endYear ?? null)},
      ${data.currentlyStudying},
      ${data.stream || null}::edu_stream,
      ${data.branch || null}::edu_branch,
      ${data.city ?? null},
      ${data.state ?? null},
      ${data.gradeCgpa ?? null}
    FROM student_profiles sp
    WHERE sp.user_id = ${userId}
    RETURNING *
  `;
  return rows[0];
}

export async function updateEducation(
  userId: string,
  id: string,
  data: EducationPayload
) {
  const rows = await sql`
    UPDATE student_education se
    SET
      institute_name     = ${data.instituteName},
      start_year         = ${data.startYear},
      end_year           = ${data.currentlyStudying ? null : (data.endYear ?? null)},
      currently_studying = ${data.currentlyStudying},
      stream             = ${data.stream || null}::edu_stream,
      branch             = ${data.branch || null}::edu_branch,
      city               = ${data.city ?? null},
      state              = ${data.state ?? null},
      grade_cgpa         = ${data.gradeCgpa ?? null}
    FROM student_profiles sp
    WHERE se.id = ${id}
      AND se.student_id = sp.id
      AND sp.user_id = ${userId}
    RETURNING se.*
  `;
  return rows[0] ?? null;
}

export async function deleteEducation(userId: string, id: string) {
  await sql`
    DELETE FROM student_education se
    USING student_profiles sp
    WHERE se.id = ${id}
      AND se.student_id = sp.id
      AND sp.user_id = ${userId}
  `;
}

// ─── Jobs / Internships ───────────────────────────────────

export async function getJobsByUserId(userId: string) {
  return sql`
    SELECT sj.*
    FROM student_jobs sj
    JOIN student_profiles sp ON sp.id = sj.student_id
    WHERE sp.user_id = ${userId}
    ORDER BY sj.start_year DESC, sj.start_month DESC, sj.created_at DESC
  `;
}

export async function addJob(userId: string, data: JobPayload) {
  const rows = await sql`
    INSERT INTO student_jobs
      (student_id, company_name, position, type,
       start_month, start_year, end_month, end_year,
       currently_working, city, state, description)
    SELECT
      sp.id,
      ${data.companyName},
      ${data.position},
      ${data.type}::job_type,
      ${data.startMonth},
      ${data.startYear},
      ${data.currentlyWorking ? null : (data.endMonth ?? null)},
      ${data.currentlyWorking ? null : (data.endYear ?? null)},
      ${data.currentlyWorking},
      ${data.city ?? null},
      ${data.state ?? null},
      ${data.description ?? null}
    FROM student_profiles sp
    WHERE sp.user_id = ${userId}
    RETURNING *
  `;
  return rows[0];
}

export async function updateJob(
  userId: string,
  id: string,
  data: JobPayload
) {
  const rows = await sql`
    UPDATE student_jobs sj
    SET
      company_name      = ${data.companyName},
      position          = ${data.position},
      type              = ${data.type}::job_type,
      start_month       = ${data.startMonth},
      start_year        = ${data.startYear},
      end_month         = ${data.currentlyWorking ? null : (data.endMonth ?? null)},
      end_year          = ${data.currentlyWorking ? null : (data.endYear ?? null)},
      currently_working = ${data.currentlyWorking},
      city              = ${data.city ?? null},
      state             = ${data.state ?? null},
      description       = ${data.description ?? null}
    FROM student_profiles sp
    WHERE sj.id = ${id}
      AND sj.student_id = sp.id
      AND sp.user_id = ${userId}
    RETURNING sj.*
  `;
  return rows[0] ?? null;
}

export async function deleteJob(userId: string, id: string) {
  await sql`
    DELETE FROM student_jobs sj
    USING student_profiles sp
    WHERE sj.id = ${id}
      AND sj.student_id = sp.id
      AND sp.user_id = ${userId}
  `;
}

// ─── Projects ─────────────────────────────────────────────

export async function getProjectsByUserId(userId: string) {
  return sql`
    SELECT sp2.*
    FROM student_projects sp2
    JOIN student_profiles sp ON sp.id = sp2.student_id
    WHERE sp.user_id = ${userId}
    ORDER BY sp2.is_ongoing DESC, sp2.start_date DESC NULLS LAST, sp2.created_at DESC
  `;
}

function toValidDate(d?: string | null): string | null {
  if (!d) return null;
  const trimmed = d.trim();
  if (!trimmed) return null;
  if (/^\d{4}-\d{2}$/.test(trimmed)) return `${trimmed}-01`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  return trimmed;
}

export async function addProject(userId: string, data: ProjectPayload) {
  const rows = await sql`
    INSERT INTO student_projects
      (student_id, title, description, tech_stack, project_url,
       start_date, end_date, is_ongoing)
    SELECT
      sp.id,
      ${data.title},
      ${data.description ?? null},
      ${data.techStack || []}::text[],
      ${data.projectUrl ?? null},
      ${toValidDate(data.startDate)},
      ${data.isOngoing ? null : toValidDate(data.endDate)},
      ${data.isOngoing}
    FROM student_profiles sp
    WHERE sp.user_id = ${userId}
    RETURNING *
  `;
  return rows[0];
}

export async function updateProject(
  userId: string,
  id: string,
  data: ProjectPayload
) {
  const rows = await sql`
    UPDATE student_projects sp2
    SET
      title       = ${data.title},
      description = ${data.description ?? null},
      tech_stack  = ${data.techStack || []}::text[],
      project_url = ${data.projectUrl ?? null},
      start_date  = ${toValidDate(data.startDate)},
      end_date    = ${data.isOngoing ? null : toValidDate(data.endDate)},
      is_ongoing  = ${data.isOngoing}
    FROM student_profiles sp
    WHERE sp2.id = ${id}
      AND sp2.student_id = sp.id
      AND sp.user_id = ${userId}
    RETURNING sp2.*
  `;
  return rows[0] ?? null;
}

export async function deleteProject(userId: string, id: string) {
  await sql`
    DELETE FROM student_projects sp2
    USING student_profiles sp
    WHERE sp2.id = ${id}
      AND sp2.student_id = sp.id
      AND sp.user_id = ${userId}
  `;
}

// ─── Achievements ─────────────────────────────────────────

export async function getAchievementsByUserId(userId: string) {
  return sql`
    SELECT sa.*
    FROM student_achievements sa
    JOIN student_profiles sp ON sp.id = sa.student_id
    WHERE sp.user_id = ${userId}
    ORDER BY sa.date DESC NULLS LAST, sa.created_at DESC
  `;
}

export async function addAchievement(userId: string, data: AchievementPayload) {
  const rows = await sql`
    INSERT INTO student_achievements
      (student_id, title, description, date, organization)
    SELECT
      sp.id,
      ${data.title},
      ${data.description ?? null},
      ${toValidDate(data.date)},
      ${data.organization ?? null}
    FROM student_profiles sp
    WHERE sp.user_id = ${userId}
    RETURNING *
  `;
  return rows[0];
}

export async function updateAchievement(
  userId: string,
  id: string,
  data: AchievementPayload
) {
  const rows = await sql`
    UPDATE student_achievements sa
    SET
      title        = ${data.title},
      description  = ${data.description ?? null},
      date         = ${toValidDate(data.date)},
      organization = ${data.organization ?? null}
    FROM student_profiles sp
    WHERE sa.id = ${id}
      AND sa.student_id = sp.id
      AND sp.user_id = ${userId}
    RETURNING sa.*
  `;
  return rows[0] ?? null;
}

export async function deleteAchievement(userId: string, id: string) {
  await sql`
    DELETE FROM student_achievements sa
    USING student_profiles sp
    WHERE sa.id = ${id}
      AND sa.student_id = sp.id
      AND sp.user_id = ${userId}
  `;
}

// ─── Certificates ─────────────────────────────────────────

export async function getCertificatesByUserId(userId: string) {
  return sql`
    SELECT sc.*
    FROM student_certificates sc
    JOIN student_profiles sp ON sp.id = sc.student_id
    WHERE sp.user_id = ${userId}
    ORDER BY sc.issue_date DESC NULLS LAST, sc.created_at DESC
  `;
}

export async function addCertificate(userId: string, data: CertificatePayload) {
  const rows = await sql`
    INSERT INTO student_certificates
      (student_id, title, issuing_org, issue_date, certificate_link)
    SELECT
      sp.id,
      ${data.title},
      ${data.issuingOrg},
      ${toValidDate(data.issueDate)},
      ${data.certificateLink ?? null}
    FROM student_profiles sp
    WHERE sp.user_id = ${userId}
    RETURNING *
  `;
  return rows[0];
}

export async function updateCertificate(
  userId: string,
  id: string,
  data: CertificatePayload
) {
  const rows = await sql`
    UPDATE student_certificates sc
    SET
      title            = ${data.title},
      issuing_org      = ${data.issuingOrg},
      issue_date       = ${toValidDate(data.issueDate)},
      certificate_link = ${data.certificateLink ?? null}
    FROM student_profiles sp
    WHERE sc.id = ${id}
      AND sc.student_id = sp.id
      AND sp.user_id = ${userId}
    RETURNING sc.*
  `;
  return rows[0] ?? null;
}

export async function deleteCertificate(userId: string, id: string) {
  await sql`
    DELETE FROM student_certificates sc
    USING student_profiles sp
    WHERE sc.id = ${id}
      AND sc.student_id = sp.id
      AND sp.user_id = ${userId}
  `;
}
