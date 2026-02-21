import { NextRequest, NextResponse } from "next/server";

const PRIORITY = ["spotify", "youtube", "appleMusic", "deezer"];

// Odesli'den bulunamayanlar için arama linki şablonları
function searchUrl(platform: string, query: string): string {
  const q = encodeURIComponent(query);
  switch (platform) {
    case "spotify":    return `https://open.spotify.com/search/${q}`;
    case "youtube":    return `https://www.youtube.com/results?search_query=${q}`;
    case "appleMusic": return `https://music.apple.com/search?term=${q}`;
    case "deezer":     return `https://www.deezer.com/search/${q}`;
    default:           return "";
  }
}

export async function GET(req: NextRequest) {
  const url    = req.nextUrl.searchParams.get("url");
  const title  = req.nextUrl.searchParams.get("title") ?? "";
  const artist = req.nextUrl.searchParams.get("artist") ?? "";
  if (!url) return NextResponse.json({ links: [] });

  const query = [artist, title].filter(Boolean).join(" ");
  const links: { platform: string; url: string }[] = [];

  try {
    const res = await fetch(
      `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(url)}&userCountry=TR`,
      { next: { revalidate: 86400 } }
    );

    if (res.ok) {
      const data = await res.json();
      for (const p of PRIORITY) {
        const entry = data.linksByPlatform?.[p];
        if (entry?.url) links.push({ platform: p, url: entry.url });
      }
    }
  } catch { /* Odesli çalışmadı, fallback'e devam */ }

  // Eksik platformları arama linki ile doldur
  if (query) {
    for (const p of PRIORITY) {
      if (!links.find((l) => l.platform === p)) {
        const fallback = searchUrl(p, query);
        if (fallback) links.push({ platform: p, url: fallback });
      }
    }
  }

  return NextResponse.json({ links: links.slice(0, 4) });
}
