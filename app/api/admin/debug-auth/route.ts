import { NextResponse } from "next/server"

// TEMPORARY debug route — DELETE after fixing auth
export async function GET() {
  const adminEmail    = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  return NextResponse.json({
    emailSet:    Boolean(adminEmail),
    passwordSet: Boolean(adminPassword),
    passwordLength: adminPassword?.length ?? 0,
    match: adminPassword === "Admin@1234",
  })
}
