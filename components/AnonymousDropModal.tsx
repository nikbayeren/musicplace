"use client";

import { useEffect, useState } from "react";
import { X, Ghost, Loader2, Link as LinkIcon } from "lucide-react";

interface AnonymousDropModalProps {
  toName: string;
  onClose: () => void;
}

export default function AnonymousDropModal({ toName, onClose }: AnonymousDropModalProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [cover, setCover] = useState("");
  const [fetching, setFetching] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const isSupportedLink = (u: string) =>
    ["spotify.com", "youtube.com", "youtu.be", "soundcloud.com", "deezer.com", "music.apple.com"].some((d) => u.includes(d));

  const fetchInfo = async (link: string) => {
    if (!isSupportedLink(link)) return;
    setFetching(true);
    try {
      const res = await fetch(`/api/oembed?url=${encodeURIComponent(link)}`);
      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.artist) setArtist(data.artist);
      if (data.cover) setCover(data.cover);
    } catch { /* ignore */ }
    finally { setFetching(false); }
  };

  const handleUrlChange = (val: string) => {
    setUrl(val);
    if (isSupportedLink(val.trim()) && val.startsWith("https://")) {
      fetchInfo(val.trim());
    }
  };

  const handleSend = () => {
    if (!title) return;
    setSent(true);
    setTimeout(onClose, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

      <div
        className="relative bg-bg-elevated border border-border rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Başlık */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Ghost className="w-4 h-4 text-text-muted" />
            <span className="text-sm font-medium text-[var(--text)]">{toName} için anonim şarkı</span>
          </div>
          <button type="button" onClick={onClose} className="text-text-muted hover:text-[var(--text)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent ? (
          <div className="px-5 py-10 text-center">
            <Ghost className="w-8 h-8 text-accent mx-auto mb-3 animate-bounce" />
            <p className="text-[var(--text)] font-medium">Şarkı gönderildi 👻</p>
            <p className="text-xs text-text-faint mt-1">Kim olduğunu bilmeyecek.</p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <p className="text-xs text-text-faint leading-relaxed">
              Bir şarkı linki yapıştır — <strong className="text-text-muted">{toName}</strong>'e gizlice bırakılacak. Kim olduğun bilinmeyecek.
            </p>

            {/* Link */}
            <div>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-faint pointer-events-none" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="Spotify, YouTube, SoundCloud..."
                  className="w-full bg-bg border border-border rounded-xl pl-9 pr-10 py-2.5 text-[var(--text)] text-sm"
                />
                {fetching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent animate-spin" />}
              </div>
            </div>

            {/* Önizleme */}
            {title && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-bg border border-border">
                {cover && <img src={cover} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--text)] truncate">{title}</p>
                  <p className="text-xs text-text-muted truncate">{artist}</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleSend}
              disabled={!title}
              className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-accent text-bg hover:bg-accent-hover"
            >
              <Ghost className="w-4 h-4" />
              Anonim Bırak
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
