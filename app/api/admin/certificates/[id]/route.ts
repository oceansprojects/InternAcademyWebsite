import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getCompletedEnrollmentWithCert,
  upsertCertificate,
  deactivateCertificate,
} from "@/services/certificate.service";

/** GET /api/admin/certificates/:enrollmentId — single record */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const record = await getCompletedEnrollmentWithCert(id);
    if (!record) {
      return NextResponse.json(
        { error: "Enrollment not found or not completed" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: record });
  } catch (error) {
    console.error("[GET /api/admin/certificates/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** PATCH /api/admin/certificates/:enrollmentId — upsert certificate URL */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { certificate_url } = body;

    if (!certificate_url || typeof certificate_url !== "string" || !certificate_url.trim()) {
      return NextResponse.json(
        { error: "certificate_url is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(certificate_url);
    } catch {
      return NextResponse.json(
        { error: "certificate_url must be a valid URL" },
        { status: 400 }
      );
    }

    // Fetch the enrollment to get user_id + program_id
    const record = await getCompletedEnrollmentWithCert(id);
    if (!record) {
      return NextResponse.json(
        { error: "Enrollment not found or not completed" },
        { status: 404 }
      );
    }

    const cert = await upsertCertificate({
      userId: record.user_id,
      programId: record.program_id,
      certificateUrl: certificate_url.trim(),
      issuedBy: (session.user as any).id,
    });

    return NextResponse.json({ data: cert });
  } catch (error) {
    console.error("[PATCH /api/admin/certificates/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** DELETE /api/admin/certificates/:enrollmentId — deactivate certificate */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const record = await getCompletedEnrollmentWithCert(id);
    if (!record) {
      return NextResponse.json(
        { error: "Enrollment not found or not completed" },
        { status: 404 }
      );
    }

    if (!record.cert_id) {
      return NextResponse.json(
        { error: "No certificate exists for this enrollment" },
        { status: 404 }
      );
    }

    const result = await deactivateCertificate(record.cert_id);
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("[DELETE /api/admin/certificates/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
