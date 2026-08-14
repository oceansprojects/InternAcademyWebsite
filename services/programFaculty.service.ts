import { sql } from "@/lib/db";

export async function getFacultyForProgram(programId: string) {
  return await sql`
    SELECT
      pf.id AS program_faculty_id,
      pf.program_id,
      pf.faculty_id,
      pf.sort_order,

      f.id,
      f.user_id,
      f.name,
      f.role,
      f.institution,
      f.bio,
      f.avatar_url,
      f.linkedin_url,
      f.created_at,
      f.updated_at,

      COALESCE(
        ARRAY_AGG(fe.tag ORDER BY fe.sort_order)
        FILTER (WHERE fe.tag IS NOT NULL),
        '{}'
      ) AS expertise

    FROM program_faculty pf

    INNER JOIN faculty f
      ON pf.faculty_id = f.id

    LEFT JOIN faculty_expertise fe
      ON fe.faculty_id = f.id

    WHERE pf.program_id = ${programId}

    GROUP BY
      pf.id,
      pf.program_id,
      pf.faculty_id,
      pf.sort_order,
      f.id,
      f.user_id,
      f.name,
      f.role,
      f.institution,
      f.bio,
      f.avatar_url,
      f.linkedin_url,
      f.created_at,
      f.updated_at

    ORDER BY pf.sort_order ASC, f.name ASC;
  `;
}

export async function attachFacultyToProgram(
  programId: string,
  facultyId: string,
  sortOrder = 0
) {
  const result = await sql`
    INSERT INTO program_faculty (
      program_id,
      faculty_id,
      sort_order
    )
    VALUES (
      ${programId},
      ${facultyId},
      ${sortOrder}
    )
    ON CONFLICT (program_id, faculty_id)
    DO NOTHING
    RETURNING *;
  `;

  return result[0] ?? null;
}

export async function detachFacultyFromProgram(
  programId: string,
  facultyId: string
) {
  await sql`
    DELETE FROM program_faculty
    WHERE
      program_id = ${programId}
      AND faculty_id = ${facultyId};
  `;
}

export async function updateFacultySortOrder(
  programId: string,
  facultyId: string,
  sortOrder: number
) {
  const result = await sql`
    UPDATE program_faculty
    SET sort_order = ${sortOrder}
    WHERE
      program_id = ${programId}
      AND faculty_id = ${facultyId}
    RETURNING *;
  `;

  return result[0] ?? null;
}