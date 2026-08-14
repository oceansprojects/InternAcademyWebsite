import { sql } from "@/lib/db";

export async function getPrograms() {
  const programs = await sql`
    SELECT *
    FROM programs
    ORDER BY created_at DESC;
  `;

  return programs;
}

export async function createProgram(data: {
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  duration_weeks: number;
  batch_mode: "online" | "offline" | "hybrid";
  schedule?: string;
  location?: string;
  base_price: number;
  discounted_price: number;
  card_image_url?: string;

  syllabus_url?: string;
  demo_video_url?: string;
  demo_video_duration_mins?: number;
  demo_video_description?: string;

  meta_title?: string;
  meta_description?: string;

  is_published?: boolean;
  is_popular?: boolean;

  cohort_start?: string;
}) {
  const result = await sql`
    INSERT INTO programs (
      slug,
      title,
      subtitle,
      category,
      duration_weeks,
      batch_mode,
      schedule,
      location,
      base_price,
      discounted_price,

      syllabus_url,
      demo_video_url,
      demo_video_duration_mins,
      demo_video_description,
      card_image_url,

      meta_title,
      meta_description,

      is_published,
      is_popular,

      cohort_start
    )
    VALUES (
      ${data.slug},
      ${data.title},
      ${data.subtitle ?? null},
      ${data.category ?? null},
      ${data.duration_weeks},
      ${data.batch_mode},
      ${data.schedule ?? null},
      ${data.location ?? null},
      ${data.base_price},
      ${data.discounted_price},

      ${data.syllabus_url ?? null},
      ${data.demo_video_url ?? null},
      ${data.demo_video_duration_mins ?? 0},
      ${data.demo_video_description ?? null},
      ${data.card_image_url ?? null},

      ${data.meta_title ?? null},
      ${data.meta_description ?? null},

      ${data.is_published ?? false},
      ${data.is_popular ?? false},

      ${data.cohort_start || null}
    )
    RETURNING *;
  `;

  return result[0];
}

export async function getProgramById(id: string) {
  const result = await sql`
    SELECT *
    FROM programs
    WHERE id = ${id};
  `;

  return result[0] ?? null;
}

export async function updateProgram(
  id: string,
  data: {
    slug: string;
    title: string;
    subtitle?: string;
    category?: string;
    duration_weeks: number;
    batch_mode: "online" | "offline" | "hybrid";
    schedule?: string;
    location?: string;
    base_price: number;
    discounted_price: number;

    syllabus_url?: string;
    demo_video_url?: string;
    demo_video_duration_mins?: number;
    demo_video_description?: string;
    card_image_url?: string;

    meta_title?: string;
    meta_description?: string;

    is_published?: boolean;
    is_popular?: boolean;

    cohort_start?: string;
  }
) {
  const result = await sql`
    UPDATE programs
    SET
      slug = ${data.slug},
      title = ${data.title},
      subtitle = ${data.subtitle ?? null},
      category = ${data.category ?? null},
      duration_weeks = ${data.duration_weeks},
      batch_mode = ${data.batch_mode},
      schedule = ${data.schedule ?? null},
      location = ${data.location ??null},

      base_price = ${data.base_price},
      discounted_price = ${data.discounted_price},

      syllabus_url = ${data.syllabus_url ?? null},
      demo_video_url = ${data.demo_video_url ?? null},
      demo_video_duration_mins = ${data.demo_video_duration_mins ?? 0},
      demo_video_description = ${data.demo_video_description ?? null},
      card_image_url = ${data.card_image_url ?? null},

      meta_title = ${data.meta_title ?? null},
      meta_description = ${data.meta_description ?? null},

      is_published = ${data.is_published ?? false},
      is_popular = ${data.is_popular ?? false},

      cohort_start = ${data.cohort_start || null},

      updated_at = NOW()

    WHERE id = ${id}

    RETURNING *;
  `;

  return result[0] ?? null;
}

export async function deleteProgram(id: string) {
  await sql`
    DELETE FROM programs
    WHERE id = ${id};
  `;
}

export async function getProgramBySlug(slug: string) {
  const rows = await sql`
    SELECT *
    FROM programs
    WHERE slug = ${slug}
    LIMIT 1
  `;

  return rows[0] ?? null;
}

export async function getFeaturedPrograms() {
  const programs = await sql`
    SELECT *
    FROM programs
    ORDER BY created_at DESC
    LIMIT 4;
  `;

  const result = await Promise.all(
    programs.map(async (program: any) => {
      const technologies = await sql`
        SELECT
          label,
          icon_url
        FROM program_technologies
        WHERE program_id = ${program.id}
        ORDER BY sort_order ASC;
      `;

      return {
        ...program,
        technologies,
      };
    })
  );

  return result;
}