import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getProfessionalProfile,
  updateProfessionalProfile,
} from "@/services/student-professional.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const profile = await getProfessionalProfile(session.user.id);
  return NextResponse.json(profile ?? {});
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const updated = await updateProfessionalProfile(session.user.id, {
    fullName:         body.fullName,
    profilePhotoUrl:  body.profilePhotoUrl,
    email:            body.email,
    phoneNumber:      body.phoneNumber,
    whatsappNumber:   body.whatsappNumber,
    addressState:     body.addressState,
    addressCity:      body.addressCity,
    addressNation:    body.addressNation,
    techStack:        Array.isArray(body.techStack) ? body.techStack : [],
    yearsExperience:  body.yearsExperience,
    resumeUrl:        body.resumeUrl,
  });
  if (!updated) {
    return NextResponse.json(
      { message: "Profile not found. Complete the basic profile first." },
      { status: 404 }
    );
  }
  return NextResponse.json(updated);
}
