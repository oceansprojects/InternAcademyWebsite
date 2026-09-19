import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAdminCompanyById } from "@/services/admin-company.service";

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
    const company = await getAdminCompanyById(id);

    if (!company) {
      return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      company,
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/companies/[id]:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch company" },
      { status: 500 }
    );
  }
}
