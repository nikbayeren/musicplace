"use client";

import { BannedSongsProvider } from "@/contexts/BannedSongsContext";
import GlobalUserBackground from "./GlobalUserBackground";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BannedSongsProvider>
      <GlobalUserBackground />
      {children}
    </BannedSongsProvider>
  );
}
