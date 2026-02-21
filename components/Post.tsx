"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bookmark, Play, Pause, Music2, Repeat2, MessageCircle, Scissors, Trash2, MoreHorizontal, Ban } from "lucide-react";
import Link from "next/link";
import { useBannedSongs } from "@/contexts/BannedSongsContext";
import { formatDistanceToNow } from "date-fns";
import { mockComments, mockPosts } from "@/lib/mockData";
import { getCardAccent, formatClipTime } from "@/lib/colorUtils";
import PlatformIcon from "./PlatformIcon";
import dynamic from "next/dynamic";

const CommentSection   = dynamic(() => import("./CommentSection"),   { ssr: false });
const SameSongModal    = dynamic(() => import("./SameSongModal"),    { ssr: false });
const SongDetailModal  = dynamic(() => import("./SongDetailModal"),  { ssr: false });

type MediaType = "image" | "video";

interface PlatformLink { platform: string; url: string; }

interface PostProps {
  post: {
    id: string;
    user: { name: string; username: string; avatar?: string };
    song: { title: string; artist: string; cover?: string; spotifyUrl?: string };
    media?: { type: MediaType; url: string };
    note?: string;
    clip?: { start: number; end: number };
    vibe: string[];
    resonance: number;
    createdAt: Date | string;
  };
  onDelete?: (id: string) => void;
  isOwn?: boolean;
}

function formatDate(date: Date | string): string {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return "";
    return formatDistanceToNow(d, { addSuffix: true });
  } catch { return ""; }
}

const NOTE_CHARS = ["♪", "♫", "♩", "♬", "𝅘𝅥𝅮"];

function NoteButton({ count }: { count: number }) {
  const [notes, setNotes] = useState<{ id: number; char: string; tx: number }[]>([]);
  const [active, setActive] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setActive(true);
    const newNotes = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      char: NOTE_CHARS[Math.floor(Math.random() * NOTE_CHARS.length)],
      tx: Math.round((Math.random() - 0.5) * 60),
    }));
    setNotes((p) => [...p, ...newNotes]);
    setTimeout(() => {
      setNotes((p) => p.filter((n) => !newNotes.find((nn) => nn.id === n.id)));
      setActive(false);
    }, 950);
  }, []);

  return (
    <button type="button" onClick={handleClick}
      className={`relative flex items-center gap-1.5 transition-colors ${active ? "text-accent" : "text-text-muted hover:text-accent"}`}>
      <Music2 className={`w-4 h-4 transition-transform ${active ? "scale-125" : ""}`} />
      {count > 0 && <span className="tabular-nums text-xs">{count}</span>}
      {notes.map((n) => (
        <span key={n.id} className="note-particle" style={{ "--tx": `${n.tx}px` } as React.CSSProperties}>{n.char}</span>
      ))}
    </button>
  );
}

function detectPlatform(url: string): string {
  if (url.includes("spotify.com"))    return "spotify";
  if (url.includes("music.apple.com")) return "appleMusic";
  if (url.includes("youtube.com/") || url.includes("youtu.be/")) return "youtube";
  if (url.includes("soundcloud.com")) return "soundcloud";
  if (url.includes("deezer.com"))     return "deezer";
  if (url.includes("tidal.com"))      return "tidal";
  return "unknown";
}

function buildAudioUrl(url: string, startSec?: number): string | null {
  const p = detectPlatform(url);
  const st = startSec ? Math.floor(startSec) : 0;
  if (p === "spotify") {
    const m = url.match(/spotify\.com\/(?:intl-[a-z]{2}\/)?track\/([a-zA-Z0-9]+)/);
    return m ? `https://open.spotify.com/embed/track/${m[1]}?utm_source=generator&theme=0&autoplay=1` : null;
  }
  if (p === "youtube") {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    const sp = st > 0 ? `&start=${st}` : "";
    return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1&controls=0&rel=0&modestbranding=1&showinfo=0&fs=0${sp}` : null;
  }
  if (p === "soundcloud") return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true&hide_related=true&show_comments=false&show_user=false`;
  if (p === "deezer") { const m = url.match(/deezer\.com\/(?:[a-z]{2}\/)?track\/(\d+)/); return m ? `https://widget.deezer.com/widget/dark/track/${m[1]}` : null; }
  if (p === "appleMusic") return url.replace("https://music.apple.com/", "https://embed.music.apple.com/");
  if (p === "tidal") { const m = url.match(/tidal\.com\/(?:browse\/)?track\/(\d+)/); return m ? `https://embed.tidal.com/tracks/${m[1]}?layout=gridify` : null; }
  return null;
}


const ME_USERNAME = "ayse_music";

export default function Post({ post, defaultShowComments = false, onDelete, isOwn }: PostProps & { defaultShowComments?: boolean }) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [platformLinks, setPlatformLinks] = useState<PlatformLink[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [showComments, setShowComments] = useState(defaultShowComments);
  const [reshared, setReshared] = useState(false);
  const [showSameSong, setShowSameSong] = useState(false);
  const [showSongDetail, setShowSongDetail] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const canDelete = isOwn ?? post.user.username === ME_USERNAME;
  const { add: addBanned } = useBannedSongs();

  const songUrl = post.song.spotifyUrl;
  const platform = songUrl ? detectPlatform(songUrl) : "unknown";
  const hasEmbed = !!songUrl && platform !== "unknown";
  const hasUserMedia = !!post.media;

  const thumbSrc = hasUserMedia && post.media!.type === "image"
    ? post.media!.url
    : post.song.cover;

  const audioUrl = songUrl ? buildAudioUrl(songUrl, post.clip?.start) : null;
  const cardAccent = getCardAccent(post.song.title);

  // Platform linklerini mount'ta çek
  useEffect(() => {
    if (!songUrl) return;
    setLoadingLinks(true);
    const params = new URLSearchParams({
      url: songUrl,
      title: post.song.title,
      artist: post.song.artist,
    });
    fetch(`/api/platforms?${params}`)
      .then((r) => r.json())
      .then((d) => setPlatformLinks(d.links ?? []))
      .catch(() => setPlatformLinks([]))
      .finally(() => setLoadingLinks(false));
  }, [songUrl, post.song.title, post.song.artist]);

  // Fallback: API yoksa elimizdeki tek linki göster
  const displayLinks: PlatformLink[] = platformLinks.length > 0
    ? platformLinks
    : (songUrl ? [{ platform, url: songUrl }] : []);

  // Aynı şarkıyı paylaşan diğer kullanıcılar
  const sameSongUsers = mockPosts
    .filter((p) => p.id !== post.id && p.song.title === post.song.title && p.song.artist === post.song.artist)
    .map((p) => p.user)
    .filter((u, i, arr) => arr.findIndex((x) => x.username === u.username) === i);

  // Yorum sayısı
  const postComments = mockComments.filter((c) => c.postId === post.id);

  // Başka bir post çalmaya başladığında bu postu durdur
  useEffect(() => {
    const handler = (e: Event) => {
      const { id } = (e as CustomEvent).detail;
      if (id !== post.id) setShowPlayer(false);
    };
    window.addEventListener("ms:play", handler);
    return () => window.removeEventListener("ms:play", handler);
  }, [post.id]);

  const handlePlayClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasEmbed) return;
    setShowPlayer((prev) => {
      const next = !prev;
      if (next) window.dispatchEvent(new CustomEvent("ms:play", { detail: { id: post.id } }));
      return next;
    });
  }, [hasEmbed, post.id]);

  const handleReshare = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setReshared(true);
    setTimeout(() => setReshared(false), 2000);
  }, []);

  if (deleted) return null;

  const handleDelete = () => {
    setDeleted(true);
    onDelete?.(post.id);
    setShowMenu(false);
  };

  const handleAddToBanned = () => {
    addBanned({
      title: post.song.title,
      artist: post.song.artist,
      cover: post.song.cover,
      link: post.song.spotifyUrl,
    });
    setShowMenu(false);
  };

  return (
    <article
      className="relative rounded-2xl overflow-hidden mb-3 bg-bg-elevated ring-1 ring-border-subtle hover:ring-border hover:shadow-lg hover:shadow-black/20 hover:scale-[1.01] transition-all duration-200 cursor-pointer"
      style={{ borderLeft: `3px solid ${cardAccent}` }}
      onClick={() => setShowSongDetail(true)}
    >
      {/* Blur backdrop */}
      {thumbSrc && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <img src={thumbSrc} alt="" className="w-full h-full object-cover scale-150 blur-3xl opacity-[0.08]" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-elevated/60 to-bg-elevated/95" />
        </div>
      )}

      <div className="relative flex gap-4 p-4">

        {/* ── Görsel — olabildiğince büyük ── */}
        <div className="post-thumbnail relative flex-shrink-0 w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-xl overflow-hidden bg-bg" onClick={(e) => e.stopPropagation()}>

          {/* Ses iframe — EN ALTTA */}
          {showPlayer && hasEmbed && audioUrl && (
            <iframe key={audioUrl} src={audioUrl}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="absolute inset-0 w-full h-full border-0" style={{ zIndex: 0 }} />
          )}

          {/* Kullanıcı videosu */}
          {hasUserMedia && post.media!.type === "video" && (
            <>
              {post.song.cover && (
                <img src={post.song.cover} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 1 }} />
              )}
              <video src={post.media!.url} poster={post.song.cover}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay muted loop playsInline preload="auto" style={{ zIndex: 2 }} />
            </>
          )}

          {/* Görsel / albüm kapağı */}
          {thumbSrc && !(hasUserMedia && post.media!.type === "video") && (
            <img src={thumbSrc} alt="" className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 2 }}
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }} />
          )}

          {/* Boş */}
          {!thumbSrc && !hasUserMedia && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
              <Music2 className="w-10 h-10 text-text-faint" />
            </div>
          )}

          {/* Clip rozeti */}
          {post.clip && (
            <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full px-2 py-0.5 pointer-events-none"
              style={{ zIndex: 8, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)" }}>
              <Scissors className="w-2.5 h-2.5" style={{ color: cardAccent }} />
              <span className="text-[9px] tabular-nums" style={{ color: cardAccent }}>
                {formatClipTime(post.clip.start)} → {formatClipTime(post.clip.end)}
              </span>
            </div>
          )}

{showPlayer && (
  <div
    className="absolute inset-0 pointer-events-none rounded-xl animate-pulse"
    style={{
      zIndex: 6,
      boxShadow: `0 0 0 2px ${cardAccent}, inset 0 0 0 2px ${cardAccent}60`
    }}
  />
)}

          {/* Çalıyor → ekolayzır sol alt */}
          {showPlayer && (
            <div className="absolute bottom-2 left-2 flex items-end gap-[3px] pointer-events-none" style={{ zIndex: 7 }}>
              <span className="eq-bar" style={{ background: cardAccent, width: "3px", borderRadius: "2px" }} />
              <span className="eq-bar" style={{ background: cardAccent, width: "3px", borderRadius: "2px" }} />
              <span className="eq-bar" style={{ background: cardAccent, width: "3px", borderRadius: "2px" }} />
            </div>
          )}

          {/* Play / Pause — sağ alt */}
          {hasEmbed && (
            <button type="button" onClick={handlePlayClick}
              className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-black/75 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/90 hover:scale-110 transition-all active:scale-95"
              style={{ zIndex: 7 }}>
              {showPlayer ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          )}
        </div>

        {/* ── Sağ sütun ── */}
        <div className="flex-1 min-w-0 flex flex-col" style={{ minHeight: "clamp(128px, 30vw, 192px)" }}>

          {/* Kullanıcı + zaman — kim paylaştı net olsun, orantılı */}
          <div className={`flex items-center gap-2 mb-3 min-w-0 ${canDelete ? "pl-2 -ml-2 border-l-2 border-accent/50" : ""}`}>
            <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${canDelete ? "bg-accent/15 border-accent/40 text-accent" : "bg-bg border-border text-text-muted"}`}>
              {post.user.name.charAt(0).toUpperCase()}
            </div>
            <Link
              href={post.user.username === ME_USERNAME ? "/profile" : `/user/${post.user.username}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[0.9375rem] font-medium text-[var(--text)] truncate hover:text-accent transition-colors leading-tight"
            >
              {post.user.name}
            </Link>
            <span className="text-border text-xs flex-shrink-0">·</span>
            <span className="text-text-faint text-xs whitespace-nowrap flex-shrink-0">{formatDate(post.createdAt)}</span>
            {/* Üç nokta menüsü */}
            {canDelete && (
              <div className="relative ml-auto" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setShowMenu((v) => !v)}
                  className="text-text-faint hover:text-text-muted transition-colors p-0.5"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-6 z-20 bg-bg-elevated border border-border rounded-xl shadow-xl overflow-hidden min-w-40">
                      <button
                        type="button"
                        onClick={handleAddToBanned}
                        className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-text-muted hover:bg-bg hover:scale-[1.02] transition-all border-b border-border-subtle"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        Yasaklılara ekle
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Sil
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Şarkı adı + sanatçı */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowSongDetail(true); }}
            className="block text-left font-serif text-[var(--text)] leading-tight mb-1 line-clamp-2 hover:text-accent transition-colors"
            style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.45rem)" }}
          >
            {post.song.title}
          </button>
          <p className="text-text-muted text-sm truncate mb-1">{post.song.artist}</p>

          {/* Kullanıcı notu */}
          {post.note && (
            <p className="text-xs text-text-faint italic leading-relaxed mb-2 line-clamp-2">
              "{post.note}"
            </p>
          )}

          {/* Genre etiketleri */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.vibe.slice(0, 3).map((g) => (
              <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-bg/40"
                style={{ border: `1px solid ${cardAccent}40`, color: cardAccent }}>
                {g}
              </span>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Platform linkleri */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {loadingLinks
              ? <span className="text-[10px] text-text-faint animate-pulse">yükleniyor...</span>
              : displayLinks.map((link) => (
                  <div key={link.platform} onClick={(e) => e.stopPropagation()}>
                    <PlatformIcon platform={link.platform} url={link.url} variant="badge" />
                  </div>
                ))
            }
          </div>

          {/* Alt satır: sol = "X kişi daha paylaştı", sağ = aksiyon ikonları */}
          <div className="flex items-center justify-between gap-3" onClick={(e) => e.stopPropagation()}>
            {/* Sol: X kişi daha paylaştı + avatarlar — orantılı, ikonlarla aynı hizada */}
            {sameSongUsers.length > 0 ? (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowSameSong(true); }}
                className="flex items-center gap-1.5 min-w-0 group"
              >
                <span className="text-[10px] text-text-faint group-hover:text-accent transition-colors whitespace-nowrap truncate">
                  {sameSongUsers.length > 99
                    ? `${sameSongUsers.length}+ kişi daha paylaştı`
                    : `${sameSongUsers.length} kişi daha paylaştı`}
                </span>
                <div className="flex -space-x-1 flex-shrink-0">
                  {sameSongUsers.slice(0, 4).map((u) => (
                    <div key={u.username}
                      className="w-4 h-4 rounded-full bg-bg border border-bg-elevated flex items-center justify-center text-[8px] font-semibold text-text-muted">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {sameSongUsers.length > 4 && (
                    <div className="w-4 h-4 rounded-full bg-bg border border-bg-elevated flex items-center justify-center text-[7px] font-semibold text-text-faint">
                      +{sameSongUsers.length - 4}
                    </div>
                  )}
                </div>
              </button>
            ) : (
              <div />
            )}

            {/* Sağ: Aksiyon ikonları */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={handleReshare}
                className={`flex items-center gap-1 transition-colors ${reshared ? "text-accent" : "text-text-muted hover:text-accent"}`}
                title="Profilinde paylaş"
              >
                <Repeat2 className={`w-4 h-4 transition-transform ${reshared ? "scale-110" : ""}`} />
                {reshared && <span className="text-[10px]">paylaşıldı</span>}
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowComments((v) => !v); }}
                className={`flex items-center gap-1.5 transition-colors ${showComments ? "text-accent" : "text-text-muted hover:text-accent"}`}
              >
                <MessageCircle className="w-4 h-4" />
                {postComments.length > 0 && <span className="text-xs tabular-nums">{postComments.length}</span>}
              </button>
              <NoteButton count={post.resonance} />
              <button type="button" className="text-text-muted hover:text-[var(--text)] transition-colors">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Yorumlar */}
      {showComments && (
        <div onClick={(e) => e.stopPropagation()}>
          <CommentSection comments={postComments} />
        </div>
      )}

      {/* Modaller body'e portal ile — karttaki transform modalı bozmasın */}
      {typeof document !== "undefined" && showSameSong && createPortal(
        <SameSongModal
          songTitle={post.song.title}
          artist={post.song.artist}
          users={sameSongUsers}
          onClose={() => setShowSameSong(false)}
        />,
        document.body
      )}
      {typeof document !== "undefined" && showSongDetail && createPortal(
        <SongDetailModal
          title={post.song.title}
          artist={post.song.artist}
          onClose={() => setShowSongDetail(false)}
        />,
        document.body
      )}
    </article>
  );
}
