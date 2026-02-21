"use client";

import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import Post from "./Post";
import { mockPosts, mockUsers, calcCompatibility } from "@/lib/mockData";

const ME_USERNAME = "ayse_music";
const myPosts = mockPosts.filter((p) => p.user.username === ME_USERNAME);

export default function DiscoverView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  const q = searchQuery.toLowerCase().trim();
  const isUserSearch = q.startsWith("@");
  const cleanQ = isUserSearch ? q.slice(1) : q;

  const filteredPosts = useMemo(() => {
    if (!q || isUserSearch) return q ? [] : mockPosts;
    return mockPosts.filter(
      (p) =>
        p.song.title.toLowerCase().includes(q) ||
        p.song.artist.toLowerCase().includes(q) ||
        p.user.username.toLowerCase().includes(q) ||
        p.user.name.toLowerCase().includes(q) ||
        p.vibe.some((g) => g.toLowerCase().includes(q))
    );
  }, [q, isUserSearch]);

  const filteredUsers = useMemo(() => {
    if (!cleanQ) return [];
    return mockUsers.filter(
      (u) =>
        u.username !== ME_USERNAME &&
        (u.username.toLowerCase().includes(cleanQ) ||
          u.name.toLowerCase().includes(cleanQ))
    );
  }, [cleanQ]);

  const toggleFollow = (username: string) => {
    setFollowedUsers((prev) => {
      const next = new Set(prev);
      next.has(username) ? next.delete(username) : next.add(username);
      return next;
    });
  };

  // Kullanıcının tarzı = paylaştığı şarkılardaki türler (vibe)
  const myVibes = useMemo(() => new Set(myPosts.flatMap((p) => p.vibe)), []);

  // Arama yokken: seninle aynı tada sahip kişiler (uyumlu kullanıcılar, en fazla 10)
  const topCompatible = useMemo(() => {
    if (q) return [];
    return mockUsers
      .filter((u) => u.username !== ME_USERNAME)
      .map((u) => ({
        user: u,
        compat: calcCompatibility(myPosts, mockPosts.filter((p) => p.user.username === u.username)),
      }))
      .filter((x) => x.compat > 0)
      .sort((a, b) => b.compat - a.compat)
      .slice(0, 10);
  }, [q]);

  // Keşfet ana listesi: tarzına uygun şarkılar — sadece başka insanların paylaştığı, tür eşleşen paylaşımlar
  const discoverPosts = useMemo(() => {
    if (q) return [];
    const othersPosts = mockPosts.filter((p) => p.user.username !== ME_USERNAME);
    return othersPosts
      .filter((p) => p.vibe.some((v) => myVibes.has(v)))
      .map((p) => ({
        post: p,
        matchCount: p.vibe.filter((v) => myVibes.has(v)).length,
      }))
      .sort((a, b) => b.matchCount - a.matchCount)
      .map((x) => x.post);
  }, [q, myVibes]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl text-[var(--text)] mb-5">Keşfet</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Şarkı, sanatçı, @kullanıcı veya tür ara..."
            className="w-full bg-bg-elevated border border-border rounded-xl pl-10 pr-4 py-2.5 text-[var(--text)] text-sm"
          />
        </div>
      </div>

      {/* Seninle aynı tada sahip kişiler — sadece arama yokken */}
      {!q && topCompatible.length > 0 && (
        <section>
          <h2 className="text-xs uppercase tracking-widest text-text-faint mb-3">
            Seninle aynı tada sahip {topCompatible.length} kişi
          </h2>
          <div className="space-y-2">
            {topCompatible.map(({ user: u, compat }) => {
              const isFollowing = followedUsers.has(u.username);
              return (
                <div key={u.username}
                  className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated border border-border-subtle">
                  <div className="w-10 h-10 rounded-full bg-bg border border-border flex items-center justify-center font-semibold text-text-muted flex-shrink-0">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-[var(--text)]">{u.name}</span>
                      <span className="text-xs text-text-muted">@{u.username}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                        %{compat} uyum
                      </span>
                    </div>
                    <p className="text-xs text-text-faint truncate">{u.bio}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFollow(u.username)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors flex-shrink-0 ${
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
        </section>
      )}

      {/* Kullanıcı sonuçları */}
      {filteredUsers.length > 0 && (
        <section>
          <h2 className="text-xs uppercase tracking-widest text-text-faint mb-3">Kullanıcılar</h2>
          <div className="space-y-2">
            {filteredUsers.map((u) => {
              const theirPosts = mockPosts.filter((p) => p.user.username === u.username);
              const compat = calcCompatibility(myPosts, theirPosts);
              const isFollowing = followedUsers.has(u.username);
              return (
                <div key={u.username}
                  className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated border border-border-subtle">
                  <div className="w-10 h-10 rounded-full bg-bg border border-border flex items-center justify-center font-semibold text-text-muted flex-shrink-0">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--text)]">{u.name}</span>
                      <span className="text-xs text-text-muted">@{u.username}</span>
                      {compat > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                          %{compat} uyum
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-faint truncate">{u.bio}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFollow(u.username)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors flex-shrink-0 ${
                      isFollowing
                        ? "border-border text-text-muted hover:border-red-400/50 hover:text-red-400"
                        : "border-accent/40 text-accent hover:bg-accent/10"
                    }`}
                  >
                    {isFollowing ? "Takip Ediliyor" : "Takip Et"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Arama yokken: tarzına uygun şarkılar — başka insanların paylaştığı */}
      {!q && discoverPosts.length > 0 && (
        <section>
          <h2 className="text-xs uppercase tracking-widest text-text-faint mb-3">
            Tarzına uygun şarkılar (başkalarının paylaşımları)
          </h2>
          <div>
            {discoverPosts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {!q && discoverPosts.length === 0 && (
        <p className="text-sm text-text-muted py-8 text-center">
          Tarzına uygun başka paylaşım henüz yok. Arama yaparak şarkı bulabilirsin.
        </p>
      )}

      {/* Arama varken: şarkı/post sonuçları */}
      {isUserSearch ? null : q ? (
        <>
          {filteredUsers.length > 0 && filteredPosts.length > 0 && (
            <h2 className="text-xs uppercase tracking-widest text-text-faint mb-3">Şarkılar</h2>
          )}
          {filteredPosts.length === 0 && !filteredUsers.length ? (
            <p className="text-sm text-text-muted py-8 text-center">Sonuç bulunamadı.</p>
          ) : (
            <div>
              {filteredPosts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
