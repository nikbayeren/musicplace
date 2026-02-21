"use client";

import { useEffect } from "react";
import { X, Music2 } from "lucide-react";
import { mockPosts } from "@/lib/mockData";
import Post from "./Post";
import { useState } from "react";

interface SongDetailModalProps {
  title: string;
  artist: string;
  onClose: () => void;
}

export default function SongDetailModal({ title, artist, onClose }: SongDetailModalProps) {
  const [following, setFollowing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const songPosts = mockPosts.filter(
    (p) => p.song.title === title && p.song.artist === artist
  );

  const firstPost = songPosts[0];
  const cover = firstPost?.song.cover;

  const sharers = songPosts
    .map((p) => ({ user: p.user, note: (p as any).note as string | undefined }))
    .filter((s, i, arr) => arr.findIndex((x) => x.user.username === s.user.username) === i);

  const allVibes = [...new Set(songPosts.flatMap((p) => p.vibe))];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative bg-bg border border-border w-full sm:max-w-xl max-h-[92dvh] sm:max-h-[88vh] flex flex-col rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Üst çubuk (mobile swipe indicator) */}
        <div className="flex sm:hidden justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Başlık */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-border-subtle flex-shrink-0">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-bg-elevated flex-shrink-0">
            {cover
              ? <img src={cover} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><Music2 className="w-6 h-6 text-text-faint" /></div>
            }
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-serif text-xl text-[var(--text)] leading-tight truncate">{title}</h2>
            <p className="text-sm text-text-muted truncate">{artist}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {allVibes.map((g) => (
                <span key={g} className="text-[9px] px-1.5 py-0.5 rounded-full border border-border-subtle text-text-faint">{g}</span>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-[var(--text)] transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* İçerik — kaydırılabilir */}
        <div className="overflow-y-auto flex-1 scrollbar-none">
          {!firstPost ? (
            <p className="text-center text-text-muted py-12 text-sm">Şarkı bulunamadı.</p>
          ) : (
            <>
              {/* Paylaşanlar */}
              <div className="px-5 pt-5 pb-3">
                <p className="text-[10px] uppercase tracking-widest text-text-faint mb-3">
                  {sharers.length} kişi paylaştı
                </p>
                <div className="flex flex-col gap-2">
                  {sharers.map((s) => (
                    <div key={s.user.username} className="flex items-start gap-3 p-3 rounded-xl bg-bg-elevated border border-border-subtle">
                      <div className="w-8 h-8 rounded-full bg-bg border border-border flex items-center justify-center text-sm font-semibold text-text-muted flex-shrink-0">
                        {s.user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-medium text-[var(--text)]">{s.user.name}</span>
                          <span className="text-xs text-text-faint">@{s.user.username}</span>
                        </div>
                        {s.note && (
                          <p className="text-xs text-text-faint italic mt-1">"{s.note}"</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setFollowing((f) => ({ ...f, [s.user.username]: !f[s.user.username] }))}
                        className={`text-xs px-3 py-1 rounded-full border transition-colors flex-shrink-0 ${
                          following[s.user.username]
                            ? "border-border text-text-muted"
                            : "border-accent/40 text-accent hover:bg-accent/10"
                        }`}
                      >
                        {following[s.user.username] ? "Takip ediliyor" : "Takip"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paylaşımlar */}
              <div className="px-5 pb-2 pt-1">
                <p className="text-[10px] uppercase tracking-widest text-text-faint mb-1">Paylaşımlar</p>
              </div>
              <div>
                {songPosts.map((p) => (
                  <Post key={p.id} post={p} defaultShowComments={true} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
