import { NextRequest, NextResponse } from "next/server";
import { getPublicOpportunities } from "@/services/opportunity.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || undefined;
    const work_mode = searchParams.get("work_mode") || undefined;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const opportunities = await getPublicOpportunities({
      type,
      work_mode,
      search,
      page,
      limit,
    });

    return NextResponse.json(opportunities);
  } catch (error: any) {
    console.error("Failed to fetch public opportunities:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch opportunities" }, { status: 500 });
  }
}
