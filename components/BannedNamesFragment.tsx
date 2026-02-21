"use client";

import { useState } from "react";
import { Ban, Plus, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useBannedSongs, type BannedNameEntry } from "@/contexts/BannedSongsContext";

interface BannedNamesFragmentProps {
  isOwnProfile: boolean;
}

export default function BannedNamesFragment({ isOwnProfile }: BannedNamesFragmentProps) {
  const { listNames, addName, removeName } = useBannedSongs();
  const [showAdd, setShowAdd] = useState(false);
  const [nameValue, setNameValue] = useState("");

  return (
    <section className="rounded-2xl border border-border-subtle bg-bg-elevated/50 p-4">
      <h3 className="text-xs uppercase tracking-widest text-text-faint mb-2">Yasaklı isimler</h3>
      <p className="text-[11px] text-text-faint mb-3">Dinlemek istemediğin isimler. Listede yasaklı görünür.</p>
      {listNames.length === 0 && !showAdd && (
        <div className="py-6 text-center">
          <p className="text-sm font-medium text-[var(--text)] mb-1">İlk yasaklı ismini ekle</p>
          <p className="text-xs text-text-faint">Buraya eklediklerin listede yasaklı görünür.</p>
        </div>
      )}
      <div className="space-y-2">
        {listNames.map((n) => (
          <BannedNameCard key={n.id} entry={n} onRemove={isOwnProfile ? () => removeName(n.id) : undefined} />
        ))}
      </div>
      {isOwnProfile && (
        <>
          {!showAdd ? (
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 text-xs text-text-faint hover:text-red-400/90 hover:scale-105 transition-all mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              İsim ekle
            </button>
          ) : (
            <form
              onSubmit={(ev) => {
                ev.preventDefault();
                if (nameValue.trim()) {
                  addName(nameValue.trim());
                  setNameValue("");
                  setShowAdd(false);
                }
              }}
              className="rounded-xl border border-red-500/20 bg-bg p-3 space-y-2 mt-2"
            >
              <input
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                placeholder="İsim yaz"
                className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-[var(--text)]"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2 text-xs border border-border rounded-lg text-text-muted">İptal</button>
                <button type="submit" disabled={!nameValue.trim()} className="flex-1 py-2 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:scale-105 active:scale-95 disabled:opacity-50 transition-transform">Listeye ekle</button>
              </div>
            </form>
          )}
        </>
      )}
    </section>
  );
}

function BannedNameCard({ entry, onRemove }: { entry: BannedNameEntry; onRemove?: () => void }) {
  return (
    <div className="relative flex items-center gap-3 p-3 rounded-xl border-2 border-red-500/30 bg-gradient-to-r from-red-950/20 to-red-950/5">
      <div className="w-10 h-10 rounded-full bg-red-950/50 border-2 border-red-500/40 flex items-center justify-center flex-shrink-0">
        <Ban className="w-5 h-5 text-red-400/80" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--text)] line-through decoration-red-500 decoration-[3px] decoration-double">{entry.name}</p>
        <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-600/80 text-white uppercase tracking-wider">
          <Ban className="w-2.5 h-2.5" />
          Yasaklı
        </span>
      </div>
      <span className="text-[9px] text-red-300/80 flex-shrink-0">{formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}</span>
      {onRemove && (
        <button type="button" onClick={onRemove} className="p-1.5 text-red-300/70 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors" title="Listeden çıkar">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
