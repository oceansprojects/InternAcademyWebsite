import { NextRequest, NextResponse } from "next/server";

import {
  updateAssignment,
  deleteAssignment,
} from "@/services/program-faq.service";

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ assignmentId: string }>;
  }
) {
  try {
    const { assignmentId } = await params;

    const body = await req.json();

    const assignment = await updateAssignment(
      assignmentId,
      body.sort_order
    );

    return NextResponse.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error("Error in PATCH /api/admin/program-faqs/[assignmentId]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update FAQ assignment",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ assignmentId: string }>;
  }
) {
  try {
    const { assignmentId } = await params;

    await deleteAssignment(assignmentId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error in DELETE /api/admin/program-faqs/[assignmentId]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete FAQ assignment",
      },
      { status: 500 }
    );
  }
}