import { sql } from "@/lib/db";

export async function getEnrollmentByUserAndProgram(
  userId: string,
  programId: string
) {
  const rows = await sql`
    SELECT *
    FROM enrollments
    WHERE user_id = ${userId}
      AND program_id = ${programId}
    LIMIT 1
  `;

  return rows[0] ?? null;
}

export async function createEnrollment({
  userId,
  programId,
}: {
  userId: string;
  programId: string;
}) {
  // Check if the user is already enrolled
  const existing = await getEnrollmentByUserAndProgram(
    userId,
    programId
  );

  if (existing) {
    return existing;
  }

  // Create a new enrollment
  const rows = await sql`
    INSERT INTO enrollments (
      user_id,
      program_id,
      status
    )
    VALUES (
      ${userId},
      ${programId},
      'pending'
    )
    RETURNING *
  `;

  return rows[0];
}

export async function getAdminEnrollments() {
  const result = await sql`
    SELECT
      e.id,
      e.status,
      e.payment_status,
      e.amount_paid,
      e.enrolled_at,
      e.completed_at,

      -- User details
      u.id AS student_id,
      u.name AS student_name,
      u.email AS student_email,

      -- Student profile
      sp.mobile_number,
      sp.college_name,
      sp.degree,
      sp.branch,
      sp.current_year,

      -- Program details
      p.id AS program_id,
      p.title AS program_title,
      p.category AS program_category,
      p.duration_weeks,
      p.batch_mode,
      p.location,
      p.base_price,
      p.discounted_price

    FROM enrollments e

    INNER JOIN users u
      ON u.id = e.user_id

    LEFT JOIN student_profiles sp
      ON sp.user_id = u.id

    INNER JOIN programs p
      ON p.id = e.program_id

    ORDER BY e.enrolled_at DESC;
  `;


  return result;
}

export async function getEnrollmentById(id:string) {

  const result = await sql`

    SELECT

      e.*,


      u.name AS student_name,
      u.email AS student_email,


      sp.mobile_number,
      sp.college_name,
      sp.degree,
      sp.branch,
      sp.current_year,


      p.title AS program_title,
      p.category AS program_category,
      p.duration_weeks,
      p.batch_mode,
      p.location,
      p.base_price,
      p.discounted_price


    FROM enrollments e


    INNER JOIN users u
      ON u.id = e.user_id


    LEFT JOIN student_profiles sp
      ON sp.user_id = u.id


    INNER JOIN programs p
      ON p.id = e.program_id


    WHERE e.id = ${id}

    LIMIT 1;

  `;


  return result[0] ?? null;
}

export async function updateEnrollmentStatus(
  id: string,
  status: "pending" | "active" | "completed" | "dropped"
) {
  const result = await sql`
    UPDATE enrollments
    SET status = ${status}
    WHERE id = ${id}
    RETURNING *;
  `;

  return result[0];
}

export async function updateEnrollmentPaymentStatus(
  id: string,
  payment_status: "pending" | "paid" | "failed" | "refunded",
  amount_paid?: number
) {
  let result;
  if (amount_paid !== undefined && amount_paid !== null) {
    result = await sql`
      UPDATE enrollments
      SET payment_status = ${payment_status},
          amount_paid = ${amount_paid}
      WHERE id = ${id}
      RETURNING *;
    `;
  } else {
    result = await sql`
      UPDATE enrollments
      SET payment_status = ${payment_status}
      WHERE id = ${id}
      RETURNING *;
    `;
  }

  return result[0];
}

export async function updateEnrollmentDetails(
  id: string,
  data: {
    status?: "pending" | "active" | "completed" | "dropped";
    payment_status?: "pending" | "paid" | "failed" | "refunded";
    amount_paid?: number;
  }
) {
  const { status, payment_status, amount_paid } = data;

  if (status && payment_status && amount_paid !== undefined) {
    const res = await sql`
      UPDATE enrollments
      SET status = ${status},
          payment_status = ${payment_status},
          amount_paid = ${amount_paid}
      WHERE id = ${id}
      RETURNING *;
    `;
    return res[0];
  }

  if (status && payment_status) {
    const res = await sql`
      UPDATE enrollments
      SET status = ${status},
          payment_status = ${payment_status}
      WHERE id = ${id}
      RETURNING *;
    `;
    return res[0];
  }

  if (payment_status && amount_paid !== undefined) {
    const res = await sql`
      UPDATE enrollments
      SET payment_status = ${payment_status},
          amount_paid = ${amount_paid}
      WHERE id = ${id}
      RETURNING *;
    `;
    return res[0];
  }

  if (payment_status) {
    const res = await sql`
      UPDATE enrollments
      SET payment_status = ${payment_status}
      WHERE id = ${id}
      RETURNING *;
    `;
    return res[0];
  }

  if (status) {
    const res = await sql`
      UPDATE enrollments
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *;
    `;
    return res[0];
  }

  return null;
}