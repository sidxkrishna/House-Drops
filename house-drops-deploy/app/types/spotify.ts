export interface SpotifyImage {
  url: string;
  width: number | null;
  height: number | null;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  owner: { display_name: string | null; id: string };
  tracks: { total: number } | null;
}

export interface SpotifyPlaylistsResponse {
  items: SpotifyPlaylist[];
  total: number;
}

export interface SpotifyArtist {
  name: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  album: {
    name: string;
    images: SpotifyImage[];
  };
}

// NOTE: Spotify's playlist items endpoint nests the track under `item`, NOT `track`.
// Despite what Spotify's docs say, the actual response shape is:
// { added_at, added_by, is_local, primary_color, item: SpotifyTrack, video_thumbnail }
// DO NOT rename this field to `track` — it will silently break track loading.
export interface SpotifyPlaylistTrackItem {
  item: SpotifyTrack | null | undefined;
}

export interface SpotifyTracksResponse {
  items: SpotifyPlaylistTrackItem[];
  total: number;
}

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}
