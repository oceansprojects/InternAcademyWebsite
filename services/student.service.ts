import { sql } from "@/lib/db";

export async function getStudentProfile(userId: string) {
  const rows = await sql`
    SELECT *
    FROM student_profiles
    WHERE user_id = ${userId}
    LIMIT 1
  `;

  return rows[0] ?? null;
}

export async function createStudentProfile(data: {
  userId: string;
  mobileNumber: string;
  collegeName: string;
  degree: string;
  branch: string;
  currentYear: number;
}) {
  const rows = await sql`
   INSERT INTO student_profiles
(
  user_id,
  mobile_number,
  college_name,
  degree,
  branch,
  current_year,
  profile_completed
)
VALUES
(
  ${data.userId},
  ${data.mobileNumber},
  ${data.collegeName},
  ${data.degree},
  ${data.branch},
  ${data.currentYear},
  true
)
RETURNING *
  `;

  return rows[0];
}

export async function updateStudentProfile(
  userId: string,
  data: {
    mobileNumber: string;
    collegeName: string;
    degree: string;
    branch: string;
    currentYear: number;
  }
) {
  const rows = await sql`
  UPDATE student_profiles
  SET
    mobile_number = ${data.mobileNumber},
    college_name = ${data.collegeName},
    degree = ${data.degree},
    branch = ${data.branch},
    current_year = ${data.currentYear},
    profile_completed = true,
    updated_at = NOW()
  WHERE user_id = ${userId}
  RETURNING *
`;

  return rows[0];
}