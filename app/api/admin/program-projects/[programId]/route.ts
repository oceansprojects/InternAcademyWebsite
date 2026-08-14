import { NextRequest, NextResponse } from "next/server";
import { getProjects, createProject } from "@/services/project.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string }> }
) {
  try {
    const { programId } = await params;
    const projects = await getProjects(programId);
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
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
    const project = await createProject(
      programId,
      body.title,
      body.description ?? "",
      body.level ?? "beginner",
      body.image_url ?? "",
      body.sort_order ?? 0
    );
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to create project" },
      { status: 500 }
    );
  }
}
