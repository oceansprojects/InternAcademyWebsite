import { NextRequest, NextResponse } from "next/server";
import {
  updateTechnology,
  deleteTechnology,
} from "@/services/technology.service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ technologyId: string }> }
) {
  try {
    const { technologyId } = await params;
    const body = await request.json();

    const technology = await updateTechnology(
      technologyId,
      body.label,
      body.icon_url ?? "",
      body.sort_order ?? 0
    );

    return NextResponse.json({
      success: true,
      data: technology,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update technology",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ technologyId: string }> }
) {
  try {
    const { technologyId } = await params;

    await deleteTechnology(technologyId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete technology",
      },
      { status: 500 }
    );
  }
}