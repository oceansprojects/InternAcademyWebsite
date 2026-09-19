import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getJobsByUserId,
  addJob,
} from "@/services/student-professional.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const rows = await getJobsByUserId(session.user.id);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const entry = await addJob(session.user.id, {
    companyName:      body.companyName,
    position:         body.position,
    type:             body.type,
    startMonth:       Number(body.startMonth),
    startYear:        Number(body.startYear),
    endMonth:         body.endMonth ? Number(body.endMonth) : null,
    endYear:          body.endYear ? Number(body.endYear) : null,
    currentlyWorking: Boolean(body.currentlyWorking),
    city:             body.city,
    state:            body.state,
    description:      body.description,
  });
  return NextResponse.json(entry, { status: 201 });
}
