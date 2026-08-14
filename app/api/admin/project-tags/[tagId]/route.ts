import { NextRequest, NextResponse } from "next/server";
import {
  updateProjectTag,
  deleteProjectTag,
} from "@/services/project-tag.service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ tagId: string }> }
) {
  try {
    const { tagId } = await params;
    const body = await request.json();

    const updated = await updateProjectTag(
      tagId,
      body.tag,
      body.sort_order ?? 0
    );

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update project tag",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tagId: string }> }
) {
  try {
    const { tagId } = await params;

    await deleteProjectTag(tagId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete project tag",
      },
      { status: 500 }
    );
  }
}