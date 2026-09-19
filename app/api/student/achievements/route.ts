import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getAchievementsByUserId,
  addAchievement,
} from "@/services/student-professional.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const rows = await getAchievementsByUserId(session.user.id);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const entry = await addAchievement(session.user.id, {
    title:        body.title,
    description:  body.description,
    date:         body.date,
    organization: body.organization,
  });
  return NextResponse.json(entry, { status: 201 });
}
