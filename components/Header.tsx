"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Zap, Mail, Bell, User } from "lucide-react";
import { mockNotifications } from "@/lib/mockData";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Akış", icon: Home },
  { href: "/discover", label: "Keşfet", icon: Compass },
  { href: "/battle", label: "Kavga", icon: Zap },
] as const;

export default function Header() {
  const pathname = usePathname();
  const [unread] = useState(() => mockNotifications.filter((n: any) => !n.read).length);

  const linkClass = (href: string) =>
    `flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 text-sm transition-colors ${
      pathname === href || (href !== "/" && pathname?.startsWith(href))
        ? "text-accent"
        : "text-text-muted hover:text-[var(--text)]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/80 [text-shadow:0_1px_6px_rgba(0,0,0,0.95),0_0_16px_rgba(0,0,0,0.7)]">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-lg sm:text-xl tracking-tight text-[var(--text)] hover:text-accent transition-colors shrink-0"
          >
            musicshare
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6" role="navigation" aria-label="Ana menü">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={linkClass(href)} title={label}>
                <Icon className="w-4 h-4 shrink-0 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.9))]" />
                <span className="hidden sm:inline text-sm">{label}</span>
              </Link>
            ))}
            <Link href="/messages" className="text-text-muted hover:text-[var(--text)] transition-colors p-1" title="Mesajlar">
              <Mail className="w-4 h-4 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.9))]" />
            </Link>
            <Link href="/notifications" className="relative text-text-muted hover:text-[var(--text)] transition-colors p-1" title="Bildirimler">
              <Bell className="w-4 h-4 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.9))]" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent text-bg text-[8px] font-bold flex items-center justify-center leading-none">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
            <Link href="/profile" className={linkClass("/profile")} title="Profil">
              <User className="w-4 h-4 shrink-0 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.9))]" />
              <span className="hidden sm:inline text-sm">Profil</span>
            </Link>
          </nav>
        </div>
      </header>
  );
}
