/**
 * Published drops — the single source of truth for all public drops.
 *
 * WORKFLOW:
 *   1. Use Studio to pick tracks and create a drop.
 *   2. On the drop detail page, hit "Copy JSON" (admin only).
 *   3. Paste the output as a new entry in this array.
 *   4. Re-zip and redeploy to Vercel.
 *
 * Rules:
 *   - `hidden: true`  → drop exists but won't show on homepage
 *   - `isStarter: true` → shows in "Start Here" section (no time limit)
 *   - `expiresAt: "2030-12-31T00:00:00.000Z"` → pinned (never auto-expires)
 *   - `publishedAt`  → controls which section the drop starts in:
 *       today         → Latest Drops first, then Featured after 24 hours
 *       yesterday     → Featured Drops immediately
 */

export interface UserDropTrack {
  number: string;
  name: string;
  artist: string;
  note?: string;
  isStandout: boolean;
  previewUrl: string | null;
  spotifyUrl?: string;
  albumImageUrl?: string;
}

export interface UserDrop {
  id: string;
  title: string;
  description: string;
  standout: string;
  sourcePlaylistId?: string;
  tracks: UserDropTrack[];
  hidden?: boolean;
  isStarter?: boolean;
  createdAt: string;
  publishedAt?: string;
  expiresAt?: string;
}

export const publishedDrops: UserDrop[] = [
  {
    id: "8392b9e4-9035-492d-9c54-caa90c5573d5",
    title: "Drop 001 - Ten on Tens",
    description: "No fillers. Just repeat worthy tracks",
    standout: "Lose My Rhythm",
    sourcePlaylistId: "7wnC1ihg48Q60PsySqJSPD",
    tracks: [
      {
        number: "01",
        name: "Lose My Rhythm",
        artist: "Desert Sound Colony",
        note: "hold on tightttt",
        isStandout: true,
        previewUrl: null,
        spotifyUrl: "https://open.spotify.com/track/7sfQmV59SgMYfSvZCpxHDL",
        albumImageUrl:
          "https://i.scdn.co/image/ab67616d00004851bc379b42085f3f41e72a98da",
      },
      {
        number: "02",
        name: "Caminho De Dreyfus",
        artist: "Red Axes, Abrão",
        note: "follow the law & order",
        isStandout: false,
        previewUrl: null,
        spotifyUrl: "https://open.spotify.com/track/6Vu4teXIYQf4y5MRTWMRW4",
        albumImageUrl:
          "https://i.scdn.co/image/ab67616d00004851cb57608d74608a274377085d",
      },
      {
        number: "03",
        name: "Garota",
        artist: "gleb filipchenkow, Noemy Abrantes",
        note: "only vibes, super chill and mellow",
        isStandout: false,
        previewUrl: null,
        spotifyUrl: "https://open.spotify.com/track/0WbGHw9j8KJervmlqlWBYb",
        albumImageUrl:
          "https://i.scdn.co/image/ab67616d000048511494b97e80f3530b90abf52f",
      },
      {
        number: "04",
        name: "Party Like 2999 - Dino Lenny Remix",
        artist: "Man & Master, Dino Lenny",
        note: "WE LIKE TO PARTYYY",
        isStandout: false,
        previewUrl: null,
        spotifyUrl: "https://open.spotify.com/track/06YHTZK2a7smgJtSGVuWJi",
        albumImageUrl:
          "https://i.scdn.co/image/ab67616d000048518c689e2bdfa55ad991670c51",
      },
      {
        number: "05",
        name: "Come Out To Play - Santé Remix",
        artist: "ANËK, Santé",
        note: "I love this track.",
        isStandout: false,
        previewUrl: null,
        spotifyUrl: "https://open.spotify.com/track/3A3U0RsIsHaqdSAwA1ndMl",
        albumImageUrl:
          "https://i.scdn.co/image/ab67616d00004851080fe5b3ee0cae94cd5e70f2",
      },
    ],
    hidden: false,
    isStarter: true,
    createdAt: "2026-04-19T15:47:15.325Z",
    publishedAt: "2026-04-20T12:00:00.000Z",
    expiresAt: "2030-12-31T00:00:00.000Z",
  },

  {
    id: "189a8b26-a6d7-4a31-aeed-28a68bc17cb3",
    title: "Drop 001 - Sunday Ender",
    description: "Ease into the week. Nothing loud. Just right.",
    standout: "Stay At Home",
    sourcePlaylistId: "2qIloFkuzQxALnPZohqcEb",
    tracks: [
      {
        number: "01",
        name: "Stay At Home",
        artist: "SWIN",
        note: "I f w the lyrics",
        isStandout: true,
        previewUrl: null,
        spotifyUrl: "https://open.spotify.com/track/6ifdsiPLxURPwPd24Fm9Wv",
        albumImageUrl:
          "https://i.scdn.co/image/ab67616d00004851cd3a59fe224717e3e140e95b",
      },
      {
        number: "02",
        name: "Slow Trip",
        artist: "Dionigi",
        note: "Its got some funk",
        isStandout: false,
        previewUrl: null,
        spotifyUrl: "https://open.spotify.com/track/704i0xLfYSJXr6BbG47FLI",
        albumImageUrl:
          "https://i.scdn.co/image/ab67616d00004851f07de8b53d27866d8d1d0efc",
      },
      {
        number: "03",
        name: "Darkstar",
        artist: "Morgan Geist",
        note: "beatssss",
        isStandout: false,
        previewUrl: null,
        spotifyUrl: "https://open.spotify.com/track/41WkR0xldYbVGpSNcZOG41",
        albumImageUrl:
          "https://i.scdn.co/image/ab67616d00004851b22ad67d6d00267645a35c6c",
      },
      {
        number: "04",
        name: "Sunday Gathering - Dyed Soundorom Remix",
        artist: "Terence :Terry:, Hanfry Martinez, Dyed Soundorom",
        note: "sunday monday funday",
        isStandout: false,
        previewUrl: null,
        spotifyUrl: "https://open.spotify.com/track/4ClXjmSUD1VLdv81xqTUPy",
        albumImageUrl:
          "https://i.scdn.co/image/ab67616d000048519aadd1f44456d4e19ac71191",
      },
      {
        number: "05",
        name: "Stop frontin'",
        artist: "Lawnchair Generals",
        note: "surprise element",
        isStandout: false,
        previewUrl: null,
        spotifyUrl: "https://open.spotify.com/track/5ZyzKU5JZ2C7WcZ4ZWQcjQ",
        albumImageUrl:
          "https://i.scdn.co/image/ab67616d0000485158f66951a31d8bc5f7e664bd",
      },
    ],
    hidden: false,
    isStarter: false,
    createdAt: "2026-04-19T14:11:29.712Z",
    publishedAt: "2026-04-20T12:00:00.000Z",
    expiresAt: "2030-12-31T00:00:00.000Z",
  },

  {
    id: "4932578f-134f-4542-ae04-dda5e8a32a7e",
    title: "Drop 001 - No Skip Club",
    description: "These tracks wil make you groove.",
    standout: "Try A Little Tenderness",
    sourcePlaylistId: "2hD0xzlPRU5d91aqwjqn3F",
    createdAt: "2026-04-21T19:02:48.265Z",
    publishedAt: "2026-04-21T19:02:48.266Z",
    expiresAt: "2030-12-31T00:00:00.000Z",
    hidden: false,
    isStarter: false,
    tracks: [
      {
        number: "01",
        name: "Try A Little Tenderness",
        artist: "Sandy Rivera",
        note: "a 12/10 imo ",
        isStandout: true,
        previewUrl: null,
        spotifyUrl: "https://open.spotify.com/track/0mO92QLlG7CyzIxgSY6S2j",
        albumImageUrl:
          "https://i.scdn.co/image/ab67616d000048517ec7ecc2572c358eb5ae0442",
      },
      {
        number: "02",
        name: "Cardiology (Isolée Mix) - Mixed",
        artist: "Recloose",
        note: "makes my heart happy",
        isStandout: false,
        previewUrl: null,
        spotifyUrl: "https://open.spotify.com/track/4AC2gUCUq3n1Iaxz2aYskJ",
        albumImageUrl:
          "https://i.scdn.co/image/ab67616d00004851612d3ad65f7518b8fcc2286a",
      },
      {
        number: "03",
        name: "Sorry I Am Late - Richy Ahmed Remix",
        artist: "Kollektiv Turmstrasse, Richy Ahmed",
        note: "we love remixes",
        isStandout: false,
        previewUrl: null,
        spotifyUrl: "https://open.spotify.com/track/5DowtLpR23OAwtgUt8sQXk",
        albumImageUrl:
          "https://i.scdn.co/image/ddf12ac9917a39bee113922297ebf47f595ed593",
      },
      {
        number: "04",
        name: "Boss Electro",
        artist: "Lauer",
        note: "Boss fight incoming",
        isStandout: false,
        previewUrl: null,
        spotifyUrl: "https://open.spotify.com/track/5KvUzl585mV9RefQPZ8M0u",
        albumImageUrl:
          "https://i.scdn.co/image/ab67616d00004851894c95116bed0a0e43f3ee09",
      },
      {
        number: "05",
        name: "Junk",
        artist: "Veitengruber",
        note: "a fun mix?",
        isStandout: false,
        previewUrl: null,
        spotifyUrl: "https://open.spotify.com/track/3Kg4hRzGcg7b1mHPdmICaY",
        albumImageUrl:
          "https://i.scdn.co/image/ab67616d00004851d9d6a2e7a022bff8cb9b652f",
      },
    ],
  },

  // {
  //   id: "626974d4-f42a-4d8b-beed-5334f76dd1f4",
  //   title: "Melodic House Vol.1",
  //   description: "This is where it starts. Stay here.",
  //   standout: "Waste - RY X Remix",
  //   sourcePlaylistId: "5YO9Wd5D58TCghKXePQh4l",
  //   tracks: [
  //     {
  //       number: "01",
  //       name: "Waste - RY X Remix",
  //       artist: "Rhye, RY X",
  //       note: "a long but a special one",
  //       isStandout: true,
  //       previewUrl: null,
  //       spotifyUrl: "https://open.spotify.com/track/08HR9PoLSeovgXWvJEZrvi",
  //       albumImageUrl: "https://i.scdn.co/image/ab67616d00004851d266d98f5f9a0ba1fd1aeac1",
  //     },
  //     {
  //       number: "02",
  //       name: "Diamonds - Original Mix",
  //       artist: "Lane 8, Solomon Grey",
  //       note: "",
  //       isStandout: false,
  //       previewUrl: null,
  //       spotifyUrl: "https://open.spotify.com/track/1Ao2eaKcWOnOz8DFNIobNP",
  //       albumImageUrl: "https://i.scdn.co/image/ab67616d00004851ec072d0081efc8c7b8dc4b8d",
  //     },
  //     {
  //       number: "03",
  //       name: "Dogs",
  //       artist: "HVOB",
  //       note: "",
  //       isStandout: false,
  //       previewUrl: null,
  //       spotifyUrl: "https://open.spotify.com/track/2dLYHB5JJVAOE1NKQnEkIi",
  //       albumImageUrl: "https://i.scdn.co/image/ab67616d000048514fddf93b3a652bb9ed406512",
  //     },
  //     {
  //       number: "04",
  //       name: "Closer",
  //       artist: "TWO LANES",
  //       note: "",
  //       isStandout: false,
  //       previewUrl: null,
  //       spotifyUrl: "https://open.spotify.com/track/3o1zrW0DOGDIM7Inw28TyR",
  //       albumImageUrl: "https://i.scdn.co/image/ab67616d00004851478497e628e8d5f636b47b2a",
  //     },
  //     {
  //       number: "05",
  //       name: "Wide Awake",
  //       artist: "TWO LANES",
  //       note: "",
  //       isStandout: false,
  //       previewUrl: null,
  //       spotifyUrl: "https://open.spotify.com/track/5HtnwwKxLX32MEyAH71Vtm",
  //       albumImageUrl: "https://i.scdn.co/image/ab67616d000048512faf631b34405e38aafbad83",
  //     },
  //   ],
  //   hidden: false,
  //   isStarter: true,
  //   createdAt: "2026-04-19T21:16:54.478Z",
  //   publishedAt: "2026-04-20T12:00:00.000Z",
  //   expiresAt: "2030-12-31T00:00:00.000Z",
  // },

  // {
  //   id: "3e7a0331-0757-42e2-800b-b1cbad55a698",
  //   title: "Melodic House Vol.2",
  //   description: "Tracks that got me into Tech+House. A continuation of this volume.",
  //   standout: "Fingerprint",
  //   sourcePlaylistId: "5YO9Wd5D58TCghKXePQh4l",
  //   tracks: [
  //     {
  //       number: "01",
  //       name: "Fingerprint",
  //       artist: "Lane 8",
  //       note: "this is going to leave a mark haha!",
  //       isStandout: true,
  //       previewUrl: null,
  //       spotifyUrl: "https://open.spotify.com/track/1Hy3CoHThqF0NBSmkmeR21",
  //       albumImageUrl: "https://i.scdn.co/image/ab67616d00004851e96a7cf14f2d32c679d86e02",
  //     },
  //     {
  //       number: "02",
  //       name: "go with u",
  //       artist: "BAYNK",
  //       note: "",
  //       isStandout: false,
  //       previewUrl: null,
  //       spotifyUrl: "https://open.spotify.com/track/4PdLup4OaCGktZG8cvbkBz",
  //       albumImageUrl: "https://i.scdn.co/image/ab67616d000048513f863eb5ebcf1655dd4472eb",
  //     },
  //     {
  //       number: "03",
  //       name: "Somewhere (feat. Octavian)",
  //       artist: "The Blaze, Octavian",
  //       note: "",
  //       isStandout: false,
  //       previewUrl: null,
  //       spotifyUrl: "https://open.spotify.com/track/1Tzq2as6CZlNfwRoYXM5JK",
  //       albumImageUrl: "https://i.scdn.co/image/ab67616d00004851b70a72acb1cf0dab0135516b",
  //     },
  //     {
  //       number: "04",
  //       name: "Still Dre - Skydiver Edit",
  //       artist: "Liam Van Dyke",
  //       note: "",
  //       isStandout: false,
  //       previewUrl: null,
  //       spotifyUrl: "https://open.spotify.com/track/7aw5MCuRHK26MkNnoxlgph",
  //       albumImageUrl: "https://i.scdn.co/image/ab67616d00004851e1143047bd511d8d9afb2cbc",
  //     },
  //     {
  //       number: "05",
  //       name: "Nothing Around Us",
  //       artist: "Mathame, Lyke",
  //       note: "",
  //       isStandout: false,
  //       previewUrl: null,
  //       spotifyUrl: "https://open.spotify.com/track/6DuTXPpowLA1vk8fzqaLtB",
  //       albumImageUrl: "https://i.scdn.co/image/ab67616d0000485143f8c50373afaaa7cdcdce96",
  //     },
  //   ],
  //   hidden: true,
  //   isStarter: false,
  //   createdAt: "2026-04-19T21:19:44.612Z",
  //   publishedAt: "2026-04-20T12:00:00.000Z",
  //   expiresAt: "2030-12-31T00:00:00.000Z",
  // },
];
