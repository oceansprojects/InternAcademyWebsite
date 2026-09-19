import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  getCompanyProfile,
  getCompanyIdByUserId,
  updateCompanyProfile,
} from "@/services/company.service";

async function getCompanyToken(req: NextRequest) {
  const isSecure = req.nextUrl.protocol === "https:";
  let token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: isSecure });
  if (!token && isSecure) token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: false });
  return token;
}

export async function GET(req: NextRequest) {
  const token = await getCompanyToken(req);
  if (!token || token.role !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getCompanyProfile(String(token.id));
  if (!profile) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  return NextResponse.json(profile);
}

export async function PATCH(req: NextRequest) {
  const token = await getCompanyToken(req);
  if (!token || token.role !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companyId = await getCompanyIdByUserId(String(token.id));
  if (!companyId) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const body = await req.json();
  const updated = await updateCompanyProfile(companyId, body);
  return NextResponse.json(updated);
}
