import { sql } from "@/lib/db";

export async function getStudentApplications(userId: string) {
  return await sql`
    SELECT
      e.id,
      e.status,
      e.payment_status,
      e.enrolled_at,

      p.title,
      p.slug,
      p.category,
      p.batch_mode,
      p.duration_weeks,
      p.discounted_price

    FROM enrollments e
    INNER JOIN programs p
      ON e.program_id = p.id

    WHERE e.user_id = ${userId}

    ORDER BY e.enrolled_at DESC;
  `;
}

export async function getStudentApplicationById(
  userId: string,
  applicationId: string
) {
  const rows = await sql`
    SELECT
      e.*,
      p.title,
      p.slug,
      p.category,
      p.duration_weeks,
      p.batch_mode,
      p.discounted_price,
      p.cohort_start

    FROM enrollments e
    INNER JOIN programs p
      ON e.program_id = p.id

    WHERE
      e.id = ${applicationId}
      AND e.user_id = ${userId}

    LIMIT 1;
  `;

  return rows[0] ?? null;
}