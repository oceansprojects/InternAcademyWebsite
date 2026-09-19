import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { checkProfileComplete } from "@/lib/profile-guard";
import {
  applyToOpportunity,
  getApplicationByUserAndOpportunity,
} from "@/services/application.service";
import { getOpportunityById } from "@/services/opportunity.service";

async function getAuthToken(req: NextRequest) {
  const isSecure = req.nextUrl.protocol === "https:";
  let token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: isSecure });
  if (!token && isSecure) token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: false });
  return token;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getAuthToken(req);
  if (!token) {
    return NextResponse.json({ applied: false, authenticated: false });
  }

  const { id } = await params;
  const application = await getApplicationByUserAndOpportunity(String(token.id), id);

  return NextResponse.json({
    applied: !!application,
    application: application || null,
    authenticated: true,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getAuthToken(req);
  if (!token) {
    return NextResponse.json({ error: "Please sign in to apply." }, { status: 401 });
  }

  if (token.role && token.role !== "student") {
    return NextResponse.json(
      { error: "Only students can apply to opportunities." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const opportunity = await getOpportunityById(id);
  if (!opportunity || opportunity.status !== "active") {
    return NextResponse.json(
      { error: "This opportunity is no longer active or accepting applications." },
      { status: 404 }
    );
  }

  // 1. Profile Completeness Guard
  const profileCheck = await checkProfileComplete(String(token.id));
  if (!profileCheck.complete) {
    return NextResponse.json(
      {
        error: "Please complete your professional profile before applying.",
        code: "PROFILE_INCOMPLETE",
        complete: false,
        missing: profileCheck.missing,
      },
      { status: 422 }
    );
  }

  // 2. Check duplicate application
  const existing = await getApplicationByUserAndOpportunity(String(token.id), id);
  if (existing) {
    return NextResponse.json(
      { error: "You have already applied for this opportunity." },
      { status: 409 }
    );
  }

  // 3. Create application
  try {
    const body = await req.json().catch(() => ({}));
    const application = await applyToOpportunity(
      String(token.id),
      id,
      body.resumeUrl || profileCheck.resumeUrl,
      body.coverLetter || null
    );

    return NextResponse.json(application, { status: 201 });
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "You have already applied for this opportunity." },
        { status: 409 }
      );
    }
    console.error("Application error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit application." },
      { status: 500 }
    );
  }
}
