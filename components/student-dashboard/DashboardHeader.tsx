import { auth } from "@/auth";

import MobileSidebar from "./MobileSidebar";

export default async function DashboardHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-6">

      <div className="flex items-center gap-4">

        <MobileSidebar />

        <div>

          <h1 className="font-semibold">
            Welcome back,
            {" "}
            {session?.user?.name}
          </h1>

          <p className="text-sm text-muted-foreground">
            Student Dashboard
          </p>

        </div>

      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">

        {session?.user?.name?.charAt(0)}

      </div>

    </header>
  );
}