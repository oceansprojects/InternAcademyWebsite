import { sql } from "@/lib/db";

export async function getStudentDashboard(userId: string) {
  // Profile
  const profileRows = await sql`
    SELECT *
    FROM student_profiles
    WHERE user_id = ${userId}
    LIMIT 1
  `;

  const profile = profileRows[0] ?? null;

  // Applications / Enrollments
  const enrollments = await sql`
    SELECT
      e.*,
      p.title,
      p.slug,
      p.category,
      p.duration_weeks,
      p.batch_mode,
      p.discounted_price,
      p.base_price,
      p.cohort_start,
      p.card_image_url
    FROM enrollments e
    INNER JOIN programs p
      ON e.program_id = p.id
    WHERE e.user_id = ${userId}
    ORDER BY e.enrolled_at DESC
  `;

  // Active Programs
  const activePrograms = enrollments.filter(
    (item: any) =>
      item.status === "active" ||
      item.status === "completed" ||
      item.status === "pending"
  );

  // Certificates
  let certificates: any[] = [];
  try {
    certificates = await sql`
      SELECT c.*, p.title as program_title, p.slug as program_slug
      FROM certifications c
      INNER JOIN programs p ON c.program_id = p.id
      WHERE c.user_id = ${userId}
      ORDER BY c.issued_at DESC
    `;
  } catch (err) {
    console.error("Error fetching student certificates:", err);
  }

  return {
    profile,
    enrollments,
    activePrograms,
    certificates,
    stats: {
      applications: enrollments.length,
      activePrograms: activePrograms.length,
      certificates: certificates.length,
      hoursLearned: enrollments.reduce((acc: number, curr: any) => acc + (curr.duration_weeks || 0) * 10, 0),
    },
  };
}

export async function getAdminDashboardStats() {
  try {
    const [
      programsCountRes,
      facultyCountRes,
      studentsCountRes,
      enrollmentsCountRes,
      revenueRes,
      recentEnrollments,
      recentPrograms,
    ] = await Promise.all([
      sql`SELECT COUNT(*)::int as count FROM programs`,
      sql`SELECT COUNT(*)::int as count FROM faculty`,
      sql`SELECT COUNT(*)::int as count FROM users WHERE role = 'student'`,
      sql`SELECT COUNT(*)::int as count FROM enrollments`,
      sql`
        SELECT COALESCE(SUM(p.discounted_price), 0)::int as total
        FROM enrollments e
        INNER JOIN programs p ON e.program_id = p.id
        WHERE e.status IN ('active', 'completed') OR e.payment_status = 'paid'
      `,
      sql`
        SELECT
          e.id,
          e.status,
          e.payment_status,
          e.enrolled_at,
          u.name as user_name,
          u.email as user_email,
          p.title as program_title,
          p.discounted_price
        FROM enrollments e
        INNER JOIN users u ON e.user_id = u.id
        INNER JOIN programs p ON e.program_id = p.id
        ORDER BY e.enrolled_at DESC
        LIMIT 5
      `,
      sql`
        SELECT id, slug, title, category, duration_weeks, discounted_price, batch_mode, is_published
        FROM programs
        ORDER BY created_at DESC
        LIMIT 4
      `,
    ]);

    const totalPrograms = programsCountRes[0]?.count ?? 0;
    const totalInstructors = facultyCountRes[0]?.count ?? 0;
    const totalStudents = studentsCountRes[0]?.count ?? 0;
    const totalEnrollments = enrollmentsCountRes[0]?.count ?? 0;
    const totalRevenue = revenueRes[0]?.total ?? 0;

    return {
      stats: {
        totalPrograms,
        totalInstructors,
        totalStudents,
        totalEnrollments,
        totalRevenue,
      },
      recentEnrollments,
      recentPrograms,
    };
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    return {
      stats: {
        totalPrograms: 0,
        totalInstructors: 0,
        totalStudents: 0,
        totalEnrollments: 0,
        totalRevenue: 0,
      },
      recentEnrollments: [],
      recentPrograms: [],
    };
  }
}

export async function getAdminUsers({
  search = "",
  role = "all",
  page = 1,
  limit = 20,
}: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
} = {}) {
  try {
    const offset = (page - 1) * limit;
    const searchPattern = `%${search}%`;

    let usersQuery: string;
    let usersParams: any[];
    let countQuery: string;
    let countParams: any[];

    if (role === "all") {
      usersQuery = `
        SELECT
          u.id, u.name, u.email, u.role, u.oauth_provider,
          u.is_active, u.created_at, u.avatar_url,
          COUNT(DISTINCT e.id)::int AS enrollment_count
        FROM users u
        LEFT JOIN enrollments e ON e.user_id = u.id
        WHERE (u.name ILIKE $1 OR u.email ILIKE $1)
        GROUP BY u.id
        ORDER BY u.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      usersParams = [searchPattern, limit, offset];

      countQuery = `SELECT COUNT(*)::int AS total FROM users WHERE (name ILIKE $1 OR email ILIKE $1)`;
      countParams = [searchPattern];
    } else {
      usersQuery = `
        SELECT
          u.id, u.name, u.email, u.role, u.oauth_provider,
          u.is_active, u.created_at, u.avatar_url,
          COUNT(DISTINCT e.id)::int AS enrollment_count
        FROM users u
        LEFT JOIN enrollments e ON e.user_id = u.id
        WHERE (u.name ILIKE $1 OR u.email ILIKE $1) AND u.role = $2::user_role
        GROUP BY u.id
        ORDER BY u.created_at DESC
        LIMIT $3 OFFSET $4
      `;
      usersParams = [searchPattern, role, limit, offset];

      countQuery = `SELECT COUNT(*)::int AS total FROM users WHERE (name ILIKE $1 OR email ILIKE $1) AND role = $2::user_role`;
      countParams = [searchPattern, role];
    }

    const [users, countResult] = await Promise.all([
      sql.query(usersQuery, usersParams),
      sql.query(countQuery, countParams),
    ]);

    return {
      users: users.rows ?? users,
      total: (countResult.rows ?? countResult)[0]?.total ?? 0,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return { users: [], total: 0, page: 1, limit };
  }
}