import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { SpotifyTokenResponse } from "../../../types/spotify";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("spotify_auth_state")?.value;

  // Derive base from SPOTIFY_REDIRECT_URI to avoid localhost vs 127.0.0.1 mismatch
  const base = new URL(process.env.SPOTIFY_REDIRECT_URI!).origin;
  const studioUrl = new URL("/studio", base);

  if (error || !code) {
    studioUrl.searchParams.set("error", "access_denied");
    return NextResponse.redirect(studioUrl);
  }

  if (!state || state !== savedState) {
    studioUrl.searchParams.set("error", "state_mismatch");
    return NextResponse.redirect(studioUrl);
  }

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    }),
  });

  if (!tokenResponse.ok) {
    studioUrl.searchParams.set("error", "token_exchange_failed");
    return NextResponse.redirect(studioUrl);
  }

  const tokens: SpotifyTokenResponse = await tokenResponse.json();

  // Fetch the user's Spotify ID to store for admin checks
  const meRes = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const meData = meRes.ok ? await meRes.json() : null;

  const response = NextResponse.redirect(studioUrl);

  response.cookies.delete("spotify_auth_state");

  response.cookies.set("spotify_access_token", tokens.access_token, {
    httpOnly: true,
    secure: false,
    maxAge: tokens.expires_in,
    path: "/",
  });

  response.cookies.set("spotify_refresh_token", tokens.refresh_token, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  if (meData?.id) {
    response.cookies.set("spotify_user_id", meData.id, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  return response;
}
