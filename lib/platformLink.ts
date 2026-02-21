/**
 * Platform web URL'sini uygulama deep link'ine çevirir.
 * PC/telefonda uygulama yüklüyse uygulama açılır, yoksa web kullanılır.
 */
export function getAppDeepLink(platform: string, webUrl: string): string | null {
  if (!webUrl || typeof webUrl !== "string") return null;
  const url = webUrl.trim();
  try {
    const lower = platform.toLowerCase();
    if (lower === "spotify") {
      // https://open.spotify.com/track/xxx, /album/xxx, /playlist/xxx
      const m = url.match(/open\.spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
      if (m) return `spotify:${m[1]}:${m[2]}`;
      return null;
    }
    if (lower === "applemusic" || lower === "apple music") {
      // music.apple.com — iOS'ta aynı URL uygulamada açılır; masaüstü için music://
      const m = url.match(/music\.apple\.com\/[^/]+\/(album|song|playlist|artist)[^/]*\/[^/]+\/([a-zA-Z0-9.]+)/);
      if (m) return `music://music.apple.com/${m[1]}/${m[2]}`;
      return null;
    }
    if (lower === "youtube" || lower === "youtubemusic") {
      // youtube.com/watch?v=xxx → mobilde uygulama açılabilir
      const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
      if (m) return `vnd.youtube://watch?v=${m[1]}`;
      return null;
    }
    if (lower === "deezer") {
      const m = url.match(/deezer\.com\/(tr\/)?(track|album|playlist)\/(\d+)/);
      if (m) return `deezer://www.deezer.com/${m[2]}/${m[3]}`;
      return null;
    }
    if (lower === "soundcloud") {
      // SoundCloud genelde web; uygulama varsa aynı URL açılabilir
      return null;
    }
  } catch {
    return null;
  }
  return null;
}

/** URL'den platform adını tahmin eder (spotify, youtube, applemusic, deezer). */
export function getPlatformFromUrl(webUrl: string): string | null {
  if (!webUrl || typeof webUrl !== "string") return null;
  const u = webUrl.toLowerCase();
  if (u.includes("spotify.com") || u.includes("open.spotify")) return "spotify";
  if (u.includes("music.apple.com")) return "appleMusic";
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("deezer.com")) return "deezer";
  if (u.includes("soundcloud.com")) return "soundcloud";
  return null;
}

const FALLBACK_MS = 2200;

function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * PC: Uygulama yüklüyse uygulama açılır, yoksa kısa süre sonra web açılır.
 * Telefon: Web linki açılır (OS genelde Spotify/Apple Music vb. linki uygulamada açar).
 * platform verilmezse URL'den tahmin edilir.
 */
export function openPlatformLink(platform: string | null, webUrl: string): void {
  if (typeof window === "undefined") return;
  const p = platform || getPlatformFromUrl(webUrl);
  const appUrl = p ? getAppDeepLink(p, webUrl) : null;
  if (isMobile()) {
    window.open(webUrl, "_blank", "noopener noreferrer");
    return;
  }
  if (appUrl) {
    try {
      // Uygulama linkini açmayı dene (aynı pencerede veya yeni sekmede — tarayıcı/OS davranışına bırakıyoruz)
      window.open(appUrl, "_blank", "noopener");
    } catch {
      // ignore
    }
    // Uygulama yüklü değilse kullanıcı web’e gitsin diye gecikmeyle web linkini aç
    setTimeout(() => {
      window.open(webUrl, "_blank", "noopener noreferrer");
    }, FALLBACK_MS);
  } else {
    // App scheme yoksa doğrudan web
    window.open(webUrl, "_blank", "noopener noreferrer");
  }
}
