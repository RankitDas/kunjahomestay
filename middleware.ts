import { NextResponse, type NextRequest } from "next/server";

/** Admin remains available for local demos, but is deliberately closed in production until authentication is added. */
export function middleware(request: NextRequest) {
  const isAdminSurface = request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/api/billing");
  if (isAdminSurface && process.env.NODE_ENV === "production") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/billing/:path*"],
};
