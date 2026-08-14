import { NextRequest, NextResponse } from "next/server";
import {
  updateProject,
  deleteProject,
} from "@/services/project.service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const body = await request.json();

    const project = await updateProject(
      projectId,
      body.title,
      body.description ?? "",
      body.level ?? "intermediate",
      body.image_url ?? "",
      body.sort_order ?? 0
    );

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update project",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    await deleteProject(projectId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete project",
      },
      { status: 500 }
    );
  }
}