"use client";

import { useEffect, useState } from "react";
import { X, Music2, ExternalLink, Plus, Check } from "lucide-react";
import { Collection, ImportedSong, mockPosts, songSlug } from "@/lib/mockData";
import Link from "next/link";
import PlatformIcon from "./PlatformIcon";
import { openPlatformLink } from "@/lib/platformLink";

const ME_USERNAME = "ayse_music";

interface CollectionModalProps {
  collection: Collection;
  isOwn?: boolean;
  onUpdate?: (id: string, newPostIds: string[]) => void;
  onClose: () => void;
}

export default function CollectionModal({ collection, isOwn, onUpdate, onClose }: CollectionModalProps) {
  const [postIds, setPostIds] = useState<string[]>(collection.postIds);
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set(collection.postIds));

  const canEdit = isOwn ?? collection.userId === ME_USERNAME;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") { if (adding) setAdding(false); else onClose(); } };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, adding]);

  const posts = postIds
    .map((id) => mockPosts.find((p) => p.id === id))
    .filter(Boolean) as typeof mockPosts;

  const imported: ImportedSong[] = collection.importedSongs ?? [];
  const totalCount = posts.length + imported.length;

  // Kullanıcının paylaşımları (eklenebilecekler)
  const myPosts = mockPosts.filter((p) => p.user.username === ME_USERNAME);

  const toggleSelect = (id: string) =>
    setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });

  const saveAdded = () => {
    const newIds = [...selected];
    setPostIds(newIds);
    onUpdate?.(collection.id, newIds);
    setAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

      <div
        className="relative bg-bg-elevated border border-border rounded-2xl w-full max-w-sm shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "85dvh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kapak odaklı üst — poster strip */}
        {!adding && (() => {
          const coverList = [
            ...(collection.cover ? [collection.cover] : []),
            ...posts.map((p) => p.song.cover).filter(Boolean),
            ...(imported.map((s) => s.cover).filter(Boolean) as string[]),
          ].slice(0, 6);
          if (coverList.length === 0) return null;
          return (
            <div className="flex gap-0.5 flex-shrink-0 overflow-hidden bg-bg">
              {coverList.map((src, i) => (
                <div key={i} className="flex-1 min-w-0 aspect-square">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          );
        })()}

        {/* Başlık */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border-subtle flex-shrink-0">
          <div>
            <h2 className="font-serif text-xl text-[var(--text)]">{collection.title}</h2>
            {collection.description && (
              <p className="text-sm text-text-faint mt-0.5">{collection.description}</p>
            )}
            <p className="text-xs text-text-faint mt-1">{totalCount} şarkı</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-[var(--text)] transition-colors ml-3 mt-0.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* İçerik — scroll, kapak odaklı satırlar */}
        <div className="flex-1 overflow-y-auto scrollbar-none">
          {!adding ? (
            <div className="p-3 space-y-1">
              {/* MusicShare paylaşımları */}
              {posts.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/song/${songSlug(p.song.title, p.song.artist)}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-bg transition-colors group"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-bg flex-shrink-0 ring-1 ring-border-subtle">
                    {p.song.cover
                      ? <img src={p.song.cover} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Music2 className="w-4 h-4 text-text-faint" /></div>
                    }
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text)] truncate font-medium">{p.song.title}</p>
                    <p className="text-xs text-text-faint truncate">{p.song.artist}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 flex-shrink-0 max-w-20">
                    {p.vibe.slice(0, 1).map((g) => (
                      <span key={g} className="text-[9px] px-1.5 py-0.5 rounded-full border border-border-subtle text-text-faint">
                        {g}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}

              {/* Import edilen şarkılar */}
              {imported.map((s, i) => (
                <div key={`imp-${i}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-bg transition-colors">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-bg flex-shrink-0 ring-1 ring-border-subtle">
                    {s.cover
                      ? <img src={s.cover} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Music2 className="w-4 h-4 text-text-faint" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text)] truncate font-medium">{s.title}</p>
                    <p className="text-xs text-text-faint truncate">{s.artist}</p>
                  </div>
                  {s.url && (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                          e.preventDefault();
                          openPlatformLink(null, s.url!);
                        }
                      }}
                      className="text-text-faint hover:text-accent transition-colors flex-shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}

              {totalCount === 0 && (
                <div className="text-center py-6">
                <p className="text-sm font-medium text-[var(--text)] mb-1">Bu koleksiyona henüz şarkı eklenmemiş</p>
                <p className="text-xs text-text-faint">Paylaşımlarından seçerek ekleyebilirsin.</p>
              </div>
              )}
            </div>
          ) : (
            /* Şarkı ekleme modu */
            <div className="p-3 space-y-1">
              <p className="text-xs text-text-faint px-2 pb-2">Paylaşımlarından seç:</p>
              {myPosts.map((p) => {
                const sel = selected.has(p.id);
                return (
                  <button key={p.id} type="button" onClick={() => toggleSelect(p.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors ${sel ? "bg-accent/8" : "hover:bg-bg"}`}
                  >
                    <div className="w-9 h-9 rounded-md overflow-hidden bg-bg flex-shrink-0">
                      {p.song.cover
                        ? <img src={p.song.cover} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Music2 className="w-3.5 h-3.5 text-text-faint" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text)] truncate">{p.song.title}</p>
                      <p className="text-xs text-text-faint truncate">{p.song.artist}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border flex-shrink-0 transition-colors ${sel ? "bg-accent border-accent" : "border-border-subtle"}`}>
                      {sel && <Check className="w-3 h-3 text-bg" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Alt bar */}
        <div className="px-4 py-3 border-t border-border-subtle flex items-center justify-between flex-shrink-0">
          {!adding ? (
            <>
              <p className="text-xs text-text-faint">{totalCount} şarkı</p>
              <div className="flex items-center gap-2">
                {collection.sourceUrl && collection.sourcePlatform && (
                  <PlatformIcon platform={collection.sourcePlatform} url={collection.sourceUrl} variant="badge" />
                )}
                {canEdit && myPosts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setAdding(true)}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border border-border-subtle text-text-muted hover:border-accent/40 hover:text-accent transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Şarkı Ekle
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-text-faint">{selected.size} seçili</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => { setSelected(new Set(postIds)); setAdding(false); }}
                  className="text-xs px-3 py-1.5 border border-border-subtle text-text-muted rounded-xl hover:border-border transition-colors">
                  İptal
                </button>
                <button type="button" onClick={saveAdded}
                  className="text-xs px-3 py-1.5 bg-accent text-bg rounded-xl hover:bg-accent-hover transition-colors">
                  Kaydet
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
