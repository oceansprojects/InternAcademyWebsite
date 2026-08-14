import { auth } from "@/auth";
import { NextResponse } from "next/server";

import { createEnrollment } from "@/services/enrollment.service";
import { getAdminEnrollments } from "@/services/enrollment.service";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { programId } = await req.json();

  const enrollment = await createEnrollment({
    userId: session.user.id,
    programId,
  });

  return NextResponse.json(enrollment);
}

export async function GET() {
  try {
    const enrollments = await getAdminEnrollments();

    return NextResponse.json({
      success: true,
      data: enrollments,
    });

  } catch (error) {
    console.error("GET ENROLLMENTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch enrollments",
      },
      {
        status: 500,
      }
    );
  }
}