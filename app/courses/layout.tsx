import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Programs & Cohorts",
  description:
    "Browse in-person offline training cohorts in Bengaluru. Master Full Stack Development, UI/UX Design, and AI with guaranteed internships and verifiable certifications.",
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
