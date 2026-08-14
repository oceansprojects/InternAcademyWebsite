import { NextRequest, NextResponse } from "next/server";

import {
  getFacultyExpertise,
  createFacultyExpertise,
} from "@/services/faculty-expertise.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ facultyId: string }> }
) {
  try {
    const { facultyId } = await params;

    const expertise = await getFacultyExpertise(
      facultyId
    );

    return NextResponse.json({
      success: true,
      data: expertise,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/faculty/[facultyId]/expertise:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch faculty expertise",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ facultyId: string }> }
) {
  try {
    const { facultyId } = await params;

    const body = await req.json();

    const expertise =
      await createFacultyExpertise(
        facultyId,
        body.tag,
        body.sort_order ?? 0
      );

    return NextResponse.json({
      success: true,
      data: expertise,
    });
  } catch (error) {
    console.error("Error in POST /api/admin/faculty/[facultyId]/expertise:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create faculty expertise",
      },
      { status: 500 }
    );
  }
}