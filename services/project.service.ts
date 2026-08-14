import { sql } from "@/lib/db";

export async function getProjects(programId: string) {
  const projects = await sql`
    SELECT *
    FROM program_projects
    WHERE program_id = ${programId}
    ORDER BY sort_order ASC;
  `;

  if (projects.length === 0) return [];

  // Fetch all tags for these projects in one query
  const projectIds = projects.map((p) => p.id);
  const tags = await sql`
    SELECT *
    FROM program_project_tags
    WHERE project_id = ANY(${projectIds}::uuid[])
    ORDER BY sort_order ASC;
  `;

  // Attach tags array to each project
  return projects.map((project) => ({
    ...project,
    tags: tags.filter((t) => t.project_id === project.id).map((t) => t.tag),
  }));
}

export async function createProject(
  programId: string,
  title: string,
  description: string,
  level: string,
  image_url: string,
  sort_order: number
) {
  const result = await sql`
    INSERT INTO program_projects (
      program_id,
      title,
      description,
      level,
      image_url,
      sort_order
    )
    VALUES (
      ${programId},
      ${title},
      ${description},
      ${level},
      ${image_url},
      ${sort_order}
    )
    RETURNING *;
  `;

  return result[0];
}

export async function updateProject(
  id: string,
  title: string,
  description: string,
  level: string,
  image_url: string,
  sort_order: number
) {
  const result = await sql`
    UPDATE program_projects
    SET
      title = ${title},
      description = ${description},
      level = ${level},
      image_url = ${image_url},
      sort_order = ${sort_order}
    WHERE id = ${id}
    RETURNING *;
  `;

  return result[0];
}

export async function deleteProject(id: string) {
  await sql`
    DELETE FROM program_projects
    WHERE id = ${id};
  `;
}