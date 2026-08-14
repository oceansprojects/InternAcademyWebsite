import { sql } from "@/lib/db";
import type { Faculty } from "@/types/faculty";

export async function getAllFaculty() {
  return await sql`
    SELECT *
    FROM faculty
    ORDER BY name ASC;
  `;
}

export async function getFacultyById(id: string) {
  const result = await sql`
    SELECT *
    FROM faculty
    WHERE id = ${id};
  `;

  return result[0] ?? null;
}

export async function createFaculty(data: Faculty) {
  const result = await sql`
    INSERT INTO faculty (
      name,
      role,
      institution,
      bio,
      avatar_url,
      linkedin_url,
      experience_years
    )
    VALUES (
      ${data.name},
      ${data.role},
      ${data.institution},
      ${data.bio},
      ${data.avatar_url},
      ${data.linkedin_url},
      ${data.experience_years ?? null}
    )
    RETURNING *;
  `;

  return result[0];
}

export async function updateFaculty(
  id: string,
  data: Faculty
) {
  const result = await sql`
    UPDATE faculty
    SET
      name = ${data.name},
      role = ${data.role},
      institution = ${data.institution},
      bio = ${data.bio},
      avatar_url = ${data.avatar_url},
      linkedin_url = ${data.linkedin_url},
      experience_years = ${data.experience_years ?? null},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *;
  `;

  return result[0];
}

export async function deleteFaculty(id: string) {
  await sql`
    DELETE FROM faculty
    WHERE id = ${id};
  `;
}