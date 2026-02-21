"use client";

import { useEffect, useState, useMemo } from "react";
import { X, Search, Users } from "lucide-react";

interface User { name: string; username: string; }

interface SameSongModalProps {
  songTitle: string;
  artist: string;
  users: User[];
  onClose: () => void;
}

export default function SameSongModal({ songTitle, artist, users, onClose }: SameSongModalProps) {
  const [query, setQuery] = useState("");
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
    );
  }, [users, query]);

  const toggleFollow = (username: string) => {
    setFollowed((prev) => {
      const next = new Set(prev);
      next.has(username) ? next.delete(username) : next.add(username);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

      <div
        className="relative bg-bg border border-border w-full sm:max-w-sm flex flex-col rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
        style={{ maxHeight: "80dvh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Swipe bar (mobile) */}
        <div className="flex sm:hidden justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Başlık */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border-subtle flex-shrink-0">
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-lg text-[var(--text)] leading-tight truncate">{songTitle}</h3>
            <p className="text-sm text-text-muted truncate">{artist}</p>
          </div>
          <button type="button" onClick={onClose} className="text-text-muted hover:text-[var(--text)] transition-colors ml-4 mt-0.5 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sayaç + arama */}
        <div className="px-5 py-3 border-b border-border-subtle flex-shrink-0 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-text-faint">
            <Users className="w-3.5 h-3.5" />
            <span>
              <strong className="text-[var(--text)]">{users.length}</strong> kişi bu şarkıyı paylaştı
            </span>
          </div>
          {users.length > 6 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-faint pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="İsim veya kullanıcı adı ara..."
                className="w-full bg-bg-elevated border border-border-subtle rounded-xl pl-9 pr-3 py-2 text-sm text-[var(--text)] placeholder:text-text-faint"
              />
            </div>
          )}
        </div>

        {/* Liste */}
        <div className="overflow-y-auto flex-1 scrollbar-none">
          {filtered.length === 0 ? (
            <p className="text-center text-xs text-text-faint py-8">Sonuç yok.</p>
          ) : (
            <div className="divide-y divide-border-subtle/50">
              {filtered.map((u) => {
                const isFollowing = followed.has(u.username);
                return (
                  <div key={u.username} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-8 h-8 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-sm font-semibold text-text-muted flex-shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text)] font-medium truncate">{u.name}</p>
                      <p className="text-xs text-text-faint">@{u.username}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFollow(u.username)}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors flex-shrink-0 ${
                        isFollowing
                          ? "border-border text-text-muted"
                          : "border-accent/40 text-accent hover:bg-accent/10"
                      }`}
                    >
                      {isFollowing ? "Takip Ediliyor" : "Takip Et"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Alt bilgi: arama varsa kaç sonuç gösterildi */}
        {query && filtered.length > 0 && (
          <div className="px-5 py-2 border-t border-border-subtle flex-shrink-0">
            <p className="text-[10px] text-text-faint">{filtered.length} / {users.length} sonuç</p>
          </div>
        )}
      </div>
    </div>
  );
}
