import { sql } from "@/lib/db";

export async function getSummaryCards(programId: string) {
  const result = await sql`
    SELECT *
    FROM program_summary_cards
    WHERE program_id = ${programId}
    ORDER BY sort_order ASC;
  `;

  return result;
}

export async function createSummaryCard(
  programId: string,
  label: string,
  value: string,
  icon: string,
  sortOrder: number
) {
  const result = await sql`
    INSERT INTO program_summary_cards (
      program_id,
      label,
      value,
      icon,
      sort_order
    )
    VALUES (
      ${programId},
      ${label},
      ${value},
      ${icon},
      ${sortOrder}
    )
    RETURNING *;
  `;

  return result[0];
}

export async function updateSummaryCard(
  id: string,
  label: string,
  value: string,
  icon: string,
  sortOrder: number
) {
  const result = await sql`
    UPDATE program_summary_cards
    SET
      label = ${label},
      value = ${value},
      icon = ${icon},
      sort_order = ${sortOrder}
    WHERE id = ${id}
    RETURNING *;
  `;

  return result[0];
}

export async function deleteSummaryCard(id: string) {
  await sql`
    DELETE
    FROM program_summary_cards
    WHERE id = ${id};
  `;
}