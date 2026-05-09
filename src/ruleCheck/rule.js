import { NextResponse } from "next/server";

export function middleware(request) {
  const session = request.cookies.get("session");
  const role = request.cookies.get("role")?.value;
  const path = request.nextUrl.pathname;


  if (!session) {
    return NextResponse.redirect(new URL("/sign/in", request.url));
  }

  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    path.startsWith("/event_control") &&
    role !== "admin" &&
    role !== "organiser"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/event_control/:path*"],
};