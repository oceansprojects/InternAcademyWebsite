import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getCompanyIdByUserId } from "@/services/company.service";
import { expireOpportunity } from "@/services/opportunity.service";

async function getCompanyToken(req: NextRequest) {
  const isSecure = req.nextUrl.protocol === "https:";
  let token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: isSecure });
  if (!token && isSecure) token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: false });
  return token;
}

export async function PATCH(
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
  const expired = await expireOpportunity(id, companyId);
  if (!expired) {
    return NextResponse.json({ error: "Opportunity not found or access denied" }, { status: 404 });
  }

  return NextResponse.json({ success: true, status: "expired" });
}
