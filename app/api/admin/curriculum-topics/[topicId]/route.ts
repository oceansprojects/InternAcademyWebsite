import { NextRequest, NextResponse } from "next/server";

import {
  updateCurriculumTopic,
  deleteCurriculumTopic,
} from "@/services/curriculum-topic.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  const { topicId } = await params;

  const body = await req.json();

  const topic = await updateCurriculumTopic(
    topicId,
    body.topic,
    body.sort_order
  );

  return NextResponse.json({
    success: true,
    data: topic,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  const { topicId } = await params;

  await deleteCurriculumTopic(topicId);

  return NextResponse.json({
    success: true,
  });
}