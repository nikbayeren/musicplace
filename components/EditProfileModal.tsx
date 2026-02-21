"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Search, Loader2, Upload } from "lucide-react";

const PROFILE_BG_PRESETS: { id: string; label: string; value: string }[] = [
  { id: "default", label: "Varsayılan", value: "" },
  { id: "night", label: "Gece", value: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)" },
  { id: "sunset", label: "Gün batımı", value: "linear-gradient(135deg, #1a0a0a 0%, #2d1b1b 50%, #1a1a2e 100%)" },
  { id: "aurora", label: "Aurora", value: "linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 30%, #16213e 60%, #0d2818 100%)" },
  { id: "forest", label: "Orman", value: "linear-gradient(180deg, #0d1f0d 0%, #1a2e1a 50%, #0f0f0f 100%)" },
  { id: "ocean", label: "Okyanus", value: "linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #132a42 100%)" },
  { id: "berry", label: "Böğürtlen", value: "linear-gradient(180deg, #1a0a14 0%, #2d1b26 50%, #1a1a2e 100%)" },
  { id: "rose", label: "Gül", value: "linear-gradient(180deg, #2a0a14 0%, #1a0a0f 50%, #0f0a0d 100%)" },
  { id: "slate", label: "Koyu gri", value: "linear-gradient(180deg, #1e1e2e 0%, #2a2a3e 100%)" },
];

interface EditProfileModalProps {
  name: string;
  username: string;
  bio: string;
  profileBackground?: string | null;
  onSave: (data: { name: string; username: string; bio: string; profileBackground: string }) => void;
  onClose: () => void;
}

function isUrl(s: string) {
  return /^https?:\/\//i.test(s?.trim() || "");
}

export default function EditProfileModal({ name, username, bio, profileBackground = null, onSave, onClose }: EditProfileModalProps) {
  const [newName, setNewName] = useState(name);
  const [newUsername, setNewUsername] = useState(username);
  const [newBio, setNewBio] = useState(bio);
  const [newBg, setNewBg] = useState(profileBackground ?? "");
  const [tenorQuery, setTenorQuery] = useState("");
  const [tenorResults, setTenorResults] = useState<{ id: string; url: string; preview: string }[]>([]);
  const [tenorLoading, setTenorLoading] = useState(false);
  const [customUrl, setCustomUrl] = useState(isUrl(profileBackground ?? "") ? profileBackground! : "");
  const [uploadError, setUploadError] = useState("");
  const [activeBgTab, setActiveBgTab] = useState<"presets" | "gif" | "url" | "upload">("presets");

  const searchTenor = useCallback(async () => {
    const q = tenorQuery.trim();
    if (!q) return;
    setTenorLoading(true);
    setTenorResults([]);
    try {
      const res = await fetch(`/api/tenor?q=${encodeURIComponent(q)}&limit=12`);
      const data = await res.json();
      setTenorResults(data.results || []);
    } catch {
      setTenorResults([]);
    } finally {
      setTenorLoading(false);
    }
  }, [tenorQuery]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const isDataUrl = (s: string) => /^data:image\//i.test(s?.trim() || "");

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Lütfen bir görsel dosyası seçin (JPG, PNG, GIF, WebP).");
      return;
    }
    const maxMb = 2;
    if (file.size > maxMb * 1024 * 1024) {
      setUploadError(`Dosya ${maxMb} MB'dan küçük olmalı.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setNewBg(dataUrl);
      setCustomUrl("");
    };
    reader.onerror = () => setUploadError("Dosya okunamadı.");
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUsername.trim()) return;
    onSave({
      name: newName.trim(),
      username: newUsername.trim().replace(/\s+/g, "_"),
      bio: newBio.trim(),
      profileBackground: newBg,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
      <div
        className="relative bg-bg-elevated border border-border rounded-2xl w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border-subtle">
          <h2 className="font-serif text-xl text-[var(--text)]">Profili Düzenle</h2>
          <button type="button" onClick={onClose} className="text-text-muted hover:text-[var(--text)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs text-text-faint mb-1.5">İsim</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={40}
              required
              className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-[var(--text)] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-text-faint mb-1.5">Kullanıcı Adı</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint text-sm select-none">@</span>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                maxLength={30}
                required
                placeholder="kullanici_adi"
                className="w-full bg-bg border border-border rounded-xl pl-7 pr-3 py-2.5 text-[var(--text)] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-text-faint mb-1.5">Bio</label>
            <textarea
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              maxLength={120}
              rows={3}
              placeholder="Kendini kısaca tanıt..."
              className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-[var(--text)] text-sm resize-none"
            />
            <p className="text-[10px] text-text-faint mt-1 text-right">{newBio.length} / 120</p>
          </div>

          <div>
            <label className="block text-xs text-text-faint mb-2">Profil arka planı</label>
            <div className="flex gap-1 mb-2 p-0.5 rounded-lg bg-bg border border-border-subtle flex-wrap">
              {(["presets", "upload", "gif", "url"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => { setActiveBgTab(tab); setUploadError(""); }}
                  className={`flex-1 min-w-0 py-1.5 text-[10px] font-medium rounded-md transition-colors ${
                    activeBgTab === tab ? "bg-accent/20 text-accent" : "text-text-muted hover:text-[var(--text)]"
                  }`}
                >
                  {tab === "presets" ? "Renkler" : tab === "upload" ? "Yükle" : tab === "gif" ? "Tenor GIF" : "URL"}
                </button>
              ))}
            </div>

            {activeBgTab === "presets" && (
              <>
                <div className="flex flex-wrap gap-2">
                  {PROFILE_BG_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => { setNewBg(preset.value); setCustomUrl(""); }}
                      className={`h-9 rounded-lg border-2 transition-all flex-shrink-0 ${
                        (preset.value === "" && newBg === "" && !isUrl(newBg)) || preset.value === newBg
                          ? "border-accent ring-1 ring-accent/30"
                          : "border-border-subtle hover:border-border"
                      }`}
                      style={{
                        width: preset.value ? 36 : "auto",
                        paddingLeft: preset.value ? 0 : 8,
                        paddingRight: preset.value ? 0 : 8,
                        background: preset.value || "var(--bg-elevated)",
                      }}
                      title={preset.label}
                    >
                      {preset.value ? null : <span className="text-[10px] text-text-muted whitespace-nowrap">{preset.label}</span>}
                    </button>
                  ))}
                </div>
              </>
            )}

            {activeBgTab === "gif" && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tenorQuery}
                    onChange={(e) => setTenorQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), searchTenor())}
                    placeholder="Tenor'da GIF ara (örn: müzik, dans)"
                    className="flex-1 bg-bg border border-border rounded-lg px-3 py-2 text-[var(--text)] text-sm"
                  />
                  <button type="button" onClick={searchTenor} disabled={tenorLoading} className="px-3 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 disabled:opacity-50 flex items-center gap-1">
                    {tenorLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1.5 max-h-40 overflow-y-auto rounded-lg border border-border-subtle p-1.5">
                  {tenorResults.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => { setNewBg(g.url); setCustomUrl(""); }}
                      className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                        newBg === g.url ? "border-accent ring-1 ring-accent/30" : "border-transparent hover:border-border"
                      }`}
                    >
                      <img src={g.preview || g.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-text-faint">Tenor üzerinden GIF seç; profil kapağında animasyonlu görünür.</p>
              </div>
            )}

            {activeBgTab === "upload" && (
              <div className="space-y-2">
                <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-subtle hover:border-border bg-bg/50 py-6 px-4 cursor-pointer transition-colors">
                  <Upload className="w-8 h-8 text-text-muted" />
                  <span className="text-sm text-[var(--text)]">Görsel seç veya sürükle</span>
                  <span className="text-[10px] text-text-faint">JPG, PNG, GIF, WebP — en fazla 2 MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
                {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
                <p className="text-[10px] text-text-faint">Bilgisayarından bir görsel yükleyerek arka plan yapabilirsin.</p>
              </div>
            )}

            {activeBgTab === "url" && (
              <div className="space-y-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="Görsel veya GIF linki yapıştır"
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-[var(--text)] text-sm"
                />
                <button type="button" onClick={() => customUrl.trim() && setNewBg(customUrl.trim())} className="text-xs text-accent hover:underline">
                  Bu URL'yi arka plan yap
                </button>
                <p className="text-[10px] text-text-faint">Kendi yüklediğin görsel/GIF linkini yapıştırabilirsin.</p>
              </div>
            )}

            {(isUrl(newBg) || isDataUrl(newBg)) && (
              <div className="mt-2 flex items-center gap-2">
                <div className="w-12 h-8 rounded border border-border overflow-hidden flex-shrink-0 bg-bg">
                  <img src={newBg} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
                <span className="text-[10px] text-text-faint truncate flex-1">{isDataUrl(newBg) ? "Yüklenen görsel" : "Özel görsel seçildi"}</span>
                <button type="button" onClick={() => { setNewBg(""); setCustomUrl(""); }} className="text-[10px] text-red-400 hover:underline">Kaldır</button>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-border-subtle text-text-muted text-sm rounded-xl hover:border-border transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-accent text-bg font-medium text-sm rounded-xl hover:bg-accent-hover transition-colors"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
