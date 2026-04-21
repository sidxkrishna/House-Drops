"use client";

import Link from "next/link";
import { DropCardProps } from "../types/drop";

export default function DropCard({ title, description, standout, href, hidden }: DropCardProps) {
  if (hidden) return null;
  return (
    <Link
      href={href}
      className="group border border-zinc-800 bg-[#111111] p-6 transition-all duration-200 block relative overflow-hidden hover:-translate-y-0.5 hover:shadow-lg hover:border-zinc-500 hover:shadow-black/40 cursor-pointer"
    >
      <h3 className="text-lg font-semibold mb-3 text-zinc-300 group-hover:text-white transition-colors duration-200">
        {title}
      </h3>
      <p className="text-sm text-zinc-500 leading-relaxed mb-6">
        {description}
      </p>
      <div className="border-t border-zinc-800 pt-4">
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-600 mb-1">
          Standout Track
        </p>
        <p className="text-sm font-mono text-[#0ea5e9]">
          ▶ {standout}
        </p>
      </div>
      <p className="font-mono text-[10px] text-zinc-700 mt-4 group-hover:text-zinc-500 transition-colors duration-200">
        if it slaps, open it and ♥ it.
      </p>
    </Link>
  );
}
