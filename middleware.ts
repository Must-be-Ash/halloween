import { NextRequest, NextResponse } from "next/server";

// Payment logic has been moved to the API route (/app/api/process-image/route.ts)
// This allows it to run in Node.js runtime instead of Edge runtime
// The Edge runtime was causing "Forbidden" errors with CDP facilitator in production

export async function middleware(request: NextRequest) {
  console.log("[middleware] Request passed through (payment logic now in API route)");
  console.log("[middleware] Method:", request.method);
  console.log("[middleware] URL:", request.url);

  // Just pass through - payment verification happens in the API route
  return NextResponse.next();
}

export const config = {
  matcher: "/api/process-image",
};
