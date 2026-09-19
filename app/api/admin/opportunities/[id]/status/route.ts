import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  updateAdminOpportunityStatus,
  getAdminOpportunityById,
} from "@/services/admin-company.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session?.user || (role !== "admin" && role !== "super_admin")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    let targetStatus: "active" | "expired" | "closed";

    if (body.action === "expire") {
      targetStatus = "expired";
    } else if (body.action === "remove" || body.action === "close") {
      targetStatus = "closed";
    } else if (["active", "expired", "closed"].includes(body.status)) {
      targetStatus = body.status;
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid action or status. Expected action: 'expire' | 'remove' or status: 'active' | 'expired' | 'closed'",
        },
        { status: 400 }
      );
    }

    const opp = await getAdminOpportunityById(id);
    if (!opp) {
      return NextResponse.json({ success: false, message: "Opportunity not found" }, { status: 404 });
    }

    const updated = await updateAdminOpportunityStatus(id, targetStatus);

    return NextResponse.json({
      success: true,
      message: `Opportunity status updated to ${targetStatus}`,
      opportunity: updated,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/opportunities/[id]/status:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update opportunity status" },
      { status: 500 }
    );
  }
}
