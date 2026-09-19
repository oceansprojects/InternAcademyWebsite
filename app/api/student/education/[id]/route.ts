import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  updateEducation,
  deleteEducation,
} from "@/services/student-professional.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const updated = await updateEducation(session.user.id, id, {
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
  if (!updated) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await deleteEducation(session.user.id, id);
  return NextResponse.json({ success: true });
}
