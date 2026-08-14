import { sql } from "@/lib/db";

/** All completed enrollments with optional existing cert record */
export async function getCompletedEnrollmentsWithCerts() {
  const rows = await sql`
    SELECT
      e.id                  AS enrollment_id,
      e.completed_at,
      e.enrolled_at,

      u.id                  AS user_id,
      u.name                AS student_name,
      u.email               AS student_email,
      u.avatar_url,

      p.id                  AS program_id,
      p.title               AS program_title,
      p.slug                AS program_slug,
      p.category            AS program_category,
      p.duration_weeks,

      c.id                  AS cert_id,
      c.cert_number,
      c.certificate_url,
      c.issued_at,
      c.is_active           AS cert_is_active

    FROM enrollments e
    INNER JOIN users    u ON u.id = e.user_id
    INNER JOIN programs p ON p.id = e.program_id
    LEFT  JOIN certifications c
           ON  c.user_id    = e.user_id
           AND c.program_id = e.program_id

    WHERE e.status = 'completed'

    ORDER BY e.completed_at DESC NULLS LAST, e.enrolled_at DESC
  `;

  return rows;
}

/** Single completed enrollment + cert detail */
export async function getCompletedEnrollmentWithCert(enrollmentId: string) {
  const rows = await sql`
    SELECT
      e.id                  AS enrollment_id,
      e.completed_at,
      e.enrolled_at,

      u.id                  AS user_id,
      u.name                AS student_name,
      u.email               AS student_email,
      u.avatar_url,

      p.id                  AS program_id,
      p.title               AS program_title,
      p.slug                AS program_slug,
      p.category            AS program_category,
      p.duration_weeks,

      c.id                  AS cert_id,
      c.cert_number,
      c.certificate_url,
      c.issued_at,
      c.verification_code,
      c.is_active           AS cert_is_active

    FROM enrollments e
    INNER JOIN users    u ON u.id = e.user_id
    INNER JOIN programs p ON p.id = e.program_id
    LEFT  JOIN certifications c
           ON  c.user_id    = e.user_id
           AND c.program_id = e.program_id

    WHERE e.id = ${enrollmentId}
      AND e.status = 'completed'

    LIMIT 1
  `;

  return rows[0] ?? null;
}

/**
 * Upsert a certificate record for a user+program.
 * Generates a cert_number if one doesn't exist yet.
 * Returns the final certification row.
 */
export async function upsertCertificate({
  userId,
  programId,
  certificateUrl,
  issuedBy,
}: {
  userId: string;
  programId: string;
  certificateUrl: string;
  issuedBy?: string;
}) {
  // Validate that issuedBy exists in the users table to prevent foreign key violation
  let validIssuedBy: string | null = null;
  if (issuedBy) {
    try {
      const userCheck = await sql`
        SELECT id FROM users WHERE id = ${issuedBy} LIMIT 1
      `;
      if (userCheck.length > 0) {
        validIssuedBy = userCheck[0].id;
      }
    } catch {
      validIssuedBy = null;
    }
  }

  // Check existing
  const existing = await sql`
    SELECT id, cert_number FROM certifications
    WHERE user_id = ${userId} AND program_id = ${programId}
    LIMIT 1
  `;

  if (existing.length > 0) {
    // Update URL (and optionally issued_by)
    const updated = await sql`
      UPDATE certifications
      SET
        certificate_url = ${certificateUrl},
        issued_at       = NOW(),
        issued_by       = COALESCE(${validIssuedBy}, issued_by),
        is_active       = TRUE
      WHERE user_id    = ${userId}
        AND program_id = ${programId}
      RETURNING *
    `;
    return updated[0];
  } else {
    // Generate cert number: IA-<YEAR>-<RANDOM 5-DIGIT>
    const year = new Date().getFullYear();
    const rand = Math.floor(10000 + Math.random() * 90000);
    const certNumber = `IA-${year}-${rand}`;
    const verificationCode = `${certNumber}-VFY`;

    const inserted = await sql`
      INSERT INTO certifications (
        user_id, program_id, cert_number, certificate_url,
        verification_code, issued_by, is_active
      )
      VALUES (
        ${userId}, ${programId}, ${certNumber}, ${certificateUrl},
        ${verificationCode}, ${validIssuedBy}, TRUE
      )
      RETURNING *
    `;
    return inserted[0];
  }
}

/** Remove (deactivate) a certificate */
export async function deactivateCertificate(certId: string) {
  const result = await sql`
    UPDATE certifications
    SET is_active = FALSE
    WHERE id = ${certId}
    RETURNING *
  `;
  return result[0] ?? null;
}
