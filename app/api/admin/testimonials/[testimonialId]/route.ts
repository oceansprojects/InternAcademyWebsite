import { NextRequest, NextResponse } from "next/server";

import {
  updateTestimonial,
  deleteTestimonial,
} from "@/services/testimonial.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ testimonialId: string }> }
) {
  try {
    const { testimonialId } = await params;

    const body = await req.json();

    const testimonial = await updateTestimonial(
      testimonialId,
      body
    );

    return NextResponse.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error("Error in PATCH /api/admin/testimonials/[testimonialId]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update testimonial",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ testimonialId: string }> }
) {
  try {
    const { testimonialId } = await params;

    await deleteTestimonial(testimonialId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error in DELETE /api/admin/testimonials/[testimonialId]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete testimonial",
      },
      { status: 500 }
    );
  }
}