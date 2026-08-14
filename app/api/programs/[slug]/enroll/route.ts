import { auth } from "@/auth";
import { NextResponse } from "next/server";

import { createEnrollment } from "@/services/enrollment.service";
import { getProgramBySlug } from "@/services/program.service";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function POST(
  req: Request,
  { params }: Props
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { slug } = await params;

  const program = await getProgramBySlug(slug);

  if (!program) {
    return NextResponse.json(
      { message: "Program not found" },
      { status: 404 }
    );
  }

  const enrollment = await createEnrollment({
    userId: session.user.id,
    programId: program.id,
  });

  return NextResponse.json(enrollment);
}