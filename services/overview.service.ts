import { sql } from "@/lib/db";

export async function getOverview(programId: string) {
  const result = await sql`
    SELECT *
    FROM program_overview
    WHERE program_id = ${programId};
  `;

  return result[0] ?? null;
}

export async function updateOverview(
  programId: string,
  introText: string
) {
  const existing = await sql`
    SELECT id
    FROM program_overview
    WHERE program_id = ${programId};
  `;

  if (existing.length > 0) {
    const result = await sql`
      UPDATE program_overview
      SET intro_text = ${introText}
      WHERE program_id = ${programId}
      RETURNING *;
    `;

    return result[0];
  }

  const result = await sql`
    INSERT INTO program_overview (
      program_id,
      intro_text
    )
    VALUES (
      ${programId},
      ${introText}
    )
    RETURNING *;
  `;

  return result[0];
}