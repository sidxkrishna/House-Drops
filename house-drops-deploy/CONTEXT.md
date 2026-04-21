# House Drops — Project Context

## Brand

- **Name:** House Drops
- **Tagline:** My House Is Your House
- **Core identity:** 5 tracks. No misses.

---

## Guardrails

These are non-negotiable rules for this project and this machine.

### Work Laptop — Global Config Protection
- This is a work laptop. Other repos live at `~/Desktop/git/` and must not be broken.
- Do **not** change global npm versions, node versions, shell profiles, or system-level permissions.
- Do **not** modify `~/.npmrc`, `~/.zshrc`, `~/.bashrc`, or any global config in ways that could affect other repos.
- Keep all changes scoped to `/Users/skris136/side-projects/house-drops/`.
- **Exception:** The corporate npm registry (`centraluhg.jfrog.io`) was set globally — this is safe since `registry.npmjs.org` is blocked machine-wide by corporate DNS.

### Core Rules
- No over-engineering. Keep it simple and static.
- Keep dependencies minimal.
- All drops live in `app/data/published-drops.ts` — the single source of truth. No database, no localStorage for drop data.
- Publish workflow: Studio → pick tracks → Create Drop → **Copy JSON** → paste into `published-drops.ts` → redeploy.

### Code Conventions
- Interfaces and types go in `app/types/` as separate `.ts` files — never inline in components.
- Data goes in `app/data/` as separate `.ts` files — never inline in components or pages.
- No `src/` directory — the project uses `app/` at the root (Next.js App Router defaults).
- Keep the repo clean and minimalistic at all times.

### Code Quality
- Clarity over cleverness. Use meaningful names, no abbreviations unless universally understood.
- Comments only when the *why* is not obvious from the code itself.

---

## Tech Stack

- **Framework:** Next.js 16.2.3 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Node:** v20.19.4
- **Registry:** `centraluhg.jfrog.io` (corporate Artifactory — proxies npmjs.org)
- **Auth:** Spotify OAuth 2.0 (Authorization Code Flow), HTTP-only cookies
- **Like counter:** Upstash Redis (`@upstash/redis`) — one key per drop (`like:{id}`), incremented via REST API
- **Deployment:** Vercel — live at `https://house-drops-pp2s.vercel.app`
- **Deploy method:** rsync → `house-drops-clean/` → upload folder to GitHub web UI (no git push, no Vercel CLI — both blocked on work machine)

---

## Project Structure

```
app/
  api/
    auth/
      callback/route.ts     # OAuth callback — exchanges code for tokens, sets cookies
      logout/route.ts       # Clears Spotify auth cookies
      me/route.ts           # Returns current Spotify user info
      spotify/route.ts      # Initiates Spotify OAuth redirect
      status/route.ts       # Auth status check
    likes/
      [id]/route.ts         # GET + POST like count — backed by Upstash Redis
  components/
    DropCard.tsx            # Reusable drop card — title, description, standout track, hover nudge
    DropsGrid.tsx           # Flat grid of all non-hidden drops from published-drops.ts
    StudioLink.tsx          # Admin-only link shown when Spotify user is curator
  data/
    published-drops.ts      # ALL published drops — single source of truth. Edit here to publish.
  drops/
    user/[id]/
      page.tsx              # Drop detail page — tracklist, like button, Spotify links, Copy JSON
      edit/page.tsx         # Redirects to drop detail (edit is now done via published-drops.ts)
  hooks/
    useSpotifyAuth.ts       # Hook — reads auth state from /api/auth/status
  lib/
    drops-store.ts          # Drop accessors (getUserDrops, getUserDrop) + like dedup (localStorage)
    spotify-auth.ts         # Helpers: getAccessToken(), refreshAccessToken()
  studio/
    page.tsx                # Playlist picker — search + sort (Default/A→Z/Z→A)
    [playlistId]/page.tsx   # Track picker — search/filter/sort, Spotify embed player, create drop
    create-drop/page.tsx    # Create drop form → Copy JSON button
    drops/page.tsx          # All drops list — shows published drops with hidden badge
  types/
    drop.ts                 # Track, DropCardProps interfaces
    spotify.ts              # SpotifyPlaylist, SpotifyTrack, SpotifyPlaylistTrackItem interfaces
  globals.css
  layout.tsx
  page.tsx                  # Homepage — hero → DropsGrid → StudioLink
public/
```

---

## Design System

### Public site
- **Background:** `#0a0a0a` (near-black)
- **Card background:** `#111111`
- **Accent:** `#0ea5e9` (electric blue)
- **Body text:** `zinc-400` / `zinc-500`
- **Borders:** `zinc-800`, hover `zinc-500`
- **Font:** Geist Sans (headings/body), Geist Mono (labels, standout tracks, tags)
- **Aesthetic:** Minimal, premium, editorial — dark theme only

### Studio (admin)
- **Accent:** `#8b5cf6` (violet)
- **Background:** same `#0a0a0a` / `#111111`
- **Aesthetic:** Curator workbench — functional, fast, violet highlights

---

## Spotify Integration

- **OAuth scopes:** `playlist-read-private playlist-read-collaborative`
- **Token storage:** HTTP-only cookies (`spotify_access_token`, `spotify_refresh_token`, `spotify_user_id`)
- **Like counter:** Upstash Redis — `GET /api/likes/[id]` returns count, `POST /api/likes/[id]` increments. View counts in Upstash console → Data Browser, keys named `like:{dropId}`.
- **localStorage:** `house_drops_liked` only — per-browser like dedup. No drop data in localStorage.
- **Critical quirk:** Spotify playlist items endpoint nests the track under `.item` NOT `.track` — `SpotifyPlaylistTrackItem.item` is correct. Do not rename.
- **Admin check:** `ADMIN_SPOTIFY_ID` env var — Studio link/access only shown when logged-in user matches

---

## How The App Works

### Homepage (`app/page.tsx`)
- Hero → flat 3-col drop grid (`DropsGrid`) → Studio link
- `DropsGrid` reads `publishedDrops` directly, filters `hidden: true`, renders a `DropCard` per drop
- `StudioLink` shown only when admin Spotify user is logged in

### Drop Detail (`app/drops/user/[id]/page.tsx`)
- Tracklist with standout track highlighted
- Like button — increments Upstash Redis counter, deduped via localStorage
- **Copy JSON** button (admin only, `isAdmin = true`) — copies the drop's full JSON for pasting into `published-drops.ts`
- Before sharing publicly: flip `const isAdmin = true` → `false`

### Studio — Playlist Picker (`app/studio/page.tsx`)
- Search input filters playlists by name
- Sort: Default / A→Z / Z→A
- Only owned playlists shown

### Studio — Track Picker (`app/studio/[playlistId]/page.tsx`)
- Search/filter tracks by name or artist
- Sort: Order / Name / Artist / Shortest / Longest
- Select up to 5 tracks; selected shown as dismissible chips
- Inline Spotify embed player per row (▶/■ toggle)
- Duration shown in `m:ss`

### Studio — Create Drop (`app/studio/create-drop/page.tsx`)
- Fill title, description, pick standout track, add per-track notes
- **Copy JSON** generates a full `UserDrop` object (UUID, timestamps, `expiresAt: 2030`) and copies to clipboard
- Paste into `app/data/published-drops.ts` → rsync → redeploy

### Studio — All Drops (`app/studio/drops/page.tsx`)
- Lists all drops from `published-drops.ts`
- Shows "hidden" badge for drops with `hidden: true`
- Links to drop detail page

---

## Publish Workflow

1. Studio → pick playlist → select 5 tracks → Create Drop
2. Fill title, description, pick standout, add notes → **Copy JSON**
3. Paste JSON object into `app/data/published-drops.ts` (add to the `publishedDrops` array)
4. `rsync` to `house-drops-clean/` → upload to GitHub → Vercel auto-deploys

To hide a drop without deleting it: set `hidden: true` in `published-drops.ts` and redeploy.

---

## Environment Variables

| Key | Where |
|-----|-------|
| `SPOTIFY_CLIENT_ID` | `.env.local` + Vercel |
| `SPOTIFY_CLIENT_SECRET` | `.env.local` + Vercel |
| `SPOTIFY_REDIRECT_URI` | `.env.local` (local: `http://127.0.0.1:3000/api/auth/callback`) + Vercel (production URL) |
| `NEXT_PUBLIC_ADMIN_SPOTIFY_ID` | `.env.local` + Vercel |
| `ADMIN_SPOTIFY_ID` | `.env.local` + Vercel |
| `UPSTASH_REDIS_REST_URL` | `.env.local` + Vercel |
| `UPSTASH_REDIS_REST_TOKEN` | `.env.local` + Vercel |

---

## Go-Live Checklist

1. Flip `const isAdmin = true` → `false` in `app/drops/user/[id]/page.tsx`
2. Ensure all 7 env vars are set in Vercel dashboard
3. Set `hidden: false` on any drops you want visible in `published-drops.ts`
4. Rsync → upload `house-drops-clean/` to GitHub → Vercel deploys

