import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

import {
  getStudentProfile,
  createStudentProfile,
  updateStudentProfile,
} from "@/services/student.service";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const profile = await getStudentProfile(session.user.id);

  return NextResponse.json(profile);
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const existing = await getStudentProfile(session.user.id);

  if (existing) {
    return NextResponse.json(
      { message: "Profile already exists" },
      { status: 400 }
    );
  }

  const profile = await createStudentProfile({
    userId: session.user.id,
    mobileNumber: body.mobileNumber,
    collegeName: body.collegeName,
    degree: body.degree,
    branch: body.branch,
    currentYear: Number(body.currentYear),
  });

  return NextResponse.json(profile);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const profile = await updateStudentProfile(session.user.id, {
    mobileNumber: body.mobileNumber,
    collegeName: body.collegeName,
    degree: body.degree,
    branch: body.branch,
    currentYear: Number(body.currentYear),
  });

  return NextResponse.json(profile);
}