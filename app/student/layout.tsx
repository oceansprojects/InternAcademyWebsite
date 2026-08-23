import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Portal",
  description:
    "View your cohort progress, manage applications, and access course materials.",
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
