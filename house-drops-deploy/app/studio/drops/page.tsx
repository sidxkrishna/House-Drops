"use client";

import Link from "next/link";
import { getUserDrops, type UserDrop } from "../../lib/drops-store";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function StudioDropsPage() {
  const drops = getUserDrops();

  return (
    <main className="min-h-screen bg-[#0c0c0e] text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        <div className="flex items-center justify-between mb-8">
          <Link
            href="/studio"
            className="font-mono text-sm tracking-widest uppercase text-zinc-600 hover:text-zinc-300 transition-colors duration-200"
          >
            ← Studio
          </Link>
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-violet-500 bg-violet-500/10 px-2 py-1 rounded">
            Studio
          </span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">All Drops</h1>
          <p className="font-mono text-sm text-zinc-600 mt-1">{drops.length} drop{drops.length !== 1 ? "s" : ""} total</p>
        </div>

        {drops.length === 0 && (
          <p className="font-mono text-sm text-zinc-700 py-8">No drops yet. Create one from the Playlists page.</p>
        )}

        <div className="flex flex-col divide-y divide-zinc-800/50">
          {drops.map((drop: UserDrop) => (
            <div key={drop.id} className="py-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-base font-medium text-zinc-200 truncate">{drop.title}</p>
                  {drop.hidden && (
                    <span className="font-mono text-[10px] tracking-wide uppercase border px-1.5 py-0.5 text-amber-400 border-amber-500/30 bg-amber-500/10">
                      hidden
                    </span>
                  )}
                </div>
                <p className="font-mono text-xs text-zinc-600 truncate">{drop.description}</p>
                <p className="font-mono text-xs text-zinc-700 mt-1">Added {fmtDate(drop.createdAt)}</p>
              </div>
              <Link
                href={`/drops/user/${drop.id}`}
                className="font-mono text-xs tracking-widest uppercase text-zinc-600 hover:text-violet-400 transition-colors duration-200 shrink-0 pt-1"
              >
                View →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
