import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Supabase usually stores the signed-in session in cookies.
  const hasSupabaseSession = request.cookies
    .getAll()
    .some(
      (cookie) =>
        cookie.name.startsWith("sb-") &&
        cookie.name.endsWith("-auth-token")
    );

  const protectedRoutes = [
    "/explore",
    "/home",
    "/videos",
    "/messages",
    "/notifications",
    "/saved",
    "/upload",
    "/upload-story",
    "/golden-creator-hub",
  ];

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !hasSupabaseSession) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/explore/:path*",
    "/home/:path*",
    "/videos/:path*",
    "/messages/:path*",
    "/notifications/:path*",
    "/saved/:path*",
    "/upload/:path*",
    "/upload-story/:path*",
    "/golden-creator-hub/:path*",
  ],
};