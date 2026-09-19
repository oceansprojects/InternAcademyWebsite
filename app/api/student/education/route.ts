import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getEducationByUserId,
  addEducation,
} from "@/services/student-professional.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const rows = await getEducationByUserId(session.user.id);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const entry = await addEducation(session.user.id, {
    instituteName:     body.instituteName,
    startYear:         Number(body.startYear),
    endYear:           body.endYear ? Number(body.endYear) : null,
    currentlyStudying: Boolean(body.currentlyStudying),
    stream:            body.stream,
    branch:            body.branch,
    city:              body.city,
    state:             body.state,
    gradeCgpa:         body.gradeCgpa,
  });
  return NextResponse.json(entry, { status: 201 });
}
