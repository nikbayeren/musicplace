"use client";

import { useState, useEffect } from "react";
import { Ghost, Mail, MailOpen, Play, Pause, Repeat2, Music2, Clock } from "lucide-react";
import { AnonymousDrop } from "@/lib/mockData";
import { getCardAccent } from "@/lib/colorUtils";
import PlatformIcon from "./PlatformIcon";

interface PlatformLink { platform: string; url: string; }

function buildAudioUrl(url: string): string | null {
  if (url.includes("spotify.com")) {
    const m = url.match(/spotify\.com\/(?:intl-[a-z]{2}\/)?track\/([a-zA-Z0-9]+)/);
    return m ? `https://open.spotify.com/embed/track/${m[1]}?utm_source=generator&theme=0&autoplay=1` : null;
  }
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1&controls=0&rel=0&modestbranding=1&showinfo=0&fs=0` : null;
  }
  if (url.includes("soundcloud.com"))
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true&hide_related=true&show_comments=false&show_user=false`;
  return null;
}

function daysLeft(createdAt: string): number {
  const expires = new Date(createdAt).getTime() + 7 * 24 * 60 * 60 * 1000;
  return Math.max(0, Math.ceil((expires - Date.now()) / (24 * 60 * 60 * 1000)));
}

function daysSince(createdAt: string): number {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / (24 * 60 * 60 * 1000));
}

// Deterministic ama gerçekçi hissettiren ipuçları
// Her drop ID → farklı ipucu seti; geçen güne göre kademeli açılır
const HINT_POOLS = {
  follow: [
    "Sizi takip eden biri",
    "Takip ettiğiniz biri",
    "Yakın zamanda sizi takip eden biri",
    "3 ortak takipçiniz olan biri",
    "Aynı kişileri takip eden biri",
  ],
  compat: [
    "%74 müzik uyumunuz var",
    "%81 müzik uyumunuz var",
    "%68 müzik uyumunuz var",
    "Müzik zevkleriniz çok benzer",
    "Sizinle 5 ortak sanatçısı olan biri",
    "Aynı türleri seven biri",
  ],
  behavior: [
    "Son paylaşımlarınızı beğenen biri",
    "Profilinizi sık ziyaret eden biri",
    "Bu şarkıyı da paylaşmış biri",
    "Aynı şarkıyı farklı zamanlarda dinleyen biri",
    "Bir postunuza yorum yapan biri",
    "Koleksiyonlarınıza bakan biri",
  ],
};

function strHash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return Math.abs(h >>> 0);
}

function getDropHints(dropId: string, daysElapsed: number): string[] {
  const seed = strHash(dropId);
  const followHint  = HINT_POOLS.follow  [seed        % HINT_POOLS.follow.length];
  const compatHint  = HINT_POOLS.compat  [(seed >> 3)  % HINT_POOLS.compat.length];
  const behaviorHint = HINT_POOLS.behavior[(seed >> 6) % HINT_POOLS.behavior.length];

  // Kademeli açılım: geçen güne göre kaç ipucu göster
  if (daysElapsed <= 1) return [followHint];
  if (daysElapsed <= 3) return [followHint, compatHint];
  return [followHint, compatHint, behaviorHint];
}

interface Props {
  drop: AnonymousDrop;
  onReshare?: (drop: AnonymousDrop) => void;
  onReply?: (drop: AnonymousDrop) => void;
}

export default function AnonymousDropCard({ drop, onReshare, onReply }: Props) {
  const [phase, setPhase] = useState<"sealed" | "opening" | "open">("sealed");
  const [showPlayer, setShowPlayer] = useState(false);
  const [reshared, setReshared] = useState(false);
  const [platformLinks, setPlatformLinks] = useState<PlatformLink[]>([]);

  const remaining = daysLeft(drop.createdAt);
  const elapsed   = daysSince(drop.createdAt);
  const hints     = getDropHints(drop.id, elapsed);
  const accent = getCardAccent(drop.song.title);
  const audioUrl = drop.song.spotifyUrl ? buildAudioUrl(drop.song.spotifyUrl) : null;

  // Fetch platform links when opened
  useEffect(() => {
    if (phase !== "open" || !drop.song.spotifyUrl) return;
    const params = new URLSearchParams({
      url: drop.song.spotifyUrl,
      title: drop.song.title,
      artist: drop.song.artist,
    });
    fetch(`/api/platforms?${params}`)
      .then((r) => r.json())
      .then((d) => setPlatformLinks(d.links ?? []))
      .catch(() => {});
  }, [phase, drop.song.spotifyUrl, drop.song.title, drop.song.artist]);

  const handleOpen = () => {
    if (phase !== "sealed") return;
    setPhase("opening");
    setTimeout(() => setPhase("open"), 650);
  };

  const urgencyColor =
    remaining <= 1 ? "#ef4444" :
    remaining <= 3 ? "#f97316" :
    "var(--text-faint)";

  // ── SEALED ──────────────────────────────────────────────────
  if (phase === "sealed" || phase === "opening") {
    return (
      <div
        onClick={handleOpen}
        className="relative rounded-2xl border border-border-subtle bg-bg-elevated overflow-hidden cursor-pointer hover:border-accent/30 transition-all duration-300 group"
        style={{ borderLeft: `3px solid ${accent}40` }}
      >
        {/* Zarf açılma animasyonu overlay */}
        {phase === "opening" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg-elevated/80 backdrop-blur-sm">
            <MailOpen
              className="w-10 h-10 animate-bounce"
              style={{ color: accent }}
            />
          </div>
        )}

        <div className="flex items-center gap-4 p-4">
          {/* Zarf ikonu */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-300 group-hover:scale-105"
            style={{ background: `${accent}15`, borderColor: `${accent}30` }}
          >
            <Mail className="w-6 h-6 transition-all duration-300 group-hover:scale-110" style={{ color: accent }} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-[var(--text)] font-medium">Anonim bir şarkı</p>

            {/* Kademeli ipuçları */}
            <div className="mt-1 space-y-0.5">
              {hints.map((h, i) => (
                <p key={i} className="text-xs text-text-faint flex items-center gap-1">
                  <Ghost className="w-3 h-3 flex-shrink-0 opacity-60" />
                  {h}
                </p>
              ))}
              {elapsed <= 3 && (
                <p className="text-[10px] text-text-faint opacity-50 italic pl-4">
                  {3 - Math.min(elapsed, 3)} gün sonra yeni ipucu açılacak
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 mt-1.5">
              <Clock className="w-3 h-3 flex-shrink-0" style={{ color: urgencyColor }} />
              <span className="text-[10px]" style={{ color: urgencyColor }}>
                {remaining === 0 ? "Son gün!" : `${remaining} gün sonra kaybolacak`}
              </span>
            </div>
          </div>

          <div
            className="text-xs px-3 py-1.5 rounded-full border transition-colors flex-shrink-0 group-hover:opacity-80"
            style={{ borderColor: `${accent}50`, color: accent, background: `${accent}12` }}
          >
            Aç
          </div>
        </div>
      </div>
    );
  }

  // ── OPEN ────────────────────────────────────────────────────
  return (
    <div
      className="relative rounded-2xl border border-border-subtle bg-bg-elevated overflow-hidden"
      style={{
        borderLeft: `3px solid ${accent}`,
        animation: "dropReveal 0.45s cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      <style>{`
        @keyframes dropReveal {
          from { opacity: 0; transform: translateY(-12px) scaleY(0.92); }
          to   { opacity: 1; transform: translateY(0)     scaleY(1);    }
        }
      `}</style>

      {/* Ses iframe (gizli) */}
      {showPlayer && audioUrl && (
        <iframe key={audioUrl} src={audioUrl}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="absolute w-1 h-1 opacity-0 pointer-events-none" style={{ zIndex: 0 }} />
      )}

      <div className="flex gap-4 p-4">
        {/* Kapak */}
        <div className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-bg">
          {drop.song.cover
            ? <img src={drop.song.cover} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center"><Music2 className="w-6 h-6 text-text-faint" /></div>
          }
          {/* Play butonu */}
          {audioUrl && (
            <button
              type="button"
              onClick={() => setShowPlayer((v) => !v)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors"
            >
              {showPlayer
                ? <Pause className="w-5 h-5 text-white" />
                : <Play  className="w-5 h-5 text-white ml-0.5" />
              }
            </button>
          )}
          {showPlayer && (
            <div className="absolute inset-0 pointer-events-none rounded-xl"
              style={{ boxShadow: `inset 0 0 0 2px ${accent}80` }} />
          )}
        </div>

        {/* Sağ */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <p className="font-serif text-[var(--text)] leading-tight truncate">{drop.song.title}</p>
              <p className="text-xs text-text-muted truncate">{drop.song.artist}</p>
            </div>
            {/* Geri sayım */}
            <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
              <Clock className="w-3 h-3" style={{ color: urgencyColor }} />
              <span className="text-[10px] tabular-nums" style={{ color: urgencyColor }}>
                {remaining === 0 ? "Son gün" : `${remaining}g`}
              </span>
            </div>
          </div>

          {/* İpuçları */}
          {hints.length > 0 && (
            <div className="mb-2 space-y-0.5">
              {hints.map((h, i) => (
                <p key={i} className="text-[10px] text-text-faint flex items-center gap-1">
                  <Ghost className="w-3 h-3 flex-shrink-0 opacity-60" />
                  {h}
                </p>
              ))}
            </div>
          )}

          {/* Platform linkleri */}
          {platformLinks.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {platformLinks.map((link) => (
                <PlatformIcon key={link.platform} platform={link.platform} url={link.url} variant="badge" />
              ))}
            </div>
          )}

          {/* Aksiyonlar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Paylaş */}
            <button
              type="button"
              onClick={() => { setReshared(true); onReshare?.(drop); }}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
                reshared
                  ? "border-accent/40 text-accent bg-accent/10"
                  : "border-border-subtle text-text-muted hover:border-accent/30 hover:text-accent"
              }`}
            >
              <Repeat2 className="w-3.5 h-3.5" />
              {reshared ? "Feed'ine eklendi" : "Paylaşmak istiyorum"}
            </button>

            {/* Anonim cevap */}
            <button
              type="button"
              onClick={() => onReply?.(drop)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border-subtle text-text-muted hover:border-accent/30 hover:text-accent transition-colors"
            >
              <Ghost className="w-3.5 h-3.5" />
              Cevap ver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
