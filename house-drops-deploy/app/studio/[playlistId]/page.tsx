"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { SpotifyPlaylistTrackItem, SpotifyTrack } from "../../types/spotify";
import { useSpotifyAuth } from "../../hooks/useSpotifyAuth";

const MAX_TRACKS = 5;
type SortKey = "default" | "name" | "artist" | "shortest" | "longest";

function fmtDuration(ms: number) {
  return `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}`;
}

export default function PlaylistPage() {
  const { playlistId } = useParams<{ playlistId: string }>();
  const router = useRouter();
  const authState = useSpotifyAuth();
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [fetchState, setFetchState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SpotifyTrack[]>([]);
  const [limitWarning, setLimitWarning] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("default");
  const [nowPlaying, setNowPlaying] = useState<SpotifyTrack | null>(null);

  useEffect(() => {
    if (authState === "unauthenticated") {
      router.replace("/studio");
      return;
    }
    if (authState !== "authenticated") return;

    setFetchState("loading");
    fetch(`/api/playlists/${playlistId}/tracks`)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then((data) => {
        const valid: SpotifyTrack[] = (data.items ?? [])
          .map((item: SpotifyPlaylistTrackItem) => item.item)
          .filter((t: SpotifyTrack | null | undefined): t is SpotifyTrack => t != null && "name" in t);
        setTracks(valid);
        setFetchState("done");
      })
      .catch((err) => {
        setError(err.message);
        setFetchState("error");
      });
  }, [authState, playlistId, router]);

  const displayed = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = q
      ? tracks.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.artists.some((a) => a.name.toLowerCase().includes(q))
        )
      : [...tracks];
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "artist")
      list.sort((a, b) =>
        (a.artists[0]?.name ?? "").localeCompare(b.artists[0]?.name ?? "")
      );
    else if (sort === "shortest") list.sort((a, b) => a.duration_ms - b.duration_ms);
    else if (sort === "longest") list.sort((a, b) => b.duration_ms - a.duration_ms);
    return list;
  }, [tracks, query, sort]);

  function toggleTrack(track: SpotifyTrack) {
    const isSelected = selected.some((t) => t.id === track.id);
    if (isSelected) {
      setSelected(selected.filter((t) => t.id !== track.id));
      setLimitWarning(false);
    } else {
      if (selected.length >= MAX_TRACKS) {
        setLimitWarning(true);
        return;
      }
      setSelected([...selected, track]);
      setLimitWarning(false);
    }
  }

  function handleCreateDrop() {
    sessionStorage.setItem("drop_tracks", JSON.stringify(selected));
    sessionStorage.setItem("drop_source_playlist", playlistId);
    router.push("/studio/create-drop");
  }

  const SORT_OPTS: { key: SortKey; label: string }[] = [
    { key: "default", label: "Order" },
    { key: "name", label: "Name" },
    { key: "artist", label: "Artist" },
    { key: "shortest", label: "Shortest" },
    { key: "longest", label: "Longest" },
  ];

  return (
    <main className="min-h-screen bg-[#0c0c0e] text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/studio"
            className="font-mono text-sm tracking-widest uppercase text-zinc-600 hover:text-zinc-300 transition-colors duration-200"
          >
            ← Playlists
          </Link>
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-violet-500 bg-violet-500/10 px-2 py-1 rounded">
            Studio
          </span>
        </div>

        {(authState === "loading" || fetchState === "loading" || fetchState === "idle") && (
          <p className="font-mono text-sm text-zinc-600 tracking-widest uppercase">Loading tracks…</p>
        )}

        {fetchState === "error" && (
          <p className="font-mono text-sm text-red-400">Failed to load tracks: {error}</p>
        )}

        {fetchState === "done" && (
          <>
            {/* Track count + selection status */}
            <div className="flex items-center justify-between mb-5">
              <p className="font-mono text-sm text-zinc-400">
                {tracks.length} tracks
                {query && ` · ${displayed.length} visible`}
              </p>
              <div className="flex items-center gap-3">
                <span className={`font-mono text-sm ${selected.length > 0 ? "text-violet-400" : "text-zinc-600"}`}>
                  {selected.length} / {MAX_TRACKS} selected
                </span>
                {selected.length > 0 && (
                  <button
                    onClick={() => { setSelected([]); setLimitWarning(false); }}
                    className="font-mono text-xs text-zinc-600 hover:text-red-400 transition-colors duration-150 uppercase tracking-wide"
                  >
                    clear
                  </button>
                )}
              </div>
            </div>

            {/* Selected tracks preview */}
            {selected.length > 0 && (
              <div className="bg-zinc-900/60 border border-zinc-800 px-3 py-2.5 mb-5 flex flex-wrap gap-2">
                {selected.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => toggleTrack(t)}
                    title="Click to deselect"
                    className="font-mono text-xs text-violet-300 bg-violet-500/10 border border-violet-500/30 px-2.5 py-1 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors duration-150"
                  >
                    {t.name} ×
                  </button>
                ))}
              </div>
            )}

            {limitWarning && (
              <p className="font-mono text-sm text-amber-400 border border-amber-400/30 px-4 py-3 mb-5">
                5 tracks max. No fillers. No misses.
              </p>
            )}

            {/* Search + sort toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <input
                type="text"
                placeholder="Filter by track or artist…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-700 focus:border-violet-500 outline-none px-3 py-2.5 font-mono text-base text-white placeholder:text-zinc-600 transition-colors duration-150"
              />
              <div className="flex gap-1 flex-wrap">
                {SORT_OPTS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setSort(key)}
                    className={`px-3 py-2 font-mono text-xs tracking-wide uppercase border transition-colors duration-150 ${
                      sort === key
                        ? "border-violet-500 text-violet-400 bg-violet-500/10"
                        : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Track list */}
            <div className="flex flex-col mb-24">
              {displayed.map((track) => {
                const isSelected = selected.some((t) => t.id === track.id);
                const albumArt = track.album.images[2]?.url ?? track.album.images[0]?.url ?? null;
                return (
                  <div
                    key={track.id}
                    className={`border-b border-zinc-800/50 last:border-0 transition-colors duration-100 ${
                      isSelected ? "bg-violet-500/5" : "hover:bg-zinc-900/40"
                    }`}
                  >
                    <div className="py-2.5 flex gap-3 items-center">
                      {/* Album art */}
                      {albumArt ? (
                        <Image
                          src={albumArt}
                          alt=""
                          width={44}
                          height={44}
                          className="w-11 h-11 shrink-0 object-cover"
                        />
                      ) : (
                          <div className="w-11 h-11 shrink-0 bg-zinc-900 flex items-center justify-center text-zinc-700 font-mono text-xs">
                          ♪
                        </div>
                      )}

                      {/* Track info */}
                      <button
                        onClick={() => toggleTrack(track)}
                        className="flex-1 min-w-0 text-left"
                      >
                        <p className={`text-base font-medium truncate ${isSelected ? "text-violet-300" : "text-zinc-200"}`}>
                          {track.name}
                        </p>
                        <p className="text-sm font-mono text-zinc-600 mt-0.5 truncate">
                          {track.artists.map((a) => a.name).join(", ")}
                          <span className="text-zinc-700 ml-2">{fmtDuration(track.duration_ms)}</span>
                        </p>
                      </button>

                      {/* Play / stop button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setNowPlaying(nowPlaying?.id === track.id ? null : track); }}
                        title={nowPlaying?.id === track.id ? "Stop" : "Play"}
                        className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-full border transition-colors duration-150 ${
                          nowPlaying?.id === track.id
                            ? "border-[#1DB954] text-[#1DB954] bg-[#1DB954]/10"
                            : "border-zinc-700 text-zinc-400 hover:border-[#1DB954] hover:text-[#1DB954]"
                        }`}
                      >
                        {nowPlaying?.id === track.id ? (
                          /* Stop square */
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                            <rect width="8" height="8" rx="1"/>
                          </svg>
                        ) : (
                          /* Play triangle */
                          <svg width="8" height="9" viewBox="0 0 8 9" fill="currentColor">
                            <path d="M1 0.5L7.5 4.5L1 8.5V0.5Z"/>
                          </svg>
                        )}
                      </button>

                      {/* Selection tick */}
                      <span className={`font-mono text-sm shrink-0 w-4 text-right ${isSelected ? "text-violet-400" : "text-zinc-800"}`}>
                        {isSelected ? "✓" : "+"}
                      </span>
                    </div>

                    {/* Inline Spotify embed */}
                    {nowPlaying?.id === track.id && (
                      <div className="pb-3 pl-12">
                        <iframe
                          key={track.id}
                          src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`}
                          width="100%"
                          height="80"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                          className="rounded"
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {displayed.length === 0 && query && (
                <p className="font-mono text-sm text-zinc-700 py-8">no tracks match &ldquo;{query}&rdquo;</p>
              )}
            </div>

            {selected.length > 0 && (
              <div className="fixed bottom-8 left-0 right-0 flex justify-center px-4">
                <button
                  onClick={handleCreateDrop}
                  className="bg-[#0c0c0e] border border-violet-500 px-10 py-4 font-mono text-sm tracking-widest uppercase text-violet-400 hover:bg-violet-500 hover:text-white transition-colors duration-200 shadow-lg shadow-violet-900/20"
                >
                  Create Drop — {selected.length} track{selected.length !== 1 ? "s" : ""}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
