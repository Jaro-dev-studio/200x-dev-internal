import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

// Admin email for access control
const ADMIN_EMAIL = "jaroslav.vorobey@gmail.com";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/products", // Public product listings
];

// Routes that start with these prefixes are public
const publicPrefixes = [
  "/api/auth",
  "/api/webhooks",
  "/api/stripe/checkout", // Allow guest checkout
  "/api/mcp", // MCP server endpoint
  "/products/", // Individual product preview pages
];

// Admin-only routes
const adminPrefixes = ["/admin"];

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userEmail = req.auth?.user?.email;

  const pathname = nextUrl.pathname;

  // Check if route is public
  const isPublicRoute = publicRoutes.includes(pathname);
  const isPublicPrefix = publicPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // Check if route is admin-only
  const isAdminRoute = adminPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // Allow public routes
  if (isPublicRoute || isPublicPrefix) {
    return NextResponse.next();
  }

  // Check admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }
    if (userEmail !== ADMIN_EMAIL) {
      // Not an admin, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  // Protected routes require authentication
  if (!isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
