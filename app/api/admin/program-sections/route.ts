import { NextResponse } from "next/server";
import {
  getProgramSections,
  createProgramSection,
} from "@/services/program-section.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const programId = searchParams.get("programId");

    if (!programId) {
      return NextResponse.json(
        {
          success: false,
          message: "programId is required",
        },
        { status: 400 }
      );
    }

    const sections = await getProgramSections(programId);

    return NextResponse.json({
      success: true,
      data: sections,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch sections",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const section = await createProgramSection(body);

    return NextResponse.json(
      {
        success: true,
        data: section,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create section",
      },
      { status: 500 }
    );
  }
}