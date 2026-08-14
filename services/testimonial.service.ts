import { sql } from "@/lib/db";
import type { Testimonial } from "@/types/testimonial";

export async function getTestimonials(programId: string) {
  return await sql`
    SELECT *
    FROM testimonials
    WHERE program_id = ${programId}
    ORDER BY created_at DESC;
  `;
}

export async function createTestimonial(
  programId: string,
  data: Testimonial
) {
  const result = await sql`
    INSERT INTO testimonials (
      program_id,
      author_name,
      company,
      batch,
      content,
      rating,
      avatar_url,
      is_published
    )
    VALUES (
      ${programId},
      ${data.author_name},
      ${data.company},
      ${data.batch},
      ${data.content},
      ${data.rating},
      ${data.avatar_url},
      ${data.is_published}
    )
    RETURNING *;
  `;

  return result[0];
}

export async function updateTestimonial(
  id: string,
  data: Testimonial
) {
  const result = await sql`
    UPDATE testimonials
    SET
      author_name=${data.author_name},
      company=${data.company},
      batch=${data.batch},
      content=${data.content},
      rating=${data.rating},
      avatar_url=${data.avatar_url},
      is_published=${data.is_published}
    WHERE id=${id}
    RETURNING *;
  `;

  return result[0];
}

export async function deleteTestimonial(id: string) {
  await sql`
    DELETE FROM testimonials
    WHERE id=${id};
  `;
}