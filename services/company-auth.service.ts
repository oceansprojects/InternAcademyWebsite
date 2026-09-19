import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";

/**
 * Creates a new company user:
 *  1. users row (role = 'company')
 *  2. companies row (name, optional website)
 *  3. company_users join row
 */
export async function createCompanyUser(data: {
  name: string;
  email: string;
  password: string;
  companyName: string;
}) {
  // Check duplicate email
  const existing = await sql`
    SELECT id FROM users WHERE email = ${data.email} LIMIT 1
  `;
  if (existing.length > 0) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  // 1. Create user
  const userRows = await sql`
    INSERT INTO users (name, email, password_hash, oauth_provider, role)
    VALUES (${data.name}, ${data.email}, ${passwordHash}, 'credentials', 'company')
    RETURNING id, name, email, role
  `;
  const user = userRows[0];

  // 2. Create company
  const companyRows = await sql`
    INSERT INTO companies (name)
    VALUES (${data.companyName})
    RETURNING id, name
  `;
  const company = companyRows[0];

  // 3. Link user → company
  await sql`
    INSERT INTO company_users (user_id, company_id)
    VALUES (${user.id}, ${company.id})
  `;

  return { user, company };
}

/**
 * Returns the company row for a given user id.
 * Used on login to populate session / dashboard.
 */
export async function getCompanyByUserId(userId: string) {
  const rows = await sql`
    SELECT c.*
    FROM companies c
    JOIN company_users cu ON cu.company_id = c.id
    WHERE cu.user_id = ${userId}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

/**
 * Ensures that a company record exists for the given user ID (e.g. for Google login).
 */
export async function ensureCompanyForUser(
  userId: string,
  companyName?: string | null,
  contactEmail?: string | null
) {
  const existing = await getCompanyByUserId(userId);
  if (existing) return existing;

  const displayName = companyName?.trim() || "My Company";
  const rows = await sql`
    INSERT INTO companies (name, contact_email)
    VALUES (${displayName}, ${contactEmail ?? null})
    RETURNING *
  `;
  const company = rows[0];

  await sql`
    INSERT INTO company_users (user_id, company_id)
    VALUES (${userId}, ${company.id})
    ON CONFLICT (user_id) DO NOTHING
  `;

  return company;
}

