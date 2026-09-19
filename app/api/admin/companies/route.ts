import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAdminCompanies, getAdminCompanyStats } from "@/services/admin-company.service";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session?.user || (role !== "admin" && role !== "super_admin")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);

    const [data, stats] = await Promise.all([
      getAdminCompanies({ search, status, page, limit }),
      getAdminCompanyStats(),
    ]);

    return NextResponse.json({
      success: true,
      ...data,
      stats,
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/companies:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
