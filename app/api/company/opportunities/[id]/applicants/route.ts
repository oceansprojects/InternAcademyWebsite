import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getCompanyIdByUserId } from "@/services/company.service";
import { getApplicationsByOpportunity } from "@/services/application.service";

async function getCompanyToken(req: NextRequest) {
  const isSecure = req.nextUrl.protocol === "https:";
  let token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: isSecure });
  if (!token && isSecure) token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: false });
  return token;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getCompanyToken(req);
  if (!token || token.role !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companyId = await getCompanyIdByUserId(String(token.id));
  if (!companyId) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const { id } = await params;

  try {
    const applicants = await getApplicationsByOpportunity(id, companyId);
    return NextResponse.json(applicants);
  } catch (error: any) {
    console.error("Failed to fetch applicants:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch applicants." },
      { status: 403 }
    );
  }
}
