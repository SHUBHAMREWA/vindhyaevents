import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "vindhya-events-super-secret-jwt-key-2026-secure-random";
const secretKey = new TextEncoder().encode(JWT_SECRET);
const ADMIN_COOKIE_NAME = "vindhya_admin_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  let isValidAdmin = false;
  if (token) {
    try {
      await jwtVerify(token, secretKey);
      isValidAdmin = true;
    } catch {
      isValidAdmin = false;
    }
  }

  // 1. Guard /admin routes
  if (pathname.startsWith("/admin")) {
    if (!isValidAdmin) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Redirect logged-in admin away from /login
  if (pathname === "/login" && isValidAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
