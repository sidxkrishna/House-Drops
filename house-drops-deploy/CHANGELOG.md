# House Drops — Changelog

All major changes in reverse chronological order.

---

## [2026-04-20] Refactor: Simplify to flat drop grid

Full cleanup — removed all section logic, time-window bucketing, and unused features:

- **Homepage** (`app/page.tsx`) — hero → flat 3-col drop grid → Studio link. No section headers.
- **`DropsGrid`** (`app/components/DropsGrid.tsx`) — new single component; renders all non-hidden drops from `published-drops.ts` in a grid. Replaces `StarterDropSection`, `FeaturedDropsSection`, `UserDropsSection`, `SavedDropsSection`.
- **`DropCard`** — stripped `blurred`, `featured`, `isStarter` props. Pure card: title → description → standout track → hover nudge.
- **`drops-store.ts`** — removed `isLatestDrop`, `isFeaturedDrop`, `isExpiredDrop`, `dropAgeMs`, TTL constants, save/bookmark helpers. Keeps only `getUserDrops`, `getUserDrop`, and like dedup.
- **`studio/drops/page.tsx`** — simplified to plain drop list with "hidden" badge and "View →" link. No status badges, no expiry display.
- **`types/drop.ts`** — removed `Drop` interface, `blurred`, `isStarter` from `DropCardProps`.
- **Deleted files**: `StarterDropSection.tsx`, `FeaturedDropsSection.tsx`, `UserDropsSection.tsx`, `SavedDropsSection.tsx`, `drop-1.ts`, `drop-2.ts`, `drop-3.ts`, `drops.ts`, `app/drops/1/`, `app/drops/2/`, `app/drops/3/`.

**Publish workflow**: Studio → pick playlist → Create Drop → Copy JSON → paste into `app/data/published-drops.ts` → redeploy.

---

## [2026-04-20] Deployment: First live deployment to Vercel
- Deployed to `https://house-drops-pp2s.vercel.app` via zip upload (no CLI)
- All 7 env vars added in Vercel dashboard: Spotify OAuth, Upstash Redis, admin Spotify ID
- `SPOTIFY_REDIRECT_URI` updated to production domain; Spotify dashboard redirect URI updated to match

## [2026-04-20] Fix: Hydration mismatch on homepage
- `app/components/StarterDropSection.tsx`, `UserDropsSection.tsx`, `FeaturedDropsSection.tsx` — moved localStorage reads from `useState` initializer into `useEffect` to prevent server/client render mismatch

## [2026-04-20] Content: Replace mock static drops with real curated data
- `app/data/drop-1.ts` — replaced placeholder "Sunday Session" with real drop **Sunday Ender** (Stay At Home, Slow Trip, Darkstar, Sunday Gathering, Stop frontin')
- `app/data/drop-2.ts` — replaced placeholder "Late Night Heat" with real drop **Ten on Tens** (Lose My Rhythm, Caminho De Dreyfus, Garota, Party Like 2999, Come Out To Play); marked `isStarter: true`
- `app/data/drop-3.ts` — replaced placeholder "Coastal Ritual" with real drop **Melodic House Vol.1** (Waste RY X Remix, Diamonds, Dogs, Closer, Wide Awake); marked `isStarter: true`
- `app/data/drops.ts` — updated homepage card list to match; all three drops set `hidden: false`

## [2026-04-20] UI: Remove "Navigate" section header above Studio link
- `app/page.tsx` — removed decorative "Navigate" label and divider line; Studio link and tagline copy remain

## [2026-04-20] Feature: Server-side like counter via Upstash Redis
- `app/api/likes/[id]/route.ts` — new GET/POST route; GET returns current count from Upstash, POST increments via `INCR like:{id}`; replaces previous localStorage-only like count
- `app/drops/user/[id]/page.tsx` — fetches live count from API on mount; POSTs to API on like; localStorage (`house_drops_liked`) still used only to prevent double-liking per browser
- `@upstash/redis` added as dependency
- `data/likes.json` removed — no longer needed

## [2026-04-20] Polish: Card hover effect + like nudge copy
- `app/components/DropCard.tsx` — card lifts on hover (`-translate-y-0.5`), drop shadow appears, border brightens more aggressively; title starts at `zinc-300` and brightens to white on hover; added `"if it slaps, open it and ♥ it."` nudge at card bottom (hidden at rest, visible on hover)

## [2026-04-20] Copy: Homepage hero tagline update
- `app/page.tsx` — added second tagline line: `"Best traxx you will hear this week. No skips, just drops."`; placeholder copy `"more links coming soon..."` replaced with `"we don't miss. Check back soon."`

## [2026-04-20] Feature: Drop lifecycle restore system
- `app/lib/drops-store.ts` — added `publishedAt?` and `expiresAt?` fields to `UserDrop`; `dropAgeMs()` now uses `publishedAt` when set; `isLatestDrop` / `isFeaturedDrop` / `isExpiredDrop` respect `expiresAt` for explicit expiry override; new `restoreDrop(id, "latest" | "featured")` function updates existing drop in place — no duplication
- `app/studio/drops/page.tsx` — expired and hidden drops show "Restore to Latest" and "Restore to Featured" buttons; list refreshes immediately after restore; "Restored" badge (rose) shown on restored drops; expiry display uses `expiresAt` when set

## [2026-04-20] Feature: Studio — All Drops panel (`/studio/drops`)
- `app/studio/drops/page.tsx` — new admin page showing every drop regardless of hidden/expired status; colour-coded status badges (Latest / Featured / Expired / Hidden / Starter); shows added date and expiry date per drop; Edit → link to edit page; accessible from Studio home via "All Drops →" button
- `app/studio/page.tsx` — added quick nav button linking to `/studio/drops`

## [2026-04-20] Feature: Manual hidden toggle for drops
- `app/types/drop.ts` + `app/lib/drops-store.ts` — `hidden?` field already existed on `UserDrop`; homepage section filters already respected it
- `app/drops/user/[id]/edit/page.tsx` — added "Hide from homepage" On/Off toggle; hidden drops are suppressed from Latest and Featured sections but direct URL remains accessible; `hidden` state saved via `updateUserDrop`

## [2026-04-20] Refactor: Studio — increase font sizes for readability
- `app/studio/page.tsx` + `app/studio/[playlistId]/page.tsx` — bumped `text-[10px]` → `text-xs`, `text-xs` → `text-sm`, `text-sm` → `text-base` throughout; heading `text-2xl` → `text-3xl`; track row album art `36×36` → `44×44`; play button `w-7 h-7` → `w-9 h-9`; row padding increased

## [2026-04-20] Refactor: Studio — remove broken playlist sort options
- `app/studio/page.tsx` — removed "Most tracks" and "Fewest tracks" sort options; `SpotifyPlaylist` no longer has a `tracks` field so these were silently no-ops; sort now offers Default / A→Z / Z→A only

## [2026-04-20] Feature: Studio redesign — violet workbench aesthetic
- `app/studio/page.tsx` — full rebuild: violet accent (`#8b5cf6`), search input, sort buttons (Default / A→Z / Z→A), playlist name + description rows; playlist thumbnails removed (Spotify CDN not in allowed hosts)
- `app/studio/[playlistId]/page.tsx` — full rebuild: track search/filter by name or artist, sort (Order / Name / Artist / Shortest / Longest), selected tracks shown as dismissible chips with "Clear" button, inline Spotify embed player per row (▶/■ toggle), duration shown in `m:ss`

## [2026-04-20] Fix: Show track duration in Studio playlist view
- `app/studio/[playlistId]/page.tsx` — duration (`m:ss`) shown below artist name in track rows; `duration_ms` was already in the type but not surfaced in the UI

## [2026-04-20] Refactor: Remove popularity feature
- Reverted all popularity-related changes: removed `popularity` from `SpotifyTrack` type, removed popularity bar + duration block from studio track UI, reverted tracks API route to single-step fetch (no batch enrichment)

## [2026-04-20] Fix: Playlist tracks API — only own playlists shown in Studio
- `app/api/playlists/route.ts` — filters returned playlists to those owned by the current user (`spotify_user_id` cookie); added `TODO` comment for future support of followed/saved playlists
- `app/types/spotify.ts` — added `owner` and `tracks` fields to `SpotifyPlaylist` interface
- `app/studio/page.tsx` — playlist rows now show owner name + track count instead of description

## [2026-04-20] Fix: Fetch all playlists (pagination)
- `app/api/playlists/route.ts` — replaced single-page fetch with full pagination loop using Spotify's `next` cursor; previously silently cut off at 50 playlists

## [2026-04-20] Feature: Drop expiry / auto-promotion
- `app/lib/drops-store.ts` — added `isLatestDrop()`, `isFeaturedDrop()`, `isExpiredDrop()` helpers; constants `LATEST_TTL_MS` (1 day) and `FEATURED_TTL_MS` (7 days)
- `app/components/UserDropsSection.tsx` — filters to drops < 1 day old only
- `app/components/FeaturedDropsSection.tsx` — filters to drops between 1–7 days old; removed old `slice(3)` overflow logic
- Drops > 7 days old are hidden from all sections but remain accessible via Saved Drops

## [2026-04-20] Feature: isStarter toggle on edit page
- `app/drops/user/[id]/edit/page.tsx` — added "Start Here drop" On/Off toggle row; saves `isStarter` flag via `updateUserDrop`

## [2026-04-20] Feature: Start Here section supports multiple drops
- `app/components/StarterDropSection.tsx` — changed from single-starter to multi-starter; renders all drops with `isStarter: true` in a 3-col grid

## [2026-04-20] Feature: Save Drop + Start Here sections
- `app/lib/drops-store.ts` — added `SAVED_KEY`, `getSavedHrefs()`, `toggleSaveHref()`, `isSavedHref()`; save state persisted in localStorage; dispatches `saved-drops-changed` event on change
- `app/types/drop.ts` + `app/lib/drops-store.ts` — added `isStarter?: boolean` to `Drop` and `UserDrop`
- `app/components/DropCard.tsx` — added `☆`/`★` save button (top-right, amber when saved); reads saved state on mount; prevents link navigation on click
- `app/components/StarterDropSection.tsx` — new component; shows drops with `isStarter: true` under "Start Here / New to house?" heading; hidden when none set
- `app/components/SavedDropsSection.tsx` — new component; reactively syncs saved hrefs from localStorage (same-tab + cross-tab); hidden when empty
- `app/page.tsx` — added `StarterDropSection` above Latest Drops and `SavedDropsSection` below Featured Drops

---

## [2026-04-19] Fix: Mobile responsiveness across all pages
- All pages — reduced horizontal padding to `px-4` on mobile (`sm:px-6` at breakpoint), vertical padding to `py-12` (`sm:py-20`)
- `app/page.tsx` — hero heading scales down to `text-5xl` on mobile; hero section margin reduced
- `app/drops/user/[id]/page.tsx` — top bar gap tightened on small screens; track row padding reduced; Apple Music / YouTube Music / Tidal placeholder icons hidden on mobile (`hidden sm:flex`) to reduce clutter
- `app/studio/[playlistId]/page.tsx` — same placeholder icon hiding on mobile
- `app/drops/user/[id]/edit/page.tsx` — danger zone confirm-delete buttons stack vertically on mobile
- `app/lib/drops-store.ts` — fixed pre-existing TS error: excluded `likes` from `Omit` in `saveUserDrop` signature

## [2026-04-19] Feature: Placeholder text in Navigate section
- `app/page.tsx` — added cheeky placeholder line below nav links: "more links coming soon. or not. we'll see how motivated we are."

## [2026-04-19] Feature: `blurred` flag on drop cards
- `app/types/drop.ts` — added `blurred?: boolean` to `Drop` and `DropCardProps`
- `app/lib/drops-store.ts` — added `blurred?: boolean` to `UserDrop`
- `app/components/DropCard.tsx` — when `blurred` is true: title stays sharp, description + standout track blurred and non-interactive, card link disabled
- `app/components/UserDropsSection.tsx` — passes `blurred` from drop data
- `app/components/FeaturedDropsSection.tsx` — passes `blurred` from drop data

## [2026-04-19] Feature: `hidden` flag on drop cards
- `app/types/drop.ts` — added `hidden?: boolean` to `Drop` and `DropCardProps`
- `app/lib/drops-store.ts` — added `hidden?: boolean` to `UserDrop`
- `app/components/DropCard.tsx` — returns `null` when `hidden` is true
- `app/components/UserDropsSection.tsx` — filters out hidden drops before slicing top 3
- `app/components/FeaturedDropsSection.tsx` — filters out hidden user drops; static drops also filtered by `hidden`
- `app/data/drops.ts` — all three placeholder static drops set to `hidden: true` by default

## [2026-04-19] Refactor: Admin controls behind feature flag
- `app/drops/user/[id]/page.tsx` — replaced Spotify auth check with a simple `const isAdmin = true` flag; removed `useEffect` and `/api/auth/me` fetch
- Edit + Delete buttons visible when flag is `true`; flip to `false` before going live

## [2026-04-19] Feature: Dynamic Featured Drops section
- Created `app/components/FeaturedDropsSection.tsx` — client component that merges overflow user drops (4th+) with static drops, renders as a grid; hidden when empty
- `app/page.tsx` — imports and renders `FeaturedDropsSection` below `UserDropsSection`, passing `staticDrops={drops}`

## [2026-04-19] Feature: Admin-only Studio link + middleware
- Created `app/components/StudioLink.tsx` — client component that fetches `/api/auth/me` and only renders the Studio link when the logged-in user matches `NEXT_PUBLIC_ADMIN_SPOTIFY_ID`
- Created `app/api/auth/me/route.ts` — returns `{ id }` of the current Spotify session; `{ id: null }` with 401 if unauthenticated
- Created `middleware.ts` — blocks `/studio/*` and `/drops/user/*/edit` for non-admins; redirects to `/`; reads `spotify_user_id` cookie set at OAuth callback
- `app/api/auth/callback/route.ts` — sets `spotify_user_id` HTTP-only cookie (30-day expiry) after token exchange

## [2026-04-19] Refactor: Electric blue accent colour (#0ea5e9)
- Global search-and-replace: replaced all amber/gold (`#c9a84c`, `amber-*`) with electric blue (`#0ea5e9`)
- `app/components/DropCard.tsx` — featured card border/bg/standout track value now blue
- Standout tag label and liked heart/count use rose/red (`#f43f5e`); everything else blue

---

## [2026-04-19] Refactor: Homepage layout reorganisation
- `app/page.tsx` — moved user drops above static drops; static drops section renamed from "Latest Drops" to "Featured Drops"
- `app/components/UserDropsSection.tsx` — renamed section heading from "My Drops" to "Latest Drops"; removed `mt-16` margin (now first content section after hero)

## [2026-04-19] Feature: Highlighted card for most recent drop
- `app/components/DropCard.tsx` — added optional `featured` prop; featured card renders with amber-tinted border, subtle amber background wash, and a "Latest" label above the title
- `app/components/UserDropsSection.tsx` — passes `featured={index === 0}` so only the newest drop is highlighted

## [2026-04-19] Feature: Like button on drop detail page
- `app/lib/drops-store.ts` — added `likes: number` field to `UserDrop`; added `likeUserDrop()`, `hasLikedDrop()`, and `recordLike()` helpers; likes and liked state both persisted in localStorage
- `app/drops/user/[id]/page.tsx` — added heart like button below description; one-like-per-browser enforcement; count shown next to button; button dims and locks after liking

## [2026-04-19] Refactor: Remove drop page nav links from homepage
- `app/page.tsx` — removed individual drop links (Drop 01/02/03) from the Navigate section; kept only the Studio link

## [2026-04-19] Feature: Streaming service placeholder links on tracks
- `app/drops/user/[id]/page.tsx` — added dimmed placeholder icons for Apple Music, YouTube Music, and Tidal next to the Spotify link on each track; tooltips say "coming soon"
- `app/studio/[playlistId]/page.tsx` — same placeholders added to the studio track list

## [2026-04-19] Refactor: Remove play buttons, keep Spotify link only
- `app/drops/user/[id]/page.tsx` — removed embed toggle button, iframe, and all related state (`expandedId`, `toggleEmbed`)
- `app/studio/[playlistId]/page.tsx` — removed embed toggle button, iframe, and all related state

## [2026-04-19] Feature: Delete drop from detail page
- `app/drops/user/[id]/page.tsx` — added inline two-step delete confirmation in the top-right header
  - Shows **Delete · Edit** links by default
  - Clicking Delete replaces them with **Sure? · Yes, delete · Cancel**
  - Confirming calls `deleteUserDrop(id)` and redirects to `/`
- Added `useRouter` import and `deleteUserDrop` import to the detail page

## [2026-04-19] Feature: Build a Drop from playlist tracks
- `app/api/playlists/[id]/tracks/route.ts` — added full pagination (loops `next` until null, returns all items)
- `app/studio/[playlistId]/page.tsx` — added track selection UI: click to toggle, amber highlight + ✓ when selected, `X / 5 selected` counter, warning message when 5-track limit exceeded, sticky "Create Drop — N tracks" button
- Created `app/studio/create-drop/page.tsx` — drop draft form: title, description, per-track notes, standout picker (★), Save Drop button (logs to console for now)

## [2026-04-19] Debug: playlist track count showing 0
- Added temporary debug logging to `app/api/playlists/route.ts` to inspect the `tracks` field shape returned by Spotify's `/v1/me/playlists` endpoint

## [2026-04-19] Fix: `/items` endpoint field name mismatch
- Spotify's `/v1/playlists/{id}/items` returns `item.item` not `item.track`
- Updated `SpotifyPlaylistTrackItem` type in `app/types/spotify.ts` to use `item` field
- Updated mapping in `app/studio/[playlistId]/page.tsx` to read `item.item`

## [2026-04-19] Debug: 403 on playlist tracks fetch
- Switched tracks API endpoint from deprecated `/v1/playlists/{id}/tracks` to `/v1/playlists/{id}/items`
- Added debug logging (token length, URL, status, body) to `app/api/playlists/[id]/tracks/route.ts`
- Fixed null/undefined guard in playlist page: `t != null && "name" in t`

## [2026-04-19] Refactor: auth state management overhaul
- Created `app/lib/spotify-auth.ts` — `getAccessToken()` server utility, single source of truth
- Created `app/api/auth/status/route.ts` — lightweight 200/401 auth check endpoint
- Created `app/hooks/useSpotifyAuth.ts` — `useSpotifyAuth()` client hook returning `"loading" | "authenticated" | "unauthenticated"`
- Fixed `app/api/auth/callback/route.ts` — redirect base now derived from `SPOTIFY_REDIRECT_URI` env var (fixes localhost vs 127.0.0.1 state_mismatch bug)
- Fixed `app/api/auth/spotify/route.ts` — state cookie now set on response object, not `cookieStore` directly (Next.js 16 requirement)
- Fixed `app/api/auth/logout/route.ts` — cookies now deleted on response object
- Updated `app/api/playlists/route.ts` and `app/api/playlists/[id]/tracks/route.ts` to use `getAccessToken()`
- Updated `app/studio/page.tsx` and `app/studio/[playlistId]/page.tsx` to use `useSpotifyAuth()` hook
- Fixed import path: `app/api/playlists/[id]/tracks/route.ts` uses `../../../../lib/spotify-auth`
- Fixed import path: `app/api/playlists/route.ts` uses `../../lib/spotify-auth`
- Added navigation links section to homepage (`app/page.tsx`)

## [2026-04-19] Fix: SpotifyPlaylist.tracks null safety
- Changed `playlist.tracks.total` → `playlist.tracks?.total ?? 0` in `app/studio/page.tsx`
- Updated `SpotifyPlaylist.tracks` type to `{ total: number } | null` in `app/types/spotify.ts`

## [2026-04-19] Feature: /studio/[playlistId] track listing page
- Created `app/studio/[playlistId]/page.tsx` — client component fetching tracks via `/api/playlists/[id]/tracks`
- Simplified `app/studio/page.tsx` — removed inline tracks state/view, `selectPlaylist` now calls `router.push`
- Created `app/api/auth/logout/route.ts` — clears Spotify cookies, redirects to `/studio`

## [2026-04-19] Feature: Spotify OAuth integration
- Created `app/api/auth/spotify/route.ts` — initiates OAuth, sets CSRF state cookie
- Created `app/api/auth/callback/route.ts` — validates state, exchanges code for tokens, sets `spotify_access_token` and `spotify_refresh_token` HTTP-only cookies
- Created `app/api/playlists/route.ts` — fetches user's playlists using access token
- Created `app/api/playlists/[id]/tracks/route.ts` — fetches tracks for a playlist
- Created `app/types/spotify.ts` — TypeScript interfaces for all Spotify API shapes
- Created `app/studio/page.tsx` — sign in → playlists → tracks UI (client component)
- Added `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REDIRECT_URI` to `.env.local`
- Added `allowedDevOrigins: ["127.0.0.1"]` to `next.config.ts`
- Added `NODE_TLS_REJECT_UNAUTHORIZED=0` to dev script in `package.json` (corporate proxy SSL bypass)

## [2026-04-19] Refactor: clean folder structure
- Moved TypeScript interfaces to `app/types/drop.ts`
- Moved drop data to `app/data/drops.ts`, `app/data/drop-1.ts`, `app/data/drop-2.ts`, `app/data/drop-3.ts`
- Created `app/components/DropCard.tsx` — reusable drop card component

## [2026-04-19] Feature: Drop detail pages
- Created `app/drops/1/page.tsx`, `app/drops/2/page.tsx`, `app/drops/3/page.tsx`
- Each page shows title, description, standout callout, numbered tracklist

## [2026-04-19] Init: Homepage
- Scaffolded Next.js 16.2.3 app (App Router, Turbopack, TypeScript, Tailwind)
- Built `app/page.tsx` — hero section + "Latest Drops" grid
- Design: `#0a0a0a` bg, `#111111` cards, `#c9a84c` amber accent, Geist fonts
