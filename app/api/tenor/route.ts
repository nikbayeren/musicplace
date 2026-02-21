import { NextRequest, NextResponse } from "next/server";

const TENOR_API_KEY = process.env.TENOR_API_KEY || process.env.NEXT_PUBLIC_TENOR_API_KEY;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() || "";
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit")) || 12, 20);

  if (!TENOR_API_KEY) {
    return NextResponse.json({
      results: [],
      error: "Tenor API key yapılandırılmamış. .env içine TENOR_API_KEY ekleyin.",
    });
  }

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  try {
    const url = new URL("https://tenor.googleapis.com/v2/search");
    url.searchParams.set("key", TENOR_API_KEY);
    url.searchParams.set("q", q);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("client_key", "musicshare");
    url.searchParams.set("contentfilter", "low"); // low = more permissive for fun gifs

    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Tenor API error");

    const data = await res.json();
    const results = (data.results || []).map((r: any) => {
      const media = r.media_formats?.gif || r.media_formats?.mediumgif || r.media_formats?.tinygif;
      const preview = r.media_formats?.tinygif?.url || media?.url;
      return {
        id: r.id,
        url: media?.url || preview,
        preview: preview || media?.url,
        title: r.content_description || "",
      };
    }).filter((x: any) => x.url);

    return NextResponse.json({ results });
  } catch (e) {
    console.error("Tenor API:", e);
    return NextResponse.json({ results: [], error: "Arama geçici olarak kullanılamıyor." });
  }
}
