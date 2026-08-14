import { NextRequest, NextResponse } from "next/server";
import { getSummaryCards, createSummaryCard } from "@/services/summary-card.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string }> }
) {
  try {
    const { programId } = await params;
    const cards = await getSummaryCards(programId);
    return NextResponse.json({ success: true, data: cards });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch summary cards" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string }> }
) {
  try {
    const { programId } = await params;
    const body = await request.json();
    const card = await createSummaryCard(
      programId,
      body.label,
      body.value,
      body.icon ?? "",
      body.sort_order ?? 0
    );
    return NextResponse.json({ success: true, data: card }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to create summary card" },
      { status: 500 }
    );
  }
}
