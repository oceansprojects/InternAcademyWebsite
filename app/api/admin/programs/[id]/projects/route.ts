import { NextRequest, NextResponse } from "next/server";
import {
  getProjects,
  createProject,
} from "@/services/project.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const projects = await getProjects(id);

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const project = await createProject(
      id,
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
        message: "Failed to create project",
      },
      { status: 500 }
    );
  }
}