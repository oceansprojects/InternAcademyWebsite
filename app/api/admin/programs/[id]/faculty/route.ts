import { NextRequest, NextResponse } from "next/server";

import { createFaculty } from "@/services/faculty.service";

import {
  getFacultyForProgram,
  attachFacultyToProgram,
} from "@/services/programFaculty.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const faculty = await getFacultyForProgram(id);

    return NextResponse.json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/programs/[id]/faculty:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch faculty",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const faculty = await createFaculty(body);

await attachFacultyToProgram(
  id,
  faculty.id,
  body.sort_order ?? 0
);

    return NextResponse.json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    console.error("Error in POST /api/admin/programs/[id]/faculty:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create faculty",
      },
      { status: 500 }
    );
  }
}