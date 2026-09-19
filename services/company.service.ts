import { sql } from "@/lib/db";
import type { CompanyProfilePayload, SocialLinkPayload } from "@/types/company";

// ─── Profile ──────────────────────────────────────────────

export async function getCompanyProfile(userId: string) {
  const rows = await sql`
    SELECT
      c.id, c.name, c.logo_url, c.website, c.contact_email, c.contact_number,
      c.description, c.address_city, c.address_state, c.address_nation,
      c.employee_count, c.created_at, c.updated_at
    FROM companies c
    JOIN company_users cu ON cu.company_id = c.id
    WHERE cu.user_id = ${userId}
    LIMIT 1
  `;
  if (!rows[0]) return null;

  const company = rows[0];

  const socialLinks = await sql`
    SELECT id, social_app_name, social_acc_link, sort_order
    FROM company_social_links
    WHERE company_id = ${company.id}
    ORDER BY sort_order, created_at
  `;

  return { ...company, social_links: socialLinks };
}

export async function getCompanyIdByUserId(userId: string): Promise<string | null> {
  const rows = await sql`
    SELECT company_id FROM company_users WHERE user_id = ${userId} LIMIT 1
  `;
  return rows[0]?.company_id ?? null;
}

export async function updateCompanyProfile(companyId: string, data: CompanyProfilePayload) {
  const rows = await sql`
    UPDATE companies SET
      name           = COALESCE(${data.name ?? null}, name),
      logo_url       = COALESCE(${data.logoUrl ?? null}, logo_url),
      website        = ${data.website ?? null},
      contact_email  = ${data.contactEmail ?? null},
      contact_number = ${data.contactNumber ?? null},
      description    = ${data.description ?? null},
      address_city   = ${data.addressCity ?? null},
      address_state  = ${data.addressState ?? null},
      address_nation = ${data.addressNation ?? null},
      employee_count = ${data.employeeCount ?? null}::employee_count,
      updated_at     = NOW()
    WHERE id = ${companyId}
    RETURNING *
  `;
  return rows[0] ?? null;
}

// ─── Social Links ──────────────────────────────────────────

export async function addSocialLink(companyId: string, data: SocialLinkPayload) {
  const rows = await sql`
    INSERT INTO company_social_links (company_id, social_app_name, social_acc_link)
    VALUES (${companyId}, ${data.socialAppName}, ${data.socialAccLink})
    RETURNING *
  `;
  return rows[0];
}

export async function updateSocialLink(
  linkId: string,
  companyId: string,
  data: SocialLinkPayload
) {
  const rows = await sql`
    UPDATE company_social_links
    SET social_app_name = ${data.socialAppName},
        social_acc_link = ${data.socialAccLink}
    WHERE id = ${linkId} AND company_id = ${companyId}
    RETURNING *
  `;
  return rows[0] ?? null;
}

export async function deleteSocialLink(linkId: string, companyId: string) {
  const rows = await sql`
    DELETE FROM company_social_links
    WHERE id = ${linkId} AND company_id = ${companyId}
    RETURNING id
  `;
  return rows[0] ?? null;
}
