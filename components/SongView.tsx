"use client";

import Link from "next/link";
import { ArrowLeft, Music2 } from "lucide-react";
import { mockPosts, parseSongSlug } from "@/lib/mockData";
import Post from "./Post";

interface SongViewProps { slug: string; }

export default function SongView({ slug }: SongViewProps) {
  const { title, artist } = parseSongSlug(slug);

  const songPosts = mockPosts.filter(
    (p) => p.song.title === title && p.song.artist === artist
  );

  const firstPost = songPosts[0];
  const cover = firstPost?.song.cover;

  // Paylaşan kullanıcılar (tekrarsız)
  const sharers = songPosts
    .map((p) => ({ user: p.user, note: (p as any).note as string | undefined, createdAt: p.createdAt }))
    .filter((s, i, arr) => arr.findIndex((x) => x.user.username === s.user.username) === i);

  // Tüm genreler
  const allVibes = [...new Set(songPosts.flatMap((p) => p.vibe))];

  if (!firstPost) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-text-muted">Şarkı bulunamadı.</p>
        <Link href="/" className="text-accent text-sm mt-4 inline-block hover:underline">← Geri dön</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-6">

      {/* Geri */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-text-faint hover:text-[var(--text)] transition-colors text-sm mb-6">
        <ArrowLeft className="w-4 h-4" />
        Geri
      </Link>

      {/* Şarkı başlığı */}
      <div className="flex gap-5 mb-8">
        <div className="w-28 h-28 rounded-2xl overflow-hidden bg-bg-elevated flex-shrink-0">
          {cover
            ? <img src={cover} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center"><Music2 className="w-8 h-8 text-text-faint" /></div>}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h1 className="font-serif text-3xl text-[var(--text)] leading-tight">{title}</h1>
          <p className="text-text-muted mt-1">{artist}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {allVibes.map((g) => (
              <span key={g} className="text-[10px] px-2 py-0.5 rounded-full border border-border-subtle text-text-faint">{g}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Paylaşanlar */}
      <section className="mb-8">
        <h2 className="text-xs uppercase tracking-widest text-text-faint mb-4">
          {sharers.length} kişi paylaştı
        </h2>
        <div className="space-y-3">
          {sharers.map((s) => (
            <div key={s.user.username} className="flex items-start gap-3 p-3 rounded-xl bg-bg-elevated border border-border-subtle">
              <div className="w-8 h-8 rounded-full bg-bg border border-border flex items-center justify-center text-sm font-semibold text-text-muted flex-shrink-0">
                {s.user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-[var(--text)]">{s.user.name}</span>
                  <span className="text-xs text-text-faint">@{s.user.username}</span>
                </div>
                {s.note && (
                  <p className="text-sm text-text-muted italic mt-1">"{s.note}"</p>
                )}
              </div>
              <button className="text-xs px-3 py-1 rounded-full border border-accent/40 text-accent hover:bg-accent/10 transition-colors flex-shrink-0">
                Takip
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Tüm paylaşımlar */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-text-faint mb-4">
          Paylaşımlar
        </h2>
        <div>
          {songPosts.map((p) => (
            <Post key={p.id} post={p} defaultShowComments={true} />
          ))}
        </div>
      </section>
    </div>
  );
}
