import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Middleware to protect admin routes with Better Auth
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = getSessionCookie(request);

    // Check if user has a valid session cookie
    if (!sessionCookie) {
      // Redirect to login page if no session
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    // TODO: Add role-based access control here
    // For now, we just check for session existence
    // In Phase 2, we'll add proper role checking
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*", // Protect all admin routes
  ],
};
