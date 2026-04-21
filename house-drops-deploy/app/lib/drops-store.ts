import { publishedDrops } from "../data/published-drops";

export type { UserDropTrack, UserDrop } from "../data/published-drops";

// ── Drop accessors ────────────────────────────────────────────────────────────

export function getUserDrops() {
  return publishedDrops;
}

export function getUserDrop(id: string) {
  return publishedDrops.find((d) => d.id === id) ?? null;
}

// ── Like dedup (localStorage, prevents double-liking per browser) ─────────────

const LIKED_KEY = "house_drops_liked";

export function hasLikedDrop(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (JSON.parse(localStorage.getItem(LIKED_KEY) ?? "[]") as string[]).includes(id);
  } catch {
    return false;
  }
}

export function recordLike(id: string): void {
  try {
    const liked = JSON.parse(localStorage.getItem(LIKED_KEY) ?? "[]") as string[];
    if (!liked.includes(id)) {
      localStorage.setItem(LIKED_KEY, JSON.stringify([...liked, id]));
    }
  } catch {}
}
