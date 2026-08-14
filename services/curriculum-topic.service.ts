import { sql } from "@/lib/db";

export async function getCurriculumTopics(moduleId: string) {
  return await sql`
    SELECT *
    FROM curriculum_topics
    WHERE module_id=${moduleId}
    ORDER BY sort_order;
  `;
}

export async function createCurriculumTopic(
  moduleId: string,
  topic: string,
  sort_order: number
) {
  const result = await sql`
    INSERT INTO curriculum_topics(
      module_id,
      topic,
      sort_order
    )
    VALUES(
      ${moduleId},
      ${topic},
      ${sort_order}
    )
    RETURNING *;
  `;

  return result[0];
}

export async function updateCurriculumTopic(
  id: string,
  topic: string,
  sort_order: number
) {
  const result = await sql`
    UPDATE curriculum_topics
    SET
      topic=${topic},
      sort_order=${sort_order}
    WHERE id=${id}
    RETURNING *;
  `;

  return result[0];
}

export async function deleteCurriculumTopic(id: string) {
  await sql`
    DELETE FROM curriculum_topics
    WHERE id=${id};
  `;
}