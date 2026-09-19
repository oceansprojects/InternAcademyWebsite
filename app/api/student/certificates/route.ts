import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getCertificatesByUserId,
  addCertificate,
} from "@/services/student-professional.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const rows = await getCertificatesByUserId(session.user.id);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const entry = await addCertificate(session.user.id, {
    title:           body.title,
    issuingOrg:      body.issuingOrg,
    issueDate:       body.issueDate,
    certificateLink: body.certificateLink,
  });
  return NextResponse.json(entry, { status: 201 });
}
