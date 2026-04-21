import { NextResponse } from "next/server";
import { getAccessToken } from "../../../lib/spotify-auth";

export async function GET() {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ id: null }, { status: 401 });
  }

  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return NextResponse.json({ id: null }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json({ id: data.id as string });
}
