import { sql } from "@/lib/db";

export async function getProgramFAQs(
  programId: string
) {
  return await sql`
    SELECT
      pfa.id,
      pfa.sort_order,
      gf.id AS faq_id,
      gf.question,
      gf.answer

    FROM program_faq_assignments pfa

    JOIN global_faqs gf
      ON gf.id=pfa.faq_id

    WHERE pfa.program_id=${programId}

    ORDER BY pfa.sort_order;
  `;
}

export async function assignFAQ(
  programId: string,
  faqId: string,
  sort_order: number
) {
  const result = await sql`
    INSERT INTO program_faq_assignments(
      program_id,
      faq_id,
      sort_order
    )
    VALUES(
      ${programId},
      ${faqId},
      ${sort_order}
    )
    RETURNING *;
  `;

  return result[0];
}

export async function updateAssignment(
  id: string,
  sort_order: number
) {
  const result = await sql`
    UPDATE program_faq_assignments
    SET
      sort_order=${sort_order}
    WHERE id=${id}
    RETURNING *;
  `;

  return result[0];
}

export async function deleteAssignment(id: string) {
  await sql`
    DELETE
    FROM program_faq_assignments
    WHERE id=${id};
  `;
}