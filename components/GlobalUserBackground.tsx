"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const PROFILE_BG_KEY = "musicshare_profile_bg";
const ME_USERNAME = "ayse_music";

function getStoredBackground(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(`${PROFILE_BG_KEY}_${ME_USERNAME}`) ?? "";
}

function isImageBg(bg: string) {
  return /^(https?:\/\/|data:image\/)/i.test(bg?.trim() || "");
}

export default function GlobalUserBackground() {
  const pathname = usePathname();
  const [bg, setBg] = useState("");

  useEffect(() => {
    setBg(getStoredBackground());
  }, [pathname]);

  useEffect(() => {
    const handleStorage = () => setBg(getStoredBackground());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (pathname === "/profile" || pathname?.startsWith("/user/")) return null;
  if (!bg.trim()) return null;

  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={
          isImageBg(bg)
            ? {
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : { background: bg }
        }
      />
      {isImageBg(bg) && (
        <div
          aria-hidden
          className="fixed inset-0 -z-[9] bg-gradient-to-b from-black/65 via-black/78 to-black/92"
        />
      )}
    </>
  );
}
