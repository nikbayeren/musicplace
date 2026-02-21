import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "musicshare — Zevkini paylaş",
  description: "Wrapped'ı hikayeye atma sebebin. Ne çalıyorsa onu paylaş — yazı yazmadan da olur. Senin sesin, bir dokunuş.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="bg-bg">
      <body className="min-h-screen bg-bg text-[var(--text)] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
