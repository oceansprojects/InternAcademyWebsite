import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getCompanyIdByUserId } from "@/services/company.service";
import {
  getFullApplicantProfileForCompany,
  getFullApplicantProfileForAdmin,
} from "@/services/application.service";

async function getAuthToken(req: NextRequest) {
  const isSecure = req.nextUrl.protocol === "https:";
  let token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: isSecure });
  if (!token && isSecure) token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: false });
  return token;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const token = await getAuthToken(req);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;

  // Admin and Super Admin have universal read access
  if (token.role === "admin" || token.role === "super_admin") {
    try {
      const fullProfile = await getFullApplicantProfileForAdmin(userId);
      return NextResponse.json(fullProfile);
    } catch (err: any) {
      console.error("Admin failed to fetch full applicant profile:", err);
      return NextResponse.json(
        { error: err.message || "Failed to load candidate profile." },
        { status: 500 }
      );
    }
  }

  // Company flow
  if (token.role !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companyId = await getCompanyIdByUserId(String(token.id));
  if (!companyId) {
    return NextResponse.json({ error: "Company profile not found" }, { status: 404 });
  }

  try {
    const fullProfile = await getFullApplicantProfileForCompany(userId, companyId);
    return NextResponse.json(fullProfile);
  } catch (err: any) {
    console.error("Failed to fetch full applicant profile:", err);
    return NextResponse.json(
      { error: err.message || "Failed to load candidate profile." },
      { status: 403 }
    );
  }
}
