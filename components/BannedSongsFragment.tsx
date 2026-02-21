"use client";

import { useState } from "react";
import { Ban, Music2, Plus, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useBannedSongs, type BannedEntry } from "@/contexts/BannedSongsContext";

interface BannedSongsFragmentProps {
  isOwnProfile: boolean;
}

export default function BannedSongsFragment({ isOwnProfile }: BannedSongsFragmentProps) {
  const { list, add, remove } = useBannedSongs();
  const [showAdd, setShowAdd] = useState(false);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <section className="rounded-2xl border border-border-subtle bg-bg-elevated/50 p-4">
      <h3 className="text-xs uppercase tracking-widest text-text-faint mb-2">Yasaklı şarkılar</h3>
      {list.length === 0 && !showAdd && (
        <div className="py-6 text-center">
          <p className="text-sm font-medium text-[var(--text)] mb-1">İlk yasaklı şarkını ekle</p>
          <p className="text-xs text-text-faint">Buraya eklediklerin listede yasaklı görünür.</p>
        </div>
      )}
      <div className="space-y-3">
        {list.map((e) => (
          <BannedSongCard key={e.id} entry={e} onRemove={isOwnProfile ? () => remove(e.id) : undefined} />
        ))}
      </div>
      {isOwnProfile && (
        <>
          {!showAdd ? (
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 text-xs text-text-faint hover:text-red-400/90 hover:scale-105 transition-all mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Şarkı ekle (link ile)
            </button>
          ) : (
            <form
              onSubmit={async (ev) => {
                ev.preventDefault();
                const url = link.trim();
                if (!url) return;
                setError("");
                setLoading(true);
                try {
                  const res = await fetch(`/api/oembed?url=${encodeURIComponent(url)}`);
                  const data = await res.json();
                  if (data.error || !data.title) {
                    setError(data.error || "Şarkı bilgisi alınamadı.");
                    return;
                  }
                  add({
                    title: data.title,
                    artist: data.artist || "Bilinmiyor",
                    cover: data.cover,
                    link: url,
                  });
                  setLink("");
                  setShowAdd(false);
                } catch {
                  setError("Bağlantı hatası.");
                } finally {
                  setLoading(false);
                }
              }}
              className="rounded-xl border border-red-500/20 bg-bg p-4 space-y-3 mt-2"
            >
              <input
                type="url"
                value={link}
                onChange={(e) => { setLink(e.target.value); setError(""); }}
                placeholder="Spotify, YouTube, Apple Music vb. şarkı linki yapıştır"
                className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-[var(--text)]"
                required
              />
              {error && <p className="text-xs text-red-400">{error}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => { setShowAdd(false); setError(""); }} className="flex-1 py-2 text-xs border border-border rounded-lg text-text-muted">İptal</button>
                <button type="submit" disabled={loading || !link.trim()} className="flex-1 py-2 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:scale-105 active:scale-95 disabled:opacity-50 transition-transform">{loading ? "..." : "Yasaklılara ekle"}</button>
              </div>
            </form>
          )}
        </>
      )}
    </section>
  );
}

function BannedSongCard({ entry, onRemove }: { entry: BannedEntry; onRemove?: () => void }) {
  return (
    <div className="relative flex items-center gap-4 p-4 rounded-2xl border-2 border-red-500/40 bg-gradient-to-br from-red-950/30 to-red-950/10 shadow-[0_0_20px_-5px_rgba(239,68,68,0.25)] overflow-hidden">
      <div className="absolute left-0 top-0 w-14 h-14 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-red-500/90 rotate-[-28deg] origin-bottom-left scale-150" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
        <Ban className="absolute top-1.5 left-1.5 w-5 h-5 text-bg drop-shadow-md" />
      </div>
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-bg flex-shrink-0 border-2 border-red-500/50 ring-2 ring-red-500/20">
        {entry.cover ? (
          <img src={entry.cover} alt="" className="w-full h-full object-cover opacity-70 saturate-50" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-red-950/50"><Music2 className="w-6 h-6 text-red-400/70" /></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--text)] line-through decoration-red-500 decoration-[3px] decoration-double">{entry.title}</p>
        <p className="text-xs text-text-faint line-through decoration-red-500/70 decoration-2 mt-0.5">{entry.artist}</p>
        <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold px-2.5 py-1 rounded-md bg-red-600/90 text-white border border-red-400/50 uppercase tracking-wider shadow-sm">
          <Ban className="w-3 h-3" />
          Yasaklı
        </span>
      </div>
      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
        <span className="text-[9px] text-red-300/80 tabular-nums">{formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}</span>
        {onRemove && (
          <button type="button" onClick={onRemove} className="p-1.5 text-red-300/70 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors" title="Listeden çıkar">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
