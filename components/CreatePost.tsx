"use client";

import { useState, useRef } from "react";
import { Plus, X, ImageIcon, Video, Loader2, Link as LinkIcon, Scissors, Search } from "lucide-react";

interface CreatePostProps {
  onPostCreated: (post: any) => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songCover, setSongCover] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [clipEnabled, setClipEnabled] = useState(false);
  const [clipStart, setClipStart] = useState("");
  const [clipEnd, setClipEnd] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [showTenorGif, setShowTenorGif] = useState(false);
  const [tenorQuery, setTenorQuery] = useState("");
  const [tenorResults, setTenorResults] = useState<{ id: string; url: string; preview: string }[]>([]);
  const [tenorLoading, setTenorLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSupportedLink = (url: string) =>
    url.includes("spotify.com") ||
    url.includes("music.apple.com") ||
    url.includes("youtube.com/") ||
    url.includes("youtu.be/") ||
    url.includes("music.youtube.com/") ||
    url.includes("soundcloud.com") ||
    url.includes("deezer.com") ||
    url.includes("bandcamp.com") ||
    url.includes("tidal.com");

  const fetchSongInfo = async (url: string) => {
    if (!isSupportedLink(url)) return;
    setFetching(true);
    setFetchError("");
    try {
      const res = await fetch(`/api/oembed?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.title) setSongTitle(data.title);
      if (data.artist) setSongArtist(data.artist);
      if (data.cover) setSongCover(data.cover);
    } catch {
      setFetchError("Bilgiler alınamadı — elle girebilirsin.");
    } finally {
      setFetching(false);
    }
  };

  const handleLinkChange = (val: string) => {
    setMusicUrl(val);
    const trimmed = val.trim();
    if (isSupportedLink(trimmed) && trimmed.startsWith("https://")) {
      fetchSongInfo(trimmed);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").trim();
    if (isSupportedLink(pasted) && pasted.startsWith("https://")) {
      setTimeout(() => fetchSongInfo(pasted), 50);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = file.type.startsWith("video/") ? "video" : "image";
    setMediaType(type);
    setMediaPreview(URL.createObjectURL(file));
  };

  const removeMedia = () => {
    if (mediaPreview && mediaPreview.startsWith("blob:")) URL.revokeObjectURL(mediaPreview);
    setMediaType(null);
    setMediaPreview(null);
    setShowTenorGif(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const searchTenor = async () => {
    const q = tenorQuery.trim();
    if (!q) return;
    setTenorLoading(true);
    setTenorResults([]);
    try {
      const res = await fetch(`/api/tenor?q=${encodeURIComponent(q)}&limit=12`);
      const data = await res.json();
      setTenorResults(data.results || []);
    } catch {
      setTenorResults([]);
    } finally {
      setTenorLoading(false);
    }
  };

  const parseTime = (s: string): number | undefined => {
    if (!s) return undefined;
    const parts = s.split(":").map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 1 && !isNaN(parts[0])) return parts[0];
    return undefined;
  };

  const reset = () => {
    setSongTitle("");
    setSongArtist("");
    setSongCover("");
    setMusicUrl("");
    setNote("");
    setClipEnabled(false);
    setClipStart("");
    setClipEnd("");
    setFetchError("");
    removeMedia();
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle) return;
    const newPost: any = {
      id: Date.now().toString(),
      user: { name: "Sen", username: "kullanici" },
      song: {
        title: songTitle,
        artist: songArtist,
        cover: songCover || undefined,
        spotifyUrl: musicUrl || undefined,
      },
      note: note.trim() || undefined,
      clip: clipEnabled && clipStart
        ? { start: parseTime(clipStart) ?? 0, end: parseTime(clipEnd) ?? (parseTime(clipStart) ?? 0) + 60 }
        : undefined,
      vibe: [],
      resonance: 0,
      createdAt: new Date().toISOString(),
    };
    if (mediaType && mediaPreview) {
      newPost.media = { type: mediaType, url: mediaPreview };
    }
    onPostCreated(newPost);
    reset();
  };

  if (!isOpen) {
    return (
      <div className="rounded-2xl overflow-hidden bg-bg-elevated border border-border-subtle p-4">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-3 rounded-xl border border-dashed border-border py-3 px-4 text-left text-text-muted hover:text-[var(--text)] hover:border-text-faint hover:bg-bg transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-bg border border-border flex items-center justify-center text-text-faint">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-sm">Ne çalıyor? At.</span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl overflow-hidden bg-bg-elevated border border-border-subtle">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <span className="text-sm font-medium text-[var(--text)]">Şarkı paylaş</span>
        <button type="button" onClick={reset} className="p-1.5 text-text-muted hover:text-[var(--text)] rounded-full hover:bg-bg">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Link */}
        <div>
          <label className="block text-xs text-text-faint mb-1.5">
            <LinkIcon className="w-3 h-3 inline mr-1" />
            Spotify · YouTube · Apple Music · SoundCloud · Deezer · Tidal · Bandcamp
          </label>
          <div className="relative">
            <input
              type="url"
              value={musicUrl}
              onChange={(e) => handleLinkChange(e.target.value)}
              onPaste={handlePaste}
              placeholder="Linki yapıştır — otomatik dolar"
              className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-[var(--text)] text-sm pr-10"
            />
            {fetching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent animate-spin" />
            )}
          </div>
          {fetchError && <p className="text-xs text-red-400 mt-1">{fetchError}</p>}
        </div>

        {/* Önizleme */}
        {songTitle && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-bg border border-border">
            {songCover && <img src={songCover} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
            <div className="min-w-0 flex-1">
              <p className="font-serif text-[var(--text)] truncate">{songTitle}</p>
              <p className="text-sm text-text-muted truncate">{songArtist}</p>
            </div>
          </div>
        )}

        {/* Şarkı adı / sanatçı manuel */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-text-faint mb-1">Şarkı</label>
            <input
              type="text"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              required
              placeholder="Şarkı adı"
              className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-[var(--text)] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-text-faint mb-1">Sanatçı</label>
            <input
              type="text"
              value={songArtist}
              onChange={(e) => setSongArtist(e.target.value)}
              placeholder="Sanatçı"
              className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-[var(--text)] text-sm"
            />
          </div>
        </div>

        {/* Kişisel not — isteğe bağlı */}
        <div>
          <label className="block text-xs text-text-faint mb-1.5">Bir not bırak (isteğe bağlı)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 180))}
            placeholder="Bu şarkıyla ne hissettiriyor? Bir şeyler yaz..."
            rows={2}
            className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-[var(--text)] text-sm resize-none placeholder:text-text-faint"
          />
          {note.length > 140 && (
            <p className="text-right text-xs text-text-faint mt-0.5">{180 - note.length}</p>
          )}
        </div>

        {/* Klip — isteğe bağlı */}
        <div>
          <button
            type="button"
            onClick={() => setClipEnabled((v) => !v)}
            className={`flex items-center gap-1.5 text-xs transition-colors ${clipEnabled ? "text-accent" : "text-text-muted hover:text-text-faint"}`}
          >
            <Scissors className="w-3.5 h-3.5" />
            {clipEnabled ? "Klip seçildi" : "Klip seç (isteğe bağlı)"}
          </button>
          {clipEnabled && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1">
                <label className="block text-[10px] text-text-faint mb-1">Başlangıç (dk:sn)</label>
                <input
                  type="text"
                  value={clipStart}
                  onChange={(e) => setClipStart(e.target.value)}
                  placeholder="1:05"
                  className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-[var(--text)] text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] text-text-faint mb-1">Bitiş (dk:sn)</label>
                <input
                  type="text"
                  value={clipEnd}
                  onChange={(e) => setClipEnd(e.target.value)}
                  placeholder="2:05"
                  className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-[var(--text)] text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Medya — isteğe bağlı: dosya veya Tenor GIF */}
        <div>
          <label className="block text-xs text-text-faint mb-2">Fotoğraf, video veya GIF (isteğe bağlı)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaChange}
            className="hidden"
          />
          {!mediaPreview ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-text-muted hover:text-[var(--text)] hover:border-text-faint hover:bg-bg transition-colors text-sm"
                >
                  <ImageIcon className="w-4 h-4" />
                  <Video className="w-4 h-4" />
                  <span>Dosya yükle</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowTenorGif((v) => !v)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border border-dashed py-3 px-4 text-sm transition-colors ${
                    showTenorGif ? "border-accent/50 text-accent bg-accent/10" : "border-border text-text-muted hover:text-[var(--text)] hover:border-text-faint hover:bg-bg"
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Tenor GIF</span>
                </button>
              </div>
              {showTenorGif && (
                <div className="rounded-xl border border-border bg-bg p-3 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tenorQuery}
                      onChange={(e) => setTenorQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), searchTenor())}
                      placeholder="Tenor'da GIF ara (örn: müzik, dans)"
                      className="flex-1 bg-bg-elevated border border-border rounded-lg px-3 py-2 text-[var(--text)] text-sm"
                    />
                    <button type="button" onClick={searchTenor} disabled={tenorLoading} className="px-3 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 disabled:opacity-50">
                      {tenorLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto">
                    {tenorResults.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => { setMediaType("image"); setMediaPreview(g.url); setShowTenorGif(false); setTenorResults([]); }}
                        className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-accent/50 transition-colors"
                      >
                        <img src={g.preview || g.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden bg-bg border border-border">
              {mediaType === "image" ? (
                <img src={mediaPreview} alt="" className="w-full max-h-48 object-cover" />
              ) : (
                <video src={mediaPreview} className="w-full max-h-48 object-cover" muted autoPlay loop playsInline />
              )}
              <button
                type="button"
                onClick={removeMedia}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-accent text-bg font-medium text-sm rounded-xl hover:bg-accent-hover transition-colors"
        >
          Paylaş
        </button>
      </div>
    </form>
  );
}
