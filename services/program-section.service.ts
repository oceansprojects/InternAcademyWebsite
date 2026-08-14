import { sql } from "@/lib/db";

export async function getProgramSections(programId: string) {
  return await sql`
    SELECT *
    FROM program_sections
    WHERE program_id = ${programId}
    ORDER BY sort_order ASC;
  `;
}

export async function getProgramSectionById(id: string) {
  const result = await sql`
    SELECT *
    FROM program_sections
    WHERE id = ${id};
  `;

  return result[0] ?? null;
}

export async function createProgramSection(data: {
  program_id: string;
  type:
    | "overview"
    | "program_summary"
    | "demo_video"
    | "curriculum"
    | "internship_details"
    | "career_opportunities"
    | "certification_info";
  title?: string;
  content?: string;
  sort_order?: number;
}) {
  const result = await sql`
    INSERT INTO program_sections (
      program_id,
      type,
      title,
      content,
      sort_order
    )
    VALUES (
      ${data.program_id},
      ${data.type},
      ${data.title ?? null},
      ${data.content ?? null},
      ${data.sort_order ?? 0}
    )
    RETURNING *;
  `;

  return result[0];
}

export async function updateProgramSection(
  id: string,
  data: {
    title?: string;
    content?: string;
    sort_order?: number;
  }
) {
  const result = await sql`
    UPDATE program_sections
    SET
      title = ${data.title ?? null},
      content = ${data.content ?? null},
      sort_order = ${data.sort_order ?? 0}
    WHERE id = ${id}
    RETURNING *;
  `;

  return result[0] ?? null;
}

export async function deleteProgramSection(id: string) {
  await sql`
    DELETE FROM program_sections
    WHERE id = ${id};
  `;
}