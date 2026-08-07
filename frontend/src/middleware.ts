import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { canAccessPath, homePathForRoles } from "@/features/shared/config/roles";

/**
 * Route guard for the whole app:
 *  - /login, /unauthorized are public.
 *  - Everything else requires a Keycloak session; unauthenticated -> /login.
 *  - A logged-in user hitting a module they lack the role for -> /unauthorized.
 *  - A logged-in user hitting /login is bounced to their module home.
 */
export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const isLoggedIn = !!req.auth;
  const roles = req.auth?.roles ?? [];

  const isPublic = path === "/login" || path === "/unauthorized";

  if (isPublic) {
    if (isLoggedIn && path === "/login") {
      return NextResponse.redirect(new URL(homePathForRoles(roles), nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (!canAccessPath(path, roles)) {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl));
  }

  return NextResponse.next();
});

// Run on every route except Auth.js API routes and static assets.
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
