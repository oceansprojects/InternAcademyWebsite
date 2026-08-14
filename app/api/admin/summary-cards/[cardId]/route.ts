import { NextRequest, NextResponse } from "next/server";
import {
  updateSummaryCard,
  deleteSummaryCard,
} from "@/services/summary-card.service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const { cardId } = await params;

    const body = await request.json();

    const card = await updateSummaryCard(
      cardId,
      body.label,
      body.value,
      body.icon ?? "",
      body.sort_order ?? 0
    );

    return NextResponse.json({
      success: true,
      data: card,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update summary card",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const { cardId } = await params;

    await deleteSummaryCard(cardId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete summary card",
      },
      { status: 500 }
    );
  }
}