import { NextResponse } from "next/server";

export default function middleware(req) {
  const token = req.cookies.get("userToken");
  const user = req.cookies.get("user");
  const isAuthenticated = !!token && !!user;

  const { pathname, origin } = req.nextUrl;

  // Protected routes
  const protectedPaths = [
    "/library",
    "/notifications",
    "/payment-history",
    "/profile",
    "/algobots",
    "/recorded-courses",
    "/refer-and-earn",
    "/new-password",
    "/otp-screen",
    "/successfully-password",
    "/resources",
  ];

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // If not authenticated, block protected routes
  if (!isAuthenticated && isProtected) {
    const url = new URL("/", origin);
    return NextResponse.redirect(url);
  }

  // If authenticated, block auth routes
  if (isAuthenticated && ["/login", "/signup", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/library", origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/library",
    "/notifications",
    "/payment-history",
    "/profile",
    "/resources",
    "/login",
    "/signup",
    "/register",

    // Courses routes (with dynamic segments)
    "/recorded-courses/:path*",
    "/algobots/:path*",
    "/refer-and-earn/:path*",
    "/new-password/:path*",
    "/otp-screen/:path*",
    "/successfully-password/:path*",
  ],
};

