import { NextRequest, NextResponse } from "next/server";
import {
  getProjectTags,
  createProjectTag,
} from "@/services/project-tag.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId : string }> }
) {
  try {
    const { projectId  } = await params;

    const tags = await getProjectTags(projectId );

    return NextResponse.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch project tags",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const body = await request.json();

    const tag = await createProjectTag(
      projectId,
      body.tag,
      body.sort_order ?? 0
    );

    return NextResponse.json({
      success: true,
      data: tag,
    });
  } catch (error) {
    console.error("POST TAG ERROR:", error);

return NextResponse.json(
  {
    success: false,
    message:
      error instanceof Error ? error.message : "Unknown error",
    error,
  },
  { status: 500 }
);
  }
}
