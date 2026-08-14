import { NextRequest, NextResponse } from "next/server";
import { getTechnologies, createTechnology } from "@/services/technology.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string }> }
) {
  try {
    const { programId } = await params;
    const technologies = await getTechnologies(programId);
    return NextResponse.json({ success: true, data: technologies });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch technologies" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string }> }
) {
  try {
    const { programId } = await params;
    const body = await request.json();
    const technology = await createTechnology(
      programId,
      body.label,
      body.icon_url ?? "",
      body.sort_order ?? 0
    );
    return NextResponse.json({ success: true, data: technology }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to create technology" },
      { status: 500 }
    );
  }
}
