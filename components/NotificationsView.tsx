"use client";

import { useState } from "react";
import { Bell, UserPlus, Repeat2, MessageCircle, Ghost, Music2, Check } from "lucide-react";
import { mockNotifications, Notification } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";

function formatDate(s: string) {
  try { return formatDistanceToNow(new Date(s), { addSuffix: true }); } catch { return ""; }
}

const ICON: Record<string, React.ReactNode> = {
  follow:  <UserPlus className="w-4 h-4 text-blue-400" />,
  reshare: <Repeat2  className="w-4 h-4 text-green-400" />,
  comment: <MessageCircle className="w-4 h-4 text-yellow-400" />,
  drop:    <Ghost    className="w-4 h-4 text-purple-400" />,
  like:    <Music2   className="w-4 h-4 text-accent" />,
};

const LABEL: Record<string, string> = {
  follow:  "seni takip etmeye başladı",
  reshare: "şarkını yeniden paylaştı",
  comment: "gönderine yorum yaptı",
  drop:    "sana anonim bir şarkı bıraktı",
  like:    "gönderini beğendi",
};

export default function NotificationsView() {
  const [notifs, setNotifs] = useState<Notification[]>(mockNotifications as any);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl text-[var(--text)]">Bildirimler</h1>
          {unreadCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30">
              {unreadCount} yeni
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            Tümünü okundu işaretle
          </button>
        )}
      </div>

      {notifs.length === 0 && (
        <div className="text-center py-16">
          <Bell className="w-10 h-10 text-text-faint mx-auto mb-3" />
          <p className="text-text-muted">Henüz bildirim yok.</p>
        </div>
      )}

      <div className="space-y-1">
        {notifs.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => markRead(n.id)}
            className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors hover:bg-bg-elevated ${
              !n.read ? "bg-bg-elevated border border-border-subtle" : "border border-transparent"
            }`}
          >
            {/* İkon */}
            <div className="w-8 h-8 rounded-full bg-bg border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
              {ICON[n.type] ?? <Bell className="w-4 h-4 text-text-faint" />}
            </div>

            {/* İçerik */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--text)] leading-relaxed">
                {n.type === "drop" ? (
                  <span className="text-text-muted">Anonim biri</span>
                ) : (
                  <span className="font-medium">{(n as any).fromUser?.name}</span>
                )}{" "}
                <span className="text-text-muted">{LABEL[n.type]}</span>
                {(n as any).postTitle && (
                  <span className="text-text-faint"> — <em>"{(n as any).postTitle}"</em></span>
                )}
              </p>
              <p className="text-xs text-text-faint mt-0.5">{formatDate(n.createdAt)}</p>
            </div>

            {/* Okunmamış nokta */}
            {!n.read && (
              <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1.5" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
