"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu } from "lucide-react";

import { dashboardMenu } from "./menu";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

export default function MobileSidebar() {
    const pathname = usePathname();

    return (
        <Sheet>

            <SheetTrigger className="lg:hidden rounded-md border p-2">
                <Menu className="h-5 w-5" />
            </SheetTrigger>

            <SheetContent side="left" className="w-72 p-0">

                <div className="border-b px-6 py-6">

                    <h2 className="text-2xl font-bold text-primary">
                        Intern Academy
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Student Portal
                    </p>

                </div>

                <nav className="p-4 space-y-2">

                    {dashboardMenu.map((item) => {
                        const Icon = item.icon;

                        const active =
                            pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition

                ${active
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

            </SheetContent>

        </Sheet>
    );
}