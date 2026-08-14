import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getOverview } from "@/services/overview.service";
import { getSummaryCards } from "@/services/summary-card.service";
import { getTechnologies } from "@/services/technology.service";
import { getProjects } from "@/services/project.service";
import { getCurriculumModulesWithTopics } from "@/services/curriculum-module.service";
import { getFacultyForProgram } from "@/services/programFaculty.service";
import { getTestimonials } from "@/services/testimonial.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Find program by slug
    const programResult = await sql`
      SELECT * FROM programs WHERE slug = ${slug} LIMIT 1;
    `;

    if (!programResult || programResult.length === 0) {
      return NextResponse.json(
        { success: false, message: "Program not found" },
        { status: 404 }
      );
    }

    const program = programResult[0];

    // Fetch all related data in parallel
    const [overview, summaryCards, technologies, projects, curriculum, faculty, testimonials] = await Promise.all([
  getOverview(program.id),
  getSummaryCards(program.id),
  getTechnologies(program.id),
  getProjects(program.id),
  getCurriculumModulesWithTopics(program.id),
  getFacultyForProgram(program.id),
  getTestimonials(program.id),
]);

    return NextResponse.json({
      success: true,
      data: {
        program,
        overview,
        summaryCards,
        technologies,
        projects,
        curriculum,
        faculty,
        testimonials,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch program" },
      { status: 500 }
    );
  }
}
