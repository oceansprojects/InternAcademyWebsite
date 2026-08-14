import { NextResponse } from "next/server";
import { getPrograms } from "@/services/program.service";

export async function GET() {
  try {
    const programs = await getPrograms();

    return NextResponse.json({
      success: true,
      data: programs,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch programs",
      },
      { status: 500 }
    );
  }
}
