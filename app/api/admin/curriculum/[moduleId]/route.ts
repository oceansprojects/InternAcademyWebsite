import { NextRequest, NextResponse } from "next/server";

import {
  updateCurriculumModule,
  deleteCurriculumModule,
} from "@/services/curriculum-module.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await params;

  const body = await req.json();

  const module = await updateCurriculumModule(moduleId, body);

  return NextResponse.json({
    success: true,
    data: module,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await params;

  await deleteCurriculumModule(moduleId);

  return NextResponse.json({
    success: true,
  });
}