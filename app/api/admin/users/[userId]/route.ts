import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { deleteUser, getUserById } from "@/services/auth.service";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const session = await auth();

    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    if (session.user.id === userId) {
      return NextResponse.json(
        { success: false, message: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    const existing = await getUserById(userId);

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (existing.email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()) {
      return NextResponse.json(
        { success: false, message: "The configured admin account cannot be deleted" },
        { status: 400 }
      );
    }

    await deleteUser(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/admin/users/[userId]:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete user",
      },
      { status: 500 }
    );
  }
}
