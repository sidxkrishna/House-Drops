"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getUserDrop, hasLikedDrop, recordLike, type UserDrop } from "../../../lib/drops-store";

export default function UserDropPage() {
  const { id } = useParams<{ id: string }>();
  const [drop] = useState<UserDrop | null>(() => getUserDrop(id));
  const [liked, setLiked] = useState<boolean>(() => hasLikedDrop(id));
  const [likeCount, setLikeCount] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  // TODO: set SHOW_ADMIN_CONTROLS to false before going live
  const isAdmin = false;

  useEffect(() => {
    fetch(`/api/likes/${id}`)
      .then((r) => r.json())
      .then((data) => setLikeCount(data.count ?? 0))
      .catch(() => {});
  }, [id]);

  async function handleLike() {
    if (liked) return;
    recordLike(id);
    setLiked(true);
    try {
      const res = await fetch(`/api/likes/${id}`, { method: "POST" });
      const data = await res.json();
      setLikeCount(data.count ?? 0);
    } catch {
      // optimistic fallback
      setLikeCount((c) => c + 1);
    }
  }

  function handleCopyJson() {
    if (!drop) return;
    navigator.clipboard.writeText(JSON.stringify(drop, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!drop) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-xs text-red-400 mb-4">Drop not found.</p>
          <Link
            href="/"
            className="font-mono text-xs text-zinc-600 hover:text-zinc-300 uppercase tracking-widest"
          >
            ← All Drops
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        {/* Back */}
        <div className="flex items-center justify-between mb-10 sm:mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-zinc-600 hover:text-zinc-300 transition-colors duration-200"
          >
            ← All Drops
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
            {isAdmin && (
              <button
                onClick={handleCopyJson}
                className="font-mono text-xs tracking-widest uppercase text-zinc-600 hover:text-[#0ea5e9] transition-colors duration-200"
              >
                {copied ? "Copied ✓" : "Copy JSON"}
              </button>
            )}
          </div>
        </div>

        {/* Header */}
        <section className="mb-10 sm:mb-16">
          <p className="font-mono text-xs text-[#0ea5e9] tracking-[0.3em] uppercase mb-5">
            5 tracks. No misses.
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-none mb-5">
            {drop.title}
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-lg mb-8">
            {drop.description}
          </p>

          {/* Like button */}
          <button
            onClick={handleLike}
            disabled={liked}
            className={`inline-flex items-center gap-2.5 font-mono text-xs tracking-widest uppercase border px-5 py-2.5 transition-colors duration-200 ${
              liked
                ? "border-[#0ea5e9]/40 text-[#0ea5e9]/60 cursor-default"
                : "border-zinc-700 text-zinc-500 hover:border-[#0ea5e9] hover:text-[#0ea5e9]"
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={liked ? "#f43f5e" : "none"} stroke={liked ? "#f43f5e" : "currentColor"} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {liked ? "Liked" : "Like this drop"}
            {likeCount > 0 && (
              <span className="text-[#f43f5e]">
                {likeCount}
              </span>
            )}
          </button>
        </section>

        {/* Standout callout */}
        <section className="border border-[#0ea5e9]/30 bg-[#0ea5e9]/5 px-6 py-5 mb-14">
          <p className="font-mono text-xs uppercase tracking-widest text-[#0ea5e9]/70 mb-2">
            Standout Track
          </p>
          <p className="font-mono text-[#0ea5e9] text-lg">
            ▶ {drop.standout}
          </p>
        </section>

        {/* Tracklist */}
        <section>
          <div className="flex items-center gap-5 mb-8">
            <h2 className="text-xs font-mono tracking-[0.25em] uppercase text-zinc-500 shrink-0">
              Tracklist
            </h2>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <div className="flex flex-col">
            {drop.tracks.map((track) => {
              return (
                <div key={track.number} className="border-b border-zinc-800/60 last:border-0">
                  <div
                    className={`py-4 sm:py-6 flex gap-3 sm:gap-5 ${
                      track.isStandout ? "opacity-100" : "opacity-80 hover:opacity-100"
                    } transition-opacity duration-200`}
                  >
                    {/* Album art */}
                    {track.albumImageUrl ? (
                      <Image
                        src={track.albumImageUrl}
                        alt=""
                        width={48}
                        height={48}
                        className="w-12 h-12 shrink-0 object-cover mt-0.5"
                      />
                    ) : (
                      <div className="w-12 h-12 shrink-0 bg-zinc-900 mt-0.5" />
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span
                          className={`font-semibold text-base ${
                            track.isStandout ? "text-white" : "text-white"
                          }`}
                        >
                          {track.name}
                        </span>
                        {track.isStandout && (
                          <span className="font-mono text-[10px] uppercase tracking-widest text-[#f43f5e]/70">
                            standout
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
                        {track.artist}
                      </p>
                      {track.note && (
                        <p className="text-sm text-zinc-500 leading-relaxed">{track.note}</p>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-start gap-3 shrink-0 mt-0.5">
                      {/* Spotify link */}
                      {track.spotifyUrl && <a
                        href={track.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${track.name} on Spotify`}
                        className="w-7 h-7 flex items-center justify-center text-zinc-700 hover:text-[#1DB954] transition-colors duration-200"
                        title="Open on Spotify"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                      </a>}

                      {/* Apple Music — placeholder */}
                      <span
                        title="Apple Music — coming soon"
                        className="w-7 h-7 hidden sm:flex items-center justify-center text-zinc-800 cursor-not-allowed"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.064-2.31-2.18-3.043a5.022 5.022 0 0 0-1.762-.738c-.69-.148-1.387-.2-2.08-.23-.254-.01-.51-.017-.765-.017H6.999c-.31 0-.62.01-.928.027C5.3.049 4.53.168 3.82.494 2.609 1.048 1.74 1.94 1.206 3.18a6.6 6.6 0 0 0-.408 1.57 24.5 24.5 0 0 0-.16 2.55c-.004.28-.006.56-.006.84v9.71c0 .34.003.68.01 1.02.013.73.077 1.46.24 2.18.316 1.31 1.062 2.31 2.18 3.04a5.03 5.03 0 0 0 1.762.74c.69.15 1.387.2 2.08.23.31.013.62.02.928.02H17c.255 0 .51-.007.764-.02.694-.03 1.39-.08 2.08-.23a5.022 5.022 0 0 0 1.763-.74c1.116-.73 1.863-1.73 2.18-3.04.163-.72.226-1.45.24-2.18.007-.34.01-.68.01-1.02V6.964c0-.28-.002-.56-.006-.84zm-6.555 8.312l-4.77-2.754-4.772 2.754V4.986l4.771 2.754 4.771-2.754v9.45z"/>
                        </svg>
                      </span>

                      {/* YouTube Music — placeholder */}
                      <span
                        title="YouTube Music — coming soon"
                        className="w-7 h-7 hidden sm:flex items-center justify-center text-zinc-800 cursor-not-allowed"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm-2 16.5v-9l7 4.5-7 4.5z"/>
                        </svg>
                      </span>

                      {/* Tidal — placeholder */}
                      <span
                        title="Tidal — coming soon"
                        className="w-7 h-7 hidden sm:flex items-center justify-center text-zinc-800 cursor-not-allowed font-mono text-[9px] tracking-tight"
                      >
                        TIDAL
                      </span>
                    </div>
                  </div>


                </div>
              );
            })}
          </div>
        </section>

      </div>
    </main>
  );
}

