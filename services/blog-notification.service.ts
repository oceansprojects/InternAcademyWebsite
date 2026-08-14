import { sql } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export interface BlogPostNotificationData {
  id: string;
  title: string;
  excerpt?: string | null;
  slug: string;
  cover_image_url?: string | null;
  published_at?: string | Date | null;
}

/**
 * Generates responsive HTML email template for new blog notifications
 */
export function generateBlogEmailHtml(post: BlogPostNotificationData, blogUrl: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://internacademy.co.in";
  const title = post.title;
  const excerpt = post.excerpt || "We've published a brand new article on InternAcademy. Read the full post on our website!";
  const imageUrl = post.cover_image_url || `${appUrl}/og-image.png`;
  const publishDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 16px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .header {
      background-color: #0f172a;
      padding: 32px 32px 24px 32px;
      text-align: center;
    }
    .brand {
      color: #ffffff;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      text-decoration: none;
      font-family: Montserrat, sans-serif;
    }
    .badge {
      display: inline-block;
      margin-top: 8px;
      background-color: rgba(0, 210, 253, 0.15);
      color: #00d2fd;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .body-content {
      padding: 36px 32px;
    }
    .post-date {
      color: #64748b;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .post-title {
      font-size: 24px;
      font-weight: 800;
      line-height: 1.3;
      color: #0f172a;
      margin: 0 0 16px 0;
    }
    .image-container {
      margin: 20px 0 24px 0;
      border-radius: 12px;
      overflow: hidden;
      background-color: #f1f5f9;
    }
    .post-image {
      width: 100%;
      height: auto;
      max-height: 320px;
      object-fit: cover;
      display: block;
    }
    .post-excerpt {
      font-size: 16px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 28px;
    }
    .cta-button {
      display: inline-block;
      background-color: #004aad;
      color: #ffffff !important;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 50px;
      text-align: center;
      box-shadow: 0 4px 14px rgba(0, 74, 173, 0.3);
    }
    .cta-container {
      text-align: center;
      margin-bottom: 12px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #94a3b8;
    }
    .footer a {
      color: #64748b;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a href="${appUrl}" class="brand">InternAcademy</a>
        <div><span class="badge">New Blog Post</span></div>
      </div>
      
      <div class="body-content">
        <div class="post-date">${publishDate}</div>
        <h1 class="post-title">${title}</h1>
        
        ${
          imageUrl
            ? `<div class="image-container">
                <img src="${imageUrl}" alt="${title}" class="post-image" />
               </div>`
            : ""
        }
        
        <p class="post-excerpt">${excerpt}</p>
        
        <div class="cta-container">
          <a href="${blogUrl}" class="cta-button" target="_blank">Read Blog Article &rarr;</a>
        </div>
      </div>
      
      <div class="footer">
        <p>You received this email because you are subscribed to InternAcademy blog notifications.</p>
        <p>&copy; ${new Date().getFullYear()} InternAcademy. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generates plain-text fallback version
 */
export function generateBlogEmailText(post: BlogPostNotificationData, blogUrl: string): string {
  const excerpt = post.excerpt || "We've published a brand new article on InternAcademy.";
  return `
INTERNACADEMY - NEW BLOG POST

${post.title}

${excerpt}

Read full article here: ${blogUrl}

---
You received this email because you subscribed to InternAcademy blog notifications.
  `.trim();
}

/**
 * Core notification trigger:
 * Idempotently sends email notification for a published blog post to all active subscribers.
 * Runs safely in background, handling individual provider failures and logging delivery.
 */
export async function notifySubscribersOnPublish(post: BlogPostNotificationData): Promise<{
  triggered: boolean;
  sentCount: number;
  failedCount: number;
  reason?: string;
}> {
  try {
    // 1. Idempotency Check: Verify if notification was already sent
    const postCheck = await sql`
      SELECT id, status, notification_sent_at 
      FROM blog_posts 
      WHERE id = ${post.id} 
      LIMIT 1
    `;

    if (postCheck.length === 0) {
      return { triggered: false, sentCount: 0, failedCount: 0, reason: "Post not found in database" };
    }

    const currentPost = postCheck[0];

    if (currentPost.notification_sent_at) {
      console.log(`[Blog Notification] Skipped. Notification already sent for post ${post.id}`);
      return {
        triggered: false,
        sentCount: 0,
        failedCount: 0,
        reason: "Notification already dispatched for this post",
      };
    }

    // Mark notification_sent_at immediately to prevent concurrent race conditions
    await sql`
      UPDATE blog_posts 
      SET notification_sent_at = NOW() 
      WHERE id = ${post.id}
    `;

    // 2. Fetch active subscribers
    const activeSubscribers = await sql`
      SELECT email FROM blog_subscribers WHERE status = 'active'
    `;

    if (activeSubscribers.length === 0) {
      console.log("[Blog Notification] No active subscribers to notify.");
      return { triggered: true, sentCount: 0, failedCount: 0, reason: "No active subscribers" };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://internacademy.co.in";
    const blogUrl = `${appUrl}/blog?slug=${encodeURIComponent(post.slug)}`;
    const subject = `New Article: ${post.title}`;
    const htmlContent = generateBlogEmailHtml(post, blogUrl);
    const textContent = generateBlogEmailText(post, blogUrl);

    let sentCount = 0;
    let failedCount = 0;

    // 3. Dispatch emails & log results
    for (const sub of activeSubscribers) {
      const email = sub.email;
      try {
        const res = await sendEmail({
          to: email,
          subject,
          html: htmlContent,
          text: textContent,
        });

        const status = res.success ? "sent" : "failed";
        const errMessage = res.error || null;

        if (res.success) {
          sentCount++;
        } else {
          failedCount++;
        }

        // Record delivery result in blog_email_logs
        await sql`
          INSERT INTO blog_email_logs (post_id, recipient_email, status, error_message)
          VALUES (${post.id}, ${email}, ${status}, ${errMessage})
        `;
      } catch (err: any) {
        failedCount++;
        console.error(`[Blog Notification] Delivery error for ${email}:`, err);
        await sql`
          INSERT INTO blog_email_logs (post_id, recipient_email, status, error_message)
          VALUES (${post.id}, ${email}, 'failed', ${err?.message || String(err)})
        `;
      }
    }

    console.log(
      `[Blog Notification Complete] Post: "${post.title}" | Sent: ${sentCount} | Failed: ${failedCount}`
    );

    return {
      triggered: true,
      sentCount,
      failedCount,
    };
  } catch (error: any) {
    console.error("[Blog Notification Error]:", error);
    return {
      triggered: false,
      sentCount: 0,
      failedCount: 0,
      reason: error?.message || "Internal server error during notification dispatch",
    };
  }
}
