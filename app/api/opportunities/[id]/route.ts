import { NextRequest, NextResponse } from "next/server";
import { getOpportunityById } from "@/services/opportunity.service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const opportunity = await getOpportunityById(id);

    if (!opportunity) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    return NextResponse.json(opportunity);
  } catch (error: any) {
    console.error("Failed to fetch opportunity detail:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch opportunity" }, { status: 500 });
  }
}
