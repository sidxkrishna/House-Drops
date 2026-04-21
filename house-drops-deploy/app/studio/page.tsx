"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SpotifyPlaylist } from "../types/spotify";
import { useSpotifyAuth } from "../hooks/useSpotifyAuth";

type SortKey = "default" | "az" | "za";

export default function StudioPage() {
  const router = useRouter();
  const authState = useSpotifyAuth();
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("default");

  useEffect(() => {
    const urlError = new URLSearchParams(window.location.search).get("error");
    if (urlError) setError(`Authentication failed: ${urlError}`);
  }, []);

  useEffect(() => {
    if (authState !== "authenticated") return;
    fetch("/api/playlists")
      .then((res) => res.json())
      .then((data) => setPlaylists(data.items ?? []))
      .catch(() => setError("Failed to load playlists"));
  }, [authState]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = q ? playlists.filter((p) => p.name.toLowerCase().includes(q)) : [...playlists];
    if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "za") list.sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [playlists, query, sort]);

  if (authState === "loading") {
    return (
      <main className="min-h-screen bg-[#0c0c0e] text-white flex items-center justify-center">
        <p className="font-mono text-sm text-zinc-600 tracking-widest uppercase">booting up…</p>
      </main>
    );
  }

  if (authState === "unauthenticated") {
    return (
      <main className="min-h-screen bg-[#0c0c0e] text-white flex items-center justify-center">
        <div className="text-center">
          {error && <p className="font-mono text-xs text-red-400 mb-6">{error}</p>}
          <p className="font-mono text-sm text-zinc-600 tracking-widest uppercase mb-8">House Drops Studio</p>
          <a
            href="/api/auth/spotify"
            className="inline-block border border-zinc-700 px-8 py-3 text-base font-mono tracking-widest uppercase text-white hover:border-violet-400 hover:text-violet-400 transition-colors duration-200"
          >
            Sign in with Spotify
          </a>
        </div>
      </main>
    );
  }

  const SORT_OPTS: { key: SortKey; label: string }[] = [
    { key: "default", label: "Default" },
    { key: "az", label: "A → Z" },
    { key: "za", label: "Z → A" },
  ];

  return (
    <main className="min-h-screen bg-[#0c0c0e] text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="font-mono text-sm tracking-widest uppercase text-zinc-600 hover:text-zinc-300 transition-colors duration-200"
          >
            ← Home
          </Link>
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-violet-500 bg-violet-500/10 px-2 py-1 rounded">
            Studio
          </span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white">Playlists</h1>
          <p className="font-mono text-sm text-zinc-600 mt-1">{playlists.length} playlists loaded</p>
        </div>

        {/* Quick nav */}
        <div className="flex gap-2 mb-8">
          <Link
            href="/studio/drops"
            className="font-mono text-xs tracking-widest uppercase border border-zinc-800 px-3 py-2 text-zinc-500 hover:border-violet-500 hover:text-violet-400 transition-colors duration-150"
          >
            All Drops →
          </Link>
        </div>

        {/* Search + sort toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search playlists…"
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

        {/* Results count when filtering */}
        {query && (
          <p className="font-mono text-xs text-zinc-600 mb-4">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
        )}

        {/* Playlist list */}
        <div className="flex flex-col divide-y divide-zinc-800/50">
          {filtered.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => router.push(`/studio/${playlist.id}`)}
                className="py-3 flex items-center gap-3 text-left group hover:bg-zinc-900/50 -mx-2 px-2 transition-colors duration-150"
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-zinc-200 group-hover:text-white truncate transition-colors duration-150">
                    {playlist.name}
                  </p>
                  <p className="font-mono text-xs text-zinc-600 mt-0.5">
                    {playlist.tracks?.total != null ? `${playlist.tracks.total} tracks` : "—"}
                    {playlist.description ? ` · ${playlist.description}` : ""}
                  </p>
                </div>

                <span className="font-mono text-sm text-zinc-700 group-hover:text-violet-500 transition-colors duration-150 shrink-0">
                  →
                </span>
              </button>
          ))}

          {filtered.length === 0 && (
            <p className="font-mono text-sm text-zinc-700 py-8">no playlists match &ldquo;{query}&rdquo;</p>
          )}
        </div>
      </div>
    </main>
  );
}
