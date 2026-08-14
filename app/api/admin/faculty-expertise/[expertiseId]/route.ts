import { NextRequest, NextResponse } from "next/server";

import {
  updateFacultyExpertise,
  deleteFacultyExpertise,
} from "@/services/faculty-expertise.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ expertiseId: string }> }
) {
  try {
    const { expertiseId } = await params;

    const body = await req.json();

    const expertise =
      await updateFacultyExpertise(
        expertiseId,
        body.tag,
        body.sort_order
      );

    return NextResponse.json({
      success: true,
      data: expertise,
    });
  } catch (error) {
    console.error("Error in PATCH /api/admin/faculty-expertise/[expertiseId]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update faculty expertise",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ expertiseId: string }> }
) {
  try {
    const { expertiseId } = await params;

    await deleteFacultyExpertise(expertiseId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error in DELETE /api/admin/faculty-expertise/[expertiseId]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete faculty expertise",
      },
      { status: 500 }
    );
  }
}