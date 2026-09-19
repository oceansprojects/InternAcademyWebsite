import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { toggleCompanyStatus, getAdminCompanyById } from "@/services/admin-company.service";

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

    let targetActiveState: boolean;
    if (typeof body.is_active === "boolean") {
      targetActiveState = body.is_active;
    } else if (typeof body.status === "string") {
      targetActiveState = body.status === "active";
    } else {
      return NextResponse.json(
        { success: false, message: "Missing or invalid 'is_active' or 'status' field in request body" },
        { status: 400 }
      );
    }

    const company = await getAdminCompanyById(id);
    if (!company) {
      return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 });
    }

    const result = await toggleCompanyStatus(id, targetActiveState);

    return NextResponse.json({
      success: true,
      message: `Company ${targetActiveState ? "activated" : "blocked"} successfully`,
      ...result,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/companies/[id]/status:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update company status" },
      { status: 500 }
    );
  }
}
