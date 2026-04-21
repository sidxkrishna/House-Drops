"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import type { SpotifyTrack } from "../../types/spotify";

interface TrackNote {
  trackId: string;
  note: string;
}

export default function CreateDropPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="font-mono text-xs text-zinc-600 tracking-widest uppercase">Loading…</p>
      </main>
    }>
      <CreateDropForm />
    </Suspense>
  );
}

function CreateDropForm() {
  const [copied, setCopied] = useState(false);

  const [{ tracks, parseError }] = useState<{ tracks: SpotifyTrack[]; parseError: boolean }>(() => {
    if (typeof window === "undefined") return { tracks: [], parseError: false };
    const raw = sessionStorage.getItem("drop_tracks");
    if (!raw) return { tracks: [], parseError: true };
    try {
      return { tracks: JSON.parse(raw) as SpotifyTrack[], parseError: false };
    } catch {
      return { tracks: [], parseError: true };
    }
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [standoutId, setStandoutId] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    const raw = sessionStorage.getItem("drop_tracks");
    if (!raw) return "";
    try { return (JSON.parse(raw) as SpotifyTrack[])[0]?.id ?? ""; } catch { return ""; }
  });
  const [notes, setNotes] = useState<TrackNote[]>(() => {
    if (typeof window === "undefined") return [];
    const raw = sessionStorage.getItem("drop_tracks");
    if (!raw) return [];
    try { return (JSON.parse(raw) as SpotifyTrack[]).map((t) => ({ trackId: t.id, note: "" })); } catch { return []; }
  });

  function setNote(trackId: string, note: string) {
    setNotes((prev) => prev.map((n) => (n.trackId === trackId ? { ...n, note } : n)));
  }

  function handleCopyJson() {
    const standoutTrack = tracks.find((t) => t.id === standoutId);
    const sourcePlaylistId = typeof window !== "undefined"
      ? sessionStorage.getItem("drop_source_playlist")
      : null;
    const drop = {
      id: crypto.randomUUID(),
      title,
      description,
      standout: standoutTrack?.name ?? "",
      sourcePlaylistId: sourcePlaylistId ?? undefined,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      expiresAt: "2030-12-31T00:00:00.000Z",
      hidden: false,
      isStarter: false,
      tracks: tracks.map((t, i) => ({
        number: String(i + 1).padStart(2, "0"),
        name: t.name,
        artist: t.artists.map((a) => a.name).join(", "),
        note: notes.find((n) => n.trackId === t.id)?.note ?? "",
        isStandout: t.id === standoutId,
        previewUrl: t.preview_url ?? null,
        spotifyUrl: t.external_urls.spotify,
        albumImageUrl: t.album.images[2]?.url ?? t.album.images[0]?.url ?? null,
      })),
    };
    navigator.clipboard.writeText(JSON.stringify(drop, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (parseError) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-xs text-red-400 mb-4">No tracks found. Go back and select some.</p>
          <Link href="/studio" className="font-mono text-xs text-zinc-600 hover:text-zinc-300 uppercase tracking-widest">
            ← Back to Studio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <Link
          href="/studio"
          className="font-mono text-xs tracking-widest uppercase text-zinc-600 hover:text-zinc-300 transition-colors duration-200 block mb-10 sm:mb-16"
        >
          ← Back to Studio
        </Link>

        <section className="mb-12">
          <p className="font-mono text-xs text-[#0ea5e9] tracking-[0.3em] uppercase mb-4">New Drop</p>
          <h1 className="text-4xl font-bold tracking-tight">Create Drop</h1>
        </section>

        {/* Drop title */}
        <div className="mb-8">
          <label className="font-mono text-xs text-zinc-500 tracking-widest uppercase block mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Sunday Session"
            className="w-full bg-transparent border border-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-600"
          />
        </div>

        {/* Description */}
        <div className="mb-12">
          <label className="font-mono text-xs text-zinc-500 tracking-widest uppercase block mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short description of the vibe..."
            rows={2}
            className="w-full bg-transparent border border-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-600 resize-none"
          />
        </div>

        {/* Tracks */}
        <div className="mb-4 flex items-center gap-5">
          <h2 className="text-xs font-mono tracking-[0.25em] uppercase text-zinc-500 shrink-0">
            Tracks
          </h2>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <div className="flex flex-col gap-6 mb-12">
          {tracks.map((track, index) => (
            <div key={track.id} className="flex gap-5">
              <span className="font-mono text-xs text-zinc-700 w-5 shrink-0 pt-1">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{track.name}</p>
                <p className="text-xs font-mono text-zinc-500 mb-2">
                  {track.artists.map((a) => a.name).join(", ")}
                </p>
                <input
                  type="text"
                  value={notes.find((n) => n.trackId === track.id)?.note ?? ""}
                  onChange={(e) => setNote(track.id, e.target.value)}
                  placeholder="Add a note for this track..."
                  className="w-full bg-transparent border border-zinc-800 px-3 py-2 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-600"
                />
              </div>
              <button
                onClick={() => setStandoutId(track.id)}
                className={`font-mono text-xs shrink-0 pt-1 transition-colors duration-150 ${
                  standoutId === track.id ? "text-[#f43f5e]" : "text-zinc-700 hover:text-zinc-400"
                }`}
                title="Mark as standout"
              >
                ★
              </button>
            </div>
          ))}
        </div>

        {standoutId && (
          <p className="font-mono text-xs text-zinc-600 mb-12">
            Standout:{" "}
            <span className="text-[#0ea5e9]">
              {tracks.find((t) => t.id === standoutId)?.name}
            </span>
          </p>
        )}

        <button
          onClick={handleCopyJson}
          disabled={!title.trim()}
          className="w-full border border-[#0ea5e9] px-8 py-3 font-mono text-xs tracking-widest uppercase text-[#0ea5e9] hover:bg-[#0ea5e9] hover:text-black transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {copied ? "Copied ✓" : "Copy JSON"}
        </button>
        {copied && (
          <p className="font-mono text-xs text-zinc-600 mt-3 text-center">
            Paste into <span className="text-zinc-400">app/data/published-drops.ts</span> then redeploy.
          </p>
        )}
      </div>
    </main>
  );
}
