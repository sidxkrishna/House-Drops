import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAccessToken } from "../../lib/spotify-auth";

// TODO (upgrade): Support collaborative and followed playlists from other users.
// Spotify's /v1/me/playlists returns all playlists in the library (owned + followed).
// Currently we filter to owned-only because reading tracks from followed playlists
// requires additional scopes. When ready, remove the owner filter and handle
// the 403s that come from non-owned playlist track fetches.

export async function GET() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();
  const currentUserId = cookieStore.get("spotify_user_id")?.value ?? null;

  // Paginate through all playlists (Spotify max 50 per page)
  const items: unknown[] = [];
  let url: string | null = "https://api.spotify.com/v1/me/playlists?limit=50";

  while (url) {
    const response: Response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch playlists" },
        { status: response.status }
      );
    }

    const data: { items: unknown[]; next: string | null } = await response.json();
    items.push(...(data.items ?? []));
    url = data.next ?? null;
  }

  // Filter to playlists owned by the current user only
  const owned = currentUserId
    ? items.filter(
        (p) => (p as { owner: { id: string } }).owner?.id === currentUserId
      )
    : items;

  return NextResponse.json({ items: owned });
}
