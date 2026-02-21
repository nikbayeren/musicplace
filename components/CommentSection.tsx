"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Send } from "lucide-react";
import { MockComment } from "@/lib/mockData";

interface CommentSectionProps {
  comments: MockComment[];
}

function formatDate(date: string): string {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch { return ""; }
}

export default function CommentSection({ comments }: CommentSectionProps) {
  const [text, setText] = useState("");
  const [localComments, setLocalComments] = useState(comments);

  const handleSend = () => {
    if (!text.trim()) return;
    setLocalComments((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        postId: "",
        user: { name: "Ayşe", username: "ayse_music", bio: "" },
        text: text.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setText("");
  };

  return (
    <div className="border-t border-border-subtle px-4 pt-3 pb-4 bg-bg/40">
      {/* Yorum listesi */}
      <div className="space-y-3 mb-3 max-h-52 overflow-y-auto scrollbar-none">
        {localComments.length === 0 && (
          <p className="text-xs text-text-faint">Henüz yorum yok. İlk yorumu sen yap.</p>
        )}
        {localComments.map((c) => (
          <div key={c.id} className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full bg-bg border border-border flex items-center justify-center text-[10px] font-semibold text-text-muted flex-shrink-0 mt-0.5">
              {c.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-medium text-[var(--text)]">@{c.user.username}</span>
                <span className="text-[10px] text-text-faint">{formatDate(c.createdAt)}</span>
              </div>
              <p className="text-sm text-text-muted mt-0.5 break-words">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Yorum giriş alanı */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-bg border border-border flex items-center justify-center text-[10px] font-semibold text-text-muted flex-shrink-0">
          A
        </div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Yorum yaz..."
          className="flex-1 bg-transparent text-sm text-[var(--text)] placeholder:text-text-faint outline-none border-b border-border-subtle focus:border-accent/50 transition-colors pb-0.5"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim()}
          className="text-accent disabled:text-text-faint transition-colors hover:scale-110 active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
