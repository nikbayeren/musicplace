"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Send } from "lucide-react";
import { mockConversations, ME, Conversation, DmMessage } from "@/lib/mockData";

function formatDate(d: string) {
  try { return formatDistanceToNow(new Date(d), { addSuffix: true }); } catch { return ""; }
}

function Avatar({ name, size = 8 }: { name: string; size?: number }) {
  return (
    <div
      className="rounded-full bg-bg border border-border flex items-center justify-center font-semibold text-text-muted flex-shrink-0"
      style={{ width: `${size * 4}px`, height: `${size * 4}px`, fontSize: `${size * 1.5}px` }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function MessagesView() {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? null);
  const [text, setText] = useState("");

  const active = conversations.find((c) => c.id === activeId) ?? null;

  const handleSend = () => {
    if (!text.trim() || !activeId) return;
    const newMsg: DmMessage = {
      id: `msg-${Date.now()}`,
      senderId: ME.username,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    setConversations((prev) =>
      prev.map((c) => c.id === activeId ? { ...c, messages: [...c.messages, newMsg] } : c)
    );
    setText("");
  };

  return (
    <div className="max-w-3xl mx-auto w-full flex-1 min-h-0 flex">

      {/* ── Sol: Konuşma listesi ── */}
      <div className="w-64 flex-shrink-0 border-r border-border-subtle flex flex-col">
        <div className="px-4 py-5">
          <h1 className="font-serif text-xl text-[var(--text)]">Mesajlar</h1>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-none">
          {conversations.map((conv) => {
            const last = conv.messages[conv.messages.length - 1];
            const isActive = conv.id === activeId;
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => setActiveId(conv.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                  isActive ? "bg-accent/8 border-r-2 border-accent" : "hover:bg-bg-elevated/50"
                }`}
              >
                <Avatar name={conv.withUser.name} size={9} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${isActive ? "text-[var(--text)]" : "text-text-muted"}`}>
                    {conv.withUser.name}
                  </p>
                  {last && (
                    <p className="text-[11px] text-text-faint truncate mt-0.5">
                      {last.senderId === ME.username ? "Sen: " : ""}{last.text}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Sağ: Aktif konuşma ── */}
      {active ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border-subtle">
            <Avatar name={active.withUser.name} size={8} />
            <div>
              <p className="text-sm font-medium text-[var(--text)]">{active.withUser.name}</p>
              <p className="text-xs text-text-faint">@{active.withUser.username}</p>
            </div>
          </div>

          {/* Mesajlar */}
          <div className="flex-1 overflow-y-auto scrollbar-none px-5 py-4 space-y-3">
            {active.messages.map((msg) => {
              const isMe = msg.senderId === ME.username;
              return (
                <div key={msg.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  {!isMe && <Avatar name={active.withUser.name} size={7} />}
                  <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                    <div
                      className={`px-3.5 py-2 rounded-2xl text-sm ${
                        isMe
                          ? "bg-accent/15 border border-accent/25 text-[var(--text)] rounded-tr-sm"
                          : "bg-bg-elevated border border-border-subtle text-[var(--text)] rounded-tl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-text-faint px-1">{formatDate(msg.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Giriş */}
          <div className="px-5 py-4 border-t border-border-subtle flex items-center gap-3">
            <Avatar name={ME.name} size={7} />
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={`${active.withUser.name}'a mesaj yaz...`}
              className="flex-1 bg-bg-elevated border border-border-subtle rounded-xl px-4 py-2 text-sm text-[var(--text)] placeholder:text-text-faint outline-none focus:border-accent/50 transition-colors"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!text.trim()}
              className="text-accent disabled:text-text-faint transition-colors hover:scale-110 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-text-faint text-sm">
          Bir konuşma seç
        </div>
      )}
    </div>
  );
}
