import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  getAdminSubscribers,
  createAdminSubscriber,
} from "@/services/subscriber.service";

export async function GET(req: Request) {
  const authCheck = await verifyAdminSession();
  if (!authCheck.authorized) {
    return authCheck.response!;
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const result = await getAdminSubscribers({
      search,
      status,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.subscribers,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        activeCount: result.activeCount,
        disabledCount: result.disabledCount,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/subscribers Error]:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const authCheck = await verifyAdminSession();
  if (!authCheck.authorized) {
    return authCheck.response!;
  }

  try {
    const body = await req.json();
    const { email, status = "active" } = body || {};

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const result = await createAdminSubscriber({ email, status });

    if (result.error) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Subscriber created successfully",
        data: result.subscriber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/admin/subscribers Error]:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create subscriber" },
      { status: 500 }
    );
  }
}
