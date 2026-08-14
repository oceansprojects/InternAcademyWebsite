import { NextRequest, NextResponse } from "next/server";
import {
  getTestimonials,
  createTestimonial,
} from "@/services/testimonial.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ programId: string }> }
) {
  try {
    const { programId } = await params;

    const testimonials = await getTestimonials(programId);

    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch testimonials",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ programId: string }> }
) {
  try {
    const { programId } = await params;

    const body = await req.json();

    const testimonial = await createTestimonial(programId, body);

    return NextResponse.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create testimonial",
      },
      { status: 500 }
    );
  }
}
