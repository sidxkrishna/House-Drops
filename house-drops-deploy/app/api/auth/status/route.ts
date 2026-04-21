import { NextResponse } from "next/server";
import { getAccessToken } from "../../../lib/spotify-auth";

export async function GET() {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
