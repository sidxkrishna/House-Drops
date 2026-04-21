import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const adminId = process.env.ADMIN_SPOTIFY_ID;

  // If no admin ID is configured, allow through (dev convenience)
  if (!adminId || adminId === "YOUR_SPOTIFY_USER_ID") {
    return NextResponse.next();
  }

  const userId = request.cookies.get("spotify_user_id")?.value;

  if (userId !== adminId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio", "/studio/:path*", "/drops/user/:id/edit"],
};
