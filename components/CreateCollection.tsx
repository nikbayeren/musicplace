"use client";

import { useState } from "react";
import { Plus, X, Link as LinkIcon, Loader2, Music2, Check } from "lucide-react";
import PlatformIcon from "./PlatformIcon";
import { Collection, ImportedSong } from "@/lib/mockData";

interface CreateCollectionProps {
  userId: string;
  onCreated: (col: Collection) => void;
}

export default function CreateCollection({ userId, onCreated }: CreateCollectionProps) {
  const [open, setOpen] = useState(false);

  const [link, setLink]       = useState("");
  const [title, setTitle]     = useState("");
  const [desc, setDesc]       = useState("");
  const [cover, setCover]     = useState("");
  const [platform, setPlatform] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetchedTracks, setFetchedTracks] = useState<ImportedSong[]>([]);
  const [selectedIdxs, setSelectedIdxs] = useState<Set<number>>(new Set());

  const isSupportedLink = (u: string) =>
    ["spotify.com/playlist", "music.apple.com", "deezer.com/playlist", "soundcloud.com"].some(
      (d) => u.includes(d),
    );

  const fetchPlaylist = async (url: string) => {
    setFetching(true);
    setFetchedTracks([]);
    setSelectedIdxs(new Set());
    try {
      const res  = await fetch(`/api/playlist?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.title)    setTitle(data.title);
      if (data.cover)    setCover(data.cover);
      if (data.platform) setPlatform(data.platform);
      if (Array.isArray(data.tracks) && data.tracks.length > 0) {
        setFetchedTracks(data.tracks);
        // Hepsini otomatik seç
        setSelectedIdxs(new Set(data.tracks.map((_: any, i: number) => i)));
      }
    } catch { /* ignore */ }
    finally   { setFetching(false); }
  };

  const handleLinkChange = (val: string) => {
    setLink(val);
    if (val.startsWith("https://") && isSupportedLink(val)) fetchPlaylist(val.trim());
  };

  const toggleIdx = (i: number) =>
    setSelectedIdxs((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const toggleAll = () =>
    setSelectedIdxs((prev) =>
      prev.size === fetchedTracks.length
        ? new Set()
        : new Set(fetchedTracks.map((_, i) => i)),
    );

  const reset = () => {
    setOpen(false);
    setLink(""); setTitle(""); setDesc(""); setCover(""); setPlatform("");
    setFetchedTracks([]); setSelectedIdxs(new Set());
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const songs = [...selectedIdxs].sort((a, b) => a - b).map((i) => fetchedTracks[i]);
    const col: Collection = {
      id: `col_${Date.now()}`,
      userId,
      title,
      description:    desc || undefined,
      postIds:        [],
      importedSongs:  songs.length > 0 ? songs : undefined,
      createdAt:      new Date().toISOString(),
      sourceUrl:      link || undefined,
      sourcePlatform: platform || undefined,
      cover:          cover || undefined,
    };
    onCreated(col);
    reset();
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-xs text-text-faint hover:text-accent transition-colors px-1 py-1"
      >
        <Plus className="w-3.5 h-3.5" />
        Yeni koleksiyon
      </button>
    );
  }

  return (
    <form onSubmit={handleCreate} className="rounded-2xl bg-bg-elevated border border-border-subtle overflow-hidden">
      {/* Başlık */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <span className="text-sm font-medium text-[var(--text)]">Yeni Koleksiyon</span>
        <button type="button" onClick={reset} className="text-text-muted hover:text-[var(--text)]">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Platform linki */}
        <div>
          <label className="block text-xs text-text-faint mb-1.5">
            <LinkIcon className="w-3 h-3 inline mr-1" />
            Spotify · Apple Music · Deezer playlist linki (isteğe bağlı)
          </label>
          <div className="relative">
            <input
              type="url"
              value={link}
              onChange={(e) => handleLinkChange(e.target.value)}
              placeholder="Linki yapıştır — şarkılar otomatik dolar"
              className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-[var(--text)] text-sm pr-9"
            />
            {fetching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent animate-spin" />
            )}
          </div>
        </div>

        {/* Önizleme satırı (link varsa) */}
        {(cover || platform) && (
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-bg border border-border">
            <div className="w-9 h-9 rounded-md overflow-hidden bg-bg-elevated flex-shrink-0">
              {cover
                ? <img src={cover} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><Music2 className="w-4 h-4 text-text-faint" /></div>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--text)] truncate">{title || "—"}</p>
              {fetchedTracks.length > 0
                ? <p className="text-xs text-text-faint mt-0.5">{fetchedTracks.length} şarkı bulundu</p>
                : <p className="text-xs text-text-faint mt-0.5 capitalize">{platform}</p>}
            </div>
            {platform && link && <PlatformIcon platform={platform} url={link} variant="icon" />}
          </div>
        )}

        {/* Getirilen şarkı listesi */}
        {fetchedTracks.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-text-faint">
                {selectedIdxs.size} / {fetchedTracks.length} şarkı seçili
              </p>
              <button type="button" onClick={toggleAll} className="text-[10px] text-accent hover:underline">
                {selectedIdxs.size === fetchedTracks.length ? "Tümünü kaldır" : "Tümünü seç"}
              </button>
            </div>
            <div className="max-h-52 overflow-y-auto scrollbar-none rounded-xl border border-border divide-y divide-border-subtle/50">
              {fetchedTracks.map((t, i) => {
                const sel = selectedIdxs.has(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleIdx(i)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${sel ? "bg-accent/8" : "hover:bg-bg-elevated"}`}
                  >
                    <div className="w-8 h-8 rounded-md overflow-hidden bg-bg-elevated flex-shrink-0">
                      {t.cover
                        ? <img src={t.cover} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Music2 className="w-3 h-3 text-text-faint" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[var(--text)] truncate">{t.title}</p>
                      <p className="text-[10px] text-text-faint truncate">{t.artist}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border flex-shrink-0 transition-colors ${sel ? "bg-accent border-accent" : "border-border-subtle"}`}>
                      {sel && <Check className="w-2.5 h-2.5 text-bg" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Başlık */}
        <div>
          <label className="block text-xs text-text-faint mb-1">Başlık *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Koleksiyon adı"
            className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-[var(--text)] text-sm"
          />
        </div>

        {/* Açıklama */}
        <div>
          <label className="block text-xs text-text-faint mb-1">Açıklama (isteğe bağlı)</label>
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Kısa bir açıklama..."
            className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-[var(--text)] text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={!title}
          className="w-full py-2.5 bg-accent text-bg font-medium text-sm rounded-xl hover:bg-accent-hover disabled:opacity-40 transition-colors"
        >
          Oluştur
          {selectedIdxs.size > 0 && (
            <span className="ml-1 opacity-80">({selectedIdxs.size} şarkı)</span>
          )}
        </button>
      </div>
    </form>
  );
}
