import { NextResponse } from "next/server";

export function middleware(request) {
  const session = request.cookies.get("session")?.value;
  const role = request.cookies.get("role")?.value;
  const path = request.nextUrl.pathname;

  console.log("PATH:", path);
  console.log("SESSION:", session);
  console.log("ROLE:", role);

  // Allow login page
  if (path === "/sign/in") {
    return NextResponse.next();
  }

  // 🔒 Not logged in
  if (
    !session &&
    (
      path.startsWith("/admin") ||
      path.startsWith("/Create_event") ||
      path.startsWith("/Event_control")
    )
  ) {
    return NextResponse.redirect(new URL("/sign/in", request.url));
  }

  // 🔒 Admin only
  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🔒 Event control (admin + organiser)
  if (
    path.startsWith("/Event_control") &&
    role !== "admin" &&
    role !== "organiser"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🔒 Create event (admin + organiser)
  if (
    path.startsWith("/Create_event") &&
    role !== "admin" &&
    role !== "organiser"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/Event_control/:path*",
    "/Create_event/:path*"
  ],
};