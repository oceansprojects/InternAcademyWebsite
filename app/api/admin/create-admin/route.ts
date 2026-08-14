import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields.",
        },
        { status: 400 }
      );
    }

    const existing = await sql`
      SELECT id
      FROM users
      WHERE email = ${email}
      LIMIT 1;
    `;

    if (existing.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists.",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await sql`
      INSERT INTO users (
        name,
        email,
        password_hash,
        oauth_provider,
        role,
        is_active
      )
      VALUES (
        ${name},
        ${email},
        ${hashedPassword},
        'credentials',
        'admin',
        true
      )
      RETURNING id, name, email, role;
    `;

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}