import { NextRequest, NextResponse } from "next/server";

import {
  getFAQs,
  createFAQ,
} from "@/services/faq.service";

export async function GET() {
  try {
    const faqs = await getFAQs();

    return NextResponse.json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/faqs:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch FAQs",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest
) {
  try {
    const body = await req.json();

    const faq = await createFAQ(body);

    return NextResponse.json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error("Error in POST /api/admin/faqs:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create FAQ",
      },
      { status: 500 }
    );
  }
}