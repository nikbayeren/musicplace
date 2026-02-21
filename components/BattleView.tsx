"use client";

import { useState, useEffect, useMemo } from "react";
import { mockBattles, type SongBattle } from "@/lib/mockData";
import { Music2, Trophy, Clock } from "lucide-react";

const VOTES_KEY = "musicshare_battle_votes";

function loadMyVotes(): Record<string, "A" | "B"> {
  if (typeof window === "undefined") return {};
  try {
    const s = localStorage.getItem(VOTES_KEY);
    return s ? JSON.parse(s) : {};
  } catch { return {}; }
}

function saveMyVotes(m: Record<string, "A" | "B">) {
  try { localStorage.setItem(VOTES_KEY, JSON.stringify(m)); } catch {}
}

function formatCountdown(endAt: string): string {
  const end = new Date(endAt).getTime();
  const now = Date.now();
  if (now >= end) return "Bitti";
  const d = Math.floor((end - now) / (1000 * 60 * 60 * 24));
  const h = Math.floor(((end - now) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor(((end - now) % (1000 * 60 * 60)) / (1000 * 60));
  if (d > 0) return `${d}g ${h}s`;
  if (h > 0) return `${h}s ${m}dk`;
  return `${m} dakika`;
}

function BattleCard({ battle, myVote, onVote }: { battle: SongBattle; myVote: "A" | "B" | null; onVote: (side: "A" | "B") => void }) {
  const [now, setNow] = useState(Date.now());
  const endMs = new Date(battle.endAt).getTime();
  const isActive = now < endMs;

  useEffect(() => {
    if (!isActive) return;
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, [isActive]);

  const votesA = battle.votesA + (myVote === "A" ? 1 : 0);
  const votesB = battle.votesB + (myVote === "B" ? 1 : 0);
  const total = votesA + votesB;
  const pctA = total ? Math.round((votesA / total) * 100) : 0;
  const pctB = total ? Math.round((votesB / total) * 100) : 0;
  const winner = votesA >= votesB ? "A" : "B";

  return (
    <div className="relative rounded-2xl bg-bg-elevated border border-border overflow-hidden mb-6">
      <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-text-faint">Şarkı kavgası</span>
        {isActive ? (
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock className="w-3.5 h-3.5" />
            {formatCountdown(battle.endAt)}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-accent">
            <Trophy className="w-3.5 h-3.5" />
            {winner === "A" ? battle.songA.title : battle.songB.title} kazandı
          </span>
        )}
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 gap-0">
          {/* A */}
          <button
          type="button"
          disabled={!isActive || myVote !== null}
          onClick={() => onVote("A")}
          className={`p-4 text-left transition-colors ${!isActive ? "cursor-default" : myVote ? "cursor-default" : "hover:bg-bg active:bg-bg-elevated"} ${myVote === "A" ? "ring-2 ring-accent" : ""}`}
        >
          <div className="aspect-square rounded-xl overflow-hidden bg-bg mb-2">
            {battle.songA.cover ? (
              <img src={battle.songA.cover} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Music2 className="w-8 h-8 text-text-faint" /></div>
            )}
          </div>
          <p className="text-sm font-medium text-[var(--text)] truncate">{battle.songA.title}</p>
          <p className="text-xs text-text-faint truncate">{battle.songA.artist}</p>
          <p className="text-xs text-text-muted mt-1">{votesA} oy (%{pctA})</p>
        </button>

          {/* B */}
          <button
          type="button"
          disabled={!isActive || myVote !== null}
          onClick={() => onVote("B")}
          className={`p-4 text-left transition-colors border-l border-border-subtle ${!isActive ? "cursor-default" : myVote ? "cursor-default" : "hover:bg-bg active:bg-bg-elevated"} ${myVote === "B" ? "ring-2 ring-accent" : ""}`}
        >
          <div className="aspect-square rounded-xl overflow-hidden bg-bg mb-2">
            {battle.songB.cover ? (
              <img src={battle.songB.cover} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Music2 className="w-8 h-8 text-text-faint" /></div>
            )}
          </div>
          <p className="text-sm font-medium text-[var(--text)] truncate">{battle.songB.title}</p>
          <p className="text-xs text-text-faint truncate">{battle.songB.artist}</p>
          <p className="text-xs text-text-muted mt-1">{votesB} oy (%{pctB})</p>
          </button>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-bg-elevated border-2 border-border flex items-center justify-center text-[10px] font-bold text-text-faint z-10 pointer-events-none">
          VS
        </div>
      </div>

      {isActive && myVote && (
        <div className="px-4 py-2 border-t border-border-subtle text-center text-xs text-text-faint">
          Oyun kullandın — {myVote === "A" ? battle.songA.title : battle.songB.title}
        </div>
      )}
    </div>
  );
}

export default function BattleView() {
  const [myVotes, setMyVotes] = useState<Record<string, "A" | "B">>({});

  useEffect(() => {
    setMyVotes(loadMyVotes());
  }, []);

  const activeBattles = useMemo(() => mockBattles.filter((b) => new Date(b.endAt).getTime() > Date.now()), []);
  const pastBattles = useMemo(() => mockBattles.filter((b) => new Date(b.endAt).getTime() <= Date.now()), []);

  const handleVote = (battleId: string, side: "A" | "B") => {
    setMyVotes((prev) => {
      const next = { ...prev, [battleId]: side };
      saveMyVotes(next);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-[var(--text)] mb-1">Şarkı kavgası</h1>
        <p className="text-sm text-text-muted">İki şarkı karşı karşıya. Oyunu kullan, 24 saatte kazanan belli olsun.</p>
      </div>

      <div className="relative">
        {activeBattles.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs uppercase tracking-widest text-text-faint mb-4">Devam eden kavgalar</h2>
            {activeBattles.map((b) => (
              <BattleCard
                key={b.id}
                battle={b}
                myVote={myVotes[b.id] ?? null}
                onVote={(side) => handleVote(b.id, side)}
              />
            ))}
          </section>
        )}

        {pastBattles.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-text-faint mb-4">Sonuçlanan kavgalar</h2>
            {pastBattles.map((b) => (
              <BattleCard
                key={b.id}
                battle={b}
                myVote={myVotes[b.id] ?? null}
                onVote={() => {}}
              />
            ))}
          </section>
        )}

        {mockBattles.length === 0 && (
          <p className="text-sm text-text-muted text-center py-12">Henüz kavga yok. Yakında!</p>
        )}
      </div>
    </div>
  );
}
