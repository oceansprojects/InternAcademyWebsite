import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getCompanyIdByUserId, updateCompanyProfile } from "@/services/company.service";
import fs from "fs";
import path from "path";

async function getCompanyToken(req: NextRequest) {
  const isSecure = req.nextUrl.protocol === "https:";
  let token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: isSecure });
  if (!token && isSecure) token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: false });
  return token;
}

export async function POST(req: NextRequest) {
  const token = await getCompanyToken(req);
  if (!token || token.role !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companyId = await getCompanyIdByUserId(String(token.id));
  if (!companyId) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const url = formData.get("url") as string | null;

    let finalLogoUrl = "";

    if (file && typeof file === "object" && "arrayBuffer" in file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), "public", "uploads", "company-logos");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const ext = path.extname(file.name || ".png") || ".png";
      const filename = `company_${companyId}_${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      fs.writeFileSync(filePath, buffer);
      finalLogoUrl = `/uploads/company-logos/${filename}`;
    } else if (url && typeof url === "string" && url.trim()) {
      finalLogoUrl = url.trim();
    } else {
      return NextResponse.json({ error: "No file or URL provided" }, { status: 400 });
    }

    await updateCompanyProfile(companyId, { logoUrl: finalLogoUrl });
    return NextResponse.json({ logoUrl: finalLogoUrl });
  } catch (error: any) {
    console.error("Logo upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload logo" }, { status: 500 });
  }
}
