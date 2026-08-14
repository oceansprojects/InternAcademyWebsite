import { sql } from "@/lib/db";

export async function getProjectTags(projectId: string) {
  const result = await sql`
    SELECT *
    FROM program_project_tags
    WHERE project_id = ${projectId}
    ORDER BY sort_order ASC;
  `;

  return result;
}

export async function createProjectTag(
  projectId: string,
  tag: string,
  sort_order: number
) {
  const result = await sql`
    INSERT INTO program_project_tags (
      project_id,
      tag,
      sort_order
    )
    VALUES (
      ${projectId},
      ${tag},
      ${sort_order}
    )
    RETURNING *;
  `;

  return result[0];
}

export async function updateProjectTag(
  id: string,
  tag: string,
  sort_order: number
) {
  const result = await sql`
    UPDATE program_project_tags
    SET
      tag = ${tag},
      sort_order = ${sort_order}
    WHERE id = ${id}
    RETURNING *;
  `;

  return result[0];
}

export async function deleteProjectTag(id: string) {
  await sql`
    DELETE FROM program_project_tags
    WHERE id = ${id};
  `;
}