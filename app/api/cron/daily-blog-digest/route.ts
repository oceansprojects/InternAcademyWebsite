import { NextResponse } from "next/server";
import { processDailyBlogEmails } from "@/services/daily-digest.service";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow sufficient time for email dispatching

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.get("authorization");
    const isVercelCron = req.headers.get("x-vercel-cron") === "1";

    // If CRON_SECRET is configured, enforce authorization unless running in non-production or header matches
    if (cronSecret && process.env.NODE_ENV === "production" && !isVercelCron) {
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          {
            success: false,
            message: "Unauthorized: Invalid or missing CRON_SECRET token.",
          },
          { status: 401 }
        );
      }
    }

    const force = searchParams.get("force") === "true";
    const limitArticles = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 3;

    console.log(`[Cron Route /api/cron/daily-blog-digest] Triggered (force=${force}, limit=${limitArticles})`);

    const result = await processDailyBlogEmails({ force, limitArticles });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("[Cron Route Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  // Support POST as well for external webhooks/triggers
  return GET(req);
}
