"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudioLink() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminId = process.env.NEXT_PUBLIC_ADMIN_SPOTIFY_ID;
    if (!adminId || adminId === "YOUR_SPOTIFY_USER_ID") return;

    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.id && data.id === adminId) setIsAdmin(true);
      })
      .catch(() => {});
  }, []);

  if (!isAdmin) return null;

  return (
    <Link
      href="/studio"
      className="font-mono text-xs tracking-widest uppercase border border-zinc-800 px-5 py-3 text-zinc-400 hover:border-[#0ea5e9] hover:text-[#0ea5e9] transition-colors duration-200"
    >
      Studio
    </Link>
  );
}
