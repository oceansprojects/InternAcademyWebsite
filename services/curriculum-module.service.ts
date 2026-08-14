import { sql } from "@/lib/db";
import type { CurriculumModule } from "@/types/curriculum-module";

export async function getCurriculumModules(programId: string) {
  return await sql`
    SELECT *
    FROM curriculum_modules
    WHERE program_id=${programId}
    ORDER BY sort_order;
  `;
}

export async function getCurriculumModulesWithTopics(programId: string) {
  const modules = await sql`
    SELECT *
    FROM curriculum_modules
    WHERE program_id=${programId}
    ORDER BY sort_order;
  `;

  if (modules.length === 0) return [];

  const moduleIds = modules.map((m) => m.id);
  const topics = await sql`
    SELECT *
    FROM curriculum_topics
    WHERE module_id = ANY(${moduleIds}::uuid[])
    ORDER BY sort_order;
  `;

  return modules.map((mod) => ({
    ...mod,
    topics: topics
      .filter((t) => t.module_id === mod.id)
      .map((t) => t.topic),
  }));
}

export async function createCurriculumModule(
  programId: string,
  data: CurriculumModule
) {
  const result = await sql`
    INSERT INTO curriculum_modules(
      program_id,
      phase_label,
      title,
      objective,
      sort_order
    )
    VALUES(
      ${programId},
      ${data.phase_label},
      ${data.title},
      ${data.objective},
      ${data.sort_order}
    )
    RETURNING *;
  `;

  return result[0];
}

export async function updateCurriculumModule(
  id: string,
  data: CurriculumModule
) {
  const result = await sql`
    UPDATE curriculum_modules
    SET
      phase_label=${data.phase_label},
      title=${data.title},
      objective=${data.objective},
      sort_order=${data.sort_order}
    WHERE id=${id}
    RETURNING *;
  `;

  return result[0];
}

export async function deleteCurriculumModule(id: string) {
  await sql`
    DELETE FROM curriculum_modules
    WHERE id=${id};
  `;
}