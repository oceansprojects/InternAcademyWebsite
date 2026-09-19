import { NextRequest, NextResponse } from "next/server";
import { createCompanyUser } from "@/services/company-auth.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, companyName, email, password } = body;

    if (!name || !companyName || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const result = await createCompanyUser({ name, companyName, email, password });

    return NextResponse.json({ success: true, userId: result.user.id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Signup failed." }, { status: 400 });
  }
}
