import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public auth routes through immediately
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/admin/login" ||
    pathname === "/company/login" ||
    pathname === "/company/signup" ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // 2. Decode JWT session token
  //    secureCookie=true in production (https), false in development (http)
  const isSecure = request.nextUrl.protocol === "https:";
  let token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: isSecure,
  });

  // Fallback: try non-secure cookie name (handles proxy edge cases)
  if (!token && isSecure) {
    token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: false,
    });
  }

  // 3. Protect /student/* routes
  if (pathname.startsWith("/student")) {
    if (!token) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 4. Protect /admin/* routes
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

  // 5. Protect /company/* routes
  if (pathname.startsWith("/company")) {
    if (!token) {
      const companyLoginUrl = request.nextUrl.clone();
      companyLoginUrl.pathname = "/company/login";
      companyLoginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(companyLoginUrl);
    }

    const role = (token as any).role;
    if (role !== "company") {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = "/";
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",
    "/admin/:path*",
    "/company/:path*",
  ],
};
