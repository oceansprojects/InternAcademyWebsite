"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardMenu } from "./menu";

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-72 flex-col border-r bg-background">

      <div className="border-b px-6 py-6">
        <h2 className="text-2xl font-bold text-primary">
          Intern Academy
        </h2>

        <p className="text-sm text-muted-foreground">
          Student Portal
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">

        {dashboardMenu.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition

                ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }
              `}
            >
              <Icon className="h-5 w-5" />

              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}