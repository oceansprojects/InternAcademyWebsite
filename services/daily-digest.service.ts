import { sql } from "@/lib/db";
import { getBlogArticles, BlogArticle } from "@/lib/blog-feed";
import { sendEmail } from "@/lib/email";

export interface DailyDigestSubscriber {
  id: string;
  email: string;
  last_digest_sent_at?: string | Date | null;
}

export interface DailyDigestResult {
  success: boolean;
  checkedAt: string;
  totalEligible: number;
  sentCount: number;
  failedCount: number;
  skipped: boolean;
  message: string;
  details?: Array<{
    email: string;
    status: "sent" | "failed" | "skipped";
    error?: string;
  }>;
}

/**
 * Ensures the required tables and columns exist in Neon PostgreSQL (auto-migrating if needed).
 */
export async function ensureDailyDigestSchema() {
  try {
    await sql`
      ALTER TABLE blog_subscribers
      ADD COLUMN IF NOT EXISTS last_digest_sent_at TIMESTAMPTZ DEFAULT NULL
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_blog_subscribers_last_digest_sent 
      ON blog_subscribers (last_digest_sent_at)
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS daily_email_logs (
        id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        subscriber_id   UUID        REFERENCES blog_subscribers(id) ON DELETE CASCADE,
        recipient_email TEXT        NOT NULL,
        dispatch_date   DATE        NOT NULL DEFAULT CURRENT_DATE,
        sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        articles_count  INT         DEFAULT 0,
        status          VARCHAR(20) NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed')),
        error_message   TEXT,
        UNIQUE(subscriber_id, dispatch_date)
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_daily_email_logs_date 
      ON daily_email_logs (dispatch_date)
    `;
  } catch (err) {
    console.error("[Daily Digest Schema] Setup warning:", err);
  }
}

/**
 * Generates responsive HTML email template for daily blog digest
 */
export function generateDailyDigestHtml(articles: BlogArticle[], appUrl: string): string {
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const articleCards = articles
    .map((art, idx) => {
      const sourceName = art.source?.name || "InternAcademy";
      const imageUrl = art.urlToImage || `${appUrl}/og-image.png`;
      const description = art.description
        ? art.description.replace(/<[^>]*>?/gm, "").slice(0, 180) + "..."
        : "Read the latest update and industry insights on our blog.";

      return `
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
        ${
          imageUrl
            ? `<div style="width: 100%; height: 180px; background-color: #f1f5f9; overflow: hidden;">
                <img src="${imageUrl}" alt="${art.title}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
              </div>`
            : ""
        }
        <div style="padding: 20px;">
          <div style="font-size: 11px; font-weight: 700; color: #004aad; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
            ${sourceName} ${art.category ? `&bull; ${art.category}` : ""}
          </div>
          <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0; line-height: 1.4;">
            <a href="${art.url}" target="_blank" style="color: #0f172a; text-decoration: none;">${art.title}</a>
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 16px 0;">
            ${description}
          </p>
          <a href="${art.url}" target="_blank" style="display: inline-block; font-size: 13px; font-weight: 700; color: #004aad; text-decoration: none;">
            Read Full Article &rarr;
          </a>
        </div>
      </div>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Daily Tech & Internship Digest</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 0; }
  </style>
</head>
<body style="background-color: #f8fafc; margin: 0; padding: 0;">
  <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 32px 16px;">
    
    <!-- Brand Header -->
    <div style="background-color: #0f172a; padding: 28px 24px; border-radius: 16px 16px 0 0; text-align: center;">
      <a href="${appUrl}" style="color: #ffffff; font-size: 22px; font-weight: 800; text-decoration: none; font-family: Montserrat, sans-serif; letter-spacing: -0.5px;">
        InternAcademy
      </a>
      <div style="margin-top: 6px;">
        <span style="display: inline-block; background-color: rgba(0, 210, 253, 0.15); color: #00d2fd; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
          Daily Tech Digest
        </span>
      </div>
    </div>

    <!-- Main Body -->
    <div style="background-color: #ffffff; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; padding: 28px 24px;">
      <div style="font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 6px;">
        ${dateStr}
      </div>
      <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; line-height: 1.3;">
        Today's Top Curated Articles & Insights
      </h1>
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
        Stay ahead with today's curated selection of trending technology news, tutorials, and career advice.
      </p>

      ${articleCards}

      <!-- Explore More Button -->
      <div style="text-align: center; margin-top: 24px; margin-bottom: 12px;">
        <a href="${appUrl}/blog" target="_blank" style="display: inline-block; background-color: #004aad; color: #ffffff !important; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 50px; box-shadow: 0 4px 12px rgba(0, 74, 173, 0.25);">
          Explore All Articles on Website &rarr;
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f1f5f9; border-radius: 0 0 16px 16px; border: 1px solid #e2e8f0; border-top: none; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5;">
      <p style="margin: 0 0 6px 0;">You received this daily digest because you are subscribed to InternAcademy updates.</p>
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} InternAcademy. All rights reserved.</p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

/**
 * Generates plain text fallback for daily digest
 */
export function generateDailyDigestText(articles: BlogArticle[], appUrl: string): string {
  const itemsText = articles
    .map(
      (art, idx) =>
        `${idx + 1}. ${art.title}\nSource: ${art.source?.name || "InternAcademy"}\nRead: ${art.url}\n`
    )
    .join("\n");

  return `
INTERNACADEMY - DAILY BLOG DIGEST
${new Date().toDateString()}

Here are today's top curated tech articles:

${itemsText}

Visit all blogs: ${appUrl}/blog
---
You received this because you are an active subscriber to InternAcademy.
  `.trim();
}

/**
 * Core Algorithm:
 * Checks every 2 hours if emails have been sent today to all active subscribers.
 * If not sent for this calendar day:
 * 1. Fetches top latest blogs
 * 2. Dispatches daily digest email
 * 3. Idempotently records sent date in database
 */
export async function processDailyBlogEmails(options?: {
  force?: boolean;
  limitArticles?: number;
}): Promise<DailyDigestResult> {
  const now = new Date();
  const checkedAt = now.toISOString();

  // Ensure database schema is up-to-date
  await ensureDailyDigestSchema();

  try {
    // 1. Fetch eligible subscribers who have NOT received a digest today
    // Uses DATE(last_digest_sent_at) < CURRENT_DATE or NULL to ensure strictly 1 email/day
    let pendingSubscribers: DailyDigestSubscriber[] = [];

    if (options?.force) {
      const res = await sql`
        SELECT id, email, last_digest_sent_at 
        FROM blog_subscribers 
        WHERE status = 'active'
      `;
      pendingSubscribers = res as DailyDigestSubscriber[];
    } else {
      const res = await sql`
        SELECT id, email, last_digest_sent_at 
        FROM blog_subscribers 
        WHERE status = 'active'
          AND (
            last_digest_sent_at IS NULL 
            OR DATE(last_digest_sent_at) < CURRENT_DATE
          )
      `;
      pendingSubscribers = res as DailyDigestSubscriber[];
    }

    if (pendingSubscribers.length === 0) {
      console.log("[Daily Digest Check] All active subscribers have already received today's email.");
      return {
        success: true,
        checkedAt,
        totalEligible: 0,
        sentCount: 0,
        failedCount: 0,
        skipped: true,
        message: "All active subscribers have already received today's email digest.",
      };
    }

    // 2. Fetch fresh blog articles
    const allArticles = await getBlogArticles();
    const articleLimit = options?.limitArticles || 3;
    const topArticles = (allArticles || []).slice(0, articleLimit);

    if (topArticles.length === 0) {
      console.log("[Daily Digest Check] No blog articles found to send.");
      return {
        success: false,
        checkedAt,
        totalEligible: pendingSubscribers.length,
        sentCount: 0,
        failedCount: 0,
        skipped: true,
        message: "No blog articles were found in the feed to generate the digest.",
      };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://internacademy.co.in";
    const emailSubject = `Today's Tech Digest - InternAcademy (${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })})`;
    const htmlContent = generateDailyDigestHtml(topArticles, appUrl);
    const textContent = generateDailyDigestText(topArticles, appUrl);

    let sentCount = 0;
    let failedCount = 0;
    const details: Array<{ email: string; status: "sent" | "failed" | "skipped"; error?: string }> = [];

    // 3. Send email to each pending subscriber and record dispatch
    for (const subscriber of pendingSubscribers) {
      const { id: subscriberId, email } = subscriber;

      try {
        const sendRes = await sendEmail({
          to: email,
          subject: emailSubject,
          html: htmlContent,
          text: textContent,
        });

        if (sendRes.success) {
          // Mark subscriber's last_digest_sent_at to NOW()
          await sql`
            UPDATE blog_subscribers 
            SET last_digest_sent_at = NOW(), updated_at = NOW() 
            WHERE id = ${subscriberId}
          `;

          // Insert or update daily_email_logs
          await sql`
            INSERT INTO daily_email_logs (subscriber_id, recipient_email, dispatch_date, articles_count, status)
            VALUES (${subscriberId}, ${email}, CURRENT_DATE, ${topArticles.length}, 'sent')
            ON CONFLICT (subscriber_id, dispatch_date) DO UPDATE 
            SET sent_at = NOW(), status = 'sent', error_message = NULL
          `;

          sentCount++;
          details.push({ email, status: "sent" });
        } else {
          // Log failed attempt
          await sql`
            INSERT INTO daily_email_logs (subscriber_id, recipient_email, dispatch_date, articles_count, status, error_message)
            VALUES (${subscriberId}, ${email}, CURRENT_DATE, ${topArticles.length}, 'failed', ${sendRes.error || "Send failed"})
            ON CONFLICT (subscriber_id, dispatch_date) DO UPDATE 
            SET error_message = ${sendRes.error || "Send failed"}
          `;

          failedCount++;
          details.push({ email, status: "failed", error: sendRes.error });
        }
      } catch (err: any) {
        failedCount++;
        const errorMessage = err?.message || String(err);
        console.error(`[Daily Digest] Exception sending to ${email}:`, err);

        try {
          await sql`
            INSERT INTO daily_email_logs (subscriber_id, recipient_email, dispatch_date, articles_count, status, error_message)
            VALUES (${subscriberId}, ${email}, CURRENT_DATE, ${topArticles.length}, 'failed', ${errorMessage})
            ON CONFLICT (subscriber_id, dispatch_date) DO UPDATE 
            SET error_message = ${errorMessage}
          `;
        } catch {
          // Ignore logging error
        }

        details.push({ email, status: "failed", error: errorMessage });
      }
    }

    console.log(
      `[Daily Digest Complete] Eligible: ${pendingSubscribers.length} | Sent: ${sentCount} | Failed: ${failedCount}`
    );

    return {
      success: true,
      checkedAt,
      totalEligible: pendingSubscribers.length,
      sentCount,
      failedCount,
      skipped: false,
      message: `Processed daily digest: ${sentCount} sent, ${failedCount} failed out of ${pendingSubscribers.length} eligible.`,
      details,
    };
  } catch (error: any) {
    console.error("[Daily Digest Process Error]:", error);
    return {
      success: false,
      checkedAt,
      totalEligible: 0,
      sentCount: 0,
      failedCount: 0,
      skipped: true,
      message: error?.message || "Internal error during daily digest execution.",
    };
  }
}
