import { NextRequest, NextResponse } from "next/server";

import {
  getCurriculumModules,
  createCurriculumModule,
} from "@/services/curriculum-module.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const modules = await getCurriculumModules(id);

  return NextResponse.json({
    success: true,
    data: modules,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await req.json();

  const module = await createCurriculumModule(id, body);

  return NextResponse.json({
    success: true,
    data: module,
  });
}