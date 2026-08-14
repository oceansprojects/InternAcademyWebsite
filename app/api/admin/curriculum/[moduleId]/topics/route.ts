import { NextRequest, NextResponse } from "next/server";

import {
  getCurriculumTopics,
  createCurriculumTopic,
} from "@/services/curriculum-topic.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await params;

  const topics = await getCurriculumTopics(moduleId);

  return NextResponse.json({
    success: true,
    data: topics,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await params;

  const body = await req.json();

  const topic = await createCurriculumTopic(
    moduleId,
    body.topic,
    body.sort_order ?? 0
  );

  return NextResponse.json({
    success: true,
    data: topic,
  });
}