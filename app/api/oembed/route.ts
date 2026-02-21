import { NextRequest, NextResponse } from "next/server";

// ─── helpers ───────────────────────────────────────────────────────────────

async function fetchWithTimeout(
  url: string,
  opts: RequestInit = {},
  ms = 10000
): Promise<Response> {
  return fetch(url, { ...opts, signal: AbortSignal.timeout(ms) });
}

interface TrackInfo {
  title: string;
  artist: string;
  cover: string | null;
}

function detectPlatform(url: string): string {
  if (url.includes("spotify.com")) return "spotify";
  if (url.includes("music.apple.com")) return "apple";
  if (url.includes("youtube.com/") || url.includes("youtu.be/") || url.includes("music.youtube.com/")) return "youtube";
  if (url.includes("soundcloud.com")) return "soundcloud";
  if (url.includes("deezer.com")) return "deezer";
  if (url.includes("bandcamp.com")) return "bandcamp";
  if (url.includes("tidal.com")) return "tidal";
  return "unknown";
}

// ─── Spotify ───────────────────────────────────────────────────────────────

function extractSpotifyTrackId(url: string): string | null {
  const match = url.match(/spotify\.com\/(?:intl-[a-z]{2}\/)?track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

function normalizeSpotifyUrl(url: string): string {
  return url.replace(/\/intl-[a-z]{2}\//, "/");
}

async function fetchSpotify(url: string): Promise<TrackInfo | null> {
  // 1) song.link
  try {
    const cleanUrl = normalizeSpotifyUrl(url);
    const slRes = await fetchWithTimeout(
      `https://api.song.link/v1alpha1/links?url=${encodeURIComponent(cleanUrl)}`
    );
    if (slRes.ok) {
      const slData = await slRes.json();
      const entities = slData.entitiesByUniqueId || {};
      const key = Object.keys(entities)[0];
      if (key) {
        const e = entities[key];
        if (e.title && e.artistName) {
          return { title: e.title, artist: e.artistName, cover: e.thumbnailUrl || null };
        }
      }
    }
  } catch { /* devam */ }

  // 2) Spotify embed __NEXT_DATA__
  const trackId = extractSpotifyTrackId(url);
  if (trackId) {
    try {
      const res = await fetchWithTimeout(
        `https://open.spotify.com/embed/track/${trackId}`,
        { headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html" } }
      );
      if (res.ok) {
        const html = await res.text();
        const m = html.match(/<script\s+id="__NEXT_DATA__"[^>]*>(.+?)<\/script>/i);
        if (m) {
          const json = JSON.parse(m[1]);
          const entity = json?.props?.pageProps?.state?.data?.entity;
          if (entity) {
            return {
              title: entity.title || entity.name || "",
              artist: entity.artists?.map((a: { name: string }) => a.name).join(", ") || "",
              cover: entity.coverArt?.sources?.[0]?.url || null,
            };
          }
        }
      }
    } catch { /* devam */ }
  }

  // 3) oEmbed fallback
  try {
    const oRes = await fetchWithTimeout(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
    );
    if (oRes.ok) {
      const d = await oRes.json();
      return { title: d.title || "", artist: "", cover: d.thumbnail_url || null };
    }
  } catch { /* devam */ }

  return null;
}

// ─── YouTube ───────────────────────────────────────────────────────────────

function cleanYouTubeTitle(raw: string): { title: string; artist: string } {
  const cleaned = raw
    .replace(/\s*\(Official\s*(Music\s*)?Video\)/i, "")
    .replace(/\s*\[Official\s*(Music\s*)?Video\]/i, "")
    .replace(/\s*\(Official\s*Audio\)/i, "")
    .replace(/\s*\[Official\s*Audio\]/i, "")
    .replace(/\s*\(Lyric\s*Video\)/i, "")
    .replace(/\s*\[Lyric\s*Video\]/i, "")
    .replace(/\s*\(Lyrics?\)/i, "")
    .replace(/\s*\[Lyrics?\]/i, "")
    .replace(/\s*\(Visualizer\)/i, "")
    .replace(/\s*\(Audio\)/i, "")
    .replace(/\s*\[Audio\]/i, "")
    .replace(/\s*\|.*$/, "")
    .trim();
  const sep = cleaned.match(/^(.+?)\s*[-–—]\s+(.+)$/);
  if (sep) return { artist: sep[1].trim(), title: sep[2].trim() };
  return { title: cleaned, artist: "" };
}

async function fetchYouTube(url: string): Promise<TrackInfo | null> {
  try {
    const oRes = await fetchWithTimeout(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (!oRes.ok) return null;
    const data = await oRes.json();
    const { title, artist: parsedArtist } = cleanYouTubeTitle(data.title || "");
    return {
      title,
      artist: parsedArtist || data.author_name || "",
      cover: data.thumbnail_url || null,
    };
  } catch { return null; }
}

// ─── Apple Music ───────────────────────────────────────────────────────────

async function fetchAppleMusic(url: string): Promise<TrackInfo | null> {
  // Apple Music oEmbed
  try {
    const oRes = await fetchWithTimeout(
      `https://music.apple.com/oembed?url=${encodeURIComponent(url)}`
    );
    if (oRes.ok) {
      const data = await oRes.json();
      // title genelde "Song - Artist" formatında gelir
      const rawTitle = data.title || "";
      const sep = rawTitle.match(/^(.+?)\s*[-–]\s*(.+)$/);
      return {
        title: sep ? sep[1].trim() : rawTitle,
        artist: sep ? sep[2].trim() : "",
        cover: data.thumbnail_url || null,
      };
    }
  } catch { /* devam */ }

  // song.link fallback
  try {
    const slRes = await fetchWithTimeout(
      `https://api.song.link/v1alpha1/links?url=${encodeURIComponent(url)}`
    );
    if (slRes.ok) {
      const slData = await slRes.json();
      const entities = slData.entitiesByUniqueId || {};
      const key = Object.keys(entities)[0];
      if (key) {
        const e = entities[key];
        return { title: e.title || "", artist: e.artistName || "", cover: e.thumbnailUrl || null };
      }
    }
  } catch { /* devam */ }

  return null;
}

// ─── SoundCloud ────────────────────────────────────────────────────────────

async function fetchSoundCloud(url: string): Promise<TrackInfo | null> {
  try {
    const oRes = await fetchWithTimeout(
      `https://soundcloud.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (!oRes.ok) return null;
    const data = await oRes.json();
    // title: "Song by Artist" veya "Song"
    const byMatch = (data.title || "").match(/^(.+?)\s+by\s+(.+)$/i);
    return {
      title: byMatch ? byMatch[1].trim() : (data.title || ""),
      artist: byMatch ? byMatch[2].trim() : (data.author_name || ""),
      cover: data.thumbnail_url || null,
    };
  } catch { return null; }
}

// ─── Deezer ────────────────────────────────────────────────────────────────

async function fetchDeezer(url: string): Promise<TrackInfo | null> {
  // Deezer track ID'sini URL'den çıkar
  const trackMatch = url.match(/deezer\.com\/(?:[a-z]{2}\/)?track\/(\d+)/);
  if (trackMatch) {
    try {
      const apiRes = await fetchWithTimeout(
        `https://api.deezer.com/track/${trackMatch[1]}`
      );
      if (apiRes.ok) {
        const data = await apiRes.json();
        return {
          title: data.title || "",
          artist: data.artist?.name || "",
          cover: data.album?.cover_medium || data.album?.cover || null,
        };
      }
    } catch { /* devam */ }
  }

  // oEmbed fallback
  try {
    const oRes = await fetchWithTimeout(
      `https://deezer.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (oRes.ok) {
      const data = await oRes.json();
      return { title: data.title || "", artist: data.author_name || "", cover: data.thumbnail_url || null };
    }
  } catch { /* devam */ }

  return null;
}

// ─── Bandcamp ──────────────────────────────────────────────────────────────

async function fetchBandcamp(url: string): Promise<TrackInfo | null> {
  try {
    const oRes = await fetchWithTimeout(
      `https://bandcamp.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (!oRes.ok) return null;
    const data = await oRes.json();
    return {
      title: data.title || "",
      artist: data.author_name || "",
      cover: data.thumbnail_url || null,
    };
  } catch { return null; }
}

// ─── Tidal ─────────────────────────────────────────────────────────────────

async function fetchTidal(url: string): Promise<TrackInfo | null> {
  // song.link Tidal URL'lerini destekliyor
  try {
    const slRes = await fetchWithTimeout(
      `https://api.song.link/v1alpha1/links?url=${encodeURIComponent(url)}`
    );
    if (slRes.ok) {
      const slData = await slRes.json();
      const entities = slData.entitiesByUniqueId || {};
      const key = Object.keys(entities)[0];
      if (key) {
        const e = entities[key];
        return { title: e.title || "", artist: e.artistName || "", cover: e.thumbnailUrl || null };
      }
    }
  } catch { /* devam */ }
  return null;
}

// ─── Main handler ──────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "url parametresi gerekli" }, { status: 400 });
  }

  const platform = detectPlatform(url);

  if (platform === "unknown") {
    return NextResponse.json({ error: "Desteklenmeyen platform" }, { status: 400 });
  }

  try {
    let info: TrackInfo | null = null;

    if (platform === "spotify")     info = await fetchSpotify(url);
    else if (platform === "youtube") info = await fetchYouTube(url);
    else if (platform === "apple")   info = await fetchAppleMusic(url);
    else if (platform === "soundcloud") info = await fetchSoundCloud(url);
    else if (platform === "deezer")  info = await fetchDeezer(url);
    else if (platform === "bandcamp") info = await fetchBandcamp(url);
    else if (platform === "tidal")   info = await fetchTidal(url);

    if (info && (info.title || info.artist || info.cover)) {
      return NextResponse.json({ ...info, provider: platform });
    }

    return NextResponse.json({ error: "Bilgi alınamadı" }, { status: 500 });
  } catch {
    return NextResponse.json({ error: "Şarkı bilgileri alınamadı" }, { status: 500 });
  }
}
