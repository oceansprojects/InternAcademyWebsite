import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  updateCertificate,
  deleteCertificate,
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
  const updated = await updateCertificate(session.user.id, id, {
    title:           body.title,
    issuingOrg:      body.issuingOrg,
    issueDate:       body.issueDate,
    certificateLink: body.certificateLink,
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
  await deleteCertificate(session.user.id, id);
  return NextResponse.json({ success: true });
}
