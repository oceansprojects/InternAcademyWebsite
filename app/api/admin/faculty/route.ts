import { NextResponse } from "next/server";

import {
  getAllFaculty,
  createFaculty,
} from "@/services/faculty.service";

export async function GET() {
  try {
    const faculty = await getAllFaculty();

    return NextResponse.json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch faculty",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const faculty = await createFaculty(body);

    return NextResponse.json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create faculty",
      },
      { status: 500 }
    );
  }
}