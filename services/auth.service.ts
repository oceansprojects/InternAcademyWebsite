import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT *
    FROM users
    WHERE email = ${email}
    LIMIT 1;
  `;

  return result[0] ?? null;
}

export async function getUserById(id: string) {
  const result = await sql`
    SELECT *
    FROM users
    WHERE id = ${id}
    LIMIT 1;
  `;

  return result[0] ?? null;
}

export async function deleteUser(id: string) {
  try {
    const result = await sql`
      DELETE FROM users
      WHERE id = ${id}
      RETURNING id;
    `;

    return result[0] ?? null;
  } catch (error: any) {
    // Postgres FK violation — user has related records (payments, certifications, audit logs, etc.)
    if (error?.code === "23503") {
      throw new Error(
        "Cannot delete this user because they have related records (payments, certifications, or audit logs)."
      );
    }

    throw error;
  }
}

export async function getOrCreateGoogleUser(data: {
  name: string;
  email: string;
  avatarUrl: string | null;
  oauthId: string;
}) {
  const existing = await getUserByEmail(data.email);

  if (existing) {
    if (!existing.oauth_id) {
      const updated = await sql`
        UPDATE users
        SET oauth_provider = 'google',
            oauth_id = ${data.oauthId},
            avatar_url = COALESCE(avatar_url, ${data.avatarUrl}),
            updated_at = NOW()
        WHERE id = ${existing.id}
        RETURNING *;
      `;

      return updated[0];
    }

    return existing;
  }

  const result = await sql`
    INSERT INTO users (
      name,
      email,
      avatar_url,
      oauth_provider,
      oauth_id,
      role
    )
    VALUES (
      ${data.name},
      ${data.email},
      ${data.avatarUrl},
      'google',
      ${data.oauthId},
      'student'
    )
    RETURNING *;
  `;

  return result[0];
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const existing = await getUserByEmail(data.email);

  if (existing) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const result = await sql`
    INSERT INTO users (
      name,
      email,
      password_hash,
      oauth_provider,
      role
    )
    VALUES (
      ${data.name},
      ${data.email},
      ${hashedPassword},
      'credentials',
      'student'
    )
    RETURNING *;
  `;

  return result[0];
}