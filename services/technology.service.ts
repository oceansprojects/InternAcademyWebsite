import { sql } from "@/lib/db";

export async function getTechnologies(programId: string) {
  const result = await sql`
    SELECT *
    FROM program_technologies
    WHERE program_id = ${programId}
    ORDER BY sort_order ASC;
  `;

  return result;
}

export async function createTechnology(
  programId: string,
  label: string,
  icon_url: string,
  sort_order: number
) {
  const result = await sql`
    INSERT INTO program_technologies (
      program_id,
      label,
      icon_url,
      sort_order
    )
    VALUES (
      ${programId},
      ${label},
      ${icon_url},
      ${sort_order}
    )
    RETURNING *;
  `;

  return result[0];
}

export async function updateTechnology(
  id: string,
  label: string,
  icon_url: string,
  sort_order: number
) {
  const result = await sql`
    UPDATE program_technologies
    SET
      label = ${label},
      icon_url = ${icon_url},
      sort_order = ${sort_order}
    WHERE id = ${id}
    RETURNING *;
  `;

  return result[0];
}

export async function deleteTechnology(id: string) {
  await sql`
    DELETE FROM program_technologies
    WHERE id = ${id};
  `;
}