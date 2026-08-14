import { sql } from "@/lib/db";

export async function getFacultyExpertise(facultyId: string) {
  return await sql`
    SELECT *
    FROM faculty_expertise
    WHERE faculty_id=${facultyId}
    ORDER BY sort_order ASC;
  `;
}

export async function createFacultyExpertise(
  facultyId: string,
  tag: string,
  sort_order: number
) {
  const result = await sql`
    INSERT INTO faculty_expertise(
      faculty_id,
      tag,
      sort_order
    )
    VALUES(
      ${facultyId},
      ${tag},
      ${sort_order}
    )
    RETURNING *;
  `;

  return result[0];
}

export async function updateFacultyExpertise(
  id: string,
  tag: string,
  sort_order: number
) {
  const result = await sql`
    UPDATE faculty_expertise
    SET
      tag=${tag},
      sort_order=${sort_order}
    WHERE id=${id}
    RETURNING *;
  `;

  return result[0];
}

export async function deleteFacultyExpertise(id: string) {
  await sql`
    DELETE FROM faculty_expertise
    WHERE id=${id};
  `;
}