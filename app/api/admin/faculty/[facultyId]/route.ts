import { NextRequest, NextResponse } from "next/server";

import {
  getFacultyById,
  updateFaculty,
  deleteFaculty,
} from "@/services/faculty.service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ facultyId: string }> }
) {
  try {
    const { facultyId } = await params;
    const faculty = await getFacultyById(facultyId);

    if (!faculty) {
      return NextResponse.json(
        { success: false, message: "Instructor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: faculty });
  } catch (error) {
    console.error("Error in GET /api/admin/faculty/[facultyId]:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch instructor" },
      { status: 500 }
    );
  }
}


export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ facultyId: string }> }
) {
  try {
    const { facultyId } = await params;

    const body = await req.json();

    const faculty = await updateFaculty(
      facultyId,
      body
    );

    return NextResponse.json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    console.error("Error in PATCH /api/admin/faculty/[facultyId]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update faculty",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ facultyId: string }> }
) {
  try {
    const { facultyId } = await params;

    await deleteFaculty(facultyId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error in DELETE /api/admin/faculty/[facultyId]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete faculty",
      },
      { status: 500 }
    );
  }
}