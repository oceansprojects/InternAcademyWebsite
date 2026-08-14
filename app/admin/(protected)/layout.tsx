"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Menu, X, HelpCircle, Users, LogOut, GraduationCap, ShieldCheck, UserCircle, Mail, Award } from "lucide-react";
import { useState } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { adminSignOut } from "@/app/actions/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <ToastProvider>{children}</ToastProvider>;
  }

  const navItems = [
    {
      href: "/admin",
      label: "Overview",
      icon: Home,
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: UserCircle,
    },
    {
      href: "/admin/subscribers",
      label: "Subscribed Mail",
      icon: Mail,
    },
    {
      href: "/admin/programs",
      label: "Programs",
      icon: BookOpen,
    },
    {
      href: "/admin/instructors",
      label: "Instructors",
      icon: GraduationCap,
    },
    {
      href: "/admin/enrollments",
      label: "Enrollments",
      icon: Users,
    },
    {
      href: "/admin/certificates",
      label: "Certificates",
      icon: Award,
    },
    {
      href: "/admin/faqs",
      label: "Global FAQs",
      icon: HelpCircle,
    },
  ];

  return (
    <ToastProvider>
      <div className="min-h-screen flex bg-slate-50">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-slate-900 text-slate-200 border-r border-slate-800 shadow-2xl lg:shadow-none
          transition-transform duration-300 ease-in-out
          flex flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <div className="p-6 flex flex-col flex-1">
            {/* Header Brand */}
            <div className="mb-8 border-b border-slate-800 pb-6">
              <Link href="/admin" className="inline-flex items-center gap-2">
                <span className="font-montserrat text-2xl font-extrabold tracking-tight text-white">
                  InternAcademy
                </span>
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-[#00d2fd] font-semibold mt-1">
                <ShieldCheck className="size-3.5" />
                <span>Admin Control Panel</span>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-1.5 flex-1" role="navigation" aria-label="Main navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-[#004aad] text-white shadow-md shadow-[#004aad]/20"
                          : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                      }
                    `}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout & Footer */}
            <div className="mt-auto pt-6 border-t border-slate-800 space-y-4">
              <form action={adminSignOut}>
                <button
                  type="submit"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-xs font-bold"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </form>

              <div className="text-[10px] text-slate-500 text-center font-medium">
                Admin System v2.0 • Live Neon DB
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}