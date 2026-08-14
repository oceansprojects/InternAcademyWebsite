import { NextResponse } from "next/server";
import { subscribeEmail } from "@/services/subscriber.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body || {};

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is required.",
          code: "INVALID_EMAIL",
        },
        { status: 400 }
      );
    }

    const result = await subscribeEmail(email);

    if (!result.success) {
      const statusCode = result.code === "INVALID_EMAIL" ? 400 : 500;
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          code: result.code,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        code: result.code,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/subscribe API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
        code: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
