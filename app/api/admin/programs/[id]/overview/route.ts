import { NextRequest, NextResponse } from "next/server";
import {
  getOverview,
  updateOverview,
} from "@/services/overview.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const overview = await getOverview(id);

    return NextResponse.json({
      success: true,
      data: overview,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch overview",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const overview = await updateOverview(
      id,
      body.intro_text
    );

    return NextResponse.json({
      success: true,
      data: overview,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update overview",
      },
      { status: 500 }
    );
  }
}