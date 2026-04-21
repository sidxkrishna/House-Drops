import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "../../../../lib/spotify-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Fetch all playlist items across pages
  let url: string | null = `https://api.spotify.com/v1/playlists/${id}/items?limit=100`;
  const allItems: unknown[] = [];

  while (url) {
    const res: Response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        { error: "Failed to fetch tracks", status: res.status, detail: body },
        { status: res.status }
      );
    }

    const page: { items: unknown[]; next: string | null } = await res.json();
    allItems.push(...(page.items ?? []));
    url = page.next ?? null;
  }

  return NextResponse.json({ items: allItems });
}
