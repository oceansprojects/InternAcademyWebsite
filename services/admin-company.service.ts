import { sql } from "@/lib/db";

export interface AdminCompaniesParams {
  search?: string;
  status?: string; // 'all' | 'active' | 'blocked'
  page?: number;
  limit?: number;
}

export interface AdminOpportunitiesParams {
  search?: string;
  type?: string; // 'all' | 'internship' | 'job'
  status?: string; // 'all' | 'active' | 'expired' | 'closed'
  page?: number;
  limit?: number;
}

/**
 * Fetch companies list for Admin with search, status filter, and pagination
 */
export async function getAdminCompanies(params: AdminCompaniesParams = {}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 15);
  const offset = (page - 1) * limit;
  const search = params.search?.trim() || "";
  const status = params.status || "all";

  const companies = await sql`
    SELECT
      c.id,
      c.name,
      c.logo_url,
      c.website,
      c.contact_email,
      c.contact_number,
      c.employee_count,
      c.address_city,
      c.address_state,
      c.created_at,
      c.updated_at,
      COALESCE(u.is_active, true) AS is_active,
      u.id AS user_id,
      u.name AS user_name,
      u.email AS user_email,
      u.oauth_provider,
      (SELECT COUNT(*)::int FROM internship_opportunities o WHERE o.company_id = c.id) AS opportunity_count
    FROM companies c
    LEFT JOIN company_users cu ON cu.company_id = c.id
    LEFT JOIN users u ON u.id = cu.user_id
    WHERE (
      ${search === ""} OR
      c.name ILIKE ${"%" + search + "%"} OR
      c.contact_email ILIKE ${"%" + search + "%"} OR
      u.email ILIKE ${"%" + search + "%"} OR
      u.name ILIKE ${"%" + search + "%"}
    )
    AND (
      ${status === "all"} OR
      (${status === "active"} AND COALESCE(u.is_active, true) = true) OR
      (${status === "blocked"} AND COALESCE(u.is_active, true) = false)
    )
    ORDER BY c.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const countResult = await sql`
    SELECT COUNT(*)::int AS total
    FROM companies c
    LEFT JOIN company_users cu ON cu.company_id = c.id
    LEFT JOIN users u ON u.id = cu.user_id
    WHERE (
      ${search === ""} OR
      c.name ILIKE ${"%" + search + "%"} OR
      c.contact_email ILIKE ${"%" + search + "%"} OR
      u.email ILIKE ${"%" + search + "%"} OR
      u.name ILIKE ${"%" + search + "%"}
    )
    AND (
      ${status === "all"} OR
      (${status === "active"} AND COALESCE(u.is_active, true) = true) OR
      (${status === "blocked"} AND COALESCE(u.is_active, true) = false)
    )
  `;

  const total = countResult[0]?.total ?? 0;

  return {
    companies,
    total,
    page,
    limit,
  };
}

/**
 * Overall company statistics for Admin dashboard
 */
export async function getAdminCompanyStats() {
  const rows = await sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(CASE WHEN COALESCE(u.is_active, true) = true THEN 1 END)::int AS active,
      COUNT(CASE WHEN COALESCE(u.is_active, true) = false THEN 1 END)::int AS blocked
    FROM companies c
    LEFT JOIN company_users cu ON cu.company_id = c.id
    LEFT JOIN users u ON u.id = cu.user_id
  `;

  return rows[0] || { total: 0, active: 0, blocked: 0 };
}

/**
 * Fetch complete Company Profile for Admin (with social links, associated account, and opportunities)
 */
export async function getAdminCompanyById(companyId: string) {
  const companyRows = await sql`
    SELECT
      c.*,
      COALESCE(u.is_active, true) AS is_active,
      u.id AS user_id,
      u.name AS user_name,
      u.email AS user_email,
      u.role AS user_role,
      u.oauth_provider,
      u.created_at AS user_created_at
    FROM companies c
    LEFT JOIN company_users cu ON cu.company_id = c.id
    LEFT JOIN users u ON u.id = cu.user_id
    WHERE c.id = ${companyId}
    LIMIT 1
  `;

  if (!companyRows[0]) {
    return null;
  }

  const company = companyRows[0];

  const [socialLinks, opportunities] = await Promise.all([
    sql`
      SELECT id, social_app_name, social_acc_link, sort_order, created_at
      FROM company_social_links
      WHERE company_id = ${companyId}
      ORDER BY sort_order ASC, created_at ASC
    `,
    sql`
      SELECT
        o.*,
        (SELECT COUNT(*)::int FROM internship_applications a WHERE a.opportunity_id = o.id) AS applicant_count
      FROM internship_opportunities o
      WHERE o.company_id = ${companyId}
      ORDER BY o.created_at DESC
    `,
  ]);

  return {
    ...company,
    social_links: socialLinks,
    opportunities,
  };
}

/**
 * Block or Unblock a company by toggling is_active on its linked user(s)
 */
export async function toggleCompanyStatus(companyId: string, isActive: boolean) {
  const updatedUsers = await sql`
    UPDATE users
    SET is_active = ${isActive},
        updated_at = NOW()
    WHERE id IN (
      SELECT user_id FROM company_users WHERE company_id = ${companyId}
    )
    RETURNING id, is_active
  `;

  return {
    success: true,
    companyId,
    isActive,
    updatedUsersCount: updatedUsers.length,
  };
}

/**
 * Fetch all opportunities for Admin with search, type, status filter, and pagination
 */
export async function getAdminOpportunities(params: AdminOpportunitiesParams = {}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 15);
  const offset = (page - 1) * limit;
  const search = params.search?.trim() || "";
  const type = params.type || "all";
  const status = params.status || "all";

  const opportunities = await sql`
    SELECT
      o.id,
      o.company_id,
      o.title,
      o.type,
      o.role,
      o.tech_stack,
      o.years_experience,
      o.status,
      o.work_mode,
      o.city,
      o.state,
      o.openings,
      o.stipend_salary,
      o.application_deadline,
      o.is_active,
      o.created_at,
      o.updated_at,
      c.name AS company_name,
      c.logo_url AS company_logo_url,
      c.website AS company_website,
      (SELECT COUNT(*)::int FROM internship_applications a WHERE a.opportunity_id = o.id) AS applicant_count
    FROM internship_opportunities o
    LEFT JOIN companies c ON c.id = o.company_id
    WHERE (
      ${search === ""} OR
      o.title ILIKE ${"%" + search + "%"} OR
      o.role ILIKE ${"%" + search + "%"} OR
      c.name ILIKE ${"%" + search + "%"}
    )
    AND (
      ${type === "all" || !type} OR
      (${type === "internship"} AND o.type = 'internship') OR
      (${type === "job"} AND o.type != 'internship') OR
      (o.type::text = ${type})
    )
    AND (
      ${status === "all" || !status} OR
      o.status::text = ${status}
    )
    ORDER BY o.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const countResult = await sql`
    SELECT COUNT(*)::int AS total
    FROM internship_opportunities o
    LEFT JOIN companies c ON c.id = o.company_id
    WHERE (
      ${search === ""} OR
      o.title ILIKE ${"%" + search + "%"} OR
      o.role ILIKE ${"%" + search + "%"} OR
      c.name ILIKE ${"%" + search + "%"}
    )
    AND (
      ${type === "all" || !type} OR
      (${type === "internship"} AND o.type = 'internship') OR
      (${type === "job"} AND o.type != 'internship') OR
      (o.type::text = ${type})
    )
    AND (
      ${status === "all" || !status} OR
      o.status::text = ${status}
    )
  `;

  const total = countResult[0]?.total ?? 0;

  return {
    opportunities,
    total,
    page,
    limit,
  };
}

/**
 * Aggregate counts for opportunities
 */
export async function getAdminOpportunityStats() {
  const rows = await sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(CASE WHEN status = 'active' THEN 1 END)::int AS active,
      COUNT(CASE WHEN status = 'expired' THEN 1 END)::int AS expired,
      COUNT(CASE WHEN status = 'closed' THEN 1 END)::int AS closed,
      COUNT(CASE WHEN type = 'internship' THEN 1 END)::int AS internships,
      COUNT(CASE WHEN type != 'internship' THEN 1 END)::int AS jobs
    FROM internship_opportunities
  `;

  return (
    rows[0] || {
      total: 0,
      active: 0,
      expired: 0,
      closed: 0,
      internships: 0,
      jobs: 0,
    }
  );
}

/**
 * Fetch single opportunity with full details and applicant list for Admin
 */
export async function getAdminOpportunityById(opportunityId: string) {
  const oppRows = await sql`
    SELECT
      o.*,
      c.name AS company_name,
      c.logo_url AS company_logo_url,
      c.website AS company_website,
      c.contact_email AS company_contact_email,
      c.contact_number AS company_contact_number,
      c.address_city AS company_city,
      c.address_state AS company_state,
      c.address_nation AS company_nation,
      c.employee_count AS company_employee_count
    FROM internship_opportunities o
    LEFT JOIN companies c ON c.id = o.company_id
    WHERE o.id = ${opportunityId}
    LIMIT 1
  `;

  if (!oppRows[0]) {
    return null;
  }

  const applicants = await sql`
    SELECT
      a.id,
      a.user_id,
      a.opportunity_id,
      a.status,
      a.applied_at,
      a.updated_at,
      COALESCE(sp.full_name, u.name) AS student_name,
      COALESCE(sp.email, u.email) AS student_email,
      COALESCE(sp.phone_number, sp.mobile_number) AS student_phone,
      COALESCE(a.resume_url, sp.resume_url) AS resume_url,
      sp.profile_photo_url,
      sp.college_name,
      sp.degree,
      sp.tech_stack,
      sp.years_experience
    FROM internship_applications a
    JOIN users u ON u.id = a.user_id
    LEFT JOIN student_profiles sp ON sp.user_id = a.user_id
    WHERE a.opportunity_id = ${opportunityId}
    ORDER BY a.applied_at DESC
  `;

  return {
    ...oppRows[0],
    applicants,
  };
}

/**
 * Update opportunity status (expire, close/delist, activate)
 */
export async function updateAdminOpportunityStatus(
  opportunityId: string,
  status: "active" | "expired" | "closed"
) {
  const rows = await sql`
    UPDATE internship_opportunities
    SET status = ${status}::opportunity_status,
        is_active = CASE WHEN ${status} = 'active' THEN TRUE ELSE FALSE END,
        updated_at = NOW()
    WHERE id = ${opportunityId}
    RETURNING *
  `;

  return rows[0] ?? null;
}

/**
 * Delist or delete an opportunity from admin
 */
export async function deleteAdminOpportunity(opportunityId: string) {
  const rows = await sql`
    UPDATE internship_opportunities
    SET status = 'closed'::opportunity_status,
        is_active = FALSE,
        updated_at = NOW()
    WHERE id = ${opportunityId}
    RETURNING id
  `;

  return rows.length > 0;
}
