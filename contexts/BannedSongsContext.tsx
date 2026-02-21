"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { mockBannedSongs, mockBannedNames } from "@/lib/mockData";

const STORAGE_KEY = "musicshare_banned";
const NAMES_KEY = "musicshare_banned_names";

export interface BannedEntry {
  id: string;
  title: string;
  artist: string;
  cover?: string;
  link?: string;
  createdAt: string;
}

export interface BannedNameEntry {
  id: string;
  name: string;
  createdAt: string;
}

function load(): BannedEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
    return [...mockBannedSongs] as BannedEntry[];
  } catch { return []; }
}

function save(list: BannedEntry[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}

function loadNames(): BannedNameEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const s = localStorage.getItem(NAMES_KEY);
    if (s) return JSON.parse(s);
    return [...mockBannedNames] as BannedNameEntry[];
  } catch { return []; }
}

function saveNames(list: BannedNameEntry[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(NAMES_KEY, JSON.stringify(list)); } catch {}
}

const Ctx = createContext<{
  list: BannedEntry[];
  add: (entry: Omit<BannedEntry, "id" | "createdAt">) => void;
  remove: (id: string) => void;
  listNames: BannedNameEntry[];
  addName: (name: string) => void;
  removeName: (id: string) => void;
} | null>(null);

export function BannedSongsProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<BannedEntry[]>(() => load());
  const [listNames, setListNames] = useState<BannedNameEntry[]>(() => loadNames());

  const add = useCallback((entry: Omit<BannedEntry, "id" | "createdAt">) => {
    const newEntry: BannedEntry = {
      ...entry,
      id: `ban_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setList((prev) => {
      const next = [...prev, newEntry];
      save(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setList((prev) => {
      const next = prev.filter((e) => e.id !== id);
      save(next);
      return next;
    });
  }, []);

  const addName = useCallback((name: string) => {
    const newEntry: BannedNameEntry = {
      id: `name_${Date.now()}`,
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    setListNames((prev) => {
      const next = [...prev, newEntry];
      saveNames(next);
      return next;
    });
  }, []);

  const removeName = useCallback((id: string) => {
    setListNames((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveNames(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ list, add, remove, listNames, addName, removeName }),
    [list, add, remove, listNames, addName, removeName]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBannedSongs() {
  const ctx = useContext(Ctx);
  if (!ctx) return { list: [], add: () => {}, remove: () => {}, listNames: [], addName: () => {}, removeName: () => {} };
  return ctx;
}
