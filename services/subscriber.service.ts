import { sql } from "@/lib/db";
import { z } from "zod";

export interface BlogSubscriber {
  id: string;
  email: string;
  status: "active" | "disabled";
  created_at: string;
  updated_at: string;
}

export const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address.")
  .transform((val) => val.toLowerCase());

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Public subscription endpoint logic.
 * Safely handles duplicates, re-activates disabled subscribers, and inserts new ones.
 */
export async function subscribeEmail(rawEmail: string): Promise<{
  success: boolean;
  message: string;
  code: "SUBSCRIBED" | "ALREADY_SUBSCRIBED" | "INVALID_EMAIL" | "SERVER_ERROR";
}> {
  const parsed = emailSchema.safeParse(rawEmail);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid email address",
      code: "INVALID_EMAIL",
    };
  }

  const email = parsed.data;

  try {
    // Check existing
    const existing = await sql`
      SELECT id, email, status FROM blog_subscribers WHERE LOWER(email) = ${email} LIMIT 1
    `;

    if (existing.length > 0) {
      const subscriber = existing[0];
      if (subscriber.status === "active") {
        return {
          success: true,
          message: "You are already subscribed to our blog updates!",
          code: "ALREADY_SUBSCRIBED",
        };
      } else {
        // Re-activate
        await sql`
          UPDATE blog_subscribers 
          SET status = 'active', updated_at = NOW() 
          WHERE id = ${subscriber.id}
        `;
        return {
          success: true,
          message: "Welcome back! Your subscription has been re-activated.",
          code: "SUBSCRIBED",
        };
      }
    }

    // Insert new
    await sql`
      INSERT INTO blog_subscribers (email, status)
      VALUES (${email}, 'active')
    `;

    return {
      success: true,
      message: "Thank you for subscribing! You'll receive our latest blog posts.",
      code: "SUBSCRIBED",
    };
  } catch (error) {
    console.error("[Subscribe Error]:", error);
    return {
      success: false,
      message: "An error occurred while processing your subscription. Please try again.",
      code: "SERVER_ERROR",
    };
  }
}

/**
 * Admin: Get paginated subscribers list with search and filter
 */
export async function getAdminSubscribers({
  search = "",
  status = "all",
  page = 1,
  limit = 10,
}: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{
  subscribers: BlogSubscriber[];
  total: number;
  activeCount: number;
  disabledCount: number;
  page: number;
  totalPages: number;
}> {
  const offset = (page - 1) * limit;
  const searchPattern = search ? `%${search.trim().toLowerCase()}%` : null;

  // Counts
  const countsRes = await sql`
    SELECT 
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'active') AS active_count,
      COUNT(*) FILTER (WHERE status = 'disabled') AS disabled_count
    FROM blog_subscribers
  `;

  const total = Number(countsRes[0]?.total || 0);
  const activeCount = Number(countsRes[0]?.active_count || 0);
  const disabledCount = Number(countsRes[0]?.disabled_count || 0);

  // Paginated list
  let subscribers: BlogSubscriber[] = [];

  if (searchPattern && status !== "all") {
    const res = await sql`
      SELECT id, email, status, created_at, updated_at
      FROM blog_subscribers
      WHERE LOWER(email) LIKE ${searchPattern} AND status = ${status}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    subscribers = res as BlogSubscriber[];
  } else if (searchPattern) {
    const res = await sql`
      SELECT id, email, status, created_at, updated_at
      FROM blog_subscribers
      WHERE LOWER(email) LIKE ${searchPattern}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    subscribers = res as BlogSubscriber[];
  } else if (status !== "all") {
    const res = await sql`
      SELECT id, email, status, created_at, updated_at
      FROM blog_subscribers
      WHERE status = ${status}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    subscribers = res as BlogSubscriber[];
  } else {
    const res = await sql`
      SELECT id, email, status, created_at, updated_at
      FROM blog_subscribers
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    subscribers = res as BlogSubscriber[];
  }

  // Count filtered total for pagination
  let filteredTotal = total;
  if (searchPattern || status !== "all") {
    if (searchPattern && status !== "all") {
      const c = await sql`
        SELECT COUNT(*) as count FROM blog_subscribers WHERE LOWER(email) LIKE ${searchPattern} AND status = ${status}
      `;
      filteredTotal = Number(c[0]?.count || 0);
    } else if (searchPattern) {
      const c = await sql`
        SELECT COUNT(*) as count FROM blog_subscribers WHERE LOWER(email) LIKE ${searchPattern}
      `;
      filteredTotal = Number(c[0]?.count || 0);
    } else {
      const c = await sql`
        SELECT COUNT(*) as count FROM blog_subscribers WHERE status = ${status}
      `;
      filteredTotal = Number(c[0]?.count || 0);
    }
  }

  return {
    subscribers,
    total: filteredTotal,
    activeCount,
    disabledCount,
    page,
    totalPages: Math.ceil(filteredTotal / limit) || 1,
  };
}

/**
 * Admin: Add subscriber manually
 */
export async function createAdminSubscriber({
  email: rawEmail,
  status = "active",
}: {
  email: string;
  status?: "active" | "disabled";
}): Promise<{ subscriber?: BlogSubscriber; error?: string }> {
  const parsed = emailSchema.safeParse(rawEmail);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid email" };
  }

  const email = parsed.data;

  try {
    const existing = await sql`
      SELECT id FROM blog_subscribers WHERE LOWER(email) = ${email} LIMIT 1
    `;
    if (existing.length > 0) {
      return { error: "A subscriber with this email already exists." };
    }

    const res = await sql`
      INSERT INTO blog_subscribers (email, status)
      VALUES (${email}, ${status})
      RETURNING id, email, status, created_at, updated_at
    `;

    return { subscriber: res[0] as BlogSubscriber };
  } catch (error) {
    console.error("[Admin Create Subscriber Error]:", error);
    return { error: "Failed to add subscriber to database." };
  }
}

/**
 * Admin: Update subscriber (status or email)
 */
export async function updateAdminSubscriber(
  id: string,
  data: { status?: "active" | "disabled"; email?: string }
): Promise<{ subscriber?: BlogSubscriber; error?: string }> {
  try {
    let emailToUpdate: string | undefined;
    if (data.email) {
      const parsed = emailSchema.safeParse(data.email);
      if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message || "Invalid email" };
      }
      emailToUpdate = parsed.data;

      // Check duplicate
      const dup = await sql`
        SELECT id FROM blog_subscribers WHERE LOWER(email) = ${emailToUpdate} AND id != ${id} LIMIT 1
      `;
      if (dup.length > 0) {
        return { error: "Another subscriber with this email already exists." };
      }
    }

    let res: any[];
    if (emailToUpdate && data.status) {
      res = await sql`
        UPDATE blog_subscribers
        SET email = ${emailToUpdate}, status = ${data.status}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, email, status, created_at, updated_at
      `;
    } else if (emailToUpdate) {
      res = await sql`
        UPDATE blog_subscribers
        SET email = ${emailToUpdate}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, email, status, created_at, updated_at
      `;
    } else if (data.status) {
      res = await sql`
        UPDATE blog_subscribers
        SET status = ${data.status}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, email, status, created_at, updated_at
      `;
    } else {
      return { error: "No fields provided to update." };
    }

    if (!res || res.length === 0) {
      return { error: "Subscriber not found." };
    }

    return { subscriber: res[0] as BlogSubscriber };
  } catch (error) {
    console.error("[Admin Update Subscriber Error]:", error);
    return { error: "Failed to update subscriber." };
  }
}

/**
 * Admin: Delete subscriber
 */
export async function deleteAdminSubscriber(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await sql`
      DELETE FROM blog_subscribers WHERE id = ${id} RETURNING id
    `;
    if (res.length === 0) {
      return { success: false, error: "Subscriber not found." };
    }
    return { success: true };
  } catch (error) {
    console.error("[Admin Delete Subscriber Error]:", error);
    return { success: false, error: "Failed to delete subscriber." };
  }
}
