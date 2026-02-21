"use client";

import { SiSpotify, SiYoutube, SiSoundcloud } from "react-icons/si";
import type { IconType } from "react-icons";
import { openPlatformLink } from "@/lib/platformLink";

/* ── Inline SVG'ler (react-icons'ta olmayan platformlar) ── */
const AppleMusicSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
    <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208A5.494 5.494 0 0 0 .05 4.822C.017 5.198 0 5.576 0 5.954v12.09c0 .406.013.811.05 1.215.062.705.207 1.39.5 2.04.675 1.49 1.81 2.48 3.382 2.963.577.178 1.172.252 1.775.287.434.024.87.027 1.306.027H18.7c.338 0 .676-.014 1.013-.04.72-.058 1.42-.19 2.067-.513 1.575-.784 2.552-2.04 2.883-3.77.13-.677.148-1.363.157-2.054.004-.42.002-.842.002-1.263V5.955c0-.61-.02-1.22-.828-3.83M15.327 3.5c.29 0 .58.05.85.15.57.21.96.65 1.07 1.24.03.17.04.35.04.52v6.95l-4.31-1.25V4.4c0-.48.28-.75.76-.9h2.59zm-6.65 2.87c.26-.03.53.02.78.1.61.2 1.02.69 1.08 1.33.01.15.01.3.01.45v5.87l-4.32-1.25v-5.1c0-.52.35-.84.87-.92.52-.07.99-.04 1.46-.44.06-.05.07-.03.11-.04zm3.15 12.38c-1.65 0-2.99-1.34-2.99-2.99s1.34-2.99 2.99-2.99 2.99 1.34 2.99 2.99-1.34 2.99-2.99 2.99z"/>
  </svg>
);

const DeezerSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
    <path d="M18.944 16.773h4.612v1.792h-4.612zm-6.472 0h4.61v1.792h-4.61zm-6.473 0h4.61v1.792H6zm12.944-2.884h4.612v1.79h-4.612zm-6.472 0h4.61v1.79h-4.61zm-6.472 0h4.61v1.79H6zm12.944-2.885h4.612v1.79h-4.612zm-6.472 0h4.61v1.79h-4.61zM6 8.119h4.61v1.79H6zm12.944-2.885h4.612v1.79h-4.612zm-6.472 0h4.61v1.79h-4.61z"/>
  </svg>
);

const TidalSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
    <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996l4.004 4.004 4.004-4.004 4.004 4.004 4.004-4.004zm4.004 4.004l-4.004 4.004 4.004 4.004L20.016 12zm-8.008 8.008L4.004 12 0 16.004l4.004 4.004zm4.004 0l-4.004 4.004 4.004 4.004 4.004-4.004z"/>
  </svg>
);

type PlatformCfg = { Icon?: IconType; svg?: () => JSX.Element; color: string; name: string };

const CFG: Record<string, PlatformCfg> = {
  spotify:      { Icon: SiSpotify,    color: "#1DB954", name: "Spotify"      },
  youtube:      { Icon: SiYoutube,    color: "#FF4444", name: "YouTube"      },
  youtubeMusic: { Icon: SiYoutube,    color: "#FF4444", name: "YT Music"     },
  appleMusic:   { svg: AppleMusicSvg, color: "#FC3C44", name: "Apple Music"  },
  deezer:       { svg: DeezerSvg,     color: "#A238FF", name: "Deezer"       },
  soundcloud:   { Icon: SiSoundcloud, color: "#FF5500", name: "SoundCloud"   },
  tidal:        { svg: TidalSvg,      color: "#7B4FFF", name: "Tidal"        },
};

interface PlatformIconProps {
  platform: string;
  url: string;
  /** "badge" = pill with name, "icon" = small circle icon only */
  variant?: "badge" | "icon";
  className?: string;
}

export default function PlatformIcon({ platform, url, variant = "badge", className = "" }: PlatformIconProps) {
  const cfg = CFG[platform];
  if (!cfg) return null;
  const { color, name } = cfg;

  const IconEl = cfg.Icon
    ? <cfg.Icon size={variant === "icon" ? 16 : 10} style={{ color }} />
    : cfg.svg
    ? <span style={{ color, fontSize: variant === "icon" ? 16 : 10, lineHeight: 1 }}><cfg.svg /></span>
    : null;

  const handleClick = (e: React.MouseEvent) => {
    if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      openPlatformLink(platform, url);
    }
  };

  if (variant === "icon") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title={name}
        onClick={handleClick}
        className={`w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform ${className}`}
        style={{ background: color + "1a", border: `1px solid ${color}44` }}
      >
        {IconEl}
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-medium hover:scale-105 active:scale-95 transition-transform ${className}`}
      style={{ borderColor: color + "55", color, background: color + "12" }}
    >
      {IconEl}
      {name}
    </a>
  );
}
