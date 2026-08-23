import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "InternAcademy Admin Control Panel.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
