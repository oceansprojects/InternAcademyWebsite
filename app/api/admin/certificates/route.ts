import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCompletedEnrollmentsWithCerts } from "@/services/certificate.service";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await getCompletedEnrollmentsWithCerts();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/admin/certificates] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
