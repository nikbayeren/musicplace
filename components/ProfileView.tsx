"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Post from "./Post";
import { mockPosts, mockUsers, mockCollections, mockAnonymousDrops, Collection } from "@/lib/mockData";
import { Ghost, Music2, Skull } from "lucide-react";
import PlatformIcon from "./PlatformIcon";
import CreateCollection from "./CreateCollection";
import BannedSongsFragment from "./BannedSongsFragment";
import BannedNamesFragment from "./BannedNamesFragment";

const CollectionModal      = dynamic(() => import("./CollectionModal"),      { ssr: false });
const AnonymousDropModal   = dynamic(() => import("./AnonymousDropModal"),   { ssr: false });
const AnonymousDropCard    = dynamic(() => import("./AnonymousDropCard"),    { ssr: false });
const EditProfileModal     = dynamic(() => import("./EditProfileModal"),     { ssr: false });
const FollowListModal      = dynamic(() => import("./FollowListModal"),      { ssr: false });

const PROFILE_USERNAME = "ayse_music";
const IS_OWN_PROFILE = true;
const PROFILE_BG_KEY = "musicshare_profile_bg";

export default function ProfileView() {
  const [following, setFollowing] = useState(false);
  const [openCollection, setOpenCollection] = useState<Collection | null>(null);
  const [showDropModal, setShowDropModal] = useState(false);
  const [replyDrop, setReplyDrop] = useState<typeof mockAnonymousDrops[0] | null>(null);
  const [dropsOpen, setDropsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"songs" | "collections" | "banned">("songs");
  const [bannedSubTab, setBannedSubTab] = useState<"songs" | "names">("songs");
  const [extraCollections, setExtraCollections] = useState<Collection[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowList, setShowFollowList] = useState<"followers" | "following" | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileUsername, setProfileUsername] = useState<string | null>(null);
  const [profileBio, setProfileBio] = useState<string | null>(null);
  const [profileBackground, setProfileBackground] = useState<string>("");
  const [deletedPostIds, setDeletedPostIds] = useState<Set<string>>(new Set());
  const [willLinks, setWillLinks] = useState<{ platform: string; url: string }[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = localStorage.getItem(`${PROFILE_BG_KEY}_${PROFILE_USERNAME}`);
    setProfileBackground(v ?? "");
  }, []);

  useEffect(() => {
    const will = (profileUser as any).musicWill;
    if (!will?.spotifyUrl) return;
    const params = new URLSearchParams({ url: will.spotifyUrl, title: will.title, artist: will.artist });
    fetch(`/api/platforms?${params}`)
      .then((r) => r.json())
      .then((d) => setWillLinks(d.links ?? []))
      .catch(() => {});
  }, []);
  const profileUser = mockUsers.find((u) => u.username === PROFILE_USERNAME)!;
  const displayName     = profileName     ?? profileUser.name;
  const displayUsername = profileUsername ?? profileUser.username;
  const displayBio      = profileBio      ?? profileUser.bio;
  const userPosts = mockPosts
    .filter((p) => p.user.username === PROFILE_USERNAME)
    .filter((p) => !deletedPostIds.has(p.id));

  // Genre dağılımını paylaşılan şarkılardan hesapla
  const genreCount: Record<string, number> = {};
  userPosts.forEach((p) =>
    p.vibe.forEach((g) => {
      genreCount[g] = (genreCount[g] || 0) + 1;
    })
  );
  const totalGenres = Object.values(genreCount).reduce((a, b) => a + b, 0);
  const genreDistribution = Object.entries(genreCount)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
    .map((x) => x.genre);

  const totalResonance = userPosts.reduce((sum, p) => sum + p.resonance, 0);

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
    <div className={`space-y-10 max-w-2xl mx-auto relative z-0 ${/^(https?:\/\/|data:image\/)/i.test(profileBackground || "") ? "profile-bg-image" : ""}`}>
      {/* Profil başlığı */}
      <div className="border-b border-border-subtle pb-8 profile-header-text">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-bg-elevated border border-border flex items-center justify-center font-serif text-3xl text-text-muted flex-shrink-0">
            {profileUser.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-serif text-3xl text-[var(--text)]">{displayName}</h1>
              {IS_OWN_PROFILE && (
                <button
                  type="button"
                  onClick={() => setShowEditModal(true)}
                  className="text-xs px-2.5 py-1 rounded-full border border-border-subtle text-text-muted hover:border-accent/40 hover:text-accent transition-colors"
                >
                  Düzenle
                </button>
              )}
            </div>
            <p className="text-text-muted text-sm mt-1">@{displayUsername}</p>
            <p className="text-text-muted mt-3 max-w-md">{displayBio}</p>

            {!IS_OWN_PROFILE && (
              <div className="flex items-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setFollowing((v) => !v)}
                  className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    following
                      ? "border border-border text-text-muted hover:border-red-400/50 hover:text-red-400"
                      : "bg-accent text-bg hover:bg-accent-hover"
                  }`}
                >
                  {following ? "Takip Ediliyor" : "Takip Et"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDropModal(true)}
                  title="Anonim şarkı bırak"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-subtle text-text-muted hover:border-accent/40 hover:text-accent transition-colors text-sm"
                >
                  <Ghost className="w-3.5 h-3.5" />
                  <span className="text-xs">Anonim Bırak</span>
                </button>
              </div>
            )}

            <div className="flex gap-6 mt-5 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-wider text-text-faint">Nota</p>
                <p className="text-[var(--text)] font-medium tabular-nums mt-0.5">{totalResonance}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-text-faint">Paylaşım</p>
                <p className="text-[var(--text)] font-medium tabular-nums mt-0.5">{userPosts.length}</p>
              </div>
              <button type="button" onClick={() => setShowFollowList("followers")} className="text-left hover:opacity-80 transition-opacity">
                <p className="text-xs uppercase tracking-wider text-text-faint">Takipçi</p>
                <p className="text-[var(--text)] font-medium tabular-nums mt-0.5">{(profileUser as any).followers ?? 0}</p>
              </button>
              <button type="button" onClick={() => setShowFollowList("following")} className="text-left hover:opacity-80 transition-opacity">
                <p className="text-xs uppercase tracking-wider text-text-faint">Takip</p>
                <p className="text-[var(--text)] font-medium tabular-nums mt-0.5">{(profileUser as any).following ?? 0}</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Müzik Vasiyeti — kompakt tek satır */}
      {(() => {
        const will = (profileUser as any).musicWill;
        if (!will) return null;

        return (
          <div className="flex items-center gap-2 px-1 flex-wrap profile-header-text">
            <Skull className="w-4 h-4 text-text-faint flex-shrink-0" />
            <span className="text-sm text-text-faint flex-shrink-0">Vasiyet:</span>
            {will.cover && (
              <img src={will.cover} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
            )}
            <span className="text-sm text-text-muted min-w-0 truncate">
              {will.title}
              <span className="text-text-faint"> — {will.artist}</span>
            </span>

            {willLinks.length > 0 && (
              <div className="flex items-center gap-1 flex-shrink-0">
                {willLinks.slice(0, 4).map((link) => (
                  <PlatformIcon key={link.platform} platform={link.platform} url={link.url} variant="icon" />
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Senin sound'un — Top 4 tür */}
      {genreDistribution.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-text-faint mb-2">Senin sound&apos;un</p>
          <div className="flex flex-wrap gap-2">
            {genreDistribution.map((genre) => (
              <span key={genre} className="px-2.5 py-1 rounded-full bg-bg-elevated border border-border-subtle text-xs text-text-muted">
                {genre}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Anonim bırakılan şarkılar — varsayılan kapalı */}
      {IS_OWN_PROFILE && (() => {
        const drops = mockAnonymousDrops.filter((d) => d.toUsername === PROFILE_USERNAME);
        if (!drops.length) return null;
        return (
          <div>
            <button
              type="button"
              onClick={() => setDropsOpen((v) => !v)}
              className="flex items-center gap-2 group w-full text-left"
            >
              <Ghost className="w-3.5 h-3.5 text-text-faint group-hover:text-accent transition-colors" />
              <span className="text-xs text-text-faint group-hover:text-accent transition-colors">
                {drops.length} anonim şarkı bırakıldı
              </span>
              <span className="text-text-faint text-xs ml-auto">{dropsOpen ? "↑" : "↓"}</span>
            </button>

            {dropsOpen && (
              <div className="mt-3 space-y-2">
                {drops.map((drop) => (
                  <AnonymousDropCard
                    key={drop.id}
                    drop={drop}
                    onReply={(d) => setReplyDrop(d)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Sekmeler */}
      <div>
        <div className="flex border-b border-border-subtle mb-6">
          {(IS_OWN_PROFILE ? ["songs", "collections", "banned"] : ["songs", "collections"]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-accent text-[var(--text)]"
                  : "border-transparent text-text-muted hover:text-[var(--text)]"
              }`}
            >
              {tab === "songs" ? "Şarkılar" : tab === "collections" ? "Koleksiyonlar" : "Yasaklılar"}
            </button>
          ))}
        </div>

        {/* Şarkılar sekmesi */}
        {activeTab === "songs" && (
          userPosts.length === 0
            ? (
                <div className="py-10 text-center">
                  <p className="text-sm font-medium text-[var(--text)] mb-1">İlk paylaşımını yap</p>
                  <p className="text-xs text-text-faint">Keşfet sayfasından şarkı paylaşarak başlayabilirsin.</p>
                </div>
              )
            : <div>{userPosts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  isOwn={IS_OWN_PROFILE}
                  onDelete={(id) => setDeletedPostIds((prev) => new Set([...prev, id]))}
                />
              ))}</div>
        )}

        {/* Koleksiyonlar sekmesi */}
        {activeTab === "collections" && (() => {
          const allCols = [
            ...mockCollections.filter((c) => c.userId === PROFILE_USERNAME),
            ...extraCollections,
          ];
          return (
            <div className="space-y-4">
              {/* Listeler — kapak odaklı, poster tarzı */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {allCols.map((col) => {
                  const colPosts = col.postIds.map((id) => mockPosts.find((p) => p.id === id)).filter(Boolean);
                  const covers = [
                    ...(col.cover ? [col.cover] : []),
                    ...colPosts.map((p) => p!.song.cover).filter(Boolean),
                  ].slice(0, 4);
                  const totalSongs = col.postIds.length + (col.importedSongs?.length ?? 0);
                  return (
                    <div
                      key={col.id}
                      onClick={() => setOpenCollection(col)}
                      className="group rounded-xl overflow-hidden bg-bg-elevated border border-border-subtle cursor-pointer hover:border-accent/40 hover:shadow-xl hover:shadow-black/30 hover:scale-[1.02] transition-all duration-200"
                    >
                      {/* Kapak alanı — Letterboxd tarzı poster odaklı */}
                      <div className="aspect-square relative">
                        {covers.length >= 4 ? (
                          <div className="grid grid-cols-2 grid-rows-2 gap-px w-full h-full">
                            {covers.slice(0, 4).map((c, i) => (
                              <img key={i} src={c} alt="" className="w-full h-full object-cover" />
                            ))}
                          </div>
                        ) : covers.length > 0 ? (
                          <img src={covers[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-bg flex items-center justify-center">
                            <Music2 className="w-12 h-12 text-text-faint" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white">
                          <p className="text-sm font-medium leading-tight line-clamp-1 drop-shadow-md">{col.title}</p>
                          <p className="text-[10px] text-white/80 mt-0.5">{totalSongs} şarkı</p>
                        </div>
                        {col.sourcePlatform && col.sourceUrl && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                            <PlatformIcon platform={col.sourcePlatform} url={col.sourceUrl} variant="icon" />
                          </div>
                        )}
                      </div>
                      {/* Mobilde altında da başlık (kapak üstü metin küçük kalmasın diye) */}
                      <div className="p-2.5 sm:hidden border-t border-border-subtle">
                        <p className="text-xs font-medium text-[var(--text)] line-clamp-1">{col.title}</p>
                        <p className="text-[10px] text-text-faint">{totalSongs} şarkı</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {IS_OWN_PROFILE && (
                <CreateCollection
                  userId={PROFILE_USERNAME}
                  onCreated={(col) => setExtraCollections((p) => [...p, col])}
                />
              )}
            </div>
          );
        })()}

        {/* Yasaklılar sekmesi — sekmeli: Şarkılar | İsimler */}
        {activeTab === "banned" && (
          <div className="space-y-4">
            <p className="text-xs text-text-faint mb-3">
              Nefret ettiğin, birini hatırlatan ya da dinlemek istemediğin şarkılar. Herkese açık listede yasaklı görünür.
            </p>
            <div className="flex border-b border-border-subtle mb-4">
              {(["songs", "names"] as const).map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setBannedSubTab(sub)}
                  className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    bannedSubTab === sub
                      ? "border-red-500/70 text-[var(--text)]"
                      : "border-transparent text-text-muted hover:text-[var(--text)]"
                  }`}
                >
                  {sub === "songs" ? "Yasaklı şarkılar" : "Yasaklı isimler"}
                </button>
              ))}
            </div>
            {bannedSubTab === "songs" && <BannedSongsFragment isOwnProfile={IS_OWN_PROFILE} />}
            {bannedSubTab === "names" && <BannedNamesFragment isOwnProfile={IS_OWN_PROFILE} />}
          </div>
        )}
      </div>
    </div>

    {openCollection && (
      <CollectionModal
        collection={openCollection}
        isOwn={IS_OWN_PROFILE}
        onUpdate={(colId, newIds) => {
          // extraCollections güncelle (yeni oluşturulanlar için)
          setExtraCollections((prev) =>
            prev.map((c) => c.id === colId ? { ...c, postIds: newIds } : c)
          );
        }}
        onClose={() => setOpenCollection(null)}
      />
    )}

    {showDropModal && (
      <AnonymousDropModal
        toName={profileUser.name}
        onClose={() => setShowDropModal(false)}
      />
    )}

    {replyDrop && (
      <AnonymousDropModal
        toName="anonim gönderici"
        onClose={() => setReplyDrop(null)}
      />
    )}

    {showEditModal && (
      <EditProfileModal
        name={displayName}
        username={displayUsername}
        bio={displayBio}
        profileBackground={profileBackground || null}
        onSave={({ name, username, bio, profileBackground: bg }) => {
          setProfileName(name);
          setProfileUsername(username);
          setProfileBio(bio);
          setProfileBackground(bg);
          try {
            if (bg) localStorage.setItem(`${PROFILE_BG_KEY}_${PROFILE_USERNAME}`, bg);
            else localStorage.removeItem(`${PROFILE_BG_KEY}_${PROFILE_USERNAME}`);
          } catch {}
        }}
        onClose={() => setShowEditModal(false)}
      />
    )}

    {showFollowList && (
      <FollowListModal
        type={showFollowList}
        username={PROFILE_USERNAME}
        onClose={() => setShowFollowList(null)}
      />
    )}
    </>
  );
}
