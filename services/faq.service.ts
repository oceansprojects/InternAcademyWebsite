import { sql } from "@/lib/db";
import type { GlobalFAQ } from "@/types/global-faq";

export async function getFAQs() {
  return await sql`
    SELECT *
    FROM global_faqs
    ORDER BY created_at DESC;
  `;
}

export async function createFAQ(
  data: GlobalFAQ
) {
  const result = await sql`
    INSERT INTO global_faqs(
      question,
      answer
    )
    VALUES(
      ${data.question},
      ${data.answer}
    )
    RETURNING *;
  `;

  return result[0];
}

export async function updateFAQ(
  id: string,
  data: GlobalFAQ
) {
  const result = await sql`
    UPDATE global_faqs
    SET
      question=${data.question},
      answer=${data.answer}
    WHERE id=${id}
    RETURNING *;
  `;

  return result[0];
}

export async function deleteFAQ(id: string) {
  await sql`
    DELETE FROM global_faqs
    WHERE id=${id};
  `;
}