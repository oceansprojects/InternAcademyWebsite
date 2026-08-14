import { NextRequest, NextResponse } from "next/server";
import {
  getTechnologies,
  createTechnology,
} from "@/services/technology.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const technologies = await getTechnologies(id);

    return NextResponse.json({
      success: true,
      data: technologies,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch technologies",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const technology = await createTechnology(
      id,
      body.label,
      body.icon_url ?? "",
      body.sort_order ?? 0
    );

    return NextResponse.json({
      success: true,
      data: technology,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create technology",
      },
      { status: 500 }
    );
  }
}