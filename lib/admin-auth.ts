import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function verifyAdminSession() {
  const session = await auth();

  if (
    !session ||
    !session.user ||
    (session.user.role !== "admin" && (session.user as any).role !== "super_admin")
  ) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: "Unauthorized. Admin access required." },
        { status: 401 }
      ),
    };
  }

  return { authorized: true, session };
}
