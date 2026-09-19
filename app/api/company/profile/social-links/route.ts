import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  getCompanyIdByUserId,
  addSocialLink,
} from "@/services/company.service";

async function getCompanyToken(req: NextRequest) {
  const isSecure = req.nextUrl.protocol === "https:";
  let token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: isSecure });
  if (!token && isSecure) token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: false });
  return token;
}

export async function POST(req: NextRequest) {
  const token = await getCompanyToken(req);
  if (!token || token.role !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companyId = await getCompanyIdByUserId(String(token.id));
  if (!companyId) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const body = await req.json();
  if (!body.socialAppName || !body.socialAccLink) {
    return NextResponse.json({ error: "socialAppName and socialAccLink are required." }, { status: 400 });
  }

  const link = await addSocialLink(companyId, body);
  return NextResponse.json(link, { status: 201 });
}
