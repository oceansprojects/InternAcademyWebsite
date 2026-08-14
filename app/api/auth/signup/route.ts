import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/services/auth.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const user = await createUser({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        data: user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create account.",
      },
      { status: 500 }
    );
  }
}