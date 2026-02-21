import { NextRequest, NextResponse } from "next/server";

function detectPlatform(url: string): string {
  if (url.includes("spotify.com"))     return "spotify";
  if (url.includes("music.apple.com")) return "appleMusic";
  if (url.includes("deezer.com"))      return "deezer";
  if (url.includes("soundcloud.com"))  return "soundcloud";
  if (url.includes("tidal.com"))       return "tidal";
  return "unknown";
}

interface Track { title: string; artist: string; cover?: string; url?: string }

/* ── Deezer (tam public API) ── */
async function fetchDeezer(url: string): Promise<{ title: string; cover: string; tracks: Track[] } | null> {
  const m = url.match(/deezer\.com\/(?:[a-z]{2}\/)?playlist\/(\d+)/);
  if (!m) return null;
  try {
    const res = await fetch(`https://api.deezer.com/playlist/${m[1]}`);
    if (!res.ok) return null;
    const data = await res.json();
    const tracks: Track[] = (data.tracks?.data ?? []).slice(0, 50).map((t: any) => ({
      title:  t.title,
      artist: t.artist?.name ?? "",
      cover:  t.album?.cover_medium ?? "",
      url:    `https://www.deezer.com/track/${t.id}`,
    }));
    return {
      title:  data.title ?? "",
      cover:  data.picture_medium ?? "",
      tracks,
    };
  } catch { return null; }
}

/* ── Spotify: client credentials akışı (SPOTIFY_CLIENT_ID / SECRET env varsa) ── */
async function getSpotifyToken(): Promise<string | null> {
  // 1) Ortam değişkenlerinden resmi token
  const clientId     = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (clientId && clientSecret) {
    try {
      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type":  "application/x-www-form-urlencoded",
          Authorization:   "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
        },
        body: "grant_type=client_credentials",
      });
      if (res.ok) {
        const d = await res.json();
        return d.access_token ?? null;
      }
    } catch { /* devam */ }
  }

  // 2) Web-player geçici token (client credentials yoksa)
  try {
    const res = await fetch(
      "https://open.spotify.com/get_access_token?reason=transport&productType=web_player",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0 Safari/537.36",
          Accept: "application/json",
        },
      },
    );
    if (res.ok) {
      const d = await res.json();
      if (d.accessToken) return d.accessToken;
    }
  } catch { /* devam */ }

  return null;
}

async function fetchSpotify(url: string): Promise<{ title: string; cover: string; tracks: Track[] } | null> {
  const m = url.match(/playlist\/([A-Za-z0-9]+)/);
  if (!m) return null;
  const playlistId = m[1];

  // ── oEmbed ile en azından başlık + kapak al ──
  let title = "";
  let cover = "";
  try {
    const oRes = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`);
    if (oRes.ok) {
      const od = await oRes.json();
      title = od.title ?? "";
      cover = od.thumbnail_url ?? "";
    }
  } catch { /* ignore */ }

  // ── Token ile tam şarkı listesi ──
  try {
    const token = await getSpotifyToken();
    if (!token) return { title, cover, tracks: [] };

    const fields = "name,images,tracks.items(track(id,name,artists(name),album(images)))";
    const apiRes = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}?fields=${encodeURIComponent(fields)}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!apiRes.ok) return { title, cover, tracks: [] };

    const data = await apiRes.json();
    if (data.name)            title = data.name;
    if (data.images?.[0]?.url) cover = data.images[0].url;

    const tracks: Track[] = (data.tracks?.items ?? [])
      .filter((i: any) => i?.track?.name)
      .slice(0, 50)
      .map((i: any) => {
        const t = i.track;
        return {
          title:  t.name,
          artist: (t.artists ?? []).map((a: any) => a.name).join(", "),
          cover:  t.album?.images?.[1]?.url ?? t.album?.images?.[0]?.url ?? "",
          url:    `https://open.spotify.com/track/${t.id}`,
        };
      });

    return { title, cover, tracks };
  } catch {
    return { title, cover, tracks: [] };
  }
}

/* ── Apple Music (oEmbed → yalnızca meta) ── */
async function fetchAppleMusic(url: string): Promise<{ title: string; cover: string; tracks: Track[] } | null> {
  try {
    const res = await fetch(
      `https://music.apple.com/oembed?url=${encodeURIComponent(url)}`,
      { headers: { "User-Agent": "MusicShare/1.0" } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return { title: data.title ?? "", cover: data.thumbnail_url ?? "", tracks: [] };
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  const platform = detectPlatform(url);

  let result: { title: string; cover: string; tracks: Track[] } | null = null;

  if (platform === "deezer")     result = await fetchDeezer(url);
  else if (platform === "spotify")    result = await fetchSpotify(url);
  else if (platform === "appleMusic") result = await fetchAppleMusic(url);

  if (!result) {
    return NextResponse.json({ title: "", cover: "", tracks: [], platform, sourceUrl: url });
  }

  return NextResponse.json({
    title:     result.title,
    cover:     result.cover,
    tracks:    result.tracks,
    platform,
    sourceUrl: url,
  });
}
