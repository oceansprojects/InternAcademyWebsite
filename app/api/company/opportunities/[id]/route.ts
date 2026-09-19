import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getCompanyIdByUserId } from "@/services/company.service";
import {
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
} from "@/services/opportunity.service";

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
  const opportunity = await getOpportunityById(id);

  if (!opportunity || opportunity.company_id !== companyId) {
    return NextResponse.json({ error: "Opportunity not found or access denied" }, { status: 404 });
  }

  return NextResponse.json(opportunity);
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
  const body = await req.json();

  const updated = await updateOpportunity(id, companyId, body);
  if (!updated) {
    return NextResponse.json({ error: "Opportunity not found or access denied" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
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
  const deleted = await deleteOpportunity(id, companyId);
  if (!deleted) {
    return NextResponse.json({ error: "Opportunity not found or access denied" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
