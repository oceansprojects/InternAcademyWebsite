import { NextRequest, NextResponse } from "next/server";
import {
  getTestimonials,
  createTestimonial,
} from "@/services/testimonial.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const testimonials = await getTestimonials(id);

    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/programs/[id]/testimonials:", error);
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const testimonial = await createTestimonial(id, body);

    return NextResponse.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error("Error in POST /api/admin/programs/[id]/testimonials:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create testimonial",
      },
      { status: 500 }
    );
  }
}