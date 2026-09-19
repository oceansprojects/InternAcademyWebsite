import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAdminOpportunityById, deleteAdminOpportunity } from "@/services/admin-company.service";

export async function GET(
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
    const opportunity = await getAdminOpportunityById(id);

    if (!opportunity) {
      return NextResponse.json({ success: false, message: "Opportunity not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      opportunity,
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/opportunities/[id]:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch opportunity" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const existing = await getAdminOpportunityById(id);
    if (!existing) {
      return NextResponse.json({ success: false, message: "Opportunity not found" }, { status: 404 });
    }

    const deleted = await deleteAdminOpportunity(id);

    return NextResponse.json({
      success: true,
      message: "Opportunity removed/delisted successfully",
      deleted,
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/opportunities/[id]:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete opportunity" },
      { status: 500 }
    );
  }
}
