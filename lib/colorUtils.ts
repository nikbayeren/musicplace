/** Deterministic hue (0-359) from a string — same title always → same color */
export function titleToHue(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
    h = h >>> 0;
  }
  return h % 360;
}

/** Vibrant HSL accent color suitable for dark backgrounds */
export function getCardAccent(title: string): string {
  return `hsl(${titleToHue(title)}, 65%, 62%)`;
}

/** Format seconds → mm:ss */
export function formatClipTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
