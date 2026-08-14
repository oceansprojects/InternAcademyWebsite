import { NextResponse } from "next/server";
import {
  getPrograms,
  createProgram,
} from "@/services/program.service";

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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const program = await createProgram(body);

    return NextResponse.json(
      {
        success: true,
        data: program,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    // Handle duplicate slug (Postgres unique constraint violation code 23505)
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "23505" &&
      "constraint" in error &&
      (error as { constraint: string }).constraint === "programs_slug_key"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A program with this slug already exists. Please choose a different slug.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create program",
      },
      { status: 500 }
    );
  }
}