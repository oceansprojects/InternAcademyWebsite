import { NextRequest, NextResponse } from "next/server";

import { attachFacultyToProgram } from "@/services/programFaculty.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const relation = await attachFacultyToProgram(
      id,
      body.facultyId,
      body.sort_order ?? 0
    );

    return NextResponse.json({
      success: true,
      data: relation,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to attach faculty",
      },
      { status: 500 }
    );
  }
}