"use client";

import Post from "./Post";
import { mockPosts, mockUsers } from "@/lib/mockData";
import { Skull } from "lucide-react";
import { useState, useEffect } from "react";
import PlatformIcon from "./PlatformIcon";
import dynamic from "next/dynamic";

const FollowListModal = dynamic(() => import("./FollowListModal"), { ssr: false });

const ME_USERNAME = "ayse_music";
const PROFILE_BG_KEY = "musicshare_profile_bg";

interface UserProfileViewProps {
  username: string;
}

export default function UserProfileView({ username }: UserProfileViewProps) {
  const user = mockUsers.find((u) => u.username === username);
  const [following, setFollowing] = useState(false);
  const [showFollowList, setShowFollowList] = useState<"followers" | "following" | null>(null);
  const [profileBackground, setProfileBackground] = useState("");

  useEffect(() => {
    if (!user) return;
    const fromMock = (user as { profileBackground?: string }).profileBackground;
    if (fromMock) setProfileBackground(fromMock);
    else if (typeof window !== "undefined") {
      const v = localStorage.getItem(`${PROFILE_BG_KEY}_${username}`);
      setProfileBackground(v ?? "");
    } else setProfileBackground("");
  }, [user, username]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-text-muted">Kullanıcı bulunamadı: @{username}</p>
      </div>
    );
  }

  const isOwn = username === ME_USERNAME;
  const userPosts = mockPosts.filter((p) => p.user.username === username);

  // Top 4 genre
  const genreCount: Record<string, number> = {};
  userPosts.forEach((p) => p.vibe.forEach((g) => { genreCount[g] = (genreCount[g] || 0) + 1; }));
  const top4 = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([g]) => g);

  return (
    <>
    {/* Sayfanın tamamı — WhatsApp gibi; kalite bozulmadan cover */}
    <div
      aria-hidden
      className="fixed inset-0 -z-10"
      style={
        /^(https?:\/\/|data:image\/)/i.test(profileBackground || "")
          ? {
              backgroundImage: `url(${profileBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : { background: profileBackground || "var(--bg)" }
      }
    />
    {/* Görsel arka planda metin okunabilirliği: yarı saydam katman */}
    {/^(https?:\/\/|data:image\/)/i.test(profileBackground || "") && (
      <div
        aria-hidden
        className="fixed inset-0 -z-[9] bg-gradient-to-b from-black/65 via-black/78 to-black/92"
      />
    )}
    <div className={`space-y-8 max-w-2xl mx-auto relative z-0 ${/^(https?:\/\/|data:image\/)/i.test(profileBackground || "") ? "profile-bg-image" : ""}`}>
      {/* Başlık */}
      <div className="border-b border-border-subtle pb-8 profile-header-text">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-bg-elevated border border-border flex items-center justify-center font-serif text-3xl text-text-muted flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-3xl text-[var(--text)]">{user.name}</h1>
            <p className="text-text-muted text-sm mt-1">@{user.username}</p>
            <p className="text-text-muted mt-3 max-w-md">{user.bio}</p>

            {!isOwn && (
              <button
                type="button"
                onClick={() => setFollowing((v) => !v)}
                className={`mt-4 px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  following
                    ? "border border-border text-text-muted hover:border-red-400/50 hover:text-red-400"
                    : "bg-accent text-bg hover:bg-accent-hover"
                }`}
              >
                {following ? "Takip Ediliyor" : "Takip Et"}
              </button>
            )}

            <div className="flex gap-6 mt-5 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-wider text-text-faint">Paylaşım</p>
                <p className="text-[var(--text)] font-medium tabular-nums mt-0.5">{userPosts.length}</p>
              </div>
              <button type="button" onClick={() => setShowFollowList("followers")} className="text-left hover:opacity-80 transition-opacity">
                <p className="text-xs uppercase tracking-wider text-text-faint">Takipçi</p>
                <p className="text-[var(--text)] font-medium tabular-nums mt-0.5">{(user as any).followers ?? 0}</p>
              </button>
              <button type="button" onClick={() => setShowFollowList("following")} className="text-left hover:opacity-80 transition-opacity">
                <p className="text-xs uppercase tracking-wider text-text-faint">Takip</p>
                <p className="text-[var(--text)] font-medium tabular-nums mt-0.5">{(user as any).following ?? 0}</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Müzik Vasiyeti */}
      {(() => {
        const will = (user as any).musicWill;
        if (!will) return null;
        return (
          <div className="flex items-center gap-2 px-1 flex-wrap">
            <Skull className="w-4 h-4 text-text-faint flex-shrink-0" />
            <span className="text-sm text-text-faint flex-shrink-0">Vasiyet:</span>
            {will.cover && <img src={will.cover} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />}
            <span className="text-sm text-text-muted min-w-0 truncate">
              {will.title}<span className="text-text-faint"> — {will.artist}</span>
            </span>
          </div>
        );
      })()}

      {/* Sound'u — Top 4 tür */}
      {top4.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-text-faint mb-2">Sound&apos;u</p>
          <div className="flex flex-wrap gap-2">
            {top4.map((g) => (
              <span key={g} className="px-2.5 py-1 rounded-full bg-bg-elevated border border-border-subtle text-xs text-text-muted">{g}</span>
            ))}
          </div>
        </div>
      )}

      {/* Postlar */}
      {userPosts.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-text-muted">Bu kullanıcı henüz paylaşım yapmamış.</p>
        </div>
      ) : (
        <div>{userPosts.map((post) => <Post key={post.id} post={post} />)}</div>
      )}
    </div>

    {showFollowList && (
      <FollowListModal type={showFollowList} username={username} onClose={() => setShowFollowList(null)} />
    )}
    </>
  );
}
