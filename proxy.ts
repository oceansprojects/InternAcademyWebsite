import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // ✅ Public routes
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/admin/login"
  ) {
    return NextResponse.next();
  }

  // Student routes
  if (pathname.startsWith("/student")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  }

  // Admin routes
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }

    if (
      session.user.role !== "admin" &&
      session.user.role !== "super_admin"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/student/:path*",
    "/admin/:path*",
  ],
};
