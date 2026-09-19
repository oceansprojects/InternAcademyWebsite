import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getProjectsByUserId,
  addProject,
} from "@/services/student-professional.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const rows = await getProjectsByUserId(session.user.id);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const entry = await addProject(session.user.id, {
    title:       body.title,
    description: body.description,
    techStack:   Array.isArray(body.techStack) ? body.techStack : [],
    projectUrl:  body.projectUrl,
    startDate:   body.startDate,
    endDate:     body.endDate,
    isOngoing:   Boolean(body.isOngoing),
  });
  return NextResponse.json(entry, { status: 201 });
}
