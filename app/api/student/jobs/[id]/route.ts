import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  updateJob,
  deleteJob,
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
  const updated = await updateJob(session.user.id, id, {
    companyName:      body.companyName,
    position:         body.position,
    type:             body.type,
    startMonth:       Number(body.startMonth),
    startYear:        Number(body.startYear),
    endMonth:         body.endMonth ? Number(body.endMonth) : null,
    endYear:          body.endYear ? Number(body.endYear) : null,
    currentlyWorking: Boolean(body.currentlyWorking),
    city:             body.city,
    state:            body.state,
    description:      body.description,
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
  await deleteJob(session.user.id, id);
  return NextResponse.json({ success: true });
}
