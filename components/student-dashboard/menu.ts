import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Award,
  Briefcase,
  User,
  Settings,
} from "lucide-react";

export const dashboardMenu = [
  {
    title: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Programs",
    href: "/student/dashboard/programs",
    icon: BookOpen,
  },
  {
    title: "Applications",
    href: "/student/dashboard/applications",
    icon: FileText,
  },
  {
    title: "Certificates",
    href: "/student/dashboard/certificates",
    icon: Award,
  },
  {
    title: "Internships",
    href: "/student/dashboard/internships",
    icon: Briefcase,
  },
  {
    title: "Profile",
    href: "/student/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/student/dashboard/settings",
    icon: Settings,
  },
];