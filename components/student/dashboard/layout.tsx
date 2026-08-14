import { auth } from "@/auth";
import { redirect } from "next/navigation";

import DashboardSidebar from "@/components/student-dashboard/DashboardSidebar";
import DashboardHeader from "@/components/student-dashboard/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-muted/30">

      <DashboardSidebar />

      <div className="flex flex-1 flex-col">

        <DashboardHeader />

        <main className="flex-1 p-6 lg:p-8">

          {children}

        </main>

      </div>

    </div>
  );
}