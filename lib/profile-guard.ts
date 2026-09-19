import { sql } from "@/lib/db";

export interface ProfileCompletenessResult {
  complete: boolean;
  missing: string[];
  profileId?: string;
  resumeUrl?: string | null;
}

/**
 * Checks if a student's profile has all mandatory fields filled
 * before allowing them to apply for jobs/internships.
 */
export async function checkProfileComplete(userId: string): Promise<ProfileCompletenessResult> {
  const rows = await sql`
    SELECT
      id,
      full_name,
      email,
      phone_number,
      mobile_number,
      address_city,
      years_experience,
      tech_stack,
      resume_url
    FROM student_profiles
    WHERE user_id = ${userId}
    LIMIT 1
  `;

  if (!rows[0]) {
    return {
      complete: false,
      missing: [
        "Full Name",
        "Email",
        "Phone Number",
        "City",
        "Years of Experience",
        "Tech Stack",
        "Resume",
      ],
    };
  }

  const p = rows[0];
  const missing: string[] = [];

  if (!p.full_name?.trim()) missing.push("Full Name");
  if (!p.email?.trim()) missing.push("Email");
  if (!p.phone_number?.trim() && !p.mobile_number?.trim()) missing.push("Phone Number");
  if (!p.address_city?.trim()) missing.push("City");
  if (!p.years_experience) missing.push("Years of Experience");
  if (!p.tech_stack || !Array.isArray(p.tech_stack) || p.tech_stack.length === 0) {
    missing.push("Tech Stack (at least 1 skill)");
  }
  if (!p.resume_url?.trim()) missing.push("Resume");

  return {
    complete: missing.length === 0,
    missing,
    profileId: p.id,
    resumeUrl: p.resume_url ?? null,
  };
}
