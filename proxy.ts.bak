import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public routes
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/admin/login"
  ) {
    return NextResponse.next();
  }

  // 2. Decode session token
  const isSecure = request.nextUrl.protocol === "https:";
  let token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: isSecure,
  });

  // Fallback for cookie name without prefix if secure flag differs
  if (!token && isSecure) {
    token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: false,
    });
  }

  // 3. Student routes protection
  if (pathname.startsWith("/student")) {
    if (!token) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 4. Admin routes protection
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const adminLoginUrl = request.nextUrl.clone();
      adminLoginUrl.pathname = "/admin/login";
      return NextResponse.redirect(adminLoginUrl);
    }

    const role = (token as any).role;
    if (role !== "admin" && role !== "super_admin") {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = "/";
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/student/:path*",
    "/admin/:path*",
  ],
};

