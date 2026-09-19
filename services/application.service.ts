import { sql } from "@/lib/db";
import type { Application, ApplicantWithProfile } from "@/types/company";

export async function applyToOpportunity(
  userId: string,
  opportunityId: string,
  resumeUrl?: string | null,
  coverLetter?: string | null
): Promise<Application> {
  const rows = await sql`
    INSERT INTO internship_applications (
      user_id,
      opportunity_id,
      status,
      resume_url,
      cover_letter,
      applied_at,
      updated_at
    )
    VALUES (
      ${userId},
      ${opportunityId},
      'applied'::application_status,
      ${resumeUrl ?? null},
      ${coverLetter ?? null},
      NOW(),
      NOW()
    )
    RETURNING *
  `;
  return rows[0] as unknown as Application;
}

export async function getApplicationByUserAndOpportunity(
  userId: string,
  opportunityId: string
): Promise<Application | null> {
  const rows = await sql`
    SELECT *
    FROM internship_applications
    WHERE user_id = ${userId} AND opportunity_id = ${opportunityId}
    LIMIT 1
  `;
  return (rows[0] as unknown as Application) ?? null;
}

export async function getApplicationsByOpportunity(
  opportunityId: string,
  companyId: string
): Promise<ApplicantWithProfile[]> {
  // First verify the company owns this opportunity
  const oppRows = await sql`
    SELECT id FROM internship_opportunities
    WHERE id = ${opportunityId} AND company_id = ${companyId}
    LIMIT 1
  `;
  if (!oppRows[0]) {
    throw new Error("Unauthorized or opportunity not found");
  }

  const rows = await sql`
    SELECT
      a.id,
      a.user_id,
      a.opportunity_id,
      a.status,
      a.applied_at,
      a.updated_at,
      COALESCE(sp.full_name, u.name) AS student_name,
      COALESCE(sp.email, u.email) AS student_email,
      sp.full_name,
      sp.profile_photo_url,
      COALESCE(sp.phone_number, sp.mobile_number) AS phone_number,
      sp.tech_stack,
      sp.years_experience,
      COALESCE(a.resume_url, sp.resume_url) AS resume_url,
      sp.address_city,
      sp.address_state,
      sp.college_name,
      sp.degree
    FROM internship_applications a
    JOIN users u ON u.id = a.user_id
    LEFT JOIN student_profiles sp ON sp.user_id = a.user_id
    WHERE a.opportunity_id = ${opportunityId}
    ORDER BY a.applied_at DESC
  `;

  return rows as unknown as ApplicantWithProfile[];
}

export async function getApplicationsByUser(userId: string) {
  const rows = await sql`
    SELECT
      a.*,
      o.title AS opportunity_title,
      o.type AS opportunity_type,
      o.work_mode,
      o.city,
      o.state,
      c.name AS company_name,
      c.logo_url AS company_logo_url
    FROM internship_applications a
    JOIN internship_opportunities o ON o.id = a.opportunity_id
    JOIN companies c ON c.id = o.company_id
    WHERE a.user_id = ${userId}
    ORDER BY a.applied_at DESC
  `;
  return rows;
}

export const getStudentApplications = getApplicationsByUser;

export async function getFullApplicantProfileForCompany(
  applicantUserId: string,
  companyId: string
) {
  const verified = await sql`
    SELECT a.id, a.resume_url, a.cover_letter, a.status, a.applied_at
    FROM internship_applications a
    JOIN internship_opportunities o ON o.id = a.opportunity_id
    WHERE a.user_id = ${applicantUserId} AND o.company_id = ${companyId}
    LIMIT 1
  `;

  if (!verified[0]) {
    throw new Error("Unauthorized or applicant not found for your company");
  }

  const profileRows = await sql`
    SELECT
      sp.*,
      u.name AS user_name,
      u.email AS user_email,
      u.avatar_url AS user_avatar_url
    FROM student_profiles sp
    JOIN users u ON u.id = sp.user_id
    WHERE sp.user_id = ${applicantUserId}
    LIMIT 1
  `;
  const profile = profileRows[0] ?? null;

  const [education, jobs, projects, achievements, certificates] = await Promise.all([
    sql`
      SELECT se.*
      FROM student_education se
      JOIN student_profiles sp ON sp.id = se.student_id
      WHERE sp.user_id = ${applicantUserId}
      ORDER BY se.start_year DESC, se.created_at DESC
    `,
    sql`
      SELECT sj.*
      FROM student_jobs sj
      JOIN student_profiles sp ON sp.id = sj.student_id
      WHERE sp.user_id = ${applicantUserId}
      ORDER BY sj.start_year DESC, sj.start_month DESC, sj.created_at DESC
    `,
    sql`
      SELECT sproj.*
      FROM student_projects sproj
      JOIN student_profiles sp ON sp.id = sproj.student_id
      WHERE sp.user_id = ${applicantUserId}
      ORDER BY sproj.created_at DESC
    `,
    sql`
      SELECT sa.*
      FROM student_achievements sa
      JOIN student_profiles sp ON sp.id = sa.student_id
      WHERE sp.user_id = ${applicantUserId}
      ORDER BY sa.date DESC NULLS LAST, sa.created_at DESC
    `,
    sql`
      SELECT sc.*
      FROM student_certificates sc
      JOIN student_profiles sp ON sp.id = sc.student_id
      WHERE sp.user_id = ${applicantUserId}
      ORDER BY sc.issue_date DESC NULLS LAST, sc.created_at DESC
    `,
  ]);

  return {
    application: verified[0],
    profile,
    education,
    jobs,
    projects,
    achievements,
    certificates,
  };
}

export async function getFullApplicantProfileForAdmin(applicantUserId: string) {
  const profileRows = await sql`
    SELECT
      sp.*,
      u.name AS user_name,
      u.email AS user_email,
      u.avatar_url AS user_avatar_url
    FROM student_profiles sp
    JOIN users u ON u.id = sp.user_id
    WHERE sp.user_id = ${applicantUserId}
    LIMIT 1
  `;
  const profile = profileRows[0] ?? null;

  const [education, jobs, projects, achievements, certificates] = await Promise.all([
    sql`
      SELECT se.*
      FROM student_education se
      JOIN student_profiles sp ON sp.id = se.student_id
      WHERE sp.user_id = ${applicantUserId}
      ORDER BY se.start_year DESC, se.created_at DESC
    `,
    sql`
      SELECT sj.*
      FROM student_jobs sj
      JOIN student_profiles sp ON sp.id = sj.student_id
      WHERE sp.user_id = ${applicantUserId}
      ORDER BY sj.start_year DESC, sj.start_month DESC, sj.created_at DESC
    `,
    sql`
      SELECT sproj.*
      FROM student_projects sproj
      JOIN student_profiles sp ON sp.id = sproj.student_id
      WHERE sp.user_id = ${applicantUserId}
      ORDER BY sproj.created_at DESC
    `,
    sql`
      SELECT sa.*
      FROM student_achievements sa
      JOIN student_profiles sp ON sp.id = sa.student_id
      WHERE sp.user_id = ${applicantUserId}
      ORDER BY sa.date DESC NULLS LAST, sa.created_at DESC
    `,
    sql`
      SELECT sc.*
      FROM student_certificates sc
      JOIN student_profiles sp ON sp.id = sc.student_id
      WHERE sp.user_id = ${applicantUserId}
      ORDER BY sc.issue_date DESC NULLS LAST, sc.created_at DESC
    `,
  ]);

  return {
    profile,
    education,
    jobs,
    projects,
    achievements,
    certificates,
  };
}