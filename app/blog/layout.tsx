import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Career Insights",
  description:
    "Explore the latest stories, design systems, tech trends, and career roadmaps from InternAcademy mentors and students.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
