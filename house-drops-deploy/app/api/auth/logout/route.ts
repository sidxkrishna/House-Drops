import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect("http://127.0.0.1:3000/studio");
  response.cookies.delete("spotify_access_token");
  response.cookies.delete("spotify_refresh_token");
  response.cookies.delete("spotify_auth_state");
  return response;
}
