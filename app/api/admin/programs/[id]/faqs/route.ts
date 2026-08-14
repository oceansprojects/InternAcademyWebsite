import { NextRequest, NextResponse } from "next/server";

import {
  getProgramFAQs,
  assignFAQ,
} from "@/services/program-faq.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const faqs = await getProgramFAQs(id);

    return NextResponse.json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/programs/[id]/faqs:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch program FAQs",
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

    const assignment = await assignFAQ(
      id,
      body.faq_id,
      body.sort_order ?? 0
    );

    return NextResponse.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error("Error in POST /api/admin/programs/[id]/faqs:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to assign FAQ",
      },
      { status: 500 }
    );
  }
}