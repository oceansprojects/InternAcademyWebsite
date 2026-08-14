import { NextRequest, NextResponse } from "next/server";

import {
  updateFAQ,
  deleteFAQ,
} from "@/services/faq.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ faqId:string }> }
) {
  try {
    const { faqId } = await params;

    const body = await req.json();

    const faq = await updateFAQ(
      faqId,
      body
    );

    return NextResponse.json({
      success:true,
      data:faq,
    });
  } catch (error) {
    console.error("Error in PATCH /api/admin/faqs/[faqId]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update FAQ",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req:NextRequest,
  { params }: { params: Promise<{ faqId:string }> }
) {
  try {
    const { faqId } = await params;

    await deleteFAQ(faqId);

    return NextResponse.json({
      success:true,
    });
  } catch (error) {
    console.error("Error in DELETE /api/admin/faqs/[faqId]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete FAQ",
      },
      { status: 500 }
    );
  }
}