import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  updateAdminSubscriber,
  deleteAdminSubscriber,
} from "@/services/subscriber.service";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await verifyAdminSession();
  if (!authCheck.authorized) {
    return authCheck.response!;
  }

  try {
    const { id } = await params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Subscriber ID is required" },
        { status: 400 }
      );
    }

    const result = await updateAdminSubscriber(id, body);

    if (result.error) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscriber updated successfully",
      data: result.subscriber,
    });
  } catch (error) {
    console.error("[PATCH /api/admin/subscribers/[id] Error]:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update subscriber" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await verifyAdminSession();
  if (!authCheck.authorized) {
    return authCheck.response!;
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Subscriber ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteAdminSubscriber(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || "Failed to delete" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscriber deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE /api/admin/subscribers/[id] Error]:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}
