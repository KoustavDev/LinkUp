import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    console.log(request);
  // Get the "cookieFallback" cookie from the request
  const cookieFallback = request.cookies.get("cookieFallback");
    console.log(cookieFallback);
  // Check if the user is trying to access the /signup or /signin route
  const pathname = request.nextUrl.pathname;
  if (pathname === "/sign-up" || pathname === "/sign-in") {
    // If the "cookieFallback" cookie exists, redirect the user to the home page
    if (cookieFallback) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-up", "/sign-in"], // Apply middleware only to these routes
};
