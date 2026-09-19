import { sql } from "@/lib/db";
import type { Opportunity, OpportunityPayload, OpportunityStatus } from "@/types/company";

export async function createOpportunity(
  companyId: string,
  data: OpportunityPayload
): Promise<Opportunity> {
  const rows = await sql`
    INSERT INTO internship_opportunities (
      company_id,
      title,
      type,
      description,
      role,
      tech_stack,
      years_experience,
      selection_process,
      work_mode,
      city,
      state,
      openings,
      stipend_salary,
      application_deadline,
      status,
      is_active
    )
    VALUES (
      ${companyId},
      ${data.title},
      ${data.type}::opportunity_type,
      ${data.description ?? null},
      ${data.role ?? null},
      ${data.techStack ?? []},
      ${data.yearsExperience ? data.yearsExperience : null}::experience_years,
      ${data.selectionProcess ?? null},
      ${data.workMode}::work_mode,
      ${data.city ?? null},
      ${data.state ?? null},
      ${data.openings ?? null},
      ${data.stipendSalary ?? null},
      ${data.applicationDeadline ? new Date(data.applicationDeadline).toISOString() : null},
      'active'::opportunity_status,
      TRUE
    )
    RETURNING *
  `;
  return rows[0] as unknown as Opportunity;
}

export async function getOpportunitiesByCompany(companyId: string): Promise<Opportunity[]> {
  const rows = await sql`
    SELECT o.*,
           (SELECT COUNT(*)::int FROM internship_applications a WHERE a.opportunity_id = o.id) AS applicant_count
    FROM internship_opportunities o
    WHERE o.company_id = ${companyId}
    ORDER BY o.created_at DESC
  `;
  return rows as unknown as Opportunity[];
}

export async function getOpportunityById(id: string): Promise<Opportunity | null> {
  const rows = await sql`
    SELECT
      o.*,
      c.name AS company_name,
      c.logo_url AS company_logo_url,
      c.website AS company_website,
      c.address_city AS company_city,
      c.address_state AS company_state
    FROM internship_opportunities o
    LEFT JOIN companies c ON c.id = o.company_id
    WHERE o.id = ${id}
    LIMIT 1
  `;
  return (rows[0] as unknown as Opportunity) ?? null;
}

export async function updateOpportunity(
  id: string,
  companyId: string,
  data: Partial<OpportunityPayload> & { status?: OpportunityStatus }
): Promise<Opportunity | null> {
  const rows = await sql`
    UPDATE internship_opportunities SET
      title                = COALESCE(${data.title ?? null}, title),
      type                 = COALESCE(${data.type ?? null}::opportunity_type, type),
      description          = ${data.description !== undefined ? data.description : sql`description`},
      role                 = ${data.role !== undefined ? data.role : sql`role`},
      tech_stack           = COALESCE(${data.techStack ?? null}, tech_stack),
      years_experience     = ${data.yearsExperience ? data.yearsExperience : null}::experience_years,
      selection_process    = ${data.selectionProcess !== undefined ? data.selectionProcess : sql`selection_process`},
      work_mode            = COALESCE(${data.workMode ?? null}::work_mode, work_mode),
      city                 = ${data.city !== undefined ? data.city : sql`city`},
      state                = ${data.state !== undefined ? data.state : sql`state`},
      openings             = ${data.openings !== undefined ? data.openings : sql`openings`},
      stipend_salary       = ${data.stipendSalary !== undefined ? data.stipendSalary : sql`stipend_salary`},
      application_deadline = ${data.applicationDeadline ? new Date(data.applicationDeadline).toISOString() : null},
      status               = COALESCE(${data.status ?? null}::opportunity_status, status),
      is_active            = CASE WHEN ${data.status ?? null} = 'active' THEN TRUE ELSE is_active END,
      updated_at           = NOW()
    WHERE id = ${id} AND company_id = ${companyId}
    RETURNING *
  `;
  return (rows[0] as unknown as Opportunity) ?? null;
}

export async function expireOpportunity(id: string, companyId: string): Promise<boolean> {
  const rows = await sql`
    UPDATE internship_opportunities
    SET status = 'expired'::opportunity_status,
        is_active = FALSE,
        updated_at = NOW()
    WHERE id = ${id} AND company_id = ${companyId}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function deleteOpportunity(id: string, companyId: string): Promise<boolean> {
  const rows = await sql`
    DELETE FROM internship_opportunities
    WHERE id = ${id} AND company_id = ${companyId}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function getPublicOpportunities(filters: {
  type?: string;
  work_mode?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const limit = filters.limit || 20;
  const page = Math.max(1, filters.page || 1);
  const offset = (page - 1) * limit;

  // We fetch active opportunities with joined company info
  const rows = await sql`
    SELECT
      o.id,
      o.company_id,
      o.title,
      o.type,
      o.description,
      o.role,
      o.tech_stack,
      o.years_experience,
      o.selection_process,
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
      c.website AS company_website
    FROM internship_opportunities o
    LEFT JOIN companies c ON c.id = o.company_id
    WHERE o.status = 'active'
      AND (${!filters.type || filters.type === "all"} OR o.type = ${filters.type}::opportunity_type)
      AND (${!filters.work_mode || filters.work_mode === "all"} OR o.work_mode = ${filters.work_mode}::work_mode)
      AND (
        ${!filters.search} OR
        o.title ILIKE ${"%" + (filters.search || "") + "%"} OR
        c.name ILIKE ${"%" + (filters.search || "") + "%"} OR
        o.role ILIKE ${"%" + (filters.search || "") + "%"}
      )
    ORDER BY o.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  return rows as unknown as Opportunity[];
}
