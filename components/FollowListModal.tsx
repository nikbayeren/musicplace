"use client";

import { useEffect, useState } from "react";
import { X, Users } from "lucide-react";
import { mockUsers } from "@/lib/mockData";

interface FollowListModalProps {
  type: "followers" | "following";
  username: string;
  onClose: () => void;
}

// Mock: belirli kullanıcının takipçi/takip ettiği listesi
function getList(username: string, type: "followers" | "following") {
  // Basit deterministik: username hash'ine göre users listesinden seç
  const others = mockUsers.filter((u) => u.username !== username);
  const seed = username.length % others.length;
  if (type === "followers") return others.slice(0, seed + 2);
  return others.slice(seed > 0 ? seed - 1 : 0, seed + 3);
}

export default function FollowListModal({ type, username, onClose }: FollowListModalProps) {
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const list = getList(username, type);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const toggle = (u: string) =>
    setFollowed((prev) => { const next = new Set(prev); next.has(u) ? next.delete(u) : next.add(u); return next; });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
      <div
        className="relative bg-bg-elevated border border-border rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-text-faint" />
            <h2 className="font-serif text-xl text-[var(--text)]">
              {type === "followers" ? "Takipçiler" : "Takip Edilenler"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="text-text-muted hover:text-[var(--text)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto scrollbar-none divide-y divide-border-subtle/50">
          {list.length === 0 && (
            <p className="text-sm text-text-muted text-center py-10">Liste boş.</p>
          )}
          {list.map((u) => (
            <div key={u.username} className="flex items-center gap-3 px-5 py-3">
              <div className="w-9 h-9 rounded-full bg-bg border border-border flex items-center justify-center font-semibold text-text-muted flex-shrink-0 text-sm">
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text)] truncate">{u.name}</p>
                <p className="text-xs text-text-faint truncate">@{u.username}</p>
              </div>
              <button
                type="button"
                onClick={() => toggle(u.username)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors flex-shrink-0 ${
                  followed.has(u.username)
                    ? "border-border text-text-muted hover:border-red-400/50 hover:text-red-400"
                    : "border-accent/40 text-accent hover:bg-accent/10"
                }`}
              >
                {followed.has(u.username) ? "Takip Ediliyor" : "Takip Et"}
              </button>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-border-subtle">
          <p className="text-xs text-text-faint">{list.length} kişi</p>
        </div>
      </div>
    </div>
  );
}
